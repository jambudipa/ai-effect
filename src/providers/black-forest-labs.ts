import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { BlackForestLabsProviderSettings as SdkSettings } from '@ai-sdk/black-forest-labs';
import {
  createBlackForestLabs as sdkCreateBlackForestLabs,
  blackForestLabs as sdkBlackForestLabs,
} from '@ai-sdk/black-forest-labs';
import type { BlackForestLabsProvider as SdkProvider } from '@ai-sdk/black-forest-labs';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/black-forest-labs';
export type {
  BlackForestLabsAspectRatio,
  BlackForestLabsImageModelId,
  BlackForestLabsImageModelOptions,
  BlackForestLabsImageProviderOptions,
  BlackForestLabsVideoModelId,
  BlackForestLabsVideoModelOptions,
} from '@ai-sdk/black-forest-labs';

/** Adapt image and video model selection from the Black Forest Labs SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('blackForestLabs', sdk),
  image: adaptMethod(
    'blackForestLabs.image',
    sdk.image.bind(sdk),
    wrapImageModel,
  ),
  imageModel: adaptMethod(
    'blackForestLabs.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  video: adaptMethod(
    'blackForestLabs.video',
    sdk.video.bind(sdk),
    wrapVideoModel,
  ),
  videoModel: adaptMethod(
    'blackForestLabs.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
  textEmbeddingModel: adaptUnsupportedMethod(
    'blackForestLabs.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
});
/**
 * Provider returned by the adapter, with Effect-based model selection for Black Forest
 * Labs.
 */
export type BlackForestLabsProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Black Forest Labs options and allow `apiKey` to resolve through Effect
 * when the SDK requests the value.
 */
export type BlackForestLabsProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Black Forest Labs provider inside an Effect. Keep the scope open when using
 * an Effect resolver for `apiKey`.
 */
export const createBlackForestLabs = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  BlackForestLabsProvider
>('createBlackForestLabs', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateBlackForestLabs(settings)),
);
/**
 * Adapt the preconfigured provider from the Black Forest Labs SDK. Use the factory to
 * supply explicit settings.
 */
export const blackForestLabs: BlackForestLabsProvider =
  wrapProvider(sdkBlackForestLabs);
