import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { MoonshotAIProviderSettings as SdkSettings } from '@ai-sdk/moonshotai';
import {
  createMoonshotAI as sdkCreateMoonshotAI,
  moonshotai as sdkMoonshotai,
} from '@ai-sdk/moonshotai';
import type { MoonshotAIProvider as SdkProvider } from '@ai-sdk/moonshotai';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';

export { VERSION } from '@ai-sdk/moonshotai';
export type {
  MoonshotAIAssistantMessageProviderOptions,
  MoonshotAIChatModelId,
  MoonshotAILanguageModelOptions,
  MoonshotAIMessageProviderOptions,
  MoonshotAIProviderOptions,
  MoonshotAISystemMessageProviderOptions,
} from '@ai-sdk/moonshotai';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('moonshotai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('moonshotai', sdk),
    chatModel: adaptMethod(
      'moonshotai.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    languageModel: adaptMethod(
      'moonshotai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
  });
export type MoonshotAIProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type MoonshotAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createMoonshotAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  MoonshotAIProvider
>('createMoonshotAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateMoonshotAI(settings)),
);
export const moonshotai: MoonshotAIProvider = wrapProvider(sdkMoonshotai);
