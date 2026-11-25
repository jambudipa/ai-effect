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

type NativeModel = sdk.CompatibleLanguageModel;
type NativeStreamInput = Parameters<NativeModel['doStream']>[0];
type ModelResult = Awaited<ReturnType<LanguageModelV2['doStream']>>;
type NativeStreamOptions<A, P> = sdk.DurableAgentStreamOptions<
  NonNullable<sdk.DurableAgentOptions['tools']>,
  A,
  P
>;
type LegacyToolSet = NonNullable<sdk.DurableAgentOptions['tools']>;
type NativeTransform = sdk.StreamTextTransform<LegacyToolSet>;
type NativeOutput<A, P> = sdk.OutputSpecification<A, P>;

export type ProviderOptions = SharedV2ProviderOptions;

export interface GenerationSettings {
  readonly maxOutputTokens?: number;
  readonly temperature?: number;
  readonly topP?: number;
  readonly topK?: number;
  readonly presencePenalty?: number;
  readonly frequencyPenalty?: number;
  readonly stopSequences?: string[];
  readonly seed?: number;
  readonly maxRetries?: number;
  readonly abortSignal?: AbortSignal;
  readonly headers?: Record<string, string | undefined>;
  readonly providerOptions?: ProviderOptions;
}

export interface TelemetrySettings {
  readonly isEnabled?: boolean;
  readonly functionId?: string;
  readonly metadata?: Record<
    string,
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | null
    | undefined
  >;
  readonly tracer?: unknown;
}

type ToolChoice =
  | 'auto'
  | 'none'
  | 'required'
  | { readonly type: 'tool'; readonly toolName: string };

export interface CompatibleLanguageModel<R = never, E = never> {
  readonly specificationVersion: 'v2' | 'v3';
  readonly provider: string;
  readonly modelId: string;
  readonly doStream: (options: LanguageModelV2CallOptions) => Effect.Effect<
    Omit<ModelResult, 'stream'> & {
      readonly stream: Stream.Stream<LanguageModelV2StreamPart, E, R>;
    },
    E,
    R | Scope.Scope
  >;
}

type ModelFactory<E, R> =
  string | (() => Effect.Effect<CompatibleLanguageModel<R, E>, E, R>);

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

export interface PrepareStepInfo {
  readonly model: ModelFactory<AiSdkError, never>;
  readonly stepNumber: number;
  readonly steps: DurableStepResult[];
  readonly messages: LanguageModelV2Prompt;
  readonly experimental_context: unknown;
}

export interface PrepareStepResult<
  E = never,
  R = never,
> extends GenerationSettings {
  readonly model?: ModelFactory<E, R>;
  readonly system?: string;
  readonly messages?: LanguageModelV2Prompt;
  readonly toolChoice?: ToolChoice;
  readonly activeTools?: string[];
  readonly experimental_context?: unknown;
}

export type PrepareStepCallback<E = never, R = never> = (
  info: PrepareStepInfo,
) => Effect.Effect<PrepareStepResult<E, R>, E, R>;

export type DownloadFunction<E = never, R = never> = (
  options: Array<{ url: URL; isUrlSupportedByModel: boolean }>,
) => Effect.Effect<
  Array<{ data: Uint8Array; mediaType: string | undefined } | null>,
  E,
  R
>;

export type StreamTextOnAbortCallback<E = never, R = never> = (event: {
  readonly steps: DurableStepResult[];
}) => Effect.Effect<void, E, R>;

export type StreamTextOnErrorCallback<E = never, R = never> = (event: {
  readonly error: AiSdkError;
}) => Effect.Effect<void, E, R>;

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

export type ToolCallRepairFunction<E = never, R = never> = (options: {
  readonly toolCall: LanguageModelV2ToolCall;
  readonly tools: ReturnType<typeof wrapTools>;
  readonly error: AiSdkError;
  readonly messages: LanguageModelV2Prompt;
}) => Effect.Effect<LanguageModelV2ToolCall | null, E, R>;

export interface StreamTextTransform<E = never, R = never> {
  (options: {
    readonly tools: ReturnType<typeof wrapTools>;
    readonly stopStream: Effect.Effect<void, AiSdkError>;
    readonly stream: Stream.Stream<LanguageModelV2StreamPart, AiSdkError>;
  }): Stream.Stream<LanguageModelV2StreamPart, E, R>;
}

export type OutputSpecification<A, P = A, R = never> = EffectOutput<
  A,
  P,
  unknown,
  R
>;

type StopCondition<E, R> = (event: {
  readonly steps: DurableStepResult[];
}) => Effect.Effect<boolean, E, R>;

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

export type DurableAgentStreamResult<A = never> = {
  readonly messages: DurableMessage[];
  readonly steps: DurableStepResult[];
  readonly experimental_output: A;
  readonly uiMessages?: DurableUIMessage[];
};

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

  private constructor(private readonly native: sdk.DurableAgent) {}

  generate(): Effect.Effect<void, AiSdkError> {
    return runSync('DurableAgent.generate', () => this.native.generate());
  }

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
