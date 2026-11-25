import * as sdk from '@ai-sdk/swarm';
import { Effect, type Schema, Stream } from 'effect';
import {
  type AiSdkError,
  abortable,
  combineSignals,
  openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';
import { toSdkSchema } from '../internal/schema.js';
import type {
  SwarmMessage,
  SwarmModelContract,
  SwarmStepResult,
} from './internal/swarm-types.js';

type NativeModel = NonNullable<sdk.Agent['model']>;
type ModelCall = Parameters<SwarmModelContract['doGenerate']>[0];
type ModelStream = Awaited<ReturnType<SwarmModelContract['doStream']>>;
type Part = ModelStream['stream'] extends ReadableStream<infer A> ? A : never;
type SwarmToolChoice =
  | 'auto'
  | 'none'
  | 'required'
  | {
      readonly type: 'tool';
      readonly toolName: string;
    };

export interface SwarmLanguageModel<R = never, E = never> extends Omit<
  SwarmModelContract,
  'doGenerate' | 'doStream' | 'supportsUrl'
> {
  readonly supportsUrl?: (url: URL) => boolean;
  readonly doGenerate: (
    options: ModelCall,
  ) => Effect.Effect<
    Awaited<ReturnType<SwarmModelContract['doGenerate']>>,
    E,
    R
  >;
  readonly doStream: (options: ModelCall) => Effect.Effect<
    Omit<ModelStream, 'stream'> & {
      readonly stream: Stream.Stream<Part, E, R>;
    },
    E,
    R
  >;
}

type ToolOptions<C> = {
  readonly abortSignal?: AbortSignal;
  readonly context: C;
};

export interface AgentFunctionTool<C, A, O, E = never, R = never> {
  readonly type?: 'function';
  readonly description?: string;
  readonly parameters: Schema.ConstraintDecoder<A>;
  readonly execute: (
    input: A,
    options: ToolOptions<C>,
  ) => Effect.Effect<O, E, R>;
}

export interface AgentHandoverTool<C, A, R = never, E = never> {
  readonly type: 'handover';
  readonly description?: string;
  readonly parameters: Schema.ConstraintDecoder<A>;
  readonly execute: (
    input: A,
    options: ToolOptions<C>,
  ) => { readonly agent: Agent<C, R, E>; readonly context?: C };
}

export type AgentTool<C, A, O, E = never, R = never> =
  AgentFunctionTool<C, A, O, E, R> | AgentHandoverTool<C, A, R, E>;

export const functionTool = <C, A, O, E = never, R = never>(
  options: AgentFunctionTool<C, A, O, E, R>,
) => options;
export const handoverTool = <C, A, R = never, E = never>(
  options: AgentHandoverTool<C, A, R, E>,
) => options;

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

const bindModel = <R, E>(
  { doGenerate, doStream, supportsUrl, ...metadata }: SwarmLanguageModel<R, E>,
  owner: Owner<R>,
): NativeModel => ({
  ...metadata,
  ...(supportsUrl && { supportsUrl: (url: URL) => supportsUrl(url) }),
  doGenerate: (options) =>
    owner.runCallback(
      Effect.suspend(() =>
        doGenerate({
          ...options,
          abortSignal: combineSignals(owner.signal, options.abortSignal),
        }),
      ),
      options.abortSignal,
    ),
  doStream: (options) =>
    owner.runCallback(
      Effect.gen(function* () {
        const signal = combineSignals(owner.signal, options.abortSignal);
        const { stream, ...metadata } = yield* doStream({
          ...options,
          abortSignal: signal,
        });
        return {
          ...metadata,
          stream: Stream.toReadableStreamWith(
            stream,
            yield* Effect.context<R>(),
            { signal },
          ),
        };
      }),
      options.abortSignal,
    ),
});

type Definition<C, R, E> = {
  readonly name: string;
  readonly system?: string | ((context: C) => string);
  readonly toolChoice?: SwarmToolChoice;
  readonly model?: SwarmLanguageModel<R, E>;
  readonly tools?: Record<string, AgentTool<C, never, unknown, E, R>>;
};

export class Agent<C = unknown, R = never, E = never> {
  static make<C = unknown, R = never, E = never>(options: Definition<C, R, E>) {
    return runSync('Swarm.Agent.make', () => new Agent(options));
  }

  private constructor(readonly settings: Definition<C, R, E>) {}

  get name() {
    return this.settings.name;
  }
  get model() {
    return this.settings.model;
  }
  get system() {
    return this.settings.system;
  }
  get tools() {
    return this.settings.tools;
  }
  get toolChoice(): Definition<C, R, E>['toolChoice'] {
    return this.settings.toolChoice;
  }
}

type RunOptions<C, R, E> = {
  readonly agent: Agent<C, R, E>;
  readonly model: SwarmLanguageModel<R, E>;
  readonly prompt: string | SwarmMessage[];
  readonly context?: C;
  readonly maxSteps?: number;
  readonly toolChoice?: SwarmToolChoice;
  readonly debug?: boolean;
  readonly abortSignal?: AbortSignal;
  readonly onStepFinish?: (event: SwarmStepResult) => Effect.Effect<void, E, R>;
};

export type SwarmResult<C, R = never, E = never> = {
  readonly text: string;
  readonly responseMessages: SwarmMessage[];
  readonly finishReason: SwarmStepResult['finishReason'];
  readonly activeAgent: Agent<C, R, E>;
};

/** Run the legacy Swarm with Effect-owned tool and model callbacks. */
export const runSwarm = <C, R = never, E = never>(
  options: RunOptions<C, R, E>,
): Effect.Effect<SwarmResult<C, R, E>, AiSdkError, R> =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>(options.abortSignal);
      const wrapped = new WeakMap<sdk.Agent<C>, Agent<C, R, E>>();
      const bindAgent = (agent: Agent<C, R, E>): sdk.Agent<C> => {
        const { model, tools, ...settings } = agent.settings;
        const nativeTools =
          tools &&
          Object.fromEntries(
            Object.entries(tools).map(([name, tool]) => {
              const { parameters } = tool;
              const schema = toSdkSchema(
                parameters,
              ) as unknown as sdk.AgentFunctionTool<C>['parameters'];
              if (tool.type === 'handover') {
                return [
                  name,
                  sdk.handoverTool<C>({
                    ...(tool.description && { description: tool.description }),
                    type: 'handover',
                    parameters: schema,
                    execute: (input, options) => {
                      const result = tool.execute(input as never, options);
                      return { ...result, agent: bindAgent(result.agent) };
                    },
                  }),
                ] as const;
              }
              return [
                name,
                sdk.functionTool<C>({
                  ...(tool.description && { description: tool.description }),
                  parameters: schema,
                  execute: (input, options) =>
                    owner.runCallback(
                      tool.execute(input as never, options),
                      options.abortSignal,
                    ),
                }),
              ] as const;
            }),
          );
        const native = new sdk.Agent<C>({
          ...settings,
          ...(model && { model: bindModel(model, owner) }),
          ...(nativeTools && { tools: nativeTools }),
        });
        wrapped.set(native, agent);
        return native;
      };
      const { agent, model, onStepFinish, abortSignal, ...rest } = options;
      const active = yield* runSync('Swarm.bindAgent', () => bindAgent(agent));
      const result = yield* abortable(
        'Swarm.run',
        owner.signal,
        runRequest('Swarm.run', { abortSignal: owner.signal }, (signal) =>
          sdk.runSwarm<C>({
            ...rest,
            agent: active,
            model: bindModel(model, owner),
            ...(onStepFinish && {
              onStepFinish: (event) =>
                owner.runCallback(
                  Effect.suspend(() => onStepFinish(event)),
                  signal,
                ),
            }),
          }),
        ),
      );
      yield* owner.markComplete;
      return {
        ...result,
        activeAgent: wrapped.get(result.activeAgent) ?? agent,
      };
    }),
  );
