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

/** Adapt language model selection from the Anthropic on Vertex AI SDK to Effect. */
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
/**
 * Provider returned by the adapter, with Effect-based model selection for Anthropic on
 * Vertex AI.
 */
export type GoogleVertexAnthropicProvider = ReturnType<typeof wrapProvider>;
/**
 * Reserve `generateAuthToken` and `headers` for settings the SDK may read through lazy
 * Effect resolvers.
 */
type ResolverKey = 'generateAuthToken' | 'headers';
/**
 * Keep the native Anthropic on Vertex AI options and allow the SDK to obtain
 * `generateAuthToken` and `headers` through Effect resolvers.
 */
export type GoogleVertexAnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Anthropic on Vertex AI provider inside an Effect. Keep the scope open when
 * using an Effect resolver for `generateAuthToken` and `headers`.
 */
export const createGoogleVertexAnthropic = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleVertexAnthropicProvider
>('createGoogleVertexAnthropic', ['generateAuthToken', 'headers'], (settings) =>
  wrapProvider(sdkCreateGoogleVertexAnthropic(settings)),
);
/**
 * Expose the same Anthropic on Vertex AI factory as `createGoogleVertexAnthropic` under
 * the SDK alias.
 */
export const createVertexAnthropic = createGoogleVertexAnthropic;
/**
 * Adapt the preconfigured provider from the Anthropic on Vertex AI SDK. Use the factory
 * to supply explicit settings.
 */
export const googleVertexAnthropic: GoogleVertexAnthropicProvider =
  wrapProvider(sdkGoogleVertexAnthropic);
/**
 * Expose the same Anthropic on Vertex AI provider as `googleVertexAnthropic` under the SDK
 * alias.
 */
export const vertexAnthropic: GoogleVertexAnthropicProvider =
  googleVertexAnthropic;
