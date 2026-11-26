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

/** Adapt language and transcription model selection from the Groq SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for Groq. */
export type GroqProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Groq options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type GroqProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
/**
 * Construct the Groq provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createGroq = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GroqProvider
>('createGroq', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGroq(settings)),
);
/**
 * Adapt the preconfigured provider from the Groq SDK. Use the factory to supply explicit
 * settings.
 */
export const groq: GroqProvider = wrapProvider(sdkGroq);
/**
 * Build the Groq browser search tool descriptor lazily for use with a model that supports
 * it.
 */
export const browserSearch = adaptProviderTool(
  'groq.browserSearch',
  sdkBrowserSearch,
);
