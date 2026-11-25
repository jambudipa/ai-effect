import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { LiquidProviderSettings as SdkSettings } from '@ai-sdk/liquid';
import {
  createLiquid as sdkCreateLiquid,
  liquid as sdkLiquid,
} from '@ai-sdk/liquid';
import type { LiquidProvider as SdkProvider } from '@ai-sdk/liquid';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapDecisionModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/liquid';
export type {
  LiquidDecisionModelId,
  LiquidDecisionModelOptions,
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
type ResolverKey = 'apiKey';
export type LiquidProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createLiquid = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  LiquidProvider
>('createLiquid', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateLiquid(settings)),
);
export const liquid: LiquidProvider = wrapProvider(sdkLiquid);
