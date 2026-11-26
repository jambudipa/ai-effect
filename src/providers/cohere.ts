import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { CohereProviderSettings as SdkSettings } from '@ai-sdk/cohere';
import {
  createCohere as sdkCreateCohere,
  cohere as sdkCohere,
} from '@ai-sdk/cohere';
import type { CohereProvider as SdkProvider } from '@ai-sdk/cohere';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapRerankingModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/cohere';
export type {
  CohereChatModelOptions,
  CohereEmbeddingModelOptions,
  CohereLanguageModelChatOptions,
  CohereLanguageModelOptions,
  CohereRerankingModelOptions,
  CohereRerankingOptions,
} from '@ai-sdk/cohere';

/**
 * Adapt language, embedding, and reranking model selection from the Cohere SDK to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('cohere', sdk, wrapLanguageModel), {
    ...wrapProviderBase('cohere', sdk),
    languageModel: adaptMethod(
      'cohere.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'cohere.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'cohere.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbedding: adaptMethod(
      'cohere.textEmbedding',
      sdk.textEmbedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'cohere.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    reranking: adaptMethod(
      'cohere.reranking',
      sdk.reranking.bind(sdk),
      wrapRerankingModel,
    ),
    rerankingModel: adaptMethod(
      'cohere.rerankingModel',
      sdk.rerankingModel.bind(sdk),
      wrapRerankingModel,
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for Cohere. */
export type CohereProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Cohere options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type CohereProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Cohere provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createCohere = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  CohereProvider
>('createCohere', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateCohere(settings)),
);
/**
 * Adapt the preconfigured provider from the Cohere SDK. Use the factory to supply
 * explicit settings.
 */
export const cohere: CohereProvider = wrapProvider(sdkCohere);
