import {
  createVercel as sdkCreateVercel,
  vercel as sdkVercel,
} from '@ai-sdk/vercel';
import type { VercelProvider as SdkProvider } from '@ai-sdk/vercel';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/vercel';
export type { VercelErrorData, VercelProviderSettings } from '@ai-sdk/vercel';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('vercel', sdk, wrapLanguageModel), {
    ...wrapProviderBase('vercel', sdk),
    languageModel: adaptMethod(
      'vercel.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'vercel.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type VercelProvider = ReturnType<typeof wrapProvider>;
export const createVercel = (...args: Parameters<typeof sdkCreateVercel>) =>
  runSync('createVercel', () => wrapProvider(sdkCreateVercel(...args)));
export const vercel: VercelProvider = wrapProvider(sdkVercel);
