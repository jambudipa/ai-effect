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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/scaledown';
export type {
  Experimental_ScaleDownDecisionModelId,
  Experimental_ScaleDownExtractionModelId,
  Experimental_ScaleDownExtractionModelOptions,
  ScaleDownDecisionProviderMetadata,
  ScaleDownProviderSettings,
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
export const createScaleDown = (
  ...args: Parameters<typeof sdkCreateScaleDown>
) =>
  runSync('createScaleDown', () => wrapProvider(sdkCreateScaleDown(...args)));
export const scaleDown: ScaleDownProvider = wrapProvider(sdkScaleDown);
export const scaledown: ScaleDownProvider = wrapProvider(sdkScaledown);
