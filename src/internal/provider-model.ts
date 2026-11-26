import type {
  EmbeddingModelV4 as SdkEmbeddingModelV4,
  Experimental_DecisionModelV4 as SdkDecisionModelV4,
  Experimental_ExtractionModelV4 as SdkExtractionModelV4,
  Experimental_SpeechTranslationModelV4 as SdkSpeechTranslationModelV4,
  Experimental_StreamingSpeechModelV4 as SdkStreamingSpeechModelV4,
  Experimental_VideoModelV4 as SdkVideoModelV4,
  ImageModelV4 as SdkImageModelV4,
  RerankingModelV4 as SdkRerankingModelV4,
  SpeechModelV4 as SdkSpeechModelV4,
  TranscriptionModelV4 as SdkTranscriptionModelV4,
} from '@ai-sdk/provider';
import { Effect, Stream } from 'effect';
import { openOperation, runRequest, sdkError } from './operation.js';
import { ownReadable } from './readable.js';

/** Accept caller cancellation before sending a provider protocol request. */
type AbortOptions = { readonly abortSignal?: AbortSignal };

/** Defer the provider call and pass it the signal combined with Effect interruption. */
export const requestMethod =
  <Options extends AbortOptions, A>(
    operation: string,
    request: (options: Options) => PromiseLike<A>,
  ) =>
  (options: Options) =>
    runRequest(operation, options, (abortSignal) =>
      request({ ...options, abortSignal }),
    );

/** Acquire a native readable under the caller's scope and separate stream data from metadata. */
export const readMethod =
  <Options extends AbortOptions, A, Result, Metadata>(
    operation: string,
    request: (options: Options) => PromiseLike<Result>,
    separate: (result: Result) => readonly [ReadableStream<A>, Metadata],
  ) =>
  (options: Options) =>
    Effect.gen(function* () {
      const owner = yield* openOperation(options.abortSignal);
      const [source, metadata] = yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) =>
          Promise.resolve(request({ ...options, abortSignal })).then(
            (result) => {
              const [source, metadata] = separate(result);
              if (abortSignal.aborted) {
                void source.cancel().catch(() => {});
                abortSignal.throwIfAborted();
              }
              return [source, metadata] as const;
            },
          ),
      );
      const readable = yield* ownReadable(operation, source);
      const stream = Stream.fromReadableStream({
        evaluate: () => readable,
        onError: (cause) => sdkError(operation, cause),
        releaseLockOnEnd: true,
      });
      return { metadata, stream };
    });

/** Expose a scoped provider stream together with its native response metadata. */
export const streamMethod =
  <Options extends AbortOptions, A, Metadata>(
    operation: string,
    request: (
      options: Options,
    ) => PromiseLike<Metadata & { stream: ReadableStream<A> }>,
  ) =>
  (options: Options) =>
    readMethod(operation, request, ({ stream, ...metadata }) => [
      stream,
      metadata,
    ])(options).pipe(
      Effect.map(({ metadata, stream }) => ({ ...metadata, stream })),
    );

/** Copy stable protocol identity fields to the handle SDK callers inspect. */
const modelMetadata = (model: {
  readonly specificationVersion: 'v4';
  readonly provider: string;
  readonly modelId: string;
}) => ({
  specificationVersion: model.specificationVersion,
  provider: model.provider,
  modelId: model.modelId,
});

/** Read a native property lazily and map synchronous or asynchronous failure to `AiSdkError`. */
export const lazyValue = <A>(
  operation: string,
  getValue: () => A | PromiseLike<A>,
) => runRequest(operation, {}, () => Promise.resolve(getValue()));

/** Expose an Effect operation only when the native protocol method exists. */
const optionalRequest = <Options extends AbortOptions, A>(
  operation: string,
  request: ((options: Options) => PromiseLike<A>) | undefined,
) => (request === undefined ? undefined : requestMethod(operation, request));

/** Track native embedding models for registered handles passed back to the SDK. */
const embeddingModels = new WeakMap<object, SdkEmbeddingModelV4>();
/** Track native image models for registered handles passed back to the SDK. */
const imageModels = new WeakMap<object, SdkImageModelV4>();
/** Track native speech models for registered handles passed back to the SDK. */
const speechModels = new WeakMap<object, SdkSpeechModelV4>();
/** Track native transcription models for registered handles passed back to the SDK. */
const transcriptionModels = new WeakMap<object, SdkTranscriptionModelV4>();
/** Track native reranking models for registered handles passed back to the SDK. */
const rerankingModels = new WeakMap<object, SdkRerankingModelV4>();
/** Track native video models for registered handles passed back to the SDK. */
const videoModels = new WeakMap<object, SdkVideoModelV4>();
/** Track native decision models for registered handles passed back to the SDK. */
const decisionModels = new WeakMap<object, SdkDecisionModelV4>();
/** Track native extraction models for registered handles passed back to the SDK. */
const extractionModels = new WeakMap<object, SdkExtractionModelV4>();
/** Track native speech translation models for registered handles passed back to the SDK. */
const speechTranslationModels = new WeakMap<
  object,
  SdkSpeechTranslationModelV4
>();

/** Associate the public model with the native instance without putting it on the exposed handle. */
const registerModel = <Sdk extends object, Wrapper extends object>(
  models: WeakMap<object, Sdk>,
  model: Sdk,
  wrapper: Wrapper,
) => {
  models.set(wrapper, model);
  return wrapper;
};

/** Adapt the native batch input limit and embedding request to lazy Effect operations. */
export const wrapEmbeddingModel = (model: SdkEmbeddingModelV4) =>
  registerModel(embeddingModels, model, {
    ...modelMetadata(model),
    maxEmbeddingsPerCall: lazyValue(
      'EmbeddingModelV4.maxEmbeddingsPerCall',
      () => model.maxEmbeddingsPerCall,
    ),
    supportsParallelCalls: lazyValue(
      'EmbeddingModelV4.supportsParallelCalls',
      () => model.supportsParallelCalls,
    ),
    doEmbed: requestMethod(
      'EmbeddingModelV4.doEmbed',
      model.doEmbed.bind(model),
    ),
  });

/** Accept the SDK variants whose optional file and mask support getters explicitly return `undefined`. */
export type SdkImageModelInput = Omit<
  SdkImageModelV4,
  'supportsFileInputs' | 'supportsMaskInputs'
> & {
  readonly supportsFileInputs?: SdkImageModelV4['supportsFileInputs'];
  readonly supportsMaskInputs?: SdkImageModelV4['supportsMaskInputs'];
};

/** Bind image generation and defer evaluation of native input support getters. */
const imageModel = <Limit>(
  model: SdkImageModelInput,
  maxImagesPerCall: Limit,
) =>
  // Some SDK classes explicitly return undefined from these optional getters.
  registerModel(imageModels, model as SdkImageModelV4, {
    ...modelMetadata(model),
    maxImagesPerCall,
    supportsFileInputs: lazyValue(
      'ImageModelV4.supportsFileInputs',
      () => model.supportsFileInputs,
    ),
    supportsMaskInputs: lazyValue(
      'ImageModelV4.supportsMaskInputs',
      () => model.supportsMaskInputs,
    ),
    doGenerate: requestMethod(
      'ImageModelV4.doGenerate',
      model.doGenerate.bind(model),
    ),
  });

/** Adapt an image model with a lazy per-model generation limit. */
export const wrapImageModel = (model: SdkImageModelInput) =>
  imageModel(model, (options: { modelId: string }) =>
    lazyValue('ImageModelV4.maxImagesPerCall', () => {
      const limit = model.maxImagesPerCall;
      return typeof limit === 'function' ? limit.call(model, options) : limit;
    }),
  );

/** Adapt an image model while preserving its known generation limit as a direct value. */
export const wrapFixedImageModel = <Limit extends number | undefined>(
  model: Omit<SdkImageModelInput, 'maxImagesPerCall'> & {
    readonly maxImagesPerCall: Limit;
  },
) =>
  imageModel(
    model,
    lazyValue('ImageModelV4.maxImagesPerCall', () => model.maxImagesPerCall),
  );

/** Adapt one-shot speech and expose native streaming only when available. */
export const wrapSpeechModel = (
  model: SdkSpeechModelV4 & Partial<SdkStreamingSpeechModelV4>,
) => {
  const doStream = model.doStream?.bind(model);
  return registerModel(speechModels, model, {
    ...modelMetadata(model),
    doGenerate: requestMethod(
      'SpeechModelV4.doGenerate',
      model.doGenerate.bind(model),
    ),
    doStream:
      doStream === undefined
        ? undefined
        : streamMethod('SpeechModelV4.doStream', doStream),
  });
};

/** Adapt one-shot transcription and include the native stream capability when present. */
export const wrapTranscriptionModel = (model: SdkTranscriptionModelV4) => {
  const doStream = model.doStream?.bind(model);
  return registerModel(transcriptionModels, model, {
    ...modelMetadata(model),
    doGenerate: requestMethod(
      'TranscriptionModelV4.doGenerate',
      model.doGenerate.bind(model),
    ),
    doGenerateFromUrl: optionalRequest(
      'TranscriptionModelV4.doGenerateFromUrl',
      model.doGenerateFromUrl?.bind(model),
    ),
    doStream:
      doStream === undefined
        ? undefined
        : streamMethod('TranscriptionModelV4.doStream', doStream),
  });
};

/** Keep native provider identity and adapt document reranking with interruption support. */
export const wrapRerankingModel = (model: SdkRerankingModelV4) =>
  registerModel(rerankingModels, model, {
    ...modelMetadata(model),
    doRerank: requestMethod(
      'RerankingModelV4.doRerank',
      model.doRerank.bind(model),
    ),
  });

/** Register a version 4 decision model with an effectful decision request. */
export const wrapDecisionModel = (model: SdkDecisionModelV4) =>
  registerModel(decisionModels, model, {
    ...modelMetadata(model),
    supportedQuestionTypes: model.supportedQuestionTypes,
    doDecide: requestMethod(
      'DecisionModelV4.doDecide',
      model.doDecide.bind(model),
    ),
  });

/** Keep the evaluation spelling for a decision model that exposes the legacy evaluation method. */
export const wrapEvaluationModel = (
  model: SdkDecisionModelV4 & { doEvaluate: SdkDecisionModelV4['doDecide'] },
) =>
  Object.assign(wrapDecisionModel(model), {
    doEvaluate: requestMethod(
      'DecisionModelV4.doEvaluate',
      model.doEvaluate.bind(model),
    ),
  });

/** Register a version 4 extraction model with its effectful field extraction request. */
export const wrapExtractionModel = (model: SdkExtractionModelV4) =>
  registerModel(extractionModels, model, {
    ...modelMetadata(model),
    supportedFieldTypes: model.supportedFieldTypes,
    doExtract: requestMethod(
      'ExtractionModelV4.doExtract',
      model.doExtract.bind(model),
    ),
  });

/** Register the native speech translation model and adapt the request and stream boundaries. */
export const wrapSpeechTranslationModel = (
  model: SdkSpeechTranslationModelV4,
) =>
  registerModel(speechTranslationModels, model, {
    ...modelMetadata(model),
    doStream: streamMethod(
      'SpeechTranslationModelV4.doStream',
      model.doStream.bind(model),
    ),
  });

/** Infer the event delivered by a native video webhook after receipt. */
type VideoWebhook = Awaited<
  Awaited<
    ReturnType<NonNullable<SdkVideoModelV4['handleWebhookOption']>>
  >['received']
>;

/** Bind video webhook setup and receipt to the operation owner and adapt the deferred event. */
const wrapVideoWebhook =
  (handle: NonNullable<SdkVideoModelV4['handleWebhookOption']>) =>
  <E, R, E2, R2>(options: {
    readonly webhook: () => Effect.Effect<
      {
        readonly url: string;
        readonly received: Effect.Effect<VideoWebhook, E2, R2>;
      },
      E,
      R
    >;
  }) =>
    Effect.gen(function* () {
      const owner = yield* openOperation<R | R2>();
      const { webhookUrl, received } = yield* runRequest(
        'VideoModelV4.handleWebhookOption',
        { abortSignal: owner.signal },
        (signal) =>
          handle({
            webhook: () =>
              owner
                .runCallback(options.webhook(), signal)
                .then(({ url, received }) => {
                  const pending = owner.runCallback(received, signal);
                  void pending.catch(() => {});
                  return { url, received: pending };
                }),
          }),
      );
      const pending = Promise.resolve(received);
      void pending.catch(() => {});
      return {
        webhookUrl,
        received: runRequest(
          'VideoModelV4.webhook.received',
          { abortSignal: owner.signal },
          () => pending,
        ),
      };
    });

/** Adapt video generation, status polling, and optional native webhook support. */
export const wrapVideoModel = (model: SdkVideoModelV4) => {
  const handleWebhookOption = model.handleWebhookOption?.bind(model);
  return registerModel(videoModels, model, {
    ...modelMetadata(model),
    maxVideosPerCall: (options: { modelId: string }) =>
      lazyValue('VideoModelV4.maxVideosPerCall', () => {
        const limit = model.maxVideosPerCall;
        return typeof limit === 'function' ? limit.call(model, options) : limit;
      }),
    doGenerate: optionalRequest(
      'VideoModelV4.doGenerate',
      model.doGenerate?.bind(model),
    ),
    doStart: optionalRequest(
      'VideoModelV4.doStart',
      model.doStart?.bind(model),
    ),
    doStatus: optionalRequest(
      'VideoModelV4.doStatus',
      model.doStatus?.bind(model),
    ),
    handleWebhookOption:
      handleWebhookOption === undefined
        ? undefined
        : wrapVideoWebhook(handleWebhookOption),
  });
};

/** Use an embedding model handle already registered with the native bridge. */
export type EmbeddingModelV4 = ReturnType<typeof wrapEmbeddingModel>;
/** Accept an image model handle with a fixed or deferred per-request image limit. */
export type ImageModelV4 =
  ReturnType<typeof wrapImageModel> | ReturnType<typeof wrapFixedImageModel>;
/** Use a registered speech model with an optional streaming method. */
export type SpeechModelV4 = ReturnType<typeof wrapSpeechModel>;
/** Use a registered transcription model with an optional streaming method. */
export type TranscriptionModelV4 = ReturnType<typeof wrapTranscriptionModel>;
/** Use a registered model for document scoring and reranking. */
export type RerankingModelV4 = ReturnType<typeof wrapRerankingModel>;
/** Use a registered decision model for structured question responses. */
export type DecisionModelV4 = ReturnType<typeof wrapDecisionModel>;
/** Use a registered extraction model for structured field responses. */
export type ExtractionModelV4 = ReturnType<typeof wrapExtractionModel>;
/** Use a registered model for audio translation requests. */
export type SpeechTranslationModelV4 = ReturnType<
  typeof wrapSpeechTranslationModel
>;
/** Use a registered model for video generation, polling, or webhook integration. */
export type VideoModelV4 = ReturnType<typeof wrapVideoModel>;

/** Recover the native embedding model only for a previously registered handle. */
export const unwrapEmbeddingModel = (model: EmbeddingModelV4) =>
  embeddingModels.get(model);
/** Recover the native image model only for a previously registered handle. */
export const unwrapImageModel = (model: ImageModelV4) => imageModels.get(model);
/** Recover the native speech model only for a previously registered handle. */
export const unwrapSpeechModel = (model: SpeechModelV4) =>
  speechModels.get(model);
/** Recover the native transcription model only for a previously registered handle. */
export const unwrapTranscriptionModel = (model: TranscriptionModelV4) =>
  transcriptionModels.get(model);
/** Recover the native reranking model only for a previously registered handle. */
export const unwrapRerankingModel = (model: RerankingModelV4) =>
  rerankingModels.get(model);
/** Recover the native decision model only for a previously registered handle. */
export const unwrapDecisionModel = (model: DecisionModelV4) =>
  decisionModels.get(model);
/** Recover the native extraction model only for a previously registered handle. */
export const unwrapExtractionModel = (model: ExtractionModelV4) =>
  extractionModels.get(model);
/** Recover the native speech translation model only for a previously registered handle. */
export const unwrapSpeechTranslationModel = (model: SpeechTranslationModelV4) =>
  speechTranslationModels.get(model);
/** Recover the native video model only for a previously registered handle. */
export const unwrapVideoModel = (model: VideoModelV4) => videoModels.get(model);

/** Expose the required streaming method when the native model guarantees support for it. */
export const wrapStreamingSpeechModel = (model: SdkStreamingSpeechModelV4) =>
  Object.assign(wrapSpeechModel(model), {
    doStream: streamMethod(
      'SpeechModelV4.doStream',
      model.doStream.bind(model),
    ),
  });
