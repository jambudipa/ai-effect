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

/**
 * Run v4 evaluation requests through Effect while preserving the evaluation SDK protocol.
 */
export type Experimental_EvaluationModelV4 = ReturnType<
  typeof wrapEvaluationModel
>;
/**
 * Adapt the v4 streaming speech model for effectful speech operations and scoped
 * connections.
 */
export type Experimental_StreamingSpeechModelV4 = ReturnType<
  typeof wrapStreamingSpeechModel
>;
/**
 * Select realtime models and access adapted factory methods such as token or session
 * requests where available.
 */
export type Experimental_RealtimeFactoryV4 = ReturnType<
  typeof wrapRealtimeFactory
>;
/**
 * Configure realtime transports with Effect callbacks whose dependencies belong to the
 * caller.
 */
export type Experimental_RealtimeModelV4TransportOptions<
  E = unknown,
  R = never,
> = RealtimeTransportOptions<E, R>;

/**
 * Preserve the SDK protocol for v2 embedding generation, with the native embedding input
 * retained and lift model operations into Effect.
 */
export type EmbeddingModelV2<Value> = LegacyModel<sdk.EmbeddingModelV2<Value>>;
/**
 * Preserve the SDK protocol for v3 embedding generation and its batching limits and lift
 * model operations into Effect.
 */
export type EmbeddingModelV3 = LegacyModel<sdk.EmbeddingModelV3>;
/**
 * Preserve the SDK protocol for v2 image generation and lift model operations into Effect.
 */
export type ImageModelV2 = LegacyModel<sdk.ImageModelV2>;
/**
 * Preserve the SDK protocol for v3 image generation and lift model operations into Effect.
 */
export type ImageModelV3 = LegacyModel<sdk.ImageModelV3>;
/**
 * Preserve the SDK protocol for v2 language generation and streaming and lift model
 * operations into Effect.
 */
export type LanguageModelV2 = LegacyModel<sdk.LanguageModelV2>;
/**
 * Preserve the SDK protocol for v3 language generation and streaming and lift model
 * operations into Effect.
 */
export type LanguageModelV3 = LegacyModel<sdk.LanguageModelV3>;
/** Preserve the SDK protocol for v3 reranking and lift model operations into Effect. */
export type RerankingModelV3 = LegacyModel<sdk.RerankingModelV3>;
/**
 * Preserve the SDK protocol for v2 speech synthesis and lift model operations into Effect.
 */
export type SpeechModelV2 = LegacyModel<sdk.SpeechModelV2>;
/**
 * Preserve the SDK protocol for v3 speech synthesis and lift model operations into Effect.
 */
export type SpeechModelV3 = LegacyModel<sdk.SpeechModelV3>;
/**
 * Preserve the SDK protocol for v2 transcription and lift model operations into Effect.
 */
export type TranscriptionModelV2 = LegacyModel<sdk.TranscriptionModelV2>;
/**
 * Preserve the SDK protocol for v3 transcription and lift model operations into Effect.
 */
export type TranscriptionModelV3 = LegacyModel<sdk.TranscriptionModelV3>;
/**
 * Preserve the SDK protocol for experimental v3 video generation and lift model operations
 * into Effect.
 */
export type Experimental_VideoModelV3 =
  LegacyModel<sdk.Experimental_VideoModelV3>;
/** Share a base Effect provider shape across v4 SDK adapters. */
export type ProviderV4 = ReturnType<typeof wrapProviderBase>;

/** Carry SDK selection failures and provider requirements in the returned Effect. */
type ModelSelection<Model, R> = Effect.Effect<
  Model,
  import('../internal/operation.js').AiSdkError,
  R
>;

/**
 * Expose the v2 provider selectors with lazy model selection and optional audio model
 * support.
 */
export interface ProviderV2<R = never> {
  /** Select the provider language model for the native ID when the Effect runs. */
  languageModel(modelId: string): ModelSelection<LanguageModelV2, R>;
  /**
   * Select the embedding model using the SDK text embedding selector for this protocol.
   */
  textEmbeddingModel(
    modelId: string,
  ): ModelSelection<EmbeddingModelV2<string>, R>;
  /** Select the provider image model for the native ID when the Effect runs. */
  imageModel(modelId: string): ModelSelection<ImageModelV2, R>;
  /**
   * Select an audio transcription model when the provider exposes this optional
   * capability.
   */
  transcriptionModel?(modelId: string): ModelSelection<TranscriptionModelV2, R>;
  /**
   * Select a speech synthesis model when the provider exposes this optional capability.
   */
  speechModel?(modelId: string): ModelSelection<SpeechModelV2, R>;
}

/**
 * Expose v3 model selectors and the version discriminator for providers with mixed
 * protocol support.
 */
export interface ProviderV3<R = never> {
  /** Identify a v3 provider when selecting a compatible SDK protocol. */
  readonly specificationVersion: 'v3';
  /** Select the provider language model for the native ID when the Effect runs. */
  languageModel(modelId: string): ModelSelection<LanguageModelV3, R>;
  /** Select an embedding model using the v3 SDK embedding selector. */
  embeddingModel(modelId: string): ModelSelection<EmbeddingModelV3, R>;
  /**
   * Select the embedding model using the SDK text embedding selector for this protocol.
   */
  textEmbeddingModel?(modelId: string): ModelSelection<EmbeddingModelV3, R>;
  /** Select the provider image model for the native ID when the Effect runs. */
  imageModel(modelId: string): ModelSelection<ImageModelV3, R>;
  /**
   * Select an audio transcription model when the provider exposes this optional
   * capability.
   */
  transcriptionModel?(modelId: string): ModelSelection<TranscriptionModelV3, R>;
  /**
   * Select a speech synthesis model when the provider exposes this optional capability.
   */
  speechModel?(modelId: string): ModelSelection<SpeechModelV3, R>;
  /** Select a reranker when the v3 provider exposes the optional selector. */
  rerankingModel?(modelId: string): ModelSelection<RerankingModelV3, R>;
}

/**
 * Replace the native model and operation callbacks with values from the wrapped Effect
 * model.
 */
type MiddlewareArguments<Arguments, Model> = {
  [Name in keyof Arguments]: Name extends 'model'
    ? Model
    : Name extends keyof Model
      ? Model[Name] extends (options: never) => infer Result
        ? () => Result
        : Arguments[Name]
      : Arguments[Name];
};

/**
 * Keep synchronous identity overrides and adapt operation hooks to the wrapped Effect
 * model results.
 */
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

/**
 * Translate the callbacks of an older SDK middleware protocol while retaining its
 * configuration fields.
 */
type LegacyMiddleware<Native, Model, R> = {
  [Name in keyof Native]: NonNullable<Native[Name]> extends (
    options: infer Arguments,
  ) => infer Result
    ? (
        options: MiddlewareArguments<Arguments, Model>,
      ) => MiddlewareResult<Name, Result, Model, R>
    : Native[Name];
};

/** Wrap v2 generation and streaming operations with Effect middleware hooks. */
export type LanguageModelV2Middleware<R = never> = LegacyMiddleware<
  sdk.LanguageModelV2Middleware,
  LanguageModelV2,
  R
>;
/** Wrap v3 generation and streaming operations with Effect middleware hooks. */
export type LanguageModelV3Middleware<R = never> = LegacyMiddleware<
  sdk.LanguageModelV3Middleware,
  LanguageModelV3,
  R
>;
/**
 * Wrap v3 embedding calls while preserving native middleware fields and model metadata.
 */
export type EmbeddingModelV3Middleware<R = never> = LegacyMiddleware<
  sdk.EmbeddingModelV3Middleware,
  EmbeddingModelV3,
  R
>;
/** Wrap v3 image calls and allow image limits to resolve through Effect. */
export type ImageModelV3Middleware<R = never> = LegacyMiddleware<
  sdk.ImageModelV3Middleware,
  ImageModelV3,
  R
>;

/**
 * Use the SDK error formatting rules inside an Effect so formatting failures enter the
 * error channel.
 */
export const getErrorMessage = (error: unknown) =>
  runSync('provider.getErrorMessage', () => sdk.getErrorMessage(error));

/** Narrow unknown input to a JSON-compatible array using the SDK guard. */
export const isJSONArray = (value: unknown): value is JSONArray =>
  sdk.isJSONArray(value);
/** Narrow unknown input to a JSON-compatible object using the SDK guard. */
export const isJSONObject = (value: unknown): value is JSONObject =>
  sdk.isJSONObject(value);
/** Narrow unknown input to a JSON-compatible value using the SDK guard. */
export const isJSONValue = (value: unknown): value is JSONValue =>
  sdk.isJSONValue(value);
