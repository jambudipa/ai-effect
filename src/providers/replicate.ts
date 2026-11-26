import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ReplicateProviderSettings as SdkSettings } from '@ai-sdk/replicate';
import {
  createReplicate as sdkCreateReplicate,
  replicate as sdkReplicate,
} from '@ai-sdk/replicate';
import type { ReplicateProvider as SdkProvider } from '@ai-sdk/replicate';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/replicate';
export type {
  ReplicateImageModelOptions,
  ReplicateImageProviderOptions,
  ReplicateVideoModelId,
  ReplicateVideoModelOptions,
  ReplicateVideoProviderOptions,
} from '@ai-sdk/replicate';

/** Adapt image and video model selection from the Replicate SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('replicate', sdk),
  image: adaptMethod('replicate.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'replicate.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  textEmbeddingModel: adaptUnsupportedMethod(
    'replicate.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
  video: adaptMethod('replicate.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'replicate.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Replicate. */
export type ReplicateProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiToken` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiToken';
/**
 * Keep the native Replicate options and allow `apiToken` to resolve through Effect when
 * the SDK requests the value.
 */
export type ReplicateProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Replicate provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiToken`.
 */
export const createReplicate = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ReplicateProvider
>('createReplicate', ['apiToken'], (settings) =>
  wrapProvider(sdkCreateReplicate(settings)),
);
/**
 * Adapt the preconfigured provider from the Replicate SDK. Use the factory to supply
 * explicit settings.
 */
export const replicate: ReplicateProvider = wrapProvider(sdkReplicate);
