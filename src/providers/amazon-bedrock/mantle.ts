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
export type BedrockMantleProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey' | 'credentialProvider';
export type BedrockMantleProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createBedrockMantle = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  BedrockMantleProvider
>('createBedrockMantle', ['apiKey', 'credentialProvider'], (settings) =>
  wrapProvider(sdkCreateBedrockMantle(settings)),
);
export const bedrockMantle: BedrockMantleProvider =
  wrapProvider(sdkBedrockMantle);
