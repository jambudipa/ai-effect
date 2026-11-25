import {
  createMoonshotAI as sdkCreateMoonshotAI,
  moonshotai as sdkMoonshotai,
} from '@ai-sdk/moonshotai';
import type { MoonshotAIProvider as SdkProvider } from '@ai-sdk/moonshotai';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/moonshotai';
export type {
  MoonshotAIAssistantMessageProviderOptions,
  MoonshotAIChatModelId,
  MoonshotAILanguageModelOptions,
  MoonshotAIMessageProviderOptions,
  MoonshotAIProviderOptions,
  MoonshotAIProviderSettings,
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
export const createMoonshotAI = (
  ...args: Parameters<typeof sdkCreateMoonshotAI>
) =>
  runSync('createMoonshotAI', () => wrapProvider(sdkCreateMoonshotAI(...args)));
export const moonshotai: MoonshotAIProvider = wrapProvider(sdkMoonshotai);
