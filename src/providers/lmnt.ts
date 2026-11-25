import { createLMNT as sdkCreateLMNT, lmnt as sdkLmnt } from '@ai-sdk/lmnt';
import type { LMNTProvider as SdkProvider } from '@ai-sdk/lmnt';
import {
  adaptMethod,
  wrapLegacySpeech,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapSpeechModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/lmnt';
export type {
  LMNTProviderSettings,
  LMNTSpeechModelOptions,
} from '@ai-sdk/lmnt';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('lmnt', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('lmnt', sdk),
    speech: adaptMethod('lmnt.speech', sdk.speech.bind(sdk), wrapSpeechModel),
  });
export type LMNTProvider = ReturnType<typeof wrapProvider>;
export const createLMNT = (...args: Parameters<typeof sdkCreateLMNT>) =>
  runSync('createLMNT', () => wrapProvider(sdkCreateLMNT(...args)));
export const lmnt: LMNTProvider = wrapProvider(sdkLmnt);
