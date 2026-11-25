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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/replicate';
export type {
  ReplicateImageModelOptions,
  ReplicateImageProviderOptions,
  ReplicateProviderSettings,
  ReplicateVideoModelId,
  ReplicateVideoModelOptions,
  ReplicateVideoProviderOptions,
} from '@ai-sdk/replicate';

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
export type ReplicateProvider = ReturnType<typeof wrapProvider>;
export const createReplicate = (
  ...args: Parameters<typeof sdkCreateReplicate>
) =>
  runSync('createReplicate', () => wrapProvider(sdkCreateReplicate(...args)));
export const replicate: ReplicateProvider = wrapProvider(sdkReplicate);
