import {
  createTopaz as sdkCreateTopaz,
  topaz as sdkTopaz,
} from '@ai-sdk/topaz';
import type { TopazProvider as SdkProvider } from '@ai-sdk/topaz';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/topaz';
export type {
  TopazImageModelId,
  TopazImageModelOptions,
  TopazProviderSettings,
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
export const createTopaz = (...args: Parameters<typeof sdkCreateTopaz>) =>
  runSync('createTopaz', () => wrapProvider(sdkCreateTopaz(...args)));
export const topaz: TopazProvider = wrapProvider(sdkTopaz);
