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

/** Adapt language model selection from the Z.ai SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for Z.ai. */
export type ZaiProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Z.ai options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type ZaiProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
/**
 * Construct the Z.ai provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createZai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ZaiProvider
>('createZai', ['apiKey'], (settings) => wrapProvider(sdkCreateZai(settings)));
/**
 * Adapt the preconfigured provider from the Z.ai SDK. Use the factory to supply explicit
 * settings.
 */
export const zai: ZaiProvider = wrapProvider(sdkZai);
