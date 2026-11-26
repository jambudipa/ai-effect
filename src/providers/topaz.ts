import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { TopazProviderSettings as SdkSettings } from '@ai-sdk/topaz';
import {
  createTopaz as sdkCreateTopaz,
  topaz as sdkTopaz,
} from '@ai-sdk/topaz';
import type { TopazProvider as SdkProvider } from '@ai-sdk/topaz';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/topaz';
export type {
  TopazImageModelId,
  TopazImageModelOptions,
  TopazVideoModelId,
  TopazVideoModelOptions,
  TopazVideoOutput,
  TopazVideoSource,
} from '@ai-sdk/topaz';

/** Adapt image and video model selection from the Topaz SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('topaz', sdk),
  image: adaptMethod('topaz.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'topaz.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  video: adaptMethod('topaz.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'topaz.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Topaz. */
export type TopazProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Topaz options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type TopazProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Topaz provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createTopaz = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  TopazProvider
>('createTopaz', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateTopaz(settings)),
);
/**
 * Adapt the preconfigured provider from the Topaz SDK. Use the factory to supply explicit
 * settings.
 */
export const topaz: TopazProvider = wrapProvider(sdkTopaz);
