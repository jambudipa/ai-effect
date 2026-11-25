import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { VoyageProviderSettings as SdkSettings } from '@ai-sdk/voyage';
import {
  createVoyage as sdkCreateVoyage,
  voyage as sdkVoyage,
} from '@ai-sdk/voyage';
import type { VoyageProvider as SdkProvider } from '@ai-sdk/voyage';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  wrapEmbeddingModel,
  wrapRerankingModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/voyage';
export type {
  VoyageEmbeddingModelOptions,
  VoyageRerankingModelOptions,
} from '@ai-sdk/voyage';

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('voyage', sdk),
  embedding: adaptMethod(
    'voyage.embedding',
    sdk.embedding.bind(sdk),
    wrapEmbeddingModel,
  ),
  embeddingModel: adaptMethod(
    'voyage.embeddingModel',
    sdk.embeddingModel.bind(sdk),
    wrapEmbeddingModel,
  ),
  textEmbedding: adaptMethod(
    'voyage.textEmbedding',
    sdk.textEmbedding.bind(sdk),
    wrapEmbeddingModel,
  ),
  textEmbeddingModel: adaptMethod(
    'voyage.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
    wrapEmbeddingModel,
  ),
  reranking: adaptMethod(
    'voyage.reranking',
    sdk.reranking.bind(sdk),
    wrapRerankingModel,
  ),
  rerankingModel: adaptMethod(
    'voyage.rerankingModel',
    sdk.rerankingModel.bind(sdk),
    wrapRerankingModel,
  ),
});
export type VoyageProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type VoyageProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createVoyage = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  VoyageProvider
>('createVoyage', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateVoyage(settings)),
);
export const voyage: VoyageProvider = wrapProvider(sdkVoyage);
