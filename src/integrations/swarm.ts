import * as sdk from '@ai-sdk/swarm';
import { Effect, type Schema, Stream } from 'effect';
import {
  type openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';
import { openOperation as openOwner } from '../internal/operation.js';
import { toSdkSchema } from '../internal/schema.js';

type NativeModel = NonNullable<sdk.Agent['model']>;
type NativeCall = Parameters<NativeModel['doGenerate']>[0];
type NativeStream = Awaited<ReturnType<NativeModel['doStream']>>;
type Part = NativeStream['stream'] extends ReadableStream<infer A> ? A : never;

export interface SwarmLanguageModel<R = never, E = never> extends Omit<
  NativeModel,
  'doGenerate' | 'doStream'
> {
  readonly doGenerate: (
    options: NativeCall,
  ) => Effect.Effect<Awaited<ReturnType<NativeModel['doGenerate']>>, E, R>;
  readonly doStream: (
    options: Parameters<NativeModel['doStream']>[0],
  ) => Effect.Effect<
    Omit<NativeStream, 'stream'> & {
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
  model: SwarmLanguageModel<R, E>,
  owner: Owner<R>,
): NativeModel => ({
  ...model,
  doGenerate: (options) =>
    owner.runCallback(model.doGenerate(options), options.abortSignal),
  doStream: (options) =>
    owner.runCallback(
      Effect.gen(function* () {
        const { stream, ...metadata } = yield* model.doStream(options);
        return {
          ...metadata,
          stream: yield* Stream.toReadableStreamEffect(stream),
        };
      }),
      options.abortSignal,
    ),
});

type Definition<C, R, E> = Omit<
  ConstructorParameters<typeof sdk.Agent<C>>[0],
  'model' | 'tools'
> & {
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
  get toolChoice() {
    return this.settings.toolChoice;
  }
}

type NativeOptions<C> = Parameters<typeof sdk.runSwarm<C>>[0];
type StepEvent<C> = Parameters<
  NonNullable<NativeOptions<C>['onStepFinish']>
>[0];

type RunOptions<C, R, E> = Omit<
  NativeOptions<C>,
  'agent' | 'model' | 'onStepFinish'
> & {
  readonly agent: Agent<C, R, E>;
  readonly model: SwarmLanguageModel<R, E>;
  readonly abortSignal?: AbortSignal;
  readonly onStepFinish?: (event: StepEvent<C>) => Effect.Effect<void, E, R>;
};

/** Run the legacy Swarm with Effect-owned tool and model callbacks. */
export const runSwarm = <C, R = never, E = never>(
  options: RunOptions<C, R, E>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOwner<R>(options.abortSignal);
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
      const result = yield* runRequest(
        'Swarm.run',
        { ...(abortSignal && { abortSignal }) },
        (signal) =>
          sdk.runSwarm<C>({
            ...rest,
            agent: active,
            model: bindModel(model, owner),
            ...(onStepFinish && {
              onStepFinish: (event) =>
                owner.runCallback(onStepFinish(event), signal),
            }),
          }),
      );
      return {
        ...result,
        activeAgent: wrapped.get(result.activeAgent) ?? agent,
      };
    }),
  );
