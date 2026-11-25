import { createZai as sdkCreateZai, zai as sdkZai } from '@ai-sdk/zai';
import type { ZaiProvider as SdkProvider } from '@ai-sdk/zai';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/zai';
export type {
  ZaiChatModelId,
  ZaiErrorData,
  ZaiLanguageModelChatOptions,
  ZaiProviderSettings,
} from '@ai-sdk/zai';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('zai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('zai', sdk),
    languageModel: adaptMethod(
      'zai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('zai.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    textEmbeddingModel: adaptUnsupportedMethod(
      'zai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type ZaiProvider = ReturnType<typeof wrapProvider>;
export const createZai = (...args: Parameters<typeof sdkCreateZai>) =>
  runSync('createZai', () => wrapProvider(sdkCreateZai(...args)));
export const zai: ZaiProvider = wrapProvider(sdkZai);
