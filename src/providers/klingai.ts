import {
  createKlingAI as sdkCreateKlingAI,
  klingai as sdkKlingai,
} from '@ai-sdk/klingai';
import type { KlingAIProvider as SdkProvider } from '@ai-sdk/klingai';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapVideoModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/klingai';
export type {
  KlingAIProviderSettings,
  KlingAIVideoModelId,
  KlingAIVideoModelOptions,
  KlingAIVideoProviderOptions,
} from '@ai-sdk/klingai';

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('klingai', sdk),
  video: adaptMethod('klingai.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'klingai.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
});
export type KlingAIProvider = ReturnType<typeof wrapProvider>;
export const createKlingAI = (...args: Parameters<typeof sdkCreateKlingAI>) =>
  runSync('createKlingAI', () => wrapProvider(sdkCreateKlingAI(...args)));
export const klingai: KlingAIProvider = wrapProvider(sdkKlingai);
