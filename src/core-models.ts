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

type Hooks<Start, End, Services> = {
  readonly onStart?: (event: Start) => Effect.Effect<void, unknown, Services>;
  readonly experimental_onStart?: (
    event: Start,
  ) => Effect.Effect<void, unknown, Services>;
  readonly onEnd?: (event: End) => Effect.Effect<void, unknown, Services>;
  readonly experimental_onEnd?: (
    event: End,
  ) => Effect.Effect<void, unknown, Services>;
};

function bindHooks<Start, End, Services, Options extends object>(
  options: Options & Hooks<Start, End, Services>,
  owner: Effect.Success<ReturnType<typeof openOperation<Services>>>,
) {
  const { onStart, experimental_onStart, onEnd, experimental_onEnd, ...rest } =
    options;
  const start = onStart ?? experimental_onStart;
  const end = onEnd ?? experimental_onEnd;
  return {
    ...rest,
    ...(start
      ? {
          onStart: (event: Start) =>
            owner.runCallback(Effect.suspend(() => start(event))),
        }
      : {}),
    ...(end
      ? {
          onEnd: (event: End) =>
            owner.runCallback(Effect.suspend(() => end(event))),
        }
      : {}),
  };
}

type Options<Native, Handle> = Omit<Native, 'model' | '_internal'> & {
  readonly model: Handle;
};
type HookOptions<Native, Handle, Start, End, R> = Omit<
  Options<Native, Handle>,
  keyof Hooks<Start, End, R>
> &
  Hooks<Start, End, R>;

export const embed = <R extends Runtime = Runtime, Services = never>(
  options: HookOptions<
    Parameters<typeof sdk.embed<R>>[0],
    EmbeddingModel,
    sdk.EmbedStartEvent<R>,
    sdk.EmbedEndEvent<R>,
    Services
  >,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<Services>(options.abortSignal);
      const request = bindHooks<
        sdk.EmbedStartEvent<R>,
        sdk.EmbedEndEvent<R>,
        Services,
        typeof options
      >(options, owner);
      return yield* modelRequest(
        'embed',
        'embeddingModel',
        { ...options, abortSignal: owner.signal },
        getEmbeddingModel,
        (model, abortSignal) =>
          sdk.embed<R>({
            ...request,
            model,
            abortSignal,
          } as Parameters<typeof sdk.embed<R>>[0]),
      );
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
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<Services>(options.abortSignal);
      const request = bindHooks<
        sdk.EmbedStartEvent<R>,
        sdk.EmbedEndEvent<R>,
        Services,
        typeof options
      >(options, owner);
      return yield* modelRequest(
        'embedMany',
        'embeddingModel',
        { ...options, abortSignal: owner.signal },
        getEmbeddingModel,
        (model, abortSignal) =>
          sdk.embedMany<R>({
            ...request,
            model,
            abortSignal,
          } as Parameters<typeof sdk.embedMany<R>>[0]),
      );
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
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<Services>(options.abortSignal);
      const request = bindHooks<
        sdk.RerankStartEvent<R>,
        sdk.RerankEndEvent<R>,
        Services,
        typeof options
      >(options, owner);
      return yield* modelRequest(
        'rerank',
        'rerankingModel',
        { ...options, abortSignal: owner.signal },
        getRerankingModel,
        (model, abortSignal) =>
          sdk.rerank<Document, R>({
            ...request,
            model,
            abortSignal,
          } as Parameters<typeof sdk.rerank<Document, R>>[0]),
      );
    }),
  );

export const generateImage = (
  options: Options<Parameters<typeof sdk.generateImage>[0], ImageModel>,
) =>
  modelRequest(
    'generateImage',
    'imageModel',
    options,
    getImageModel,
    (model, abortSignal) =>
      sdk.generateImage({ ...options, model, abortSignal }),
  );

export const generateSpeech = (
  options: Options<Parameters<typeof sdk.generateSpeech>[0], SpeechModel>,
) =>
  modelRequest(
    'generateSpeech',
    'speechModel',
    options,
    getSpeechModel,
    (model, abortSignal) =>
      sdk.generateSpeech({ ...options, model, abortSignal }),
  );

export const transcribe = (
  options: Options<Parameters<typeof sdk.transcribe>[0], TranscriptionModel>,
) =>
  modelRequest(
    'transcribe',
    'transcriptionModel',
    options,
    getTranscriptionModel,
    (model, abortSignal) => sdk.transcribe({ ...options, model, abortSignal }),
  );

export {
  generateSpeech as experimental_generateSpeech,
  transcribe as experimental_transcribe,
};
