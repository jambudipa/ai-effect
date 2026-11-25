import {
  createLiquid as sdkCreateLiquid,
  liquid as sdkLiquid,
} from '@ai-sdk/liquid';
import type { LiquidProvider as SdkProvider } from '@ai-sdk/liquid';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapDecisionModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/liquid';
export type {
  LiquidDecisionModelId,
  LiquidDecisionModelOptions,
  LiquidProviderSettings,
} from '@ai-sdk/liquid';

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('liquid', sdk),
  decisionModel: adaptMethod(
    'liquid.decisionModel',
    sdk.decisionModel.bind(sdk),
    wrapDecisionModel,
  ),
});
export type LiquidProvider = ReturnType<typeof wrapProvider>;
export const createLiquid = (...args: Parameters<typeof sdkCreateLiquid>) =>
  runSync('createLiquid', () => wrapProvider(sdkCreateLiquid(...args)));
export const liquid: LiquidProvider = wrapProvider(sdkLiquid);
