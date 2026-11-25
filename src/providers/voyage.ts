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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/voyage';
export type {
  VoyageEmbeddingModelOptions,
  VoyageProviderSettings,
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
export const createVoyage = (...args: Parameters<typeof sdkCreateVoyage>) =>
  runSync('createVoyage', () => wrapProvider(sdkCreateVoyage(...args)));
export const voyage: VoyageProvider = wrapProvider(sdkVoyage);
