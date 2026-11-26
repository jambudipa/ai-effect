import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { HumeProviderSettings as SdkSettings } from '@ai-sdk/hume';
import { createHume as sdkCreateHume, hume as sdkHume } from '@ai-sdk/hume';
import type { HumeProvider as SdkProvider } from '@ai-sdk/hume';
import {
  adaptMethod,
  wrapLegacySpeech,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapSpeechModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/hume';
export type { HumeSpeechModelOptions } from '@ai-sdk/hume';

/** Adapt speech model selection from the Hume SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('hume', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('hume', sdk),
    speech: adaptMethod('hume.speech', sdk.speech.bind(sdk), wrapSpeechModel),
  });
/** Provider returned by the adapter, with Effect-based model selection for Hume. */
export type HumeProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Hume options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type HumeProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
/**
 * Construct the Hume provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createHume = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  HumeProvider
>('createHume', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateHume(settings)),
);
/**
 * Adapt the preconfigured provider from the Hume SDK. Use the factory to supply explicit
 * settings.
 */
export const hume: HumeProvider = wrapProvider(sdkHume);
