import { createHume as sdkCreateHume, hume as sdkHume } from '@ai-sdk/hume';
import type { HumeProvider as SdkProvider } from '@ai-sdk/hume';
import {
  adaptMethod,
  wrapLegacySpeech,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapSpeechModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/hume';
export type {
  HumeProviderSettings,
  HumeSpeechModelOptions,
} from '@ai-sdk/hume';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('hume', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('hume', sdk),
    speech: adaptMethod('hume.speech', sdk.speech.bind(sdk), wrapSpeechModel),
  });
export type HumeProvider = ReturnType<typeof wrapProvider>;
export const createHume = (...args: Parameters<typeof sdkCreateHume>) =>
  runSync('createHume', () => wrapProvider(sdkCreateHume(...args)));
export const hume: HumeProvider = wrapProvider(sdkHume);
