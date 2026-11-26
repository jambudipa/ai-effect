import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ScaleDownProviderSettings as SdkSettings } from '@ai-sdk/scaledown';
import {
  createScaleDown as sdkCreateScaleDown,
  scaleDown as sdkScaleDown,
  scaledown as sdkScaledown,
} from '@ai-sdk/scaledown';
import type { ScaleDownProvider as SdkProvider } from '@ai-sdk/scaledown';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  wrapDecisionModel,
  wrapExtractionModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/scaledown';
export type {
  Experimental_ScaleDownDecisionModelId,
  Experimental_ScaleDownExtractionModelId,
  Experimental_ScaleDownExtractionModelOptions,
  ScaleDownDecisionProviderMetadata,
} from '@ai-sdk/scaledown';

/** Adapt decision and extraction model selection from the ScaleDown SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('scaleDown', sdk),
  decisionModel: adaptMethod(
    'scaleDown.decisionModel',
    sdk.decisionModel.bind(sdk),
    wrapDecisionModel,
  ),
  extractionModel: adaptMethod(
    'scaleDown.extractionModel',
    sdk.extractionModel.bind(sdk),
    wrapExtractionModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for ScaleDown. */
export type ScaleDownProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native ScaleDown options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type ScaleDownProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the ScaleDown provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createScaleDown = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ScaleDownProvider
>('createScaleDown', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateScaleDown(settings)),
);
/**
 * Adapt the preconfigured provider from the ScaleDown SDK. Use the factory to supply
 * explicit settings.
 */
export const scaleDown: ScaleDownProvider = wrapProvider(sdkScaleDown);
/**
 * Adapt the preconfigured provider from the ScaleDown SDK. Use the factory to supply
 * explicit settings.
 */
export const scaledown: ScaleDownProvider = wrapProvider(sdkScaledown);
