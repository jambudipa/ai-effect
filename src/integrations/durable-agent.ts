import * as sdk from '@ai-sdk/durable-agent';
import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2Prompt,
  LanguageModelV2StreamPart,
  LanguageModelV2ToolCall,
  SharedV2ProviderOptions,
} from '@ai-sdk/provider';
import { Effect, Stream, type Context, type Scope } from 'effect';
import type { Owner } from '../internal/chat-boundary.js';
import {
  abortable,
  combineSignals,
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from '../internal/operation.js';
import {
  bindOutput as bindCoreOutput,
  type OutputSpecification as EffectOutput,
} from '../internal/output.js';
import { streamMethod } from '../internal/provider-model.js';
import {
  bindTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import type {
  DurableMessage,
  DurableStepResult,
  DurableUIMessage,
  DurableUIMessageChunk,
} from './internal/durable-agent-types.js';
import { wrapTools } from './internal/sdk-tool.js';

export { Output } from '../internal/output.js';

/** Model contract accepted by the pinned Durable Agent SDK. */
type NativeModel = sdk.CompatibleLanguageModel;
/** Native streaming input before converting to the Effect model call shape. */
type NativeStreamInput = Parameters<NativeModel['doStream']>[0];
/** Native v2 stream result used to preserve provider response metadata. */
type ModelResult = Awaited<ReturnType<LanguageModelV2['doStream']>>;
/** Native stream configuration specialized to the structured-output and partial-output types. */
type NativeStreamOptions<A, P> = sdk.DurableAgentStreamOptions<
  NonNullable<sdk.DurableAgentOptions['tools']>,
  A,
  P
>;
/** Tool representation expected by the pinned SDK after binding Effect tools. */
type LegacyToolSet = NonNullable<sdk.DurableAgentOptions['tools']>;
/** Native transform shape before connecting it to an Effect stream. */
type NativeTransform = sdk.StreamTextTransform<LegacyToolSet>;
/** Legacy output contract with separate partial and complete parsing hooks. */
type NativeOutput<A, P> = sdk.OutputSpecification<A, P>;

/** Provider-specific options keyed by provider under the legacy v2 protocol. */
export type ProviderOptions = SharedV2ProviderOptions;

/** Per-call generation, retry, and cancellation configuration accepted by the Durable Agent SDK. */
export interface GenerationSettings {
  /** Upper bound on output tokens for the model request. */
  readonly maxOutputTokens?: number;
  /** Temperature used by the provider when sampling output tokens. */
  readonly temperature?: number;
  /** Cumulative-probability cutoff used by providers that support nucleus sampling. */
  readonly topP?: number;
  /** Number of token candidates used by providers that support top-k sampling. */
  readonly topK?: number;
  /** Provider penalty for tokens that already occur in the generated text. */
  readonly presencePenalty?: number;
  /** Provider penalty that increases with previous token frequency. */
  readonly frequencyPenalty?: number;
  /** Termination sequences forwarded to the native model request. */
  readonly stopSequences?: string[];
  /** Sampling seed for providers that support reproducible generation. */
  readonly seed?: number;
  /** Limit the additional attempts the native SDK may make after a failed request. */
  readonly maxRetries?: number;
  /** Combine caller cancellation with interruption of the owning operation. */
  readonly abortSignal?: AbortSignal;
  /** Request headers passed through to the SDK, including keys whose values are unset. */
  readonly headers?: Record<string, string | undefined>;
  /** Provider-scoped configuration for the durable model request. */
  readonly providerOptions?: ProviderOptions;
}

/** Native telemetry configuration for individual Durable Agent operations. */
export interface TelemetrySettings {
  /** Enable the legacy SDK's telemetry hooks for the operation. */
  readonly isEnabled?: boolean;
  /** Label a call with a function identifier for telemetry grouping. */
  readonly functionId?: string;
  /** Application attributes attached to the operation's telemetry. */
  readonly metadata?: Record<
    string,
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | null
    | undefined
  >;
  /** Optional tracer forwarded to the legacy SDK without runtime conversion. */
  readonly tracer?: unknown;
}

/** Select automatic, disabled, required, or named-tool execution for a durable step. */
type ToolChoice =
  | 'auto'
  | 'none'
  | 'required'
  | { readonly type: 'tool'; readonly toolName: string };

/** Effect model contract for a Durable Agent that still uses a v2-shaped native streaming boundary. */
export interface CompatibleLanguageModel<R = never, E = never> {
  /** Provider protocol version accepted by the pinned Durable Agent adapter. */
  readonly specificationVersion: 'v2' | 'v3';
  /** Provider name carried into native language model metadata. */
  readonly provider: string;
  /** Model identifier carried into native language model metadata. */
  readonly modelId: string;
  /** Open a scoped stream of legacy model events and retain the native response metadata. */
  readonly doStream: (options: LanguageModelV2CallOptions) => Effect.Effect<
    Omit<ModelResult, 'stream'> & {
      readonly stream: Stream.Stream<LanguageModelV2StreamPart, E, R>;
    },
    E,
    R | Scope.Scope
  >;
}

/** Select a native string model ID or lazily resolve a compatible Effect streaming model. */
type ModelFactory<E, R> =
  string | (() => Effect.Effect<CompatibleLanguageModel<R, E>, E, R>);

/** Bind a model and optional Effect tools to a Durable Agent construction scope. */
export type DurableAgentOptions<
  T extends EffectTools = {},
  R = never,
  E = never,
> = GenerationSettings & {
  readonly model: ModelFactory<E, R>;
  readonly tools?: T;
  readonly system?: string;
  readonly toolChoice?: ToolChoice;
  readonly experimental_telemetry?: TelemetrySettings;
};

/** Current model, accumulated steps, and prompt passed to the preparation callback. */
export interface PrepareStepInfo {
  /** Read the current model selection as an ID or a deferred compatible model. */
  readonly model: ModelFactory<AiSdkError, never>;
  /** Step position reported by the pinned SDK. */
  readonly stepNumber: number;
  /** Completed step results available before the next step starts. */
  readonly steps: DurableStepResult[];
  /** Legacy model prompt that will be sent to the next step unless replaced. */
  readonly messages: LanguageModelV2Prompt;
  /** Application context forwarded by the SDK to the next step. */
  readonly experimental_context: unknown;
}

/** Optional overrides applied to the upcoming durable model step. */
export interface PrepareStepResult<
  E = never,
  R = never,
> extends GenerationSettings {
  /** Replace the current model selection with another ID or scoped model factory. */
  readonly model?: ModelFactory<E, R>;
  /** Supply replacement system instructions for the next step. */
  readonly system?: string;
  /** Supply a replacement native v2 prompt for the upcoming model call. */
  readonly messages?: LanguageModelV2Prompt;
  /** Override the next step's tool selection mode. */
  readonly toolChoice?: ToolChoice;
  /** Limit which of the registered tool names can be called during the next step. */
  readonly activeTools?: string[];
  /** Replace the application context passed on to the next step. */
  readonly experimental_context?: unknown;
}

/** Prepare the next step's overrides with access to the current prompt and previous step results. */
export type PrepareStepCallback<E = never, R = never> = (
  info: PrepareStepInfo,
) => Effect.Effect<PrepareStepResult<E, R>, E, R>;

/** Resolve assets in request order. Return `null` for a URL the model can receive directly. */
export type DownloadFunction<E = never, R = never> = (
  options: Array<{ url: URL; isUrlSupportedByModel: boolean }>,
) => Effect.Effect<
  Array<{ data: Uint8Array; mediaType: string | undefined } | null>,
  E,
  R
>;

/** Observe completed steps when the SDK reports cancellation of the stream. */
export type StreamTextOnAbortCallback<E = never, R = never> = (event: {
  readonly steps: DurableStepResult[];
}) => Effect.Effect<void, E, R>;

/** Observe the tagged SDK error associated with a failed streaming operation. */
export type StreamTextOnErrorCallback<E = never, R = never> = (event: {
  readonly error: AiSdkError;
}) => Effect.Effect<void, E, R>;

/** Observe final conversation state, completed steps, and parsed structured output. */
export type StreamTextOnFinishCallback<
  A = never,
  E = never,
  R = never,
> = (event: {
  readonly steps: DurableStepResult[];
  readonly messages: DurableMessage[];
  readonly experimental_context: unknown;
  readonly experimental_output: A;
}) => Effect.Effect<void, E, R>;

/** Return a repaired legacy tool call or `null` when no repair can be offered. */
export type ToolCallRepairFunction<E = never, R = never> = (options: {
  readonly toolCall: LanguageModelV2ToolCall;
  readonly tools: ReturnType<typeof wrapTools>;
  readonly error: AiSdkError;
  readonly messages: LanguageModelV2Prompt;
}) => Effect.Effect<LanguageModelV2ToolCall | null, E, R>;

/** Transform a legacy model event stream with wrapped tools and an Effect to stop generation. */
export interface StreamTextTransform<E = never, R = never> {
  (options: {
    readonly tools: ReturnType<typeof wrapTools>;
    readonly stopStream: Effect.Effect<void, AiSdkError>;
    readonly stream: Stream.Stream<LanguageModelV2StreamPart, AiSdkError>;
  }): Stream.Stream<LanguageModelV2StreamPart, E, R>;
}

/** Parse complete and partial durable output with an Effect-backed output specification. */
export type OutputSpecification<A, P = A, R = never> = EffectOutput<
  A,
  P,
  unknown,
  R
>;

/** Decide whether streaming should stop after observing the steps completed so far. */
type StopCondition<E, R> = (event: {
  readonly steps: DurableStepResult[];
}) => Effect.Effect<boolean, E, R>;

/** Configure legacy model streaming into a supplied UI writer, including callback and output handling. */
export type DurableAgentStreamOptions<
  A = never,
  P = A,
  E = never,
  R = never,
> = GenerationSettings & {
  readonly messages: DurableMessage[];
  readonly system?: string;
  readonly writable: WritableStream<DurableUIMessageChunk>;
  readonly preventClose?: boolean;
  readonly sendStart?: boolean;
  readonly sendFinish?: boolean;
  readonly stopWhen?: StopCondition<E, R> | ReadonlyArray<StopCondition<E, R>>;
  readonly maxSteps?: number;
  readonly toolChoice?: ToolChoice;
  readonly activeTools?: string[];
  readonly experimental_telemetry?: TelemetrySettings;
  readonly experimental_context?: unknown;
  readonly experimental_output?: OutputSpecification<A, P, R>;
  readonly includeRawChunks?: boolean;
  readonly experimental_repairToolCall?: ToolCallRepairFunction<E, R>;
  readonly experimental_transform?:
    StreamTextTransform<E, R> | ReadonlyArray<StreamTextTransform<E, R>>;
  readonly experimental_download?: DownloadFunction<E, R>;
  readonly onStepFinish?: (
    event: DurableStepResult,
  ) => Effect.Effect<void, E, R>;
  readonly onError?: StreamTextOnErrorCallback<E, R>;
  readonly onFinish?: StreamTextOnFinishCallback<A, E, R>;
  readonly onAbort?: StreamTextOnAbortCallback<E, R>;
  readonly prepareStep?: PrepareStepCallback<E, R>;
  readonly collectUIMessages?: boolean;
};

/** Completed durable run state and optional gathered UI messages from the supplied writer flow. */
export type DurableAgentStreamResult<A = never> = {
  readonly messages: DurableMessage[];
  readonly steps: DurableStepResult[];
  readonly experimental_output: A;
  readonly uiMessages?: DurableUIMessage[];
};

/** Preserve string IDs and adapt Effect model factories and streams at the scoped native boundary. */
const modelForSdk = <E, R>(
  factory: ModelFactory<E, R>,
  owner: Owner<R | Scope.Scope>,
) =>
  typeof factory === 'string'
    ? factory
    : () =>
        owner.runCallback(
          Effect.suspend(factory).pipe(
            Effect.map(
              (model): NativeModel =>
                ({
                  ...model,
                  doStream: (options: NativeStreamInput) =>
                    owner.runCallback(
                      Effect.gen(function* () {
                        const signal = combineSignals(
                          owner.signal,
                          options.abortSignal,
                        );
                        const request = {
                          ...options,
                          abortSignal: signal,
                        } as LanguageModelV2CallOptions;
                        const { stream, ...metadata } =
                          yield* model.doStream(request);
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
                }) as NativeModel,
            ),
          ),
        );

/** Wrap a native model factory and its stream before exposing it to step preparation. */
const publicModel = (
  model: sdk.PrepareStepInfo['model'],
  signal: AbortSignal,
): ModelFactory<AiSdkError, never> =>
  typeof model === 'string'
    ? model
    : () =>
        runRequest(
          'DurableAgent.prepareStep.model',
          { abortSignal: signal },
          model,
        ).pipe(
          Effect.map((native) => ({
            specificationVersion: native.specificationVersion,
            provider: native.provider,
            modelId: native.modelId,
            doStream: streamMethod(
              'DurableAgent.model.doStream',
              (options: LanguageModelV2CallOptions) =>
                native.doStream(
                  options as NativeStreamInput,
                ) as unknown as PromiseLike<ModelResult>,
            ),
          })),
        );

/** Translate the current output specification to legacy format, partial parsing, and complete parsing operations. */
const bindOutput = <A, P, R>(
  output: OutputSpecification<A, P, R>,
  owner: Owner<R>,
) =>
  Effect.gen(function* () {
    const operation = 'DurableAgent.output';
    const native = yield* runSync(operation, () =>
      bindCoreOutput(output, owner),
    );
    if (!native)
      return yield* Effect.fail(
        sdkError(operation, 'Invalid output specification'),
      );
    const responseFormat = yield* runRequest(
      operation,
      { abortSignal: owner.signal },
      () => native.responseFormat,
    );
    return {
      type: output.name === 'text' ? 'text' : 'object',
      responseFormat,
      parsePartial: (
        input: Parameters<NativeOutput<A, P>['parsePartial']>[0],
      ) => native.parsePartialOutput(input),
      parseOutput: (...args: Parameters<NativeOutput<A, P>['parseOutput']>) =>
        native.parseCompleteOutput(
          ...(args as unknown as Parameters<typeof native.parseCompleteOutput>),
        ),
    } as NativeOutput<A, P>;
  });

/** Connect the caller's Effect transform to the SDK web stream with shared cancellation. */
const bindTransform =
  <E, R>(
    transform: StreamTextTransform<E, R>,
    context: Context.Context<R>,
    signal: AbortSignal,
  ): NativeTransform =>
  ({ tools, stopStream }) => {
    const bridge = new TransformStream<
      LanguageModelV2StreamPart,
      LanguageModelV2StreamPart
    >();
    const stream = Stream.fromReadableStream({
      evaluate: () => bridge.readable,
      onError: (cause) => sdkError('DurableAgent.transform', cause),
    });
    const transformed = transform({
      tools: wrapTools('DurableAgent.tools', tools),
      stopStream: runSync('DurableAgent.stopStream', stopStream),
      stream,
    });
    return {
      writable: bridge.writable,
      readable: Stream.toReadableStreamWith(transformed, context, { signal }),
    } as ReturnType<NativeTransform>;
  };

/** Own legacy model and tool callbacks in the scope of the agent. */
export class DurableAgent {
  /** Construct the native agent lazily and keep its model factory and tool callbacks in scope. */
  static make<T extends EffectTools = {}, R = never, E = never>(
    settings: DurableAgentOptions<T, R, E>,
  ): Effect.Effect<
    DurableAgent,
    AiSdkError,
    R | ToolServices<T> | Scope.Scope
  > {
    return Effect.gen(function* () {
      const { model, tools, ...rest } = settings;
      const owner = yield* openOperation<R | ToolServices<T> | Scope.Scope>(
        settings.abortSignal,
      );
      return yield* runSync(
        'DurableAgent.make',
        () =>
          new DurableAgent(
            new sdk.DurableAgent({
              ...rest,
              model: modelForSdk(model, owner),
              ...(tools && {
                tools: bindTools(tools, owner) as unknown as LegacyToolSet,
              }),
            } as sdk.DurableAgentOptions),
          ),
      );
    });
  }

  /** Keep the legacy SDK agent private so its calls pass through the Effect boundary. */
  private constructor(private readonly native: sdk.DurableAgent) {}

  /** Call the legacy generate entry point. The pinned SDK throws an unimplemented-operation error. */
  generate(): Effect.Effect<void, AiSdkError> {
    return runSync('DurableAgent.generate', () => this.native.generate());
  }

  /** Stream into the caller's writer and join native completion, including scoped callback handling. */
  stream<A = never, P = A, E = never, R = never>(
    options: DurableAgentStreamOptions<A, P, E, R>,
  ): Effect.Effect<
    DurableAgentStreamResult<A>,
    AiSdkError,
    Exclude<R, Scope.Scope>
  > {
    const agent = this;
    return Effect.scoped(
      Effect.gen(function* () {
        const operation = 'DurableAgent.stream';
        const owner = yield* openOperation<R | Scope.Scope>(
          options.abortSignal,
        );
        const {
          experimental_output,
          experimental_transform,
          experimental_download,
          experimental_repairToolCall,
          onStepFinish,
          onError,
          onFinish,
          onAbort,
          prepareStep,
          stopWhen,
          ...data
        } = options;
        const context = yield* Effect.context<R>();
        const transforms =
          experimental_transform &&
          (typeof experimental_transform === 'function'
            ? [experimental_transform]
            : experimental_transform
          ).map((transform) => bindTransform(transform, context, owner.signal));
        const output =
          experimental_output &&
          (yield* bindOutput(experimental_output, owner));
        const bind =
          <Input, Result>(
            callback: (input: Input) => Effect.Effect<Result, E, R>,
          ) =>
          (input: Input) =>
            owner.runCallback(Effect.suspend(() => callback(input)));
        const conditions =
          stopWhen &&
          (typeof stopWhen === 'function' ? [stopWhen] : stopWhen).map(bind);
        const result = yield* abortable(
          operation,
          owner.signal,
          runRequest(
            operation,
            { abortSignal: owner.signal },
            (abortSignal) => {
              const bound = {
                ...data,
                abortSignal,
                ...(output && { experimental_output: output }),
                ...(transforms && { experimental_transform: transforms }),
                ...(conditions && { stopWhen: conditions }),
                ...(experimental_download && {
                  experimental_download: bind(experimental_download),
                }),
                ...(experimental_repairToolCall && {
                  experimental_repairToolCall: (
                    event: Parameters<
                      sdk.ToolCallRepairFunction<LegacyToolSet>
                    >[0],
                  ) =>
                    bind(experimental_repairToolCall)({
                      ...event,
                      tools: wrapTools(operation, event.tools),
                      error: sdkError(operation, event.error),
                      messages: event.messages as LanguageModelV2Prompt,
                      toolCall: event.toolCall as LanguageModelV2ToolCall,
                    }),
                }),
                ...(onStepFinish && { onStepFinish: bind(onStepFinish) }),
                ...(onError && {
                  onError: ({ error }: { error: unknown }) =>
                    bind(onError)({ error: sdkError(operation, error) }),
                }),
                ...(onFinish && { onFinish: bind(onFinish) }),
                ...(onAbort && { onAbort: bind(onAbort) }),
                ...(prepareStep && {
                  prepareStep: ({ model, ...event }: sdk.PrepareStepInfo) =>
                    owner.runCallback(
                      Effect.suspend(() =>
                        prepareStep({
                          ...event,
                          steps: event.steps as unknown as DurableStepResult[],
                          messages: event.messages as LanguageModelV2Prompt,
                          model: publicModel(model, owner.signal),
                        }),
                      ).pipe(
                        Effect.map(({ model: replacement, ...rest }) => ({
                          ...rest,
                          ...(replacement === undefined
                            ? {}
                            : { model: modelForSdk(replacement, owner) }),
                        })),
                      ),
                    ),
                }),
              };
              return agent.native.stream(
                bound as unknown as NativeStreamOptions<A, P>,
              );
            },
          ),
        );
        yield* owner.markComplete;
        return result as unknown as DurableAgentStreamResult<A>;
      }),
    );
  }
}
