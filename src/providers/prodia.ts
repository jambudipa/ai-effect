import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ProdiaProviderSettings as SdkSettings } from '@ai-sdk/prodia';
import {
  createProdia as sdkCreateProdia,
  prodia as sdkProdia,
} from '@ai-sdk/prodia';
import type { ProdiaProvider as SdkProvider } from '@ai-sdk/prodia';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/prodia';
export type {
  ProdiaImageModelId,
  ProdiaImageModelOptions,
  ProdiaImageProviderOptions,
  ProdiaLanguageModelId,
  ProdiaLanguageModelOptions,
  ProdiaVideoModelId,
  ProdiaVideoModelOptions,
} from '@ai-sdk/prodia';

/** Adapt language, image, and video model selection from the Prodia SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('prodia', sdk),
  languageModel: adaptMethod(
    'prodia.languageModel',
    sdk.languageModel.bind(sdk),
    wrapLanguageModel,
  ),
  image: adaptMethod('prodia.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'prodia.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  video: adaptMethod('prodia.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'prodia.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
  textEmbeddingModel: adaptUnsupportedMethod(
    'prodia.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Prodia. */
export type ProdiaProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Prodia options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type ProdiaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Prodia provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createProdia = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ProdiaProvider
>('createProdia', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateProdia(settings)),
);
/**
 * Adapt the preconfigured provider from the Prodia SDK. Use the factory to supply
 * explicit settings.
 */
export const prodia: ProdiaProvider = wrapProvider(sdkProdia);
