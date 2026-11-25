import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import {
  createHeyGen as sdkCreateHeyGen,
  heygen as sdkHeygen,
  VERSION as sdkVersion,
} from '@ai-sdk/heygen';
import type {
  HeyGenProvider as SdkProvider,
  HeyGenProviderSettings as SdkSettings,
} from '../internal/provider-contracts/heygen.js';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  wrapDecisionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';

export const VERSION: string = sdkVersion;
export type {
  HeyGenDecisionModelId,
  HeyGenDecisionModelOptions,
  HeyGenVideoAsset,
  HeyGenVideoModelId,
  HeyGenVideoModelOptions,
} from '../internal/provider-contracts/heygen.js';

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
type ResolverKey = 'apiKey';
export type HeyGenProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createHeyGen = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  HeyGenProvider
>('createHeyGen', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateHeyGen(settings)),
);
export const heygen: HeyGenProvider = wrapProvider(sdkHeygen);
