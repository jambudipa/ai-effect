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
export type CohereProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type CohereProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createCohere = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  CohereProvider
>('createCohere', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateCohere(settings)),
);
export const cohere: CohereProvider = wrapProvider(sdkCohere);
