import { adaptProviderFactory } from '../../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../../internal/provider-settings.js';
import type { GoogleVertexXaiProviderSettings as SdkSettings } from '@ai-sdk/google-vertex/xai/edge';
import {
  createGoogleVertexXai as sdkCreateGoogleVertexXai,
  googleVertexXai as sdkGoogleVertexXai,
} from '@ai-sdk/google-vertex/xai/edge';
import type { GoogleVertexXaiProvider as SdkProvider } from '@ai-sdk/google-vertex/xai/edge';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../../internal/language-model.js';

export type { GoogleVertexXaiModelId } from '@ai-sdk/google-vertex/xai/edge';

/** Adapt language model selection from the edge xAI on Vertex AI SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('googleVertexXai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('googleVertexXai', sdk),
    languageModel: adaptMethod(
      'googleVertexXai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chatModel: adaptMethod(
      'googleVertexXai.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'googleVertexXai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for xAI on Vertex
 * AI.
 */
export type GoogleVertexXaiProvider = ReturnType<typeof wrapProvider>;
/** Reserve `headers` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'headers';
/**
 * Keep the native xAI on Vertex AI options and allow `headers` to resolve through Effect
 * when the SDK requests the value.
 */
export type GoogleVertexXaiProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the xAI on Vertex AI provider inside an Effect. Keep the scope open when using
 * an Effect resolver for `headers`.
 */
export const createGoogleVertexXai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleVertexXaiProvider
>('createGoogleVertexXai', ['headers'], (settings) =>
  wrapProvider(sdkCreateGoogleVertexXai(settings)),
);
/**
 * Adapt the preconfigured provider from the edge xAI on Vertex AI SDK. Use the factory to
 * supply explicit settings.
 */
export const googleVertexXai: GoogleVertexXaiProvider =
  wrapProvider(sdkGoogleVertexXai);
