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

type AbortOptions = { readonly abortSignal?: AbortSignal };

export const requestMethod =
  <Options extends AbortOptions, A>(
    operation: string,
    request: (options: Options) => PromiseLike<A>,
  ) =>
  (options: Options) =>
    runRequest(operation, options, (abortSignal) =>
      request({ ...options, abortSignal }),
    );

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

const modelMetadata = (model: {
  readonly specificationVersion: 'v4';
  readonly provider: string;
  readonly modelId: string;
}) => ({
  specificationVersion: model.specificationVersion,
  provider: model.provider,
  modelId: model.modelId,
});

export const lazyValue = <A>(
  operation: string,
  getValue: () => A | PromiseLike<A>,
) => runRequest(operation, {}, () => Promise.resolve(getValue()));

const optionalRequest = <Options extends AbortOptions, A>(
  operation: string,
  request: ((options: Options) => PromiseLike<A>) | undefined,
) => (request === undefined ? undefined : requestMethod(operation, request));

const embeddingModels = new WeakMap<object, SdkEmbeddingModelV4>();
const imageModels = new WeakMap<object, SdkImageModelV4>();
const speechModels = new WeakMap<object, SdkSpeechModelV4>();
const transcriptionModels = new WeakMap<object, SdkTranscriptionModelV4>();
const rerankingModels = new WeakMap<object, SdkRerankingModelV4>();
const videoModels = new WeakMap<object, SdkVideoModelV4>();
const decisionModels = new WeakMap<object, SdkDecisionModelV4>();
const extractionModels = new WeakMap<object, SdkExtractionModelV4>();
const speechTranslationModels = new WeakMap<
  object,
  SdkSpeechTranslationModelV4
>();

const registerModel = <Sdk extends object, Wrapper extends object>(
  models: WeakMap<object, Sdk>,
  model: Sdk,
  wrapper: Wrapper,
) => {
  models.set(wrapper, model);
  return wrapper;
};

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

export type SdkImageModelInput = Omit<
  SdkImageModelV4,
  'supportsFileInputs' | 'supportsMaskInputs'
> & {
  readonly supportsFileInputs?: SdkImageModelV4['supportsFileInputs'];
  readonly supportsMaskInputs?: SdkImageModelV4['supportsMaskInputs'];
};

export const wrapImageModel = (model: SdkImageModelInput) =>
  // Some SDK classes explicitly return undefined from these optional getters.
  registerModel(imageModels, model as SdkImageModelV4, {
    ...modelMetadata(model),
    maxImagesPerCall: (options: { modelId: string }) =>
      lazyValue('ImageModelV4.maxImagesPerCall', () => {
        const limit = model.maxImagesPerCall;
        return typeof limit === 'function' ? limit.call(model, options) : limit;
      }),
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

export const wrapRerankingModel = (model: SdkRerankingModelV4) =>
  registerModel(rerankingModels, model, {
    ...modelMetadata(model),
    doRerank: requestMethod(
      'RerankingModelV4.doRerank',
      model.doRerank.bind(model),
    ),
  });

export const wrapDecisionModel = (model: SdkDecisionModelV4) =>
  registerModel(decisionModels, model, {
    ...modelMetadata(model),
    supportedQuestionTypes: model.supportedQuestionTypes,
    doDecide: requestMethod(
      'DecisionModelV4.doDecide',
      model.doDecide.bind(model),
    ),
  });

export const wrapEvaluationModel = (
  model: SdkDecisionModelV4 & { doEvaluate: SdkDecisionModelV4['doDecide'] },
) =>
  Object.assign(wrapDecisionModel(model), {
    doEvaluate: requestMethod(
      'DecisionModelV4.doEvaluate',
      model.doEvaluate.bind(model),
    ),
  });

export const wrapExtractionModel = (model: SdkExtractionModelV4) =>
  registerModel(extractionModels, model, {
    ...modelMetadata(model),
    supportedFieldTypes: model.supportedFieldTypes,
    doExtract: requestMethod(
      'ExtractionModelV4.doExtract',
      model.doExtract.bind(model),
    ),
  });

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

type VideoWebhook = Awaited<
  Awaited<
    ReturnType<NonNullable<SdkVideoModelV4['handleWebhookOption']>>
  >['received']
>;

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

export type EmbeddingModelV4 = ReturnType<typeof wrapEmbeddingModel>;
export type ImageModelV4 = ReturnType<typeof wrapImageModel>;
export type SpeechModelV4 = ReturnType<typeof wrapSpeechModel>;
export type TranscriptionModelV4 = ReturnType<typeof wrapTranscriptionModel>;
export type RerankingModelV4 = ReturnType<typeof wrapRerankingModel>;
export type DecisionModelV4 = ReturnType<typeof wrapDecisionModel>;
export type ExtractionModelV4 = ReturnType<typeof wrapExtractionModel>;
export type SpeechTranslationModelV4 = ReturnType<
  typeof wrapSpeechTranslationModel
>;
export type VideoModelV4 = ReturnType<typeof wrapVideoModel>;

export const unwrapEmbeddingModel = (model: EmbeddingModelV4) =>
  embeddingModels.get(model);
export const unwrapImageModel = (model: ImageModelV4) => imageModels.get(model);
export const unwrapSpeechModel = (model: SpeechModelV4) =>
  speechModels.get(model);
export const unwrapTranscriptionModel = (model: TranscriptionModelV4) =>
  transcriptionModels.get(model);
export const unwrapRerankingModel = (model: RerankingModelV4) =>
  rerankingModels.get(model);
export const unwrapDecisionModel = (model: DecisionModelV4) =>
  decisionModels.get(model);
export const unwrapExtractionModel = (model: ExtractionModelV4) =>
  extractionModels.get(model);
export const unwrapSpeechTranslationModel = (model: SpeechTranslationModelV4) =>
  speechTranslationModels.get(model);
export const unwrapVideoModel = (model: VideoModelV4) => videoModels.get(model);

export const wrapStreamingSpeechModel = (model: SdkStreamingSpeechModelV4) =>
  Object.assign(wrapSpeechModel(model), {
    doStream: streamMethod(
      'SpeechModelV4.doStream',
      model.doStream.bind(model),
    ),
  });
