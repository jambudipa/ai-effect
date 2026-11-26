import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ByteDanceProviderSettings as SdkSettings } from '@ai-sdk/bytedance';
import type { AdaptedConstructor } from '../internal/provider-adapter.js';
import { ByteDanceImageModel as SdkByteDanceImageModel } from '@ai-sdk/bytedance';
import {
  createByteDance as sdkCreateByteDance,
  byteDance as sdkByteDance,
} from '@ai-sdk/bytedance';
import type { ByteDanceProvider as SdkProvider } from '@ai-sdk/bytedance';
import {
  adaptMethod,
  adaptModelConstructor,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import {
  wrapFixedImageModel,
  wrapImageModel,
  wrapVideoModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/bytedance';
export type {
  ByteDanceImageModelId,
  ByteDanceImageModelOptions,
  ByteDanceVideoModelId,
  ByteDanceVideoModelOptions,
  ByteDanceVideoProviderOptions,
} from '@ai-sdk/bytedance';

/** Adapt image and video model selection from the ByteDance SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('byteDance', sdk),
  video: adaptMethod('byteDance.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'byteDance.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
  image: adaptMethod('byteDance.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'byteDance.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for ByteDance. */
export type ByteDanceProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native ByteDance options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type ByteDanceProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the ByteDance provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createByteDance = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ByteDanceProvider
>('createByteDance', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateByteDance(settings)),
);
/**
 * Adapt the preconfigured provider from the ByteDance SDK. Use the factory to supply
 * explicit settings.
 */
export const byteDance: ByteDanceProvider = wrapProvider(sdkByteDance);
/** Construct the SDK ByteDance image model lazily with its native options. */
export const ByteDanceImageModel: AdaptedConstructor<
  typeof SdkByteDanceImageModel,
  ByteDanceImageModel
> = adaptModelConstructor(
  'ByteDanceImageModel',
  SdkByteDanceImageModel,
  wrapFixedImageModel,
);
/**
 * Effect model returned by `ByteDanceImageModel`. Use its image generation operations in
 * an Effect program.
 */
export type ByteDanceImageModel = ReturnType<
  typeof wrapFixedImageModel<SdkByteDanceImageModel['maxImagesPerCall']>
>;
