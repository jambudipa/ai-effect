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
export type ScaleDownProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type ScaleDownProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createScaleDown = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ScaleDownProvider
>('createScaleDown', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateScaleDown(settings)),
);
export const scaleDown: ScaleDownProvider = wrapProvider(sdkScaleDown);
export const scaledown: ScaleDownProvider = wrapProvider(sdkScaledown);
