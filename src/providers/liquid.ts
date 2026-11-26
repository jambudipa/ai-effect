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

/** Adapt decision model selection from the Liquid SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('liquid', sdk),
  decisionModel: adaptMethod(
    'liquid.decisionModel',
    sdk.decisionModel.bind(sdk),
    wrapDecisionModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Liquid. */
export type LiquidProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Liquid options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type LiquidProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Liquid provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createLiquid = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  LiquidProvider
>('createLiquid', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateLiquid(settings)),
);
/**
 * Adapt the preconfigured provider from the Liquid SDK. Use the factory to supply
 * explicit settings.
 */
export const liquid: LiquidProvider = wrapProvider(sdkLiquid);
