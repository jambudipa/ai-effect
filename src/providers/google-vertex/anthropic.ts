import { adaptProviderFactory } from '../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../internal/provider-settings.js';
import type { GoogleVertexAnthropicProviderSettings as SdkSettings } from '@ai-sdk/google-vertex/anthropic';
import { wrapProviderTools } from '../../internal/provider-tool.js';
import {
  createGoogleVertexAnthropic as sdkCreateGoogleVertexAnthropic,
  googleVertexAnthropic as sdkGoogleVertexAnthropic,
} from '@ai-sdk/google-vertex/anthropic';
import type { GoogleVertexAnthropicProvider as SdkProvider } from '@ai-sdk/google-vertex/anthropic';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../internal/language-model.js';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('googleVertexAnthropic', sdk, wrapLanguageModel), {
    ...wrapProviderBase('googleVertexAnthropic', sdk),
    languageModel: adaptMethod(
      'googleVertexAnthropic.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'googleVertexAnthropic.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    tools: wrapProviderTools('googleVertexAnthropic.tools', sdk.tools),
  });
export type GoogleVertexAnthropicProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'generateAuthToken' | 'headers';
export type GoogleVertexAnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createGoogleVertexAnthropic = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleVertexAnthropicProvider
>('createGoogleVertexAnthropic', ['generateAuthToken', 'headers'], (settings) =>
  wrapProvider(sdkCreateGoogleVertexAnthropic(settings)),
);
export const createVertexAnthropic = createGoogleVertexAnthropic;
export const googleVertexAnthropic: GoogleVertexAnthropicProvider =
  wrapProvider(sdkGoogleVertexAnthropic);
export const vertexAnthropic: GoogleVertexAnthropicProvider =
  googleVertexAnthropic;
