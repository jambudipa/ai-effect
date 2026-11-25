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

export type EmbeddingModel =
  | string
  | EmbeddingModelV4
  | legacy.EmbeddingModelV3
  | legacy.EmbeddingModelV2<string>;
export type ImageModel =
  string | ImageModelV4 | legacy.ImageModelV3 | legacy.ImageModelV2;
export type RerankingModel =
  string | RerankingModelV4 | legacy.RerankingModelV3;
export type SpeechModel =
  string | SpeechModelV4 | legacy.SpeechModelV3 | legacy.SpeechModelV2;
export type TranscriptionModel =
  | string
  | TranscriptionModelV4
  | legacy.TranscriptionModelV3
  | legacy.TranscriptionModelV2;

const getEmbeddingModel = (model: Exclude<EmbeddingModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapEmbeddingModel(model)
    : unwrapLegacyModel<
        native.EmbeddingModelV3 | native.EmbeddingModelV2<string>
      >(model);

const getImageModel = (model: Exclude<ImageModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapImageModel(model)
    : unwrapLegacyModel<native.ImageModelV3 | native.ImageModelV2>(model);

const getRerankingModel = (model: Exclude<RerankingModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapRerankingModel(model)
    : unwrapLegacyModel<native.RerankingModelV3>(model);

const getSpeechModel = (model: Exclude<SpeechModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapSpeechModel(model)
    : unwrapLegacyModel<native.SpeechModelV3 | native.SpeechModelV2>(model);

const getTranscriptionModel = (model: Exclude<TranscriptionModel, string>) =>
  model.specificationVersion === 'v4'
    ? unwrapTranscriptionModel(model)
    : unwrapLegacyModel<
        native.TranscriptionModelV3 | native.TranscriptionModelV2
      >(model);

type Runtime = NonNullable<Parameters<typeof sdk.embed>[0]['runtimeContext']>;
type ModelType = ConstructorParameters<
  typeof sdk.NoSuchModelError
>[0]['modelType'];

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

type VisibleOptions<Native> = {
  [Key in keyof Native as Key extends '_internal' ? never : Key]: Native[Key];
};
type Options<Native, Handle, R = never> = ExperimentalOptions<
  VisibleOptions<Native>,
  Handle,
  R
>;

type HookInput<Options, Start, End, R> = {
  [
    Key in keyof Options as Key extends keyof Hooks<Start, End, R> ? never : Key
  ]: Options[Key];
} & Hooks<Start, End, R>;

type HookOptions<Native, Handle, Start, End, R> = HookInput<
  Options<Native, Handle, R>,
  Start,
  End,
  R
>;

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
