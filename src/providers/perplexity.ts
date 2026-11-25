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
export type PerplexityProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type PerplexityProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createPerplexity = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  PerplexityProvider
>('createPerplexity', ['apiKey'], (settings) =>
  wrapProvider(sdkCreatePerplexity(settings)),
);
export const perplexity: PerplexityProvider = wrapProvider(sdkPerplexity);
