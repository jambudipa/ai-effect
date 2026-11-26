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

/** Adapt language model selection from the Bedrock Anthropic SDK to Effect. */
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
/**
 * Provider returned by the adapter, with Effect-based model selection for Bedrock
 * Anthropic.
 */
export type AmazonBedrockAnthropicProvider = ReturnType<typeof wrapProvider>;
/**
 * Expose the same Bedrock Anthropic contract as `AmazonBedrockAnthropicProvider` under the
 * SDK alias.
 */
export type BedrockAnthropicProvider = AmazonBedrockAnthropicProvider;
/**
 * Reserve `apiKey`, `credentialProvider`, and `headers` for settings the SDK may read
 * through lazy Effect resolvers.
 */
type ResolverKey = 'apiKey' | 'credentialProvider' | 'headers';
/**
 * Keep the native Bedrock Anthropic options and allow the SDK to obtain `apiKey`,
 * `credentialProvider`, and `headers` through Effect resolvers.
 */
export type AmazonBedrockAnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Keep the native Bedrock Anthropic options and allow the SDK to obtain `apiKey`,
 * `credentialProvider`, and `headers` through Effect resolvers.
 */
export type BedrockAnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Bedrock Anthropic provider inside an Effect. Keep the scope open when using
 * an Effect resolver for `apiKey`, `credentialProvider`, and `headers`.
 */
export const createAmazonBedrockAnthropic = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AmazonBedrockAnthropicProvider
>(
  'createAmazonBedrockAnthropic',
  ['apiKey', 'credentialProvider', 'headers'],
  (settings) => wrapProvider(sdkCreateAmazonBedrockAnthropic(settings)),
);
/**
 * Expose the same Bedrock Anthropic factory as `createAmazonBedrockAnthropic` under the
 * SDK alias.
 */
export const createBedrockAnthropic = createAmazonBedrockAnthropic;
/**
 * Adapt the preconfigured provider from the Bedrock Anthropic SDK. Use the factory to
 * supply explicit settings.
 */
export const amazonBedrockAnthropic: AmazonBedrockAnthropicProvider =
  wrapProvider(sdkAmazonBedrockAnthropic);
/**
 * Expose the same Bedrock Anthropic provider as `amazonBedrockAnthropic` under the SDK
 * alias.
 */
export const bedrockAnthropic: AmazonBedrockAnthropicProvider =
  amazonBedrockAnthropic;
