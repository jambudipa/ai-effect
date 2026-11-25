import { createLuma as sdkCreateLuma, luma as sdkLuma } from '@ai-sdk/luma';
import type { LumaProvider as SdkProvider } from '@ai-sdk/luma';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapImageModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/luma';
export type {
  LumaErrorData,
  LumaImageModelOptions,
  LumaImageProviderOptions,
  LumaProviderSettings,
} from '@ai-sdk/luma';

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('luma', sdk),
  image: adaptMethod('luma.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'luma.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  textEmbeddingModel: adaptUnsupportedMethod(
    'luma.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
});
export type LumaProvider = ReturnType<typeof wrapProvider>;
export const createLuma = (...args: Parameters<typeof sdkCreateLuma>) =>
  runSync('createLuma', () => wrapProvider(sdkCreateLuma(...args)));
export const luma: LumaProvider = wrapProvider(sdkLuma);
