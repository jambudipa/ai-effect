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

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('hume', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('hume', sdk),
    speech: adaptMethod('hume.speech', sdk.speech.bind(sdk), wrapSpeechModel),
  });
export type HumeProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type HumeProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
export const createHume = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  HumeProvider
>('createHume', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateHume(settings)),
);
export const hume: HumeProvider = wrapProvider(sdkHume);
