import {
  experimental_streamTextLowMemory as sdkStreamTextLowMemory,
  generateText as sdkGenerateText,
  NoSuchModelError,
  streamText as sdkStreamText,
  ToolLoopAgent as SdkToolLoopAgent,
  type LanguageModel as SdkLanguageModel,
  type OutputInterface,
  type ToolLoopAgentSettings,
} from 'ai';

export { makeChatTransport } from './internal/chat-transport.js';
export * from './core-chat.js';
export type * from './core-contracts.js';
export type { StreamTextTransform } from './internal/core-transform.js';
export type {
  SafeValidateUIMessagesResult,
  SafeValidateWebSocketChatTransportRequestResult,
  UIDataPartSchemas,
} from './core-chat.js';
export * from './core-data.js';
export * from './core-errors.js';
export {
  experimental_cancelBatch,
  experimental_decide,
  experimental_decodeRealtimeAudio,
  experimental_encodeRealtimeAudio,
  experimental_evaluate,
  experimental_extract,
  experimental_generateVideo,
  experimental_getBatchResults,
  experimental_getBatchStatus,
  experimental_getRealtimeToolDefinitions,
  experimental_getVideoStatus,
  experimental_listBatches,
  experimental_resampleAudio,
  experimental_startBatch,
  experimental_startVideo,
  experimental_streamSpeech,
  experimental_streamTranscribe,
  experimental_streamTranslate,
  type Experimental_BatchItemResult,
  type Experimental_BatchProvider,
  type Experimental_BatchRequest,
  type Experimental_CancelBatchOptions,
  type Experimental_DecisionModel,
  type Experimental_EvaluationModel,
  type Experimental_ExtractionModel,
  type Experimental_GetBatchResultsOptions,
  type Experimental_GetBatchStatusOptions,
  type Experimental_ListBatchesOptions,
  type Experimental_StartBatchOptions,
  type Experimental_StreamSpeechResult,
  type Experimental_StreamTranslationResult,
  type Experimental_TextBatchGenerationResult,
  type Experimental_TextBatchItemResult,
  type Experimental_TextBatchRequest,
} from './core-experimental.js';
export { createDownload, uploadFile, uploadSkill } from './core-files.js';
export * from './core-models.js';
export * from './core-message-schema.js';
export {
  Experimental_AbstractRealtimeSession,
  type Experimental_RealtimeFactory,
  type Experimental_RealtimeModel,
  type Experimental_RealtimeSessionOptions,
} from './core-realtime.js';
export {
  createProviderRegistry,
  customProvider,
  experimental_createProviderRegistry,
  wrapProvider,
  type Experimental_DecisionProviderRegistry,
  type Experimental_EvaluationProviderRegistry,
  type Experimental_ExtractionProviderRegistry,
  type ProviderRegistryProvider,
} from './core-providers.js';
export {
  registerTelemetry,
  type Telemetry,
  type TelemetryOptions,
} from './core-telemetry.js';
export {
  callCompletionApi,
  experimental_streamLanguageModelCall,
  smoothStream,
  type CallCompletionApiOptions,
  type SmoothStream,
  type SmoothStreamOptions,
  type StreamLanguageModelCallOptions,
} from './core-stream-operations.js';
export {
  addToolInputExamplesMiddleware,
  defaultEmbeddingSettingsMiddleware,
  defaultInstructionsMiddleware,
  defaultSettingsMiddleware,
  extractJsonMiddleware,
  extractReasoningMiddleware,
  simulateStreamingMiddleware,
  wrapEmbeddingModel,
  wrapImageModel,
  wrapLanguageModel,
  type EmbeddingModelMiddleware,
  type ImageModelMiddleware,
  type LanguageModelMiddleware,
} from './core-middleware.js';
export * from './core-utilities.js';
export { createGateway, gateway } from './providers/gateway.js';
export { ToolLoopAgent as Experimental_Agent };
export { generateObject, streamObject } from './core-object.js';
export type {
  GenerateObjectResult,
  StreamObjectResult,
} from './core-object.js';
export {
  detectToolDrift,
  dynamicTool,
  experimental_filterActiveTools,
  filterActiveTools,
  fingerprintTools,
  hasToolCall,
  isLoopFinished,
  isStepCount,
  stepCountIs,
  toolSearch,
  type ToolSearchFunction,
} from './core-tools.js';
export type { ActiveTools, ActiveToolSubset } from './core-tools.js';
export { asSchema, jsonSchema, zodSchema } from './core-schema.js';
export type {
  FlexibleSchema,
  Schema,
  ValidationResult,
} from './core-schema.js';
export * from './internal/sdk-data/core.js';
export { simulateReadableStream } from './internal/simulate-readable.js';
export type {
  ChatReconnectOptions,
  ChatSendOptions,
  ChatTransport,
  ChatTransportHandlers,
} from './internal/chat-transport.js';
export {
  parseJsonEventStream,
  experimental_toolCaller,
} from './protocols/provider-utils-operations.js';
import { Effect } from 'effect';
import type { FlexibleSchema } from './core-schema.js';
import {
  bindCoreOptions,
  modelForSdk,
  type CoreOptions,
  type CoreServices,
} from './internal/core-settings.js';
import type { LanguageModelV4 } from './internal/language-model.js';
import { registerNativeAgent } from './internal/native-agent.js';
import { openOperation, runRequest, runSync } from './internal/operation.js';
import { bindOutput, type OutputSpecification } from './internal/output.js';
import {
  wrapSingleConsumerTextStream,
  wrapTextStream,
} from './internal/text-stream.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from './internal/tool.js';
import type { LanguageModelV2, LanguageModelV3 } from './protocols/provider.js';

export { Output, type OutputSpecification } from './internal/output.js';
export { tool, type EffectToolOptions } from './internal/tool.js';
export type { LanguageModelV4 } from './internal/language-model.js';
export type { ModelMessage, TextPart, UIMessage } from 'ai';

/** Accept SDK registry IDs and supported native model versions at the Core boundary. */
export type LanguageModel =
  | Extract<SdkLanguageModel, string>
  | LanguageModelV2
  | LanguageModelV3
  | LanguageModelV4;
/** Use the same model input on one-shot calls and reusable agents. */
type Model = LanguageModel;
/** Retain the caller's context record across SDK steps and tool execution. */
type RuntimeContext = Record<string, unknown>;
/** Carry complete, partial, and item output types through the native parser. */
type BoundOutput<A, P, I> = OutputInterface<A, P, I>;
/** Own the SDK abort signal and the Effect services available to callbacks. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Hold the public model, tools, and output specification before native binding. */
type Settings<Tools, Complete, Partial, Element> = {
  readonly model: Model;
  readonly tools?: Tools;
  readonly output?: OutputSpecification<Complete, Partial, Element, unknown>;
};

/** Remove fields that need Effect adaptation while preserving native option unions. */
type ReplaceSettings<Options> = Options extends unknown
  ? Omit<Options, 'model' | 'tools' | 'output'>
  : never;

/** Bind the model, tools, and output parser to one operation owner before calling the SDK. */
const bindSettings = <Tools extends EffectTools, A, P, I, Hook>(
  settings: Settings<Tools, A, P, I>,
  owner: Owner<ToolServices<Tools> | Hook>,
) => {
  const { model, tools, output, ...options } = settings;
  const native = modelForSdk(model);
  if (!native) {
    throw new NoSuchModelError({
      modelId: typeof model === 'string' ? model : model.modelId,
      modelType: 'languageModel',
    });
  }
  return {
    ...bindCoreOptions(options, owner, tools, (prepared) => {
      const preparedOptions = { ...prepared };
      if (prepared.model)
        preparedOptions.model = modelForSdk(prepared.model as Model);
      if (prepared.tools)
        preparedOptions.tools = bindTools(prepared.tools as Tools, owner);
      if (prepared.output)
        preparedOptions.output = bindOutput(
          prepared.output as OutputSpecification<
            A,
            P,
            I,
            ToolServices<Tools> | Hook
          >,
          owner,
        );
      return bindCoreOptions(
        preparedOptions,
        owner,
        (prepared.tools ?? tools) as Tools | undefined,
      );
    }),
    model: native,
    ...(tools ? { tools: bindTools(tools, owner) } : {}),
    ...(output
      ? {
          output: bindOutput(
            output as OutputSpecification<A, P, I, ToolServices<Tools> | Hook>,
            owner,
          ),
        }
      : {}),
  };
};

/** Preserve generation options and expose only the required Effect callback services. */
type GenerateOptions<
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
  Hook,
> = CoreOptions<
  ReplaceSettings<
    Parameters<
      typeof sdkGenerateText<BoundTools<T>, R, BoundOutput<A, P, I>>
    >[0]
  >,
  Hook,
  T
> &
  Settings<T, A, P, I>;

/** Generate text or structured output with Effect-owned tool callbacks. */
export const generateText = <
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
  Hook = never,
  Provided extends object = {},
>(
  options: GenerateOptions<T, R, A, P, I, unknown> & Provided,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      type Services = Hook | CoreServices<Provided>;
      const owner = yield* openOperation<ToolServices<T> | Services>(
        options.abortSignal,
      );
      return yield* runRequest(
        'generateText',
        { abortSignal: owner.signal },
        (abortSignal) =>
          sdkGenerateText<BoundTools<T>, R, BoundOutput<A, P, I>>({
            ...bindSettings<T, A, P, I, Services>(options, owner),
            abortSignal,
          } as unknown as Parameters<
            typeof sdkGenerateText<BoundTools<T>, R, BoundOutput<A, P, I>>
          >[0]),
      );
    }),
  );

/** Preserve stream options and use the same callback bindings as text generation. */
type StreamOptions<
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
  Hook,
> = CoreOptions<
  ReplaceSettings<
    Parameters<typeof sdkStreamText<BoundTools<T>, R, BoundOutput<A, P, I>>>[0]
  >,
  Hook,
  T
> &
  Settings<T, A, P, I>;

/** Acquire a text stream and release its request when the scope closes. */
export const streamText = <
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
  Hook = never,
  Provided extends object = {},
>(
  options: StreamOptions<T, R, A, P, I, unknown> & Provided,
) =>
  Effect.gen(function* () {
    type Services = Hook | CoreServices<Provided>;
    const owner = yield* openOperation<ToolServices<T> | Services>(
      options.abortSignal,
    );
    const operation = 'streamText';
    return yield* runSync(operation, () =>
      wrapTextStream<BoundTools<T>, R, BoundOutput<A, P, I>>(
        operation,
        sdkStreamText<BoundTools<T>, R, BoundOutput<A, P, I>>(
          bindStreamSettings<T, R, A, P, I, Services>(options, owner),
        ),
        owner.markComplete,
      ),
    );
  });

/** Keep native stream errors on the stream while allowing callers to add an error hook. */
function bindStreamSettings<
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
  Hook,
>(options: Settings<T, A, P, I>, owner: Owner<ToolServices<T> | Hook>) {
  return {
    onError: () => {},
    ...bindSettings<T, A, P, I, Hook>(options, owner),
    abortSignal: owner.signal,
  } as unknown as Parameters<
    typeof sdkStreamText<BoundTools<T>, R, BoundOutput<A, P, I>>
  >[0];
}

/** Stream text with the SDK's single-consumer buffering mode. */
export const experimental_streamTextLowMemory = <
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
  Hook = never,
  Provided extends object = {},
>(
  options: StreamOptions<T, R, A, P, I, unknown> & Provided,
) =>
  Effect.gen(function* () {
    type Services = Hook | CoreServices<Provided>;
    const owner = yield* openOperation<ToolServices<T> | Services>(
      options.abortSignal,
    );
    const operation = 'experimental_streamTextLowMemory';
    return yield* runSync(operation, () =>
      wrapSingleConsumerTextStream<BoundTools<T>, R, BoundOutput<A, P, I>>(
        operation,
        sdkStreamTextLowMemory<BoundTools<T>, R, BoundOutput<A, P, I>>(
          bindStreamSettings<T, R, A, P, I, Services>(options, owner),
        ),
        owner.markComplete,
      ),
    );
  });

/** Retain native agent settings with the model, tools, and schema adapted at the boundary. */
type AgentSettings<
  C,
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
  Hook,
> = CoreOptions<
  ReplaceSettings<
    Omit<
      ToolLoopAgentSettings<C, BoundTools<T>, R, BoundOutput<A, P, I>>,
      'callOptionsSchema'
    >
  >,
  Hook,
  T
> &
  Settings<T, A, P, I> & {
    readonly callOptionsSchema?: FlexibleSchema<C, Hook>;
  };

/** A tool loop that creates a private SDK agent for each execution. */
export class ToolLoopAgent<
  C = never,
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
  Hook = never,
  Provided extends object = {},
> {
  /** Advertise the SDK protocol version used by consumers of an agent. */
  readonly version = 'agent-v1';
  /** Keep the original settings until a call supplies its operation owner. */
  readonly #settings: AgentSettings<C, T, R, A, P, I, unknown>;

  /** Register an agent factory that binds a fresh owner for each native consumer. */
  constructor(settings: AgentSettings<C, T, R, A, P, I, unknown> & Provided) {
    this.#settings = settings;
    registerNativeAgent(
      this,
      (owner: Owner<ToolServices<T> | Hook | CoreServices<Provided>>) =>
        this.#agent(owner),
    );
  }

  /** Forward the configured agent identifier for host and UI adapters. */
  get id() {
    return this.#settings.id;
  }

  /** Expose the public tool set so adapters can infer tool input and output. */
  get tools() {
    return this.#settings.tools ?? ({} as T);
  }

  /** Construct a native agent with callbacks bound to this call's owner. */
  #agent(owner: Owner<ToolServices<T> | Hook | CoreServices<Provided>>) {
    const settings = this.#settings;
    return new SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>(
      bindSettings<T, A, P, I, Hook | CoreServices<Provided>>(
        settings,
        owner,
      ) as unknown as ToolLoopAgentSettings<
        C,
        BoundTools<T>,
        R,
        BoundOutput<A, P, I>
      >,
    );
  }

  /** Run the configured agent to completion in a scope and return the adapted SDK result. */
  generate<CallHook = never, Call extends object = {}>(
    options: CoreOptions<
      Parameters<
        SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>['generate']
      >[0],
      unknown,
      T
    > &
      Call,
  ) {
    return Effect.scoped(
      Effect.gen({ self: this }, function* () {
        const operation = 'ToolLoopAgent.generate';
        type Services =
          | ToolServices<T>
          | Hook
          | CoreServices<Provided>
          | CallHook
          | CoreServices<Call>;
        const owner = yield* openOperation<Services>(options.abortSignal);
        return yield* runRequest(
          operation,
          { abortSignal: owner.signal },
          (abortSignal) =>
            this.#agent(owner).generate(
              Object.assign(
                bindCoreOptions<
                  Parameters<
                    SdkToolLoopAgent<
                      C,
                      BoundTools<T>,
                      R,
                      BoundOutput<A, P, I>
                    >['generate']
                  >[0],
                  Services
                >(options, owner, this.tools),
                { abortSignal },
              ),
            ),
        );
      }),
    );
  }

  /** Start a scoped generation and retain the owner until the stream ends or the caller closes it. */
  stream<CallHook = never, Call extends object = {}>(
    options: CoreOptions<
      Parameters<
        SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>['stream']
      >[0],
      unknown,
      T
    > &
      Call,
  ) {
    return Effect.gen({ self: this }, function* () {
      const operation = 'ToolLoopAgent.stream';
      type Services =
        | ToolServices<T>
        | Hook
        | CoreServices<Provided>
        | CallHook
        | CoreServices<Call>;
      const owner = yield* openOperation<Services>(options.abortSignal);
      const result = yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) =>
          this.#agent(owner).stream(
            Object.assign(
              bindCoreOptions<
                Parameters<
                  SdkToolLoopAgent<
                    C,
                    BoundTools<T>,
                    R,
                    BoundOutput<A, P, I>
                  >['stream']
                >[0],
                Services
              >(options, owner, this.tools),
              { abortSignal },
            ),
          ),
      );
      return wrapTextStream(operation, result, owner.markComplete);
    });
  }
}
