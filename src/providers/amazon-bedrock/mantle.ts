import { adaptProviderFactory } from '../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../internal/provider-settings.js';
import type { BedrockMantleProviderSettings as SdkSettings } from '@ai-sdk/amazon-bedrock/mantle';
import {
  createBedrockMantle as sdkCreateBedrockMantle,
  bedrockMantle as sdkBedrockMantle,
} from '@ai-sdk/amazon-bedrock/mantle';
import type { BedrockMantleProvider as SdkProvider } from '@ai-sdk/amazon-bedrock/mantle';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../internal/language-model.js';

export type { BedrockMantleModelId } from '@ai-sdk/amazon-bedrock/mantle';

/** Adapt language model selection from the Bedrock Mantle SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('bedrockMantle', sdk, wrapLanguageModel), {
    ...wrapProviderBase('bedrockMantle', sdk),
    languageModel: adaptMethod(
      'bedrockMantle.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod(
      'bedrockMantle.chat',
      sdk.chat.bind(sdk),
      wrapLanguageModel,
    ),
    responses: adaptMethod(
      'bedrockMantle.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'bedrockMantle.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for Bedrock Mantle.
 */
export type BedrockMantleProvider = ReturnType<typeof wrapProvider>;
/**
 * Reserve `apiKey` and `credentialProvider` for settings the SDK may read through lazy
 * Effect resolvers.
 */
type ResolverKey = 'apiKey' | 'credentialProvider';
/**
 * Keep the native Bedrock Mantle options and allow the SDK to obtain `apiKey` and
 * `credentialProvider` through Effect resolvers.
 */
export type BedrockMantleProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Bedrock Mantle provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey` and `credentialProvider`.
 */
export const createBedrockMantle = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  BedrockMantleProvider
>('createBedrockMantle', ['apiKey', 'credentialProvider'], (settings) =>
  wrapProvider(sdkCreateBedrockMantle(settings)),
);
/**
 * Adapt the preconfigured provider from the Bedrock Mantle SDK. Use the factory to supply
 * explicit settings.
 */
export const bedrockMantle: BedrockMantleProvider =
  wrapProvider(sdkBedrockMantle);
