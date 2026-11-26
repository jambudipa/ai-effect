import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { PerplexityProviderSettings as SdkSettings } from '@ai-sdk/perplexity';
import {
  createPerplexity as sdkCreatePerplexity,
  perplexity as sdkPerplexity,
} from '@ai-sdk/perplexity';
import type { PerplexityProvider as SdkProvider } from '@ai-sdk/perplexity';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  wrapDecisionModel,
  wrapEmbeddingModel,
} from '../internal/provider-model.js';
import { wrapLanguageModel } from '../internal/language-model.js';

export { VERSION } from '@ai-sdk/perplexity';
export type {
  PerplexityAgentPreset,
  PerplexityDecisionModelId,
  PerplexityDecisionModelOptions,
  PerplexityEmbeddingModelId,
  PerplexityEmbeddingModelOptions,
  PerplexityLanguageModelId,
  PerplexityLanguageModelOptions,
} from '@ai-sdk/perplexity';

/**
 * Adapt language, embedding, and decision model selection from the Perplexity SDK to
 * Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('perplexity', sdk, wrapLanguageModel), {
    ...wrapProviderBase('perplexity', sdk),
    decisionModel: adaptMethod(
      'perplexity.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
    languageModel: adaptMethod(
      'perplexity.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'perplexity.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'perplexity.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'perplexity.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for Perplexity. */
export type PerplexityProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Perplexity options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type PerplexityProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Perplexity provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createPerplexity = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  PerplexityProvider
>('createPerplexity', ['apiKey'], (settings) =>
  wrapProvider(sdkCreatePerplexity(settings)),
);
/**
 * Adapt the preconfigured provider from the Perplexity SDK. Use the factory to supply
 * explicit settings.
 */
export const perplexity: PerplexityProvider = wrapProvider(sdkPerplexity);
