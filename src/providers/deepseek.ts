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
export type DeepSeekProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type DeepSeekProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createDeepSeek = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  DeepSeekProvider
>('createDeepSeek', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateDeepSeek(settings)),
);
export const deepSeek: DeepSeekProvider = wrapProvider(sdkDeepSeek);
export const deepseek: DeepSeekProvider = deepSeek;
