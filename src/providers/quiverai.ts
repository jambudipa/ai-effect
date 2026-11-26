import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { QuiverAIProviderSettings as SdkSettings } from '@ai-sdk/quiverai';
import { prepareQuiverAIImageReference as sdkPrepareReference } from '@ai-sdk/quiverai';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createQuiverAI as sdkCreateQuiverAI,
  quiverai as sdkQuiverai,
} from '@ai-sdk/quiverai';
import type { QuiverAIProvider as SdkProvider } from '@ai-sdk/quiverai';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapImageModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/quiverai';
export type {
  QuiverAICustomToolOptions,
  QuiverAIImageModelId,
  QuiverAIImageModelOptions,
  QuiverAIImageReference,
  QuiverAIImageReferenceInput,
  QuiverAILanguageModelId,
  QuiverAILanguageModelOptions,
} from '@ai-sdk/quiverai';

/** Adapt language and image model selection from the QuiverAI SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('quiverai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('quiverai', sdk),
    languageModel: adaptMethod(
      'quiverai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    image: adaptMethod('quiverai.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'quiverai.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'quiverai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    tools: wrapProviderTools('quiverai.tools', sdk.tools),
  });
/** Provider returned by the adapter, with Effect-based model selection for QuiverAI. */
export type QuiverAIProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native QuiverAI options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type QuiverAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the QuiverAI provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createQuiverAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  QuiverAIProvider
>('createQuiverAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateQuiverAI(settings)),
);
/**
 * Adapt the preconfigured provider from the QuiverAI SDK. Use the factory to supply
 * explicit settings.
 */
export const quiverai: QuiverAIProvider = wrapProvider(sdkQuiverai);
/**
 * Prepare a native QuiverAI image reference inside an Effect and map SDK preparation
 * failures.
 */
export const prepareQuiverAIImageReference = (
  ...args: Parameters<typeof sdkPrepareReference>
) =>
  runSync('prepareQuiverAIImageReference', () => sdkPrepareReference(...args));
