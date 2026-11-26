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

/** Expose the version of the HeyGen SDK used by this adapter. */
export const VERSION: string = sdkVersion;
export type {
  HeyGenDecisionModelId,
  HeyGenDecisionModelOptions,
  HeyGenVideoAsset,
  HeyGenVideoModelId,
  HeyGenVideoModelOptions,
} from '../internal/provider-contracts/heygen.js';

/** Adapt video and decision model selection from the HeyGen SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for HeyGen. */
export type HeyGenProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native HeyGen options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type HeyGenProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the HeyGen provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createHeyGen = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  HeyGenProvider
>('createHeyGen', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateHeyGen(settings)),
);
/**
 * Adapt the preconfigured provider from the HeyGen SDK. Use the factory to supply
 * explicit settings.
 */
export const heygen: HeyGenProvider = wrapProvider(sdkHeygen);
