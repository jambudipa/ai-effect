import {
  createGmicloud as sdkCreateGmicloud,
  gmicloud as sdkGmicloud,
} from '@ai-sdk/gmicloud';
import type { GmicloudProvider as SdkProvider } from '@ai-sdk/gmicloud';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/gmicloud';
export type {
  GmicloudErrorData,
  GmicloudProviderSettings,
} from '@ai-sdk/gmicloud';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('gmicloud', sdk, wrapLanguageModel), {
    ...wrapProviderBase('gmicloud', sdk),
    languageModel: adaptMethod(
      'gmicloud.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('gmicloud.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    textEmbeddingModel: adaptUnsupportedMethod(
      'gmicloud.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type GmicloudProvider = ReturnType<typeof wrapProvider>;
export const createGmicloud = (...args: Parameters<typeof sdkCreateGmicloud>) =>
  runSync('createGmicloud', () => wrapProvider(sdkCreateGmicloud(...args)));
export const gmicloud: GmicloudProvider = wrapProvider(sdkGmicloud);
