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
export type BlackForestLabsProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type BlackForestLabsProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createBlackForestLabs = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  BlackForestLabsProvider
>('createBlackForestLabs', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateBlackForestLabs(settings)),
);
export const blackForestLabs: BlackForestLabsProvider =
  wrapProvider(sdkBlackForestLabs);
