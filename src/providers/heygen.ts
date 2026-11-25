import {
  createHeyGen as sdkCreateHeyGen,
  heygen as sdkHeygen,
} from '@ai-sdk/heygen';
import type { HeyGenProvider as SdkProvider } from '@ai-sdk/heygen';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  wrapDecisionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/heygen';
export type {
  HeyGenDecisionModelId,
  HeyGenDecisionModelOptions,
  HeyGenProviderSettings,
  HeyGenVideoAsset,
  HeyGenVideoModelId,
  HeyGenVideoModelOptions,
} from '@ai-sdk/heygen';

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('heygen', sdk),
  video: adaptMethod('heygen.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'heygen.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
  decisionModel: adaptMethod(
    'heygen.decisionModel',
    sdk.decisionModel.bind(sdk),
    wrapDecisionModel,
  ),
});
export type HeyGenProvider = ReturnType<typeof wrapProvider>;
export const createHeyGen = (...args: Parameters<typeof sdkCreateHeyGen>) =>
  runSync('createHeyGen', () => wrapProvider(sdkCreateHeyGen(...args)));
export const heygen: HeyGenProvider = wrapProvider(sdkHeygen);
