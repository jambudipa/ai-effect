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

/** Adapt embedding and reranking model selection from the Voyage AI SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for Voyage AI. */
export type VoyageProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Voyage AI options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type VoyageProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Voyage AI provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createVoyage = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  VoyageProvider
>('createVoyage', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateVoyage(settings)),
);
/**
 * Adapt the preconfigured provider from the Voyage AI SDK. Use the factory to supply
 * explicit settings.
 */
export const voyage: VoyageProvider = wrapProvider(sdkVoyage);
