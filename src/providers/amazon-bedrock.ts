import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AmazonBedrockProviderSettings as SdkSettings } from '@ai-sdk/amazon-bedrock';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createAmazonBedrock as sdkCreateAmazonBedrock,
  amazonBedrock as sdkAmazonBedrock,
} from '@ai-sdk/amazon-bedrock';
import type { AmazonBedrockProvider as SdkProvider } from '@ai-sdk/amazon-bedrock';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapImageModel,
  wrapRerankingModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/amazon-bedrock';
export type {
  AmazonBedrockChatModelSettings,
  AmazonBedrockEmbeddingModelOptions,
  AmazonBedrockEmbeddingModelSettings,
  AmazonBedrockImageModelOptions,
  AmazonBedrockLanguageModelChatOptions,
  AmazonBedrockLanguageModelOptions,
  AmazonBedrockRerankingModelOptions,
  AnthropicProviderOptions,
  BedrockProviderOptions,
  BedrockRerankingOptions,
} from '@ai-sdk/amazon-bedrock';

/**
 * Adapt language, embedding, image, and reranking model selection from the Amazon Bedrock
 * SDK to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('amazonBedrock', sdk, wrapLanguageModel), {
    ...wrapProviderBase('amazonBedrock', sdk),
    languageModel: adaptMethod(
      'amazonBedrock.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'amazonBedrock.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'amazonBedrock.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbedding: adaptMethod(
      'amazonBedrock.textEmbedding',
      sdk.textEmbedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'amazonBedrock.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    image: adaptMethod(
      'amazonBedrock.image',
      sdk.image.bind(sdk),
      wrapImageModel,
    ),
    imageModel: adaptMethod(
      'amazonBedrock.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    reranking: adaptMethod(
      'amazonBedrock.reranking',
      sdk.reranking.bind(sdk),
      wrapRerankingModel,
    ),
    rerankingModel: adaptMethod(
      'amazonBedrock.rerankingModel',
      sdk.rerankingModel.bind(sdk),
      wrapRerankingModel,
    ),
    tools: wrapProviderTools('amazonBedrock.tools', sdk.tools),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for Amazon Bedrock.
 */
export type AmazonBedrockProvider = ReturnType<typeof wrapProvider>;
/**
 * Reserve `apiKey` and `credentialProvider` for settings the SDK may read through lazy
 * Effect resolvers.
 */
type ResolverKey = 'apiKey' | 'credentialProvider';
/**
 * Keep the native Amazon Bedrock options and allow the SDK to obtain `apiKey` and
 * `credentialProvider` through Effect resolvers.
 */
export type AmazonBedrockProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Amazon Bedrock provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey` and `credentialProvider`.
 */
export const createAmazonBedrock = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AmazonBedrockProvider
>('createAmazonBedrock', ['apiKey', 'credentialProvider'], (settings) =>
  wrapProvider(sdkCreateAmazonBedrock(settings)),
);
/**
 * Adapt the preconfigured provider from the Amazon Bedrock SDK. Use the factory to supply
 * explicit settings.
 */
export const amazonBedrock: AmazonBedrockProvider =
  wrapProvider(sdkAmazonBedrock);
/** Expose the same Amazon Bedrock provider as `amazonBedrock` under the SDK alias. */
export const bedrock: AmazonBedrockProvider = amazonBedrock;
