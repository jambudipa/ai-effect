import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ZaiProviderSettings as SdkSettings } from '@ai-sdk/zai';
import { createZai as sdkCreateZai, zai as sdkZai } from '@ai-sdk/zai';
import type { ZaiProvider as SdkProvider } from '@ai-sdk/zai';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';

export { VERSION } from '@ai-sdk/zai';
export type {
  ZaiChatModelId,
  ZaiErrorData,
  ZaiLanguageModelChatOptions,
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
type ResolverKey = 'apiKey';
export type ZaiProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
export const createZai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ZaiProvider
>('createZai', ['apiKey'], (settings) => wrapProvider(sdkCreateZai(settings)));
export const zai: ZaiProvider = wrapProvider(sdkZai);
