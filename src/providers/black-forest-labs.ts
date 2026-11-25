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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/black-forest-labs';
export type {
  BlackForestLabsAspectRatio,
  BlackForestLabsImageModelId,
  BlackForestLabsImageModelOptions,
  BlackForestLabsImageProviderOptions,
  BlackForestLabsProviderSettings,
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
export const createBlackForestLabs = (
  ...args: Parameters<typeof sdkCreateBlackForestLabs>
) =>
  runSync('createBlackForestLabs', () =>
    wrapProvider(sdkCreateBlackForestLabs(...args)),
  );
export const blackForestLabs: BlackForestLabsProvider =
  wrapProvider(sdkBlackForestLabs);
