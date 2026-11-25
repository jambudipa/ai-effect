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
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/bytedance';
export type {
  ByteDanceImageModelId,
  ByteDanceImageModelOptions,
  ByteDanceVideoModelId,
  ByteDanceVideoModelOptions,
  ByteDanceVideoProviderOptions,
} from '@ai-sdk/bytedance';

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
export type ByteDanceProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type ByteDanceProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createByteDance = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ByteDanceProvider
>('createByteDance', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateByteDance(settings)),
);
export const byteDance: ByteDanceProvider = wrapProvider(sdkByteDance);
export const ByteDanceImageModel: AdaptedConstructor<
  typeof SdkByteDanceImageModel,
  ByteDanceImageModel
> = adaptModelConstructor(
  'ByteDanceImageModel',
  SdkByteDanceImageModel,
  wrapImageModel,
);
export type ByteDanceImageModel = ReturnType<typeof wrapImageModel>;
