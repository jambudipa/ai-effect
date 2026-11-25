import { adaptProviderFactory } from '../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../internal/provider-settings.js';
import type { AmazonBedrockAnthropicProviderSettings as SdkSettings } from '@ai-sdk/amazon-bedrock/anthropic';
import { wrapProviderTools } from '../../internal/provider-tool.js';
import {
  createAmazonBedrockAnthropic as sdkCreateAmazonBedrockAnthropic,
  amazonBedrockAnthropic as sdkAmazonBedrockAnthropic,
} from '@ai-sdk/amazon-bedrock/anthropic';
import type { AmazonBedrockAnthropicProvider as SdkProvider } from '@ai-sdk/amazon-bedrock/anthropic';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../internal/language-model.js';

export type {
  AmazonBedrockAnthropicModelId,
  BedrockAnthropicModelId,
} from '@ai-sdk/amazon-bedrock/anthropic';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('amazonBedrockAnthropic', sdk, wrapLanguageModel), {
    ...wrapProviderBase('amazonBedrockAnthropic', sdk),
    languageModel: adaptMethod(
      'amazonBedrockAnthropic.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'amazonBedrockAnthropic.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    tools: wrapProviderTools('amazonBedrockAnthropic.tools', sdk.tools),
  });
export type AmazonBedrockAnthropicProvider = ReturnType<typeof wrapProvider>;
export type BedrockAnthropicProvider = AmazonBedrockAnthropicProvider;
type ResolverKey = 'apiKey' | 'credentialProvider' | 'headers';
export type AmazonBedrockAnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export type BedrockAnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createAmazonBedrockAnthropic = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AmazonBedrockAnthropicProvider
>(
  'createAmazonBedrockAnthropic',
  ['apiKey', 'credentialProvider', 'headers'],
  (settings) => wrapProvider(sdkCreateAmazonBedrockAnthropic(settings)),
);
export const createBedrockAnthropic = createAmazonBedrockAnthropic;
export const amazonBedrockAnthropic: AmazonBedrockAnthropicProvider =
  wrapProvider(sdkAmazonBedrockAnthropic);
export const bedrockAnthropic: AmazonBedrockAnthropicProvider =
  amazonBedrockAnthropic;
