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

/** Adapt language model selection from the Vercel SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for Vercel. */
export type VercelProvider = ReturnType<typeof wrapProvider>;
/**
 * Construct the Vercel provider lazily with the native SDK arguments and map SDK
 * construction failures.
 */
export const createVercel = (...args: Parameters<typeof sdkCreateVercel>) =>
  runSync('createVercel', () => wrapProvider(sdkCreateVercel(...args)));
/**
 * Adapt the preconfigured provider from the Vercel SDK. Use the factory to supply
 * explicit settings.
 */
export const vercel: VercelProvider = wrapProvider(sdkVercel);
