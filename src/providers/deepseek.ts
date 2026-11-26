import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { DeepSeekProviderSettings as SdkSettings } from '@ai-sdk/deepseek';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createDeepSeek as sdkCreateDeepSeek,
  deepSeek as sdkDeepSeek,
} from '@ai-sdk/deepseek';
import type { DeepSeekProvider as SdkProvider } from '@ai-sdk/deepseek';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapFiles } from '../internal/provider-resource.js';

export { VERSION } from '@ai-sdk/deepseek';
export type {
  DeepSeekAssistantMessageProviderOptions,
  DeepSeekChatOptions,
  DeepSeekErrorData,
  DeepSeekFilePartProviderOptions,
  DeepSeekFilesOptions,
  DeepSeekLanguageModelChatOptions,
  DeepSeekLanguageModelOptions,
  DeepSeekLanguageModelResponsesOptions,
  DeepSeekMessageProviderOptions,
} from '@ai-sdk/deepseek';

/** Adapt language model selection from the DeepSeek SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('deepSeek', sdk, wrapLanguageModel), {
    ...wrapProviderBase('deepSeek', sdk),
    languageModel: adaptMethod(
      'deepSeek.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('deepSeek.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    responses: adaptMethod(
      'deepSeek.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    files: adaptMethod('deepSeek.files', sdk.files.bind(sdk), wrapFiles),
    textEmbeddingModel: adaptUnsupportedMethod(
      'deepSeek.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    tools: wrapProviderTools('deepSeek.tools', sdk.tools),
  });
/** Provider returned by the adapter, with Effect-based model selection for DeepSeek. */
export type DeepSeekProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native DeepSeek options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type DeepSeekProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the DeepSeek provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createDeepSeek = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  DeepSeekProvider
>('createDeepSeek', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateDeepSeek(settings)),
);
/**
 * Adapt the preconfigured provider from the DeepSeek SDK. Use the factory to supply
 * explicit settings.
 */
export const deepSeek: DeepSeekProvider = wrapProvider(sdkDeepSeek);
/** Expose the same DeepSeek provider as `deepSeek` under the SDK alias. */
export const deepseek: DeepSeekProvider = deepSeek;
