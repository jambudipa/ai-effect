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
export type LumaProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type LumaProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
export const createLuma = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  LumaProvider
>('createLuma', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateLuma(settings)),
);
export const luma: LumaProvider = wrapProvider(sdkLuma);
