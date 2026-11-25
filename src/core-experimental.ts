import * as sdk from 'ai';
import type {
  Experimental_BatchV4 as NativeBatch,
  Experimental_BatchV4ModelIds,
} from '@ai-sdk/provider';
import { bindTools } from './internal/tool.js';
import type { BoundTools, EffectTools, ToolServices } from './internal/tool.js';
import { unwrapOutput } from './internal/output.js';
import type { OutputSpecification } from './internal/output.js';
import { unwrapBatch } from './internal/provider-resource.js';
import type { BatchV4 } from './internal/provider-resource.js';
import type {
  Experimental_DecisionModelV4Question,
  Experimental_ExtractionModelV4Field,
  Experimental_VideoModelV3 as NativeVideoModelV3,
  TranscriptionModelV2,
  TranscriptionModelV3,
  SpeechModelV2,
  SpeechModelV3,
} from '@ai-sdk/provider';
import type { Context as SdkContext } from '@ai-sdk/provider-utils';
import { Effect, Stream } from 'effect';
import type { Scope } from 'effect';
import { generateSpeech, transcribe } from './core-models.js';
import type { SpeechModel, TranscriptionModel } from './core-models.js';
import { bindExperimentalOptions } from './internal/experimental-callbacks.js';
import type {
  ExperimentalOptions,
  Owner,
} from './internal/experimental-callbacks.js';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from './internal/operation.js';
import type { AiSdkError } from './internal/operation.js';
import {
  unwrapDecisionModel,
  unwrapExtractionModel,
  unwrapSpeechModel,
  unwrapSpeechTranslationModel,
  unwrapTranscriptionModel,
  unwrapVideoModel,
} from './internal/provider-model.js';
import type {
  DecisionModelV4,
  ExtractionModelV4,
  SpeechTranslationModelV4,
  VideoModelV4,
} from './internal/provider-model.js';
import { ownReadable } from './internal/readable.js';

type NativeOutput<A, P, I> = ReturnType<typeof unwrapOutput<A, P, I>>;

export type Experimental_DecisionModel = string | DecisionModelV4;
export type Experimental_ExtractionModel = string | ExtractionModelV4;
type SpeechTranslationModel = string | SpeechTranslationModelV4;

type LegacyVideoModelV3 = {
  readonly modelId: string;
  readonly specificationVersion: 'v3';
  readonly provider: string;
};
type VideoModel = string | VideoModelV4 | LegacyVideoModelV3;

type AbortOptions = { readonly abortSignal?: AbortSignal | undefined };
type ModelHandle = { readonly modelId: string };
type ModelType =
  | ConstructorParameters<typeof sdk.NoSuchModelError>[0]['modelType']
  | 'speechTranslationModel';

const selectModel = <Handle extends ModelHandle, Native>(
  operation: string,
  modelType: ModelType,
  model: string | Handle,
  unwrap: (handle: Handle) => Native | undefined,
): Effect.Effect<string | Native, AiSdkError> =>
  Effect.suspend(() => {
    if (typeof model === 'string')
      return Effect.succeed<string | Native>(model);
    const native = unwrap(model);
    return native
      ? Effect.succeed<string | Native>(native)
      : Effect.fail(
          sdkError(operation, {
            name: 'AI_NoSuchModelError',
            modelId: model.modelId,
            modelType,
          }),
        );
  });

const scopedRequest = <R, A>(
  operation: string,
  options: AbortOptions,
  run: (owner: Owner<R>, abortSignal: AbortSignal) => PromiseLike<A>,
): Effect.Effect<A, AiSdkError, R> =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>(options.abortSignal);
      return yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) => run(owner, abortSignal),
      );
    }),
  );

type Questions = Record<string, Experimental_DecisionModelV4Question>;
type Fields = Record<string, Experimental_ExtractionModelV4Field>;
type NativeDecisionOptions<
  Q extends Questions,
  C extends SdkContext,
> = Parameters<typeof sdk.experimental_decide<Q, C>>[0];
type NativeExtractionOptions<
  F extends Fields,
  C extends SdkContext,
> = Parameters<typeof sdk.experimental_extract<F, C>>[0];

export const experimental_decide = <
  const Q extends Questions,
  C extends SdkContext = SdkContext,
  R = never,
>(
  options: ExperimentalOptions<
    NativeDecisionOptions<Q, C>,
    Experimental_DecisionModel,
    R
  >,
) =>
  selectModel(
    'experimental_decide',
    'decisionModel',
    options.model,
    unwrapDecisionModel,
  ).pipe(
    Effect.flatMap((model) =>
      scopedRequest<
        R,
        Awaited<ReturnType<typeof sdk.experimental_decide<Q, C>>>
      >('experimental_decide', options, (owner, abortSignal) =>
        sdk.experimental_decide<Q, C>({
          ...bindExperimentalOptions<
            NativeDecisionOptions<Q, C>,
            Experimental_DecisionModel,
            R
          >(options, owner),
          model,
          abortSignal,
        }),
      ),
    ),
  );

export type Experimental_EvaluationModel = Experimental_DecisionModel;

export const experimental_evaluate = experimental_decide;

export const experimental_extract = <
  const F extends Fields,
  C extends SdkContext = SdkContext,
  R = never,
>(
  options: ExperimentalOptions<
    NativeExtractionOptions<F, C>,
    Experimental_ExtractionModel,
    R
  >,
) =>
  selectModel(
    'experimental_extract',
    'extractionModel',
    options.model,
    unwrapExtractionModel,
  ).pipe(
    Effect.flatMap((model) =>
      scopedRequest<
        R,
        Awaited<ReturnType<typeof sdk.experimental_extract<F, C>>>
      >('experimental_extract', options, (owner, abortSignal) =>
        sdk.experimental_extract<F, C>({
          ...bindExperimentalOptions<
            NativeExtractionOptions<F, C>,
            Experimental_ExtractionModel,
            R
          >(options, owner),
          model,
          abortSignal,
        }),
      ),
    ),
  );

const unwrapVideo = (handle: VideoModelV4 | LegacyVideoModelV3) =>
  handle.specificationVersion === 'v4'
    ? unwrapVideoModel(handle)
    : unwrapLegacyModel<NativeVideoModelV3>(handle);

type NativeGenerateVideoOptions = Parameters<
  typeof sdk.experimental_generateVideo
>[0];
type NativeStartVideoOptions = Parameters<
  typeof sdk.experimental_startVideo
>[0];
type NativeGetVideoStatusOptions = Parameters<
  typeof sdk.experimental_getVideoStatus
>[1];
type NativeWebhook = Awaited<
  ReturnType<NonNullable<NativeGenerateVideoOptions['webhook']>>
>;

type VideoOptions<R> = {
  [
    K in keyof ExperimentalOptions<NativeGenerateVideoOptions, VideoModel, R>
  ]: K extends 'webhook'
    ? () => Effect.Effect<
        {
          readonly url: string;
          readonly received: Effect.Effect<
            Awaited<NativeWebhook['received']>,
            unknown,
            R
          >;
        },
        unknown,
        R
      >
    : ExperimentalOptions<NativeGenerateVideoOptions, VideoModel, R>[K];
};

const bindWebhook = <R>(options: VideoOptions<R>, owner: Owner<R>) => {
  const { webhook, ...rest } = options;
  const bound = bindExperimentalOptions<
    Omit<NativeGenerateVideoOptions, 'webhook'>,
    VideoModel,
    R
  >(rest, owner);
  return {
    ...bound,
    ...(webhook
      ? {
          webhook: () =>
            owner.runCallback(
              Effect.map(Effect.suspend(webhook), ({ url, received }) => {
                const pending = owner.runCallback(received);
                void pending.catch(() => {});
                return { url, received: pending };
              }),
            ),
        }
      : {}),
  };
};

export const experimental_generateVideo = <R = never>(
  options: VideoOptions<R>,
) =>
  selectModel(
    'experimental_generateVideo',
    'videoModel',
    options.model,
    unwrapVideo,
  ).pipe(
    Effect.flatMap((model) =>
      scopedRequest<
        R,
        Awaited<ReturnType<typeof sdk.experimental_generateVideo>>
      >('experimental_generateVideo', options, (owner, abortSignal) =>
        sdk.experimental_generateVideo({
          ...bindWebhook(options, owner),
          model,
          abortSignal,
        }),
      ),
    ),
  );

export const experimental_startVideo = (
  options: ExperimentalOptions<NativeStartVideoOptions, VideoModel, never>,
) =>
  selectModel(
    'experimental_startVideo',
    'videoModel',
    options.model,
    unwrapVideo,
  ).pipe(
    Effect.flatMap((model) =>
      runRequest('experimental_startVideo', options, (abortSignal) =>
        sdk.experimental_startVideo({ ...options, model, abortSignal }),
      ),
    ),
  );

export const experimental_getVideoStatus = (
  model: VideoModel,
  options: NativeGetVideoStatusOptions,
) =>
  selectModel(
    'experimental_getVideoStatus',
    'videoModel',
    model,
    unwrapVideo,
  ).pipe(
    Effect.flatMap((native) =>
      runRequest('experimental_getVideoStatus', options, (abortSignal) =>
        sdk.experimental_getVideoStatus(native, { ...options, abortSignal }),
      ),
    ),
  );

export const experimental_generateSpeech = generateSpeech;
export const experimental_transcribe = transcribe;

type PublicStreamPart<A> = A extends { type: 'error'; error: unknown }
  ? { [K in keyof A]: K extends 'error' ? AiSdkError : A[K] }
  : A;

const wrapStreamPart = <A>(operation: string, part: A): PublicStreamPart<A> => {
  if (
    typeof part === 'object' &&
    part &&
    'type' in part &&
    part.type === 'error' &&
    'error' in part
  )
    return {
      ...part,
      error: sdkError(operation, part.error),
    } as PublicStreamPart<A>;
  return part as PublicStreamPart<A>;
};

const ownedStream = <A>(
  operation: string,
  source: () => ReadableStream<A>,
): Stream.Stream<PublicStreamPart<A>, AiSdkError> =>
  Stream.unwrap(
    Effect.gen(function* () {
      const readable = yield* runSync(operation, source);
      const owned = yield* ownReadable(operation, readable);
      return Stream.fromReadableStream({
        evaluate: () => owned,
        onError: (error) => sdkError(operation, error),
        releaseLockOnEnd: true,
      }).pipe(Stream.map((part) => wrapStreamPart(operation, part)));
    }),
  );

type ResultEffect<A> =
  A extends ReadableStream<infer Chunk>
    ? Stream.Stream<PublicStreamPart<Chunk>, AiSdkError>
    : A extends PromiseLike<infer Value>
      ? Effect.Effect<Value, AiSdkError>
      : A;

type PublicStreamResult<Native> = {
  [Key in keyof Native]: ResultEffect<Native[Key]>;
};

type ResultKeys<A, Match> = {
  [Key in keyof A]-?: A[Key] extends Match ? Key : never;
}[keyof A];

type StreamingProperties<A> = {
  readonly streams: ReadonlyArray<ResultKeys<A, ReadableStream<unknown>>>;
  readonly effects: ReadonlyArray<ResultKeys<A, PromiseLike<unknown>>>;
};

const wrapStreamingProperties = <Native extends object>(
  operation: string,
  native: Native,
  signal: AbortSignal,
  properties: StreamingProperties<Native>,
): PublicStreamResult<Native> =>
  Object.fromEntries([
    ...properties.effects.map((key) => [
      key,
      runRequest(
        `${operation}.${String(key)}`,
        { abortSignal: signal },
        () => native[key] as PromiseLike<unknown>,
      ),
    ]),
    ...properties.streams.map((key) => [
      key,
      ownedStream(
        `${operation}.${String(key)}`,
        () => native[key] as ReadableStream<unknown>,
      ),
    ]),
  ]) as PublicStreamResult<Native>;

const streamOperation = <
  Handle extends ModelHandle,
  NativeModel,
  NativeOptions,
  R,
  Result extends object,
>(
  operation: string,
  modelType: ModelType,
  options: ExperimentalOptions<NativeOptions, string | Handle, R> &
    AbortOptions & { readonly model: string | Handle },
  unwrap: (model: Handle) => NativeModel | undefined,
  invoke: (
    options: NativeOptions,
    model: string | NativeModel,
    signal: AbortSignal,
  ) => Result,
  properties: StreamingProperties<Result>,
): Effect.Effect<PublicStreamResult<Result>, AiSdkError, R | Scope.Scope> =>
  Effect.gen(function* () {
    const model = yield* selectModel(
      operation,
      modelType,
      options.model,
      unwrap,
    );
    const owner = yield* openOperation<R>(options.abortSignal);
    const result = yield* runSync(operation, () =>
      invoke(
        bindExperimentalOptions<NativeOptions, string | Handle, R>(
          options,
          owner,
        ),
        model,
        owner.signal,
      ),
    );
    return wrapStreamingProperties(operation, result, owner.signal, properties);
  });

const unwrapSpeech = (model: Exclude<SpeechModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapSpeechModel(model)
    : unwrapLegacyModel<SpeechModelV2 | SpeechModelV3>(model);

const unwrapTranscription = (model: Exclude<TranscriptionModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapTranscriptionModel(model)
    : unwrapLegacyModel<TranscriptionModelV2 | TranscriptionModelV3>(model);

type NativeStreamSpeechOptions = Parameters<
  typeof sdk.experimental_streamSpeech
>[0];
type NativeStreamTranscribeOptions = Parameters<
  typeof sdk.experimental_streamTranscribe
>[0];
type NativeStreamTranslateOptions = Parameters<
  typeof sdk.experimental_streamTranslate
>[0];

export type Experimental_StreamSpeechResult = PublicStreamResult<
  ReturnType<typeof sdk.experimental_streamSpeech>
>;
export type StreamTranscriptionResult = PublicStreamResult<
  ReturnType<typeof sdk.experimental_streamTranscribe>
>;
export type Experimental_StreamTranslationResult = PublicStreamResult<
  ReturnType<typeof sdk.experimental_streamTranslate>
>;

export const experimental_streamSpeech = <R = never>(
  options: ExperimentalOptions<NativeStreamSpeechOptions, SpeechModel, R>,
): Effect.Effect<
  Experimental_StreamSpeechResult,
  AiSdkError,
  R | Scope.Scope
> =>
  streamOperation(
    'experimental_streamSpeech',
    'speechModel',
    options,
    unwrapSpeech,
    (native: NativeStreamSpeechOptions, model, abortSignal) =>
      sdk.experimental_streamSpeech({ ...native, model, abortSignal }),
    {
      effects: ['usage', 'warnings', 'responses', 'providerMetadata'],
      streams: ['audioStream', 'fullStream'],
    },
  );

export const experimental_streamTranscribe = <R = never>(
  options: ExperimentalOptions<
    NativeStreamTranscribeOptions,
    TranscriptionModel,
    R
  >,
): Effect.Effect<StreamTranscriptionResult, AiSdkError, R | Scope.Scope> =>
  streamOperation(
    'experimental_streamTranscribe',
    'transcriptionModel',
    options,
    unwrapTranscription,
    (native: NativeStreamTranscribeOptions, model, abortSignal) =>
      sdk.experimental_streamTranscribe({ ...native, model, abortSignal }),
    {
      effects: [
        'text',
        'segments',
        'language',
        'durationInSeconds',
        'warnings',
        'responses',
        'providerMetadata',
      ],
      streams: ['fullStream'],
    },
  );

export const experimental_streamTranslate = <R = never>(
  options: ExperimentalOptions<
    NativeStreamTranslateOptions,
    SpeechTranslationModel,
    R
  >,
): Effect.Effect<
  Experimental_StreamTranslationResult,
  AiSdkError,
  R | Scope.Scope
> =>
  streamOperation(
    'experimental_streamTranslate',
    'speechTranslationModel',
    options,
    unwrapSpeechTranslationModel,
    (native: NativeStreamTranslateOptions, model, abortSignal) =>
      sdk.experimental_streamTranslate({ ...native, model, abortSignal }),
    {
      effects: [
        'sourceText',
        'translationText',
        'durationInSeconds',
        'usage',
        'warnings',
        'response',
        'providerMetadata',
      ],
      streams: ['fullStream'],
    },
  );

type BatchIds = Experimental_BatchV4ModelIds;
export type Experimental_BatchProvider<Ids extends BatchIds = BatchIds> =
  | BatchV4<Ids>
  | { experimental_batch(): Effect.Effect<BatchV4<Ids>, AiSdkError> };

type BatchLookup = Pick<
  BatchV4,
  'specificationVersion' | 'provider' | 'doGetBatchStatus'
>;
type BatchLookupProvider =
  | BatchLookup
  | {
      experimental_batch(): Effect.Effect<BatchLookup, AiSdkError>;
    };

const getNativeBatch = <Ids extends BatchIds = BatchIds>(
  operation: string,
  provider?: BatchLookupProvider,
): Effect.Effect<NativeBatch<Ids> | undefined, AiSdkError> =>
  Effect.gen(function* () {
    if (!provider) return;
    const batch =
      'experimental_batch' in provider
        ? yield* provider.experimental_batch()
        : provider;
    const native = unwrapBatch<Ids>(batch);
    if (native) return native;
    return yield* Effect.fail(
      sdkError(operation, 'The batch handle is not registered.'),
    );
  });

type BatchOptions<Native> = {
  [Key in keyof Native]: Key extends 'provider'
    ? BatchLookupProvider
    : Native[Key];
};

const batchRequest = <Native extends AbortOptions, A>(
  operation: string,
  options: BatchOptions<Native> &
    AbortOptions & { provider?: BatchLookupProvider },
  invoke: (options: Native) => PromiseLike<A>,
) => {
  const { provider: handle, ...data } = options;
  return getNativeBatch(operation, handle).pipe(
    Effect.flatMap((provider) => {
      return runRequest(operation, options, (abortSignal) =>
        invoke({
          ...data,
          ...(provider ? { provider } : {}),
          abortSignal,
        } as Native),
      );
    }),
  );
};

type NativeBatchStatusOptions = Parameters<
  typeof sdk.experimental_getBatchStatus
>[0];
type NativeBatchCancelOptions = Parameters<
  typeof sdk.experimental_cancelBatch
>[0];
type NativeBatchListOptions = NonNullable<
  Parameters<typeof sdk.experimental_listBatches>[0]
>;

export const experimental_getBatchStatus = (
  options: BatchOptions<NativeBatchStatusOptions>,
) =>
  batchRequest(
    'experimental_getBatchStatus',
    options,
    sdk.experimental_getBatchStatus,
  );

export const experimental_cancelBatch = (
  options: BatchOptions<NativeBatchCancelOptions>,
) =>
  batchRequest(
    'experimental_cancelBatch',
    options,
    sdk.experimental_cancelBatch,
  );

export const experimental_listBatches = (
  options: BatchOptions<NativeBatchListOptions> = {},
) =>
  batchRequest(
    'experimental_listBatches',
    options,
    sdk.experimental_listBatches,
  );

type NativeStartBatchOptions<
  Ids extends BatchIds,
  Tools extends EffectTools,
> = Parameters<
  typeof sdk.experimental_startBatch<BoundTools<Tools>, NativeBatch<Ids>>
>[0];

type BatchInput<Native, Tools extends EffectTools> = Native extends {
  type: 'text';
}
  ? { [Key in keyof Native]: Key extends 'tools' ? Tools : Native[Key] }
  : Native;

type AdaptStartBatchOptions<
  Native extends { requests: ReadonlyArray<unknown> },
  Ids extends BatchIds,
  Tools extends EffectTools,
  A,
  P,
  I,
> = {
  [Key in keyof Native]: Key extends 'provider'
    ? Experimental_BatchProvider<Ids>
    : Key extends 'requests'
      ? ReadonlyArray<BatchInput<Native['requests'][number], Tools>>
      : Key extends 'output'
        ? OutputSpecification<A, P, I>
        : Native[Key];
};

type StartBatchOptions<
  Ids extends BatchIds,
  Tools extends EffectTools,
  A,
  P,
  I,
> = AdaptStartBatchOptions<
  NativeStartBatchOptions<Ids, Tools>,
  Ids,
  Tools,
  A,
  P,
  I
>;

export const experimental_startBatch = <
  Ids extends BatchIds = BatchIds,
  Tools extends EffectTools = {},
  A = string,
  P = string,
  I = never,
>(
  options: StartBatchOptions<Ids, Tools, A, P, I>,
) =>
  getNativeBatch<Ids>('experimental_startBatch', options.provider).pipe(
    Effect.flatMap((provider) =>
      scopedRequest<
        ToolServices<Tools>,
        Awaited<
          ReturnType<
            typeof sdk.experimental_startBatch<
              BoundTools<Tools>,
              NativeBatch<Ids>
            >
          >
        >
      >('experimental_startBatch', options, (owner, abortSignal) => {
        const { provider: _, output, requests, ...data } = options;
        const nativeRequests = requests.map((request) => {
          if (request.type !== 'text') return request;
          const { tools, ...data } = request;
          return tools ? { ...data, tools: bindTools(tools, owner) } : data;
        });
        return sdk.experimental_startBatch<BoundTools<Tools>, NativeBatch<Ids>>(
          {
            ...data,
            ...(provider ? { provider } : {}),
            ...(output ? { output: unwrapOutput(output) } : {}),
            requests: nativeRequests,
            abortSignal,
          },
        );
      }),
    ),
  );

type NativeBatchResultsOptions<Tools extends EffectTools, A, P, I> = Parameters<
  typeof sdk.experimental_getBatchResults<
    BoundTools<Tools>,
    NativeOutput<A, P, I> | undefined
  >
>[0];

type AdaptBatchResultsOptions<Native, Tools extends EffectTools, A, P, I> = {
  [Key in keyof Native]: Key extends 'provider'
    ? BatchLookupProvider
    : Key extends 'tools'
      ? Tools
      : Key extends 'output'
        ? OutputSpecification<A, P, I>
        : Native[Key];
};

type BatchResultsOptions<
  Tools extends EffectTools,
  A,
  P,
  I,
> = AdaptBatchResultsOptions<
  NativeBatchResultsOptions<Tools, A, P, I>,
  Tools,
  A,
  P,
  I
>;

export const experimental_getBatchResults = <
  Tools extends EffectTools = {},
  A = string,
  P = string,
  I = never,
>(
  options: BatchResultsOptions<Tools, A, P, I>,
) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const provider = yield* getNativeBatch(
        'experimental_getBatchResults',
        options.provider,
      );
      const owner = yield* openOperation<ToolServices<Tools>>(
        options.abortSignal,
      );
      const { provider: _, output, tools, ...data } = options;
      return ownedStream('experimental_getBatchResults', () =>
        sdk.experimental_getBatchResults<
          BoundTools<Tools>,
          NativeOutput<A, P, I> | undefined
        >({
          ...data,
          ...(provider ? { provider } : {}),
          ...(output ? { output: unwrapOutput(output) } : {}),
          ...(tools ? { tools: bindTools(tools, owner) } : {}),
          abortSignal: owner.signal,
        }),
      );
    }),
  );

export type Experimental_GetBatchStatusOptions =
  BatchOptions<NativeBatchStatusOptions>;
export type Experimental_CancelBatchOptions =
  BatchOptions<NativeBatchCancelOptions>;
export type Experimental_ListBatchesOptions =
  BatchOptions<NativeBatchListOptions>;

type ProviderModelIds<Provider> =
  Provider extends Experimental_BatchProvider<infer Ids> ? Ids : BatchIds;

export type Experimental_StartBatchOptions<
  Tools extends EffectTools = {},
  Provider = Experimental_BatchProvider,
> = StartBatchOptions<
  ProviderModelIds<Provider>,
  Tools,
  unknown,
  unknown,
  unknown
>;

export type Experimental_BatchRequest<
  Ids extends BatchIds = BatchIds,
  Tools extends EffectTools = {},
> = BatchInput<sdk.Experimental_BatchRequest<Ids, BoundTools<Tools>>, Tools>;

export type Experimental_TextBatchRequest<
  Id extends string = string,
  Tools extends EffectTools = {},
> = BatchInput<sdk.Experimental_TextBatchRequest<Id, BoundTools<Tools>>, Tools>;

type AppliedOutput<Output> =
  Output extends OutputSpecification<infer A, infer P, infer I>
    ? NativeOutput<A, P, I>
    : undefined;

type SelectedOutput<Output> =
  Output extends OutputSpecification<infer A, infer P, infer I>
    ? [A, P, I]
    : [string, string, never];

export type Experimental_GetBatchResultsOptions<
  Tools extends EffectTools = {},
  Output = undefined,
> = BatchResultsOptions<
  Tools,
  SelectedOutput<Output>[0],
  SelectedOutput<Output>[1],
  SelectedOutput<Output>[2]
>;

export type Experimental_BatchItemResult<
  Tools extends EffectTools = {},
  Output = undefined,
> = PublicStreamPart<
  sdk.Experimental_BatchItemResult<BoundTools<Tools>, AppliedOutput<Output>>
>;

export type Experimental_TextBatchItemResult<
  Tools extends EffectTools = {},
  Output = undefined,
> = sdk.Experimental_TextBatchItemResult<
  BoundTools<Tools>,
  AppliedOutput<Output>
>;

export type Experimental_TextBatchGenerationResult<
  Tools extends EffectTools = {},
> = sdk.Experimental_TextBatchGenerationResult<BoundTools<Tools>>;
