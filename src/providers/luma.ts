import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { LumaProviderSettings as SdkSettings } from '@ai-sdk/luma';
import { createLuma as sdkCreateLuma, luma as sdkLuma } from '@ai-sdk/luma';
import type { LumaProvider as SdkProvider } from '@ai-sdk/luma';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapImageModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/luma';
export type {
  LumaErrorData,
  LumaImageModelOptions,
  LumaImageProviderOptions,
} from '@ai-sdk/luma';

/** Adapt image model selection from the Luma SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('luma', sdk),
  image: adaptMethod('luma.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'luma.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  textEmbeddingModel: adaptUnsupportedMethod(
    'luma.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Luma. */
export type LumaProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Luma options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type LumaProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
/**
 * Construct the Luma provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createLuma = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  LumaProvider
>('createLuma', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateLuma(settings)),
);
/**
 * Adapt the preconfigured provider from the Luma SDK. Use the factory to supply explicit
 * settings.
 */
export const luma: LumaProvider = wrapProvider(sdkLuma);
