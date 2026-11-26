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

/** Native legacy model adapter passed to the pinned Swarm SDK. */
type NativeModel = NonNullable<sdk.Agent['model']>;
/** Native v1 input shared by complete generation and streaming. */
type ModelCall = Parameters<SwarmModelContract['doGenerate']>[0];
/** Successful native streaming response before adapting its readable stream. */
type ModelStream = Awaited<ReturnType<SwarmModelContract['doStream']>>;
/** Event emitted by the pinned provider's v1 streaming contract. */
type Part = ModelStream['stream'] extends ReadableStream<infer A> ? A : never;
/** Choose automatic, disabled, required, or named-tool execution during the run. */
type SwarmToolChoice =
  | 'auto'
  | 'none'
  | 'required'
  | {
      readonly type: 'tool';
      readonly toolName: string;
    };

/** Effect model contract for the v1 provider interface used by the legacy Swarm SDK. */
export interface SwarmLanguageModel<R = never, E = never> extends Omit<
  SwarmModelContract,
  'doGenerate' | 'doStream' | 'supportsUrl'
> {
  /** Synchronous model capability check for passing a URL directly in the native request. */
  readonly supportsUrl?: (url: URL) => boolean;
  /** Run complete v1 model generation in the operation's Effect context. */
  readonly doGenerate: (
    options: ModelCall,
  ) => Effect.Effect<
    Awaited<ReturnType<SwarmModelContract['doGenerate']>>,
    E,
    R
  >;
  /** Return an Effect stream of v1 events while preserving the provider's response metadata. */
  readonly doStream: (options: ModelCall) => Effect.Effect<
    Omit<ModelStream, 'stream'> & {
      readonly stream: Stream.Stream<Part, E, R>;
    },
    E,
    R
  >;
}

/** Tool execution context and cancellation supplied by the active Swarm run. */
type ToolOptions<C> = {
  readonly abortSignal?: AbortSignal;
  readonly context: C;
};

/** An ordinary Swarm tool with Effect decoding and execution. */
export interface AgentFunctionTool<C, A, O, E = never, R = never> {
  /** Optional discriminator for a function tool in the native Swarm registry. */
  readonly type?: 'function';
  /** Text that helps the model decide whether to select this function tool. */
  readonly description?: string;
  /** Decode model-supplied arguments before running the tool body. */
  readonly parameters: Schema.ConstraintDecoder<A>;
  /** Run an Effect using decoded arguments, the current context, and the supplied cancellation signal. */
  readonly execute: (
    input: A,
    options: ToolOptions<C>,
  ) => Effect.Effect<O, E, R>;
}

/** A tool that changes the active Swarm agent and can replace its context. */
export interface AgentHandoverTool<C, A, R = never, E = never> {
  /** Required discriminator so the dispatcher handles this tool as an agent handover. */
  readonly type: 'handover';
  /** Text that helps the model decide when to transfer to another agent. */
  readonly description?: string;
  /** Decode the arguments required to select the next agent. */
  readonly parameters: Schema.ConstraintDecoder<A>;
  /** Select the destination agent synchronously and optionally supply its replacement context. */
  readonly execute: (
    input: A,
    options: ToolOptions<C>,
  ) => { readonly agent: Agent<C, R, E>; readonly context?: C };
}

/** Tool registered with a Swarm agent, either an Effect function or a synchronous handover. */
export type AgentTool<C, A, O, E = never, R = never> =
  AgentFunctionTool<C, A, O, E, R> | AgentHandoverTool<C, A, R, E>;

/** Retain the input, output, and Effect service types of an ordinary tool declaration. */
export const functionTool = <C, A, O, E = never, R = never>(
  options: AgentFunctionTool<C, A, O, E, R>,
) => options;
/** Retain the context and argument types of a handover tool declaration. */
export const handoverTool = <C, A, R = never, E = never>(
  options: AgentHandoverTool<C, A, R, E>,
) => options;

/** Run native model and tool callbacks with the scope and context that own the Swarm run. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Adapt Effect model calls and streams to the pinned v1 protocol with shared cancellation. */
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

/** Agent configuration including dynamic system instructions, model choice, and tool definitions. */
type Definition<C, R, E> = {
  readonly name: string;
  readonly system?: string | ((context: C) => string);
  readonly toolChoice?: SwarmToolChoice;
  readonly model?: SwarmLanguageModel<R, E>;
  readonly tools?: Record<string, AgentTool<C, never, unknown, E, R>>;
};

/** Immutable Swarm agent description that can become active during a handover. */
export class Agent<C = unknown, R = never, E = never> {
  /** Construct an agent description lazily through the tagged boundary. */
  static make<C = unknown, R = never, E = never>(options: Definition<C, R, E>) {
    return runSync('Swarm.Agent.make', () => new Agent(options));
  }

  /** Retain the full Effect tool configuration until a Swarm run binds it. */
  private constructor(readonly settings: Definition<C, R, E>) {}

  /** Name used by the native Swarm to identify the agent. */
  get name() {
    return this.settings.name;
  }
  /** Agent-specific model override, when the definition supplies one. */
  get model() {
    return this.settings.model;
  }
  /** System instructions or the function that derives them from the active context. */
  get system() {
    return this.settings.system;
  }
  /** Tools available to the active agent before they are bound into the native SDK. */
  get tools() {
    return this.settings.tools;
  }
  /** Optional tool choice configured for this agent's native turns. */
  get toolChoice(): Definition<C, R, E>['toolChoice'] {
    return this.settings.toolChoice;
  }
}

/** Supply an initial agent, fallback model, prompt, and Effect completion callback for a run. */
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

/** Completed Swarm response with the wrapper for the agent active when generation ended. */
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
