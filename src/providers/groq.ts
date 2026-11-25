import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { GroqProviderSettings as SdkSettings } from '@ai-sdk/groq';
import { browserSearch as sdkBrowserSearch } from '@ai-sdk/groq';
import {
  adaptProviderTool,
  wrapProviderTools,
} from '../internal/provider-tool.js';
import { createGroq as sdkCreateGroq, groq as sdkGroq } from '@ai-sdk/groq';
import type { GroqProvider as SdkProvider } from '@ai-sdk/groq';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapTranscriptionModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/groq';
export type {
  GroqLanguageModelChatOptions,
  GroqLanguageModelOptions,
  GroqProviderOptions,
  GroqTranscriptionModelOptions,
} from '@ai-sdk/groq';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('groq', sdk, wrapLanguageModel), {
    ...wrapProviderBase('groq', sdk),
    languageModel: adaptMethod(
      'groq.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    transcription: adaptMethod(
      'groq.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'groq.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    tools: wrapProviderTools('groq.tools', sdk.tools),
  });
export type GroqProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type GroqProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
export const createGroq = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GroqProvider
>('createGroq', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGroq(settings)),
);
export const groq: GroqProvider = wrapProvider(sdkGroq);
export const browserSearch = adaptProviderTool(
  'groq.browserSearch',
  sdkBrowserSearch,
);
