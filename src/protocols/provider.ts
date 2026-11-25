import * as sdk from '@ai-sdk/provider';
import type { JSONArray, JSONObject, JSONValue } from '@ai-sdk/provider';
import type { Effect } from 'effect';
import type { LegacyModel } from '../internal/legacy-model.js';
import { runSync } from '../internal/operation.js';
import type { wrapProviderBase } from '../internal/provider-adapter.js';

export * from './provider-errors.js';
export * from '../internal/sdk-data/provider.js';

export type {
  EmbeddingModelV4Middleware,
  ImageModelV4Middleware,
  LanguageModelV4Middleware,
} from '../core-middleware.js';
export type { LanguageModelV4 } from '../internal/language-model.js';
export type {
  DecisionModelV4 as Experimental_DecisionModelV4,
  EmbeddingModelV4,
  ExtractionModelV4 as Experimental_ExtractionModelV4,
  ImageModelV4,
  RerankingModelV4,
  SpeechModelV4,
  SpeechTranslationModelV4 as Experimental_SpeechTranslationModelV4,
  TranscriptionModelV4,
  VideoModelV4,
  VideoModelV4 as Experimental_VideoModelV4,
} from '../internal/provider-model.js';
export type {
  BatchV4 as Experimental_BatchV4,
  FilesV4Handle as FilesV4,
  SkillsV4Handle as SkillsV4,
} from '../internal/provider-resource.js';
export type {
  RealtimeModelV4 as Experimental_RealtimeModelV4,
  RealtimeTransport as Experimental_RealtimeModelV4Transport,
} from '../internal/provider-realtime.js';
import type {
  wrapEvaluationModel,
  wrapStreamingSpeechModel,
} from '../internal/provider-model.js';
import type {
  RealtimeTransportOptions,
  wrapRealtimeFactory,
} from '../internal/provider-realtime.js';

export type Experimental_EvaluationModelV4 = ReturnType<
  typeof wrapEvaluationModel
>;
export type Experimental_StreamingSpeechModelV4 = ReturnType<
  typeof wrapStreamingSpeechModel
>;
export type Experimental_RealtimeFactoryV4 = ReturnType<
  typeof wrapRealtimeFactory
>;
export type Experimental_RealtimeModelV4TransportOptions<
  E = unknown,
  R = never,
> = RealtimeTransportOptions<E, R>;

export type EmbeddingModelV2<Value> = LegacyModel<sdk.EmbeddingModelV2<Value>>;
export type EmbeddingModelV3 = LegacyModel<sdk.EmbeddingModelV3>;
export type ImageModelV2 = LegacyModel<sdk.ImageModelV2>;
export type ImageModelV3 = LegacyModel<sdk.ImageModelV3>;
export type LanguageModelV2 = LegacyModel<sdk.LanguageModelV2>;
export type LanguageModelV3 = LegacyModel<sdk.LanguageModelV3>;
export type RerankingModelV3 = LegacyModel<sdk.RerankingModelV3>;
export type SpeechModelV2 = LegacyModel<sdk.SpeechModelV2>;
export type SpeechModelV3 = LegacyModel<sdk.SpeechModelV3>;
export type TranscriptionModelV2 = LegacyModel<sdk.TranscriptionModelV2>;
export type TranscriptionModelV3 = LegacyModel<sdk.TranscriptionModelV3>;
export type Experimental_VideoModelV3 =
  LegacyModel<sdk.Experimental_VideoModelV3>;
export type ProviderV4 = ReturnType<typeof wrapProviderBase>;

type ModelSelection<Model, R> = Effect.Effect<
  Model,
  import('../internal/operation.js').AiSdkError,
  R
>;

export interface ProviderV2<R = never> {
  languageModel(modelId: string): ModelSelection<LanguageModelV2, R>;
  textEmbeddingModel(
    modelId: string,
  ): ModelSelection<EmbeddingModelV2<string>, R>;
  imageModel(modelId: string): ModelSelection<ImageModelV2, R>;
  transcriptionModel?(modelId: string): ModelSelection<TranscriptionModelV2, R>;
  speechModel?(modelId: string): ModelSelection<SpeechModelV2, R>;
}

export interface ProviderV3<R = never> {
  readonly specificationVersion: 'v3';
  languageModel(modelId: string): ModelSelection<LanguageModelV3, R>;
  embeddingModel(modelId: string): ModelSelection<EmbeddingModelV3, R>;
  textEmbeddingModel?(modelId: string): ModelSelection<EmbeddingModelV3, R>;
  imageModel(modelId: string): ModelSelection<ImageModelV3, R>;
  transcriptionModel?(modelId: string): ModelSelection<TranscriptionModelV3, R>;
  speechModel?(modelId: string): ModelSelection<SpeechModelV3, R>;
  rerankingModel?(modelId: string): ModelSelection<RerankingModelV3, R>;
}

type MiddlewareArguments<Arguments, Model> = {
  [Name in keyof Arguments]: Name extends 'model'
    ? Model
    : Name extends keyof Model
      ? Model[Name] extends (options: never) => infer Result
        ? () => Result
        : Arguments[Name]
      : Arguments[Name];
};

type MiddlewareResult<Name, Result, Model, R> = Name extends
  'overrideProvider' | 'overrideModelId'
  ? Result
  : Name extends 'overrideMaxImagesPerCall'
    ? | number
      | undefined
      | ((options: {
          modelId: string;
        }) => Effect.Effect<number | undefined, unknown, R>)
    : Name extends 'wrapStream'
      ? Model extends { doStream: (options: never) => infer StreamResult }
        ? StreamResult extends Effect.Effect<
            infer Value,
            unknown,
            infer Context
          >
          ? Effect.Effect<Value, unknown, R | Context>
          : never
        : never
      : Effect.Effect<Awaited<Result>, unknown, R>;

type LegacyMiddleware<Native, Model, R> = {
  [Name in keyof Native]: NonNullable<Native[Name]> extends (
    options: infer Arguments,
  ) => infer Result
    ? (
        options: MiddlewareArguments<Arguments, Model>,
      ) => MiddlewareResult<Name, Result, Model, R>
    : Native[Name];
};

export type LanguageModelV2Middleware<R = never> = LegacyMiddleware<
  sdk.LanguageModelV2Middleware,
  LanguageModelV2,
  R
>;
export type LanguageModelV3Middleware<R = never> = LegacyMiddleware<
  sdk.LanguageModelV3Middleware,
  LanguageModelV3,
  R
>;
export type EmbeddingModelV3Middleware<R = never> = LegacyMiddleware<
  sdk.EmbeddingModelV3Middleware,
  EmbeddingModelV3,
  R
>;
export type ImageModelV3Middleware<R = never> = LegacyMiddleware<
  sdk.ImageModelV3Middleware,
  ImageModelV3,
  R
>;

export const getErrorMessage = (error: unknown) =>
  runSync('provider.getErrorMessage', () => sdk.getErrorMessage(error));

export const isJSONArray = (value: unknown): value is JSONArray =>
  sdk.isJSONArray(value);
export const isJSONObject = (value: unknown): value is JSONObject =>
  sdk.isJSONObject(value);
export const isJSONValue = (value: unknown): value is JSONValue =>
  sdk.isJSONValue(value);
