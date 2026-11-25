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
export type TopazProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type TopazProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createTopaz = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  TopazProvider
>('createTopaz', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateTopaz(settings)),
);
export const topaz: TopazProvider = wrapProvider(sdkTopaz);
