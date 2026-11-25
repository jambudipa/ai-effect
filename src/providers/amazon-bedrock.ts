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
export type AmazonBedrockProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey' | 'credentialProvider';
export type AmazonBedrockProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createAmazonBedrock = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AmazonBedrockProvider
>('createAmazonBedrock', ['apiKey', 'credentialProvider'], (settings) =>
  wrapProvider(sdkCreateAmazonBedrock(settings)),
);
export const amazonBedrock: AmazonBedrockProvider =
  wrapProvider(sdkAmazonBedrock);
export const bedrock: AmazonBedrockProvider = amazonBedrock;
