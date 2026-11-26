import { bindExperimentalOptions } from './internal/experimental-callbacks.js';
import type {
  ExperimentalOptions,
  Owner,
} from './internal/experimental-callbacks.js';
import { wrapTelemetryEvent } from './integrations/internal/telemetry.js';
import type { TelemetryEvent } from './integrations/internal/telemetry.js';
import * as sdk from 'ai';
import type * as native from '@ai-sdk/provider';
import type { JSONObject } from '@ai-sdk/provider';
import { Effect } from 'effect';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import {
  openOperation,
  runRequest,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import {
  unwrapEmbeddingModel,
  unwrapImageModel,
  unwrapRerankingModel,
  unwrapSpeechModel,
  unwrapTranscriptionModel,
  type EmbeddingModelV4,
  type ImageModelV4,
  type RerankingModelV4,
  type SpeechModelV4,
  type TranscriptionModelV4,
} from './internal/provider-model.js';
import type * as legacy from './protocols/provider.js';

/** Accept a model registry ID or a supported embedding model handle. */
export type EmbeddingModel =
  | string
  | EmbeddingModelV4
  | legacy.EmbeddingModelV3
  | legacy.EmbeddingModelV2<string>;
/** Accept a model registry ID or a supported image model handle. */
export type ImageModel =
  string | ImageModelV4 | legacy.ImageModelV3 | legacy.ImageModelV2;
/** Accept a model registry ID or a supported document reranking handle. */
export type RerankingModel =
  string | RerankingModelV4 | legacy.RerankingModelV3;
/** Accept a model registry ID or a supported speech synthesis handle. */
export type SpeechModel =
  string | SpeechModelV4 | legacy.SpeechModelV3 | legacy.SpeechModelV2;
/** Accept a model registry ID or a supported transcription model handle. */
export type TranscriptionModel =
  | string
  | TranscriptionModelV4
  | legacy.TranscriptionModelV3
  | legacy.TranscriptionModelV2;

/** Resolve a version 4 embedding handle or its matching legacy model binding. */
const getEmbeddingModel = (model: Exclude<EmbeddingModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapEmbeddingModel(model)
    : unwrapLegacyModel<
        native.EmbeddingModelV3 | native.EmbeddingModelV2<string>
      >(model);

/** Resolve an image generation handle using the adapter for its protocol version. */
const getImageModel = (model: Exclude<ImageModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapImageModel(model)
    : unwrapLegacyModel<native.ImageModelV3 | native.ImageModelV2>(model);

/** Resolve a reranking handle through version 4 or registered version 3 bindings. */
const getRerankingModel = (model: Exclude<RerankingModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapRerankingModel(model)
    : unwrapLegacyModel<native.RerankingModelV3>(model);

/** Resolve a speech model using its protocol version before opening a synthesis request. */
const getSpeechModel = (model: Exclude<SpeechModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapSpeechModel(model)
    : unwrapLegacyModel<native.SpeechModelV3 | native.SpeechModelV2>(model);

/** Resolve a transcription model using its protocol version before sending audio. */
const getTranscriptionModel = (model: Exclude<TranscriptionModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapTranscriptionModel(model)
    : unwrapLegacyModel<
        native.TranscriptionModelV3 | native.TranscriptionModelV2
      >(model);

/** Reuse the SDK context record constraint for model telemetry callbacks. */
type Runtime = NonNullable<Parameters<typeof sdk.embed>[0]['runtimeContext']>;
/** Report missing models using the SDK's capability-specific model category. */
type ModelType = ConstructorParameters<
  typeof sdk.NoSuchModelError
>[0]['modelType'];

/** Resolve the native model lazily, fail on an unknown handle, and pass through cancellation. */
function modelRequest<
  Handle extends { readonly modelId: string },
  Native,
  Result,
>(
  operation: string,
  modelType: ModelType,
  options: {
    readonly model: string | Handle;
    readonly abortSignal?: AbortSignal | undefined;
  },
  unwrap: (model: Handle) => Native | undefined,
  invoke: (model: string | Native, signal: AbortSignal) => PromiseLike<Result>,
): Effect.Effect<Result, AiSdkError> {
  const caller = options.abortSignal;
  return Effect.suspend(() => {
    const handle = options.model;
    const native = typeof handle === 'string' ? handle : unwrap(handle);
    if (native === undefined) {
      const modelId = typeof handle === 'string' ? handle : handle.modelId;
      return Effect.fail(
        sdkError(operation, new sdk.NoSuchModelError({ modelId, modelType })),
      );
    }
    return runRequest(
      operation,
      caller ? { abortSignal: caller } : {},
      (signal) => invoke(native, signal),
    );
  });
}

/** Own the bound model callbacks and native request signal for the lifetime of one request. */
const scopedModelRequest = <
  Handle extends { readonly modelId: string },
  Native,
  R,
  Result,
>(
  operation: string,
  modelType: ModelType,
  options: {
    readonly model: string | Handle;
    readonly abortSignal?: AbortSignal | undefined;
  },
  unwrap: (model: Handle) => Native | undefined,
  invoke: (
    model: string | Native,
    abortSignal: AbortSignal,
    owner: Owner<R>,
  ) => PromiseLike<Result>,
): Effect.Effect<Result, AiSdkError, R> =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>(options.abortSignal);
      return yield* modelRequest(
        operation,
        modelType,
        { ...options, abortSignal: owner.signal },
        unwrap,
        (model, abortSignal) => invoke(model, abortSignal, owner),
      );
    }),
  );

/** Allow Effect callbacks to observe the start and end events of a model request. */
type Hooks<Start, End, Services> = {
  readonly onStart?: (
    event: TelemetryEvent<Start>,
  ) => Effect.Effect<void, unknown, Services>;
  readonly experimental_onStart?: (
    event: TelemetryEvent<Start>,
  ) => Effect.Effect<void, unknown, Services>;
  readonly onEnd?: (
    event: TelemetryEvent<End>,
  ) => Effect.Effect<void, unknown, Services>;
  readonly experimental_onEnd?: (
    event: TelemetryEvent<End>,
  ) => Effect.Effect<void, unknown, Services>;
};

/** Run each configured callback through the request owner and preserve options that need no binding. */
function bindHooks<Start, End, Services, Native extends object>(
  options: object & Hooks<Start, End, Services>,
  owner: Effect.Success<ReturnType<typeof openOperation<Services>>>,
) {
  const { onStart, experimental_onStart, onEnd, experimental_onEnd, ...rest } =
    options;
  const start = onStart ?? experimental_onStart;
  const end = onEnd ?? experimental_onEnd;
  return {
    ...bindExperimentalOptions<Record<string, unknown>, unknown, Services>(
      rest,
      owner,
    ),
    ...(start
      ? {
          onStart: (event: Start) =>
            owner.runCallback(
              Effect.suspend(() => start(wrapTelemetryEvent(event))),
            ),
        }
      : {}),
    ...(end
      ? {
          onEnd: (event: End) =>
            owner.runCallback(
              Effect.suspend(() => end(wrapTelemetryEvent(event))),
            ),
        }
      : {}),
  } as Native;
}

/** Remove the SDK's internal test-only field from public request options. */
type VisibleOptions<Native> = {
  [Key in keyof Native as Key extends '_internal' ? never : Key]: Native[Key];
};
/** Replace a model option with its public handle and adapt Effect callback requirements. */
type Options<Native, Handle, R = never> = ExperimentalOptions<
  VisibleOptions<Native>,
  Handle,
  R
>;

/** Remove native hooks so the public Effect callback contracts can replace them. */
type HookInput<Options, Start, End, R> = {
  [
    Key in keyof Options as Key extends keyof Hooks<Start, End, R> ? never : Key
  ]: Options[Key];
} & Hooks<Start, End, R>;

/** Combine public model input with typed start and end telemetry hooks. */
type HookOptions<Native, Handle, Start, End, R> = HookInput<
  Options<Native, Handle, R>,
  Start,
  End,
  R
>;

/** Request an embedding for one value with scoped start and end callbacks. */
export const embed = <R extends Runtime = Runtime, Services = never>(
  options: HookOptions<
    Parameters<typeof sdk.embed<R>>[0],
    EmbeddingModel,
    sdk.EmbedStartEvent<R>,
    sdk.EmbedEndEvent<R>,
    Services
  >,
) =>
  scopedModelRequest(
    'embed',
    'embeddingModel',
    options,
    getEmbeddingModel,
    (model, abortSignal, owner: Owner<Services>) =>
      sdk.embed<R>({
        ...bindHooks<
          sdk.EmbedStartEvent<R>,
          sdk.EmbedEndEvent<R>,
          Services,
          Parameters<typeof sdk.embed<R>>[0]
        >(options, owner),
        model,
        abortSignal,
      }),
  );

/** Request embeddings for a batch while preserving the SDK's input-order correspondence. */
export const embedMany = <R extends Runtime = Runtime, Services = never>(
  options: HookOptions<
    Parameters<typeof sdk.embedMany<R>>[0],
    EmbeddingModel,
    sdk.EmbedStartEvent<R>,
    sdk.EmbedEndEvent<R>,
    Services
  >,
) =>
  scopedModelRequest(
    'embedMany',
    'embeddingModel',
    options,
    getEmbeddingModel,
    (model, abortSignal, owner: Owner<Services>) =>
      sdk.embedMany<R>({
        ...bindHooks<
          sdk.EmbedStartEvent<R>,
          sdk.EmbedEndEvent<R>,
          Services,
          Parameters<typeof sdk.embedMany<R>>[0]
        >(options, owner),
        model,
        abortSignal,
      }),
  );

/** Rank documents by their relevance to a query and retain their inferred document type. */
export const rerank = <
  Document extends string | JSONObject,
  R extends Runtime = Runtime,
  Services = never,
>(
  options: HookOptions<
    Parameters<typeof sdk.rerank<Document, R>>[0],
    RerankingModel,
    sdk.RerankStartEvent<R>,
    sdk.RerankEndEvent<R>,
    Services
  >,
) =>
  scopedModelRequest(
    'rerank',
    'rerankingModel',
    options,
    getRerankingModel,
    (model, abortSignal, owner: Owner<Services>) =>
      sdk.rerank<Document, R>({
        ...bindHooks<
          sdk.RerankStartEvent<R>,
          sdk.RerankEndEvent<R>,
          Services,
          Parameters<typeof sdk.rerank<Document, R>>[0]
        >(options, owner),
        model,
        abortSignal,
      }),
  );

/** Generate an image with a registry ID or registered handle and preserve provider output. */
export const generateImage = <R = never>(
  options: Options<Parameters<typeof sdk.generateImage>[0], ImageModel, R>,
) =>
  scopedModelRequest(
    'generateImage',
    'imageModel',
    options,
    getImageModel,
    (model, abortSignal, owner: Owner<R>) =>
      sdk.generateImage({
        ...bindExperimentalOptions<
          Parameters<typeof sdk.generateImage>[0],
          ImageModel,
          R
        >(options, owner),
        model,
        abortSignal,
      }),
  );

/** Synthesize speech and expose the generated audio through lazy encoding accessors. */
export const generateSpeech = <R = never>(
  options: Options<Parameters<typeof sdk.generateSpeech>[0], SpeechModel, R>,
) =>
  scopedModelRequest(
    'generateSpeech',
    'speechModel',
    options,
    getSpeechModel,
    (model, abortSignal, owner: Owner<R>) =>
      sdk.generateSpeech({
        ...bindExperimentalOptions<
          Parameters<typeof sdk.generateSpeech>[0],
          SpeechModel,
          R
        >(options, owner),
        model,
        abortSignal,
      }),
  );

/** Transcribe audio and preserve native segments and response metadata. */
export const transcribe = <R = never>(
  options: Options<Parameters<typeof sdk.transcribe>[0], TranscriptionModel, R>,
) =>
  scopedModelRequest(
    'transcribe',
    'transcriptionModel',
    options,
    getTranscriptionModel,
    (model, abortSignal, owner: Owner<R>) =>
      sdk.transcribe({
        ...bindExperimentalOptions<
          Parameters<typeof sdk.transcribe>[0],
          TranscriptionModel,
          R
        >(options, owner),
        model,
        abortSignal,
      }),
  );

export {
  generateSpeech as experimental_generateSpeech,
  transcribe as experimental_transcribe,
};
