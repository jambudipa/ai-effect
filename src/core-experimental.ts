import * as sdk from 'ai';
import type {
  Experimental_BatchV4 as NativeBatch,
  Experimental_BatchV4ModelIds,
} from '@ai-sdk/provider';
import { bindTools } from './internal/tool.js';
import type { BoundTools, EffectTools, ToolServices } from './internal/tool.js';
import { bindOutput } from './internal/output.js';
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

/** Recover the SDK parser type after complete, partial, and element values acquire a native binding. */
type NativeOutput<A, P, I> = NonNullable<
  ReturnType<typeof bindOutput<A, P, I, never>>
>;

/** Select a decision model by registry ID or by a registered version 4 handle. */
export type Experimental_DecisionModel = string | DecisionModelV4;
/** Select an extraction model by registry ID or by a registered version 4 handle. */
export type Experimental_ExtractionModel = string | ExtractionModelV4;
/** Accept both registry IDs and version 4 speech translation handles. */
type SpeechTranslationModel = string | SpeechTranslationModelV4;

/** Keep the identity fields needed to unwrap a registered legacy video model. */
type LegacyVideoModelV3 = {
  readonly modelId: string;
  readonly specificationVersion: 'v3';
  readonly provider: string;
};
/** Resolve a video model from the registry or a supported native handle. */
type VideoModel = string | VideoModelV4 | LegacyVideoModelV3;

/** Let the caller cancel the SDK operation independently of the Effect fiber. */
type AbortOptions = { readonly abortSignal?: AbortSignal | undefined };
/** Retain the public model ID when reporting a missing native binding. */
type ModelHandle = { readonly modelId: string };
/** Include streamed audio and video capability names in lookup diagnostics. */
type ModelType =
  | ConstructorParameters<typeof sdk.NoSuchModelError>[0]['modelType']
  | 'speechTranslationModel';

/** Pass registry IDs through and report unresolved handles as typed failures. */
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

/** Run a one-shot SDK request in a scope that owns its cancellation and callbacks. */
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

/** Keep each decision question keyed by the name used in the result. */
type Questions = Record<string, Experimental_DecisionModelV4Question>;
/** Keep each extraction field keyed by the name used in the result. */
type Fields = Record<string, Experimental_ExtractionModelV4Field>;
/** Derive native decision options with the caller's question keys and context type. */
type NativeDecisionOptions<
  Q extends Questions,
  C extends SdkContext,
> = Parameters<typeof sdk.experimental_decide<Q, C>>[0];
/** Derive native extraction options with the caller's field keys and context type. */
type NativeExtractionOptions<
  F extends Fields,
  C extends SdkContext,
> = Parameters<typeof sdk.experimental_extract<F, C>>[0];

/** Evaluate keyed questions through a registered model and retain the inferred answer keys. */
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

/** Keep the older evaluation type spelling compatible with decision model inputs. */
export type Experimental_EvaluationModel = Experimental_DecisionModel;

/** Retain the SDK compatibility spelling for the decision operation. */
export const experimental_evaluate = experimental_decide;

/** Extract keyed fields through a registered model and retain the inferred field names. */
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

/** Resolve video handles through the native registry for their protocol version. */
const unwrapVideo = (handle: VideoModelV4 | LegacyVideoModelV3) =>
  handle.specificationVersion === 'v4'
    ? unwrapVideoModel(handle)
    : unwrapLegacyModel<NativeVideoModelV3>(handle);

/** Derive complete video generation options from the installed SDK. */
type NativeGenerateVideoOptions = Parameters<
  typeof sdk.experimental_generateVideo
>[0];
/** Derive the initial video submission options from the installed SDK. */
type NativeStartVideoOptions = Parameters<
  typeof sdk.experimental_startVideo
>[0];
/** Derive the polling options that follow the native model argument. */
type NativeGetVideoStatusOptions = Parameters<
  typeof sdk.experimental_getVideoStatus
>[1];
/** Type the native webhook registration, including the result that will arrive later. */
type NativeWebhook = Awaited<
  ReturnType<NonNullable<NativeGenerateVideoOptions['webhook']>>
>;

/** Adapt video generation options so webhook setup and receipt can run in Effect. */
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

/** Bind webhook setup and receipt to the same scope as the video generation request. */
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

/** Run video generation to completion with the caller's timeout, signal, and optional webhook. */
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

/** Submit a video generation job and return the SDK reference for subsequent status calls. */
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

/** Query a video job through the same model capability that submitted it. */
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

/** Keep the SDK compatibility name for one-shot speech generation. */
export const experimental_generateSpeech = generateSpeech;
/** Keep the SDK compatibility name for one-shot transcription. */
export const experimental_transcribe = transcribe;

/** Replace an error event's native value with a redacted `AiSdkError`. */
type PublicStreamPart<A> = A extends { type: 'error'; error: unknown }
  ? { [K in keyof A]: K extends 'error' ? AiSdkError : A[K] }
  : A;

/** Redact error parts and preserve all other native stream parts. */
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

/** Acquire the native readable stream lazily and release its reader with the consumer scope. */
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

/** Map native stream fields to Effect streams and deferred values to Effect accessors. */
type ResultEffect<A> =
  A extends ReadableStream<infer Chunk>
    ? Stream.Stream<PublicStreamPart<Chunk>, AiSdkError>
    : A extends PromiseLike<infer Value>
      ? Effect.Effect<Value, AiSdkError>
      : A;

/** Preserve every native result key while adapting its Effect representation. */
type PublicStreamResult<Native> = {
  [Key in keyof Native]: ResultEffect<Native[Key]>;
};

/** Select the property names whose values match the requested native shape. */
type ResultKeys<A, Match> = {
  [Key in keyof A]-?: A[Key] extends Match ? Key : never;
}[keyof A];

/** Declare the stream and deferred result fields to adapt for each operation. */
type StreamingProperties<A> = {
  readonly streams: ReadonlyArray<ResultKeys<A, ReadableStream<unknown>>>;
  readonly effects: ReadonlyArray<ResultKeys<A, PromiseLike<unknown>>>;
};

/** Wrap each declared stream or promise without pulling data or resolving metadata immediately. */
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

/** Resolve the model and open an SDK audio stream in the caller's Effect scope. */
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

/** Resolve a speech model through its version 4 or legacy adapter. */
const unwrapSpeech = (model: Exclude<SpeechModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapSpeechModel(model)
    : unwrapLegacyModel<SpeechModelV2 | SpeechModelV3>(model);

/** Resolve a transcription model through its version 4 or legacy adapter. */
const unwrapTranscription = (model: Exclude<TranscriptionModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapTranscriptionModel(model)
    : unwrapLegacyModel<TranscriptionModelV2 | TranscriptionModelV3>(model);

/** Derive speech streaming inputs from the installed SDK. */
type NativeStreamSpeechOptions = Parameters<
  typeof sdk.experimental_streamSpeech
>[0];
/** Derive transcription streaming inputs from the installed SDK. */
type NativeStreamTranscribeOptions = Parameters<
  typeof sdk.experimental_streamTranscribe
>[0];
/** Derive translation streaming inputs from the installed SDK. */
type NativeStreamTranslateOptions = Parameters<
  typeof sdk.experimental_streamTranslate
>[0];

/** Expose incremental speech data and deferred synthesis metadata through Effect. */
export type Experimental_StreamSpeechResult = PublicStreamResult<
  ReturnType<typeof sdk.experimental_streamSpeech>
>;
/** Expose live transcription data and deferred metadata through Effect. */
export type StreamTranscriptionResult = PublicStreamResult<
  ReturnType<typeof sdk.experimental_streamTranscribe>
>;
/** Expose live translation data and deferred metadata through Effect. */
export type Experimental_StreamTranslationResult = PublicStreamResult<
  ReturnType<typeof sdk.experimental_streamTranslate>
>;

/** Open a scoped speech synthesis stream using the requested registered model. */
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

/** Open a scoped transcription stream and preserve the SDK's audio input options. */
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

/** Open a scoped audio translation stream through a supported translation model. */
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

/** Keep provider-specific model IDs for each supported batch request category. */
type BatchIds = Experimental_BatchV4ModelIds;
/** Accept a batch API handle directly or resolve it lazily from a provider. */
export type Experimental_BatchProvider<Ids extends BatchIds = BatchIds> =
  | BatchV4<Ids>
  | { experimental_batch(): Effect.Effect<BatchV4<Ids>, AiSdkError> };

/** Require the batch protocol identity and lookup capability used to recognize a batch handle. */
type BatchLookup = Pick<
  BatchV4,
  'specificationVersion' | 'provider' | 'doGetBatchStatus'
>;
/** Accept an existing batch handle or its Effect accessor when resolving batch operations. */
type BatchLookupProvider =
  | BatchLookup
  | {
      experimental_batch(): Effect.Effect<BatchLookup, AiSdkError>;
    };

/** Resolve a registered native batch API when supplied or leave provider selection to the SDK. */
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

/** Replace the native provider option with an Effect-compatible batch provider input. */
type BatchOptions<Native> = {
  [Key in keyof Native]: Key extends 'provider'
    ? BatchLookupProvider
    : Native[Key];
};

/** Resolve an optional provider and run a cancellable SDK batch management operation. */
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

/** Derive the provider and option fields used to query a batch job. */
type NativeBatchStatusOptions = Parameters<
  typeof sdk.experimental_getBatchStatus
>[0];
/** Derive the provider and option fields used to cancel a batch job. */
type NativeBatchCancelOptions = Parameters<
  typeof sdk.experimental_cancelBatch
>[0];
/** Derive the documented filters and paging inputs for reading batch jobs. */
type NativeBatchListOptions = NonNullable<
  Parameters<typeof sdk.experimental_listBatches>[0]
>;

/** Read the current state of an existing batch job with caller cancellation. */
export const experimental_getBatchStatus = (
  options: BatchOptions<NativeBatchStatusOptions>,
) =>
  batchRequest(
    'experimental_getBatchStatus',
    options,
    sdk.experimental_getBatchStatus,
  );

/** Ask the configured batch provider to cancel a submitted job. */
export const experimental_cancelBatch = (
  options: BatchOptions<NativeBatchCancelOptions>,
) =>
  batchRequest(
    'experimental_cancelBatch',
    options,
    sdk.experimental_cancelBatch,
  );

/** List jobs with the provided paging and filtering options or use the SDK defaults. */
export const experimental_listBatches = (
  options: BatchOptions<NativeBatchListOptions> = {},
) =>
  batchRequest(
    'experimental_listBatches',
    options,
    sdk.experimental_listBatches,
  );

/** Derive native batch submissions for the selected provider model IDs and bound tool set. */
type NativeStartBatchOptions<
  Ids extends BatchIds,
  Tools extends EffectTools,
> = Parameters<
  typeof sdk.experimental_startBatch<BoundTools<Tools>, NativeBatch<Ids>>
>[0];

/** Replace tool definitions only on text requests and preserve the other batch request shapes. */
type BatchInput<Native, Tools extends EffectTools> = Native extends {
  type: 'text';
}
  ? { [Key in keyof Native]: Key extends 'tools' ? Tools : Native[Key] }
  : Native;

/** Substitute Effect providers and tools on the native batch submission request. */
type AdaptStartBatchOptions<
  Native extends { requests: ReadonlyArray<unknown> },
  Ids extends BatchIds,
  Tools extends EffectTools,
  A,
  P,
  I,
  R,
> = {
  [Key in keyof Native]: Key extends 'provider'
    ? Experimental_BatchProvider<Ids>
    : Key extends 'requests'
      ? ReadonlyArray<BatchInput<Native['requests'][number], Tools>>
      : Key extends 'output'
        ? OutputSpecification<A, P, I, R>
        : Native[Key];
};

/** Apply the caller's output parser and tool types to the final submission options. */
type StartBatchOptions<
  Ids extends BatchIds,
  Tools extends EffectTools,
  A,
  P,
  I,
  R,
> = AdaptStartBatchOptions<
  NativeStartBatchOptions<Ids, Tools>,
  Ids,
  Tools,
  A,
  P,
  I,
  R
>;

/** Submit batch requests after binding tools and optional structured output within a shared scope. */
export const experimental_startBatch = <
  Ids extends BatchIds = BatchIds,
  Tools extends EffectTools = {},
  A = string,
  P = string,
  I = never,
  R = never,
>(
  options: StartBatchOptions<Ids, Tools, A, P, I, R>,
) =>
  getNativeBatch<Ids>('experimental_startBatch', options.provider).pipe(
    Effect.flatMap((provider) =>
      scopedRequest<
        ToolServices<Tools> | R,
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
        const nativeOutput = output && bindOutput(output, owner);
        const nativeRequests = requests.map((request) => {
          if (request.type !== 'text') return request;
          const { tools, ...data } = request;
          return tools ? { ...data, tools: bindTools(tools, owner) } : data;
        });
        return sdk.experimental_startBatch<BoundTools<Tools>, NativeBatch<Ids>>(
          {
            ...data,
            ...(provider ? { provider } : {}),
            ...(nativeOutput ? { output: nativeOutput } : {}),
            requests: nativeRequests,
            abortSignal,
          },
        );
      }),
    ),
  );

/** Derive result streaming options from native tools and output parser types. */
type NativeBatchResultsOptions<Tools extends EffectTools, A, P, I> = Parameters<
  typeof sdk.experimental_getBatchResults<
    BoundTools<Tools>,
    NativeOutput<A, P, I> | undefined
  >
>[0];

/** Allow Effect batch providers, tool definitions, and output parsers for result collection. */
type AdaptBatchResultsOptions<Native, Tools extends EffectTools, A, P, I, R> = {
  [Key in keyof Native]: Key extends 'provider'
    ? BatchLookupProvider
    : Key extends 'tools'
      ? Tools
      : Key extends 'output'
        ? OutputSpecification<A, P, I, R>
        : Native[Key];
};

/** Carry the typed tools, output parser, and Effect services needed when reading batch results. */
type BatchResultsOptions<
  Tools extends EffectTools,
  A,
  P,
  I,
  R,
> = AdaptBatchResultsOptions<
  NativeBatchResultsOptions<Tools, A, P, I>,
  Tools,
  A,
  P,
  I,
  R
>;

/** Stream available batch results under a scope that owns cancellation and result parsing. */
export const experimental_getBatchResults = <
  Tools extends EffectTools = {},
  A = string,
  P = string,
  I = never,
  R = never,
>(
  options: BatchResultsOptions<Tools, A, P, I, R>,
) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const provider = yield* getNativeBatch(
        'experimental_getBatchResults',
        options.provider,
      );
      const owner = yield* openOperation<ToolServices<Tools> | R>(
        options.abortSignal,
      );
      const { provider: _, output, tools, ...data } = options;
      return ownedStream('experimental_getBatchResults', () => {
        const nativeOutput = output && bindOutput(output, owner);
        return sdk.experimental_getBatchResults<
          BoundTools<Tools>,
          NativeOutput<A, P, I> | undefined
        >({
          ...data,
          ...(provider ? { provider } : {}),
          ...(nativeOutput ? { output: nativeOutput } : {}),
          ...(tools ? { tools: bindTools(tools, owner) } : {}),
          abortSignal: owner.signal,
        });
      });
    }),
  );

/** Accept a batch provider handle or accessor alongside the native status lookup options. */
export type Experimental_GetBatchStatusOptions =
  BatchOptions<NativeBatchStatusOptions>;
/** Accept a batch provider handle or accessor alongside the native cancellation options. */
export type Experimental_CancelBatchOptions =
  BatchOptions<NativeBatchCancelOptions>;
/** Accept a batch provider handle or accessor alongside native list and paging options. */
export type Experimental_ListBatchesOptions =
  BatchOptions<NativeBatchListOptions>;

/** Recover capability-specific model IDs from a known batch provider input. */
type ProviderModelIds<Provider> =
  Provider extends Experimental_BatchProvider<infer Ids> ? Ids : BatchIds;

/** Infer valid batch submission options from the selected provider, tools, and output parser. */
export type Experimental_StartBatchOptions<
  Tools extends EffectTools = {},
  Provider = Experimental_BatchProvider,
  R = never,
> = StartBatchOptions<
  ProviderModelIds<Provider>,
  Tools,
  unknown,
  unknown,
  unknown,
  R
>;

/** Represent one request from the union of the SDK's batch request kinds. */
export type Experimental_BatchRequest<
  Ids extends BatchIds = BatchIds,
  Tools extends EffectTools = {},
> = BatchInput<sdk.Experimental_BatchRequest<Ids, BoundTools<Tools>>, Tools>;

/** Retain the public tool definition type on an individual text request. */
export type Experimental_TextBatchRequest<
  Id extends string = string,
  Tools extends EffectTools = {},
> = BatchInput<sdk.Experimental_TextBatchRequest<Id, BoundTools<Tools>>, Tools>;

/** Translate an Effect output parser specification into its native SDK output type. */
type AppliedOutput<Output> =
  Output extends OutputSpecification<infer A, infer P, infer I, infer _R>
    ? NativeOutput<A, P, I>
    : undefined;

/** Extract complete, partial, item, and service types while retaining defaults for plain text. */
type SelectedOutput<Output> =
  Output extends OutputSpecification<infer A, infer P, infer I, infer R>
    ? [A, P, I, R]
    : [string, string, never, never];

/** Infer result streaming options from the tools and optional output parser. */
export type Experimental_GetBatchResultsOptions<
  Tools extends EffectTools = {},
  Output = undefined,
> = BatchResultsOptions<
  Tools,
  SelectedOutput<Output>[0],
  SelectedOutput<Output>[1],
  SelectedOutput<Output>[2],
  SelectedOutput<Output>[3]
>;

/** Expose one batch outcome with Effect-adapted stream or deferred result fields. */
export type Experimental_BatchItemResult<
  Tools extends EffectTools = {},
  Output = undefined,
> = PublicStreamPart<
  sdk.Experimental_BatchItemResult<BoundTools<Tools>, AppliedOutput<Output>>
>;

/** Retain text batch result typing for the tools and parser used during submission. */
export type Experimental_TextBatchItemResult<
  Tools extends EffectTools = {},
  Output = undefined,
> = sdk.Experimental_TextBatchItemResult<
  BoundTools<Tools>,
  AppliedOutput<Output>
>;

/** Preserve typed tool data in the SDK's text generation result for a batch item. */
export type Experimental_TextBatchGenerationResult<
  Tools extends EffectTools = {},
> = sdk.Experimental_TextBatchGenerationResult<BoundTools<Tools>>;

/** Encode provider audio input lazily and translate SDK encoding failures to `AiSdkError`. */
export const experimental_encodeRealtimeAudio = (
  ...args: Parameters<typeof sdk.experimental_encodeRealtimeAudio>
) => sdk.experimental_encodeRealtimeAudio(...args);

/** Decode the provider audio representation into the native SDK audio format. */
export const experimental_decodeRealtimeAudio = (
  ...args: Parameters<typeof sdk.experimental_decodeRealtimeAudio>
) => sdk.experimental_decodeRealtimeAudio(...args);

/** Resample audio with the SDK rate options and report conversion errors through Effect. */
export const experimental_resampleAudio = (
  ...args: Parameters<typeof sdk.experimental_resampleAudio>
) => sdk.experimental_resampleAudio(...args);

/** Replace native realtime tool definitions with the public tool set before binding. */
type RealtimeDefinitions<Native, Tools> = {
  [K in keyof Native]: K extends 'tools' ? Tools : Native[K];
};

/** Bind the caller's Effect tools before generating native realtime tool definitions. */
export const experimental_getRealtimeToolDefinitions = <
  Tools extends EffectTools,
>(
  options: RealtimeDefinitions<
    Parameters<
      typeof sdk.experimental_getRealtimeToolDefinitions<BoundTools<Tools>>
    >[0],
    Tools
  >,
) =>
  scopedRequest<
    ToolServices<Tools>,
    Awaited<
      ReturnType<
        typeof sdk.experimental_getRealtimeToolDefinitions<BoundTools<Tools>>
      >
    >
  >('experimental_getRealtimeToolDefinitions', {}, (owner) =>
    sdk.experimental_getRealtimeToolDefinitions<BoundTools<Tools>>({
      ...options,
      tools: bindTools(options.tools, owner),
    }),
  );
