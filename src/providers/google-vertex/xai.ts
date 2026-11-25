import { adaptProviderFactory } from '../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../internal/provider-settings.js';
import type { GoogleVertexXaiProviderSettings as SdkSettings } from '@ai-sdk/google-vertex/xai';
import {
  createGoogleVertexXai as sdkCreateGoogleVertexXai,
  googleVertexXai as sdkGoogleVertexXai,
} from '@ai-sdk/google-vertex/xai';
import type { GoogleVertexXaiProvider as SdkProvider } from '@ai-sdk/google-vertex/xai';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../internal/language-model.js';

export type { GoogleVertexXaiModelId } from '@ai-sdk/google-vertex/xai';

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
export type GoogleVertexXaiProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'headers';
export type GoogleVertexXaiProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createGoogleVertexXai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleVertexXaiProvider
>('createGoogleVertexXai', ['headers'], (settings) =>
  wrapProvider(sdkCreateGoogleVertexXai(settings)),
);
export const googleVertexXai: GoogleVertexXaiProvider =
  wrapProvider(sdkGoogleVertexXai);
