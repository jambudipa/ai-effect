import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { TogetherAIProviderSettings as SdkSettings } from '@ai-sdk/togetherai';
import {
  createTogetherAI as sdkCreateTogetherAI,
  togetherai as sdkTogetherai,
} from '@ai-sdk/togetherai';
import type { TogetherAIProvider as SdkProvider } from '@ai-sdk/togetherai';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapImageModel,
  wrapRerankingModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/togetherai';
export type {
  TogetherAIErrorData,
  TogetherAIImageModelOptions,
  TogetherAIImageProviderOptions,
  TogetherAIRerankingModelOptions,
  TogetherAIRerankingOptions,
} from '@ai-sdk/togetherai';

/**
 * Adapt language, embedding, image, and reranking model selection from the Together AI SDK
 * to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('togetherai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('togetherai', sdk),
    chatModel: adaptMethod(
      'togetherai.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    languageModel: adaptMethod(
      'togetherai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    completionModel: adaptMethod(
      'togetherai.completionModel',
      sdk.completionModel.bind(sdk),
      wrapLanguageModel,
    ),
    embeddingModel: adaptMethod(
      'togetherai.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'togetherai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    image: adaptMethod('togetherai.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'togetherai.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    reranking: adaptMethod(
      'togetherai.reranking',
      sdk.reranking.bind(sdk),
      wrapRerankingModel,
    ),
    rerankingModel: adaptMethod(
      'togetherai.rerankingModel',
      sdk.rerankingModel.bind(sdk),
      wrapRerankingModel,
    ),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for Together AI.
 */
export type TogetherAIProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Together AI options and allow `apiKey` to resolve through Effect when
 * the SDK requests the value.
 */
export type TogetherAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Together AI provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createTogetherAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  TogetherAIProvider
>('createTogetherAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateTogetherAI(settings)),
);
/**
 * Adapt the preconfigured provider from the Together AI SDK. Use the factory to supply
 * explicit settings.
 */
export const togetherai: TogetherAIProvider = wrapProvider(sdkTogetherai);
