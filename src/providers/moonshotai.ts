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

/** Adapt language model selection from the Moonshot AI SDK to Effect. */
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
/**
 * Provider returned by the adapter, with Effect-based model selection for Moonshot AI.
 */
export type MoonshotAIProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Moonshot AI options and allow `apiKey` to resolve through Effect when
 * the SDK requests the value.
 */
export type MoonshotAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Moonshot AI provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createMoonshotAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  MoonshotAIProvider
>('createMoonshotAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateMoonshotAI(settings)),
);
/**
 * Adapt the preconfigured provider from the Moonshot AI SDK. Use the factory to supply
 * explicit settings.
 */
export const moonshotai: MoonshotAIProvider = wrapProvider(sdkMoonshotai);
