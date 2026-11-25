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
import { runSync } from '../../../internal/operation.js';

export type {
  GoogleVertexXaiModelId,
  GoogleVertexXaiProviderSettings,
} from '@ai-sdk/google-vertex/xai/edge';

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
export const createGoogleVertexXai = (
  ...args: Parameters<typeof sdkCreateGoogleVertexXai>
) =>
  runSync('createGoogleVertexXai', () =>
    wrapProvider(sdkCreateGoogleVertexXai(...args)),
  );
export const googleVertexXai: GoogleVertexXaiProvider =
  wrapProvider(sdkGoogleVertexXai);
