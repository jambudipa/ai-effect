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

/** Adapt speech model selection from the LMNT SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('lmnt', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('lmnt', sdk),
    speech: adaptMethod('lmnt.speech', sdk.speech.bind(sdk), wrapSpeechModel),
  });
/** Provider returned by the adapter, with Effect-based model selection for LMNT. */
export type LMNTProvider = ReturnType<typeof wrapProvider>;
/**
 * Construct the LMNT provider lazily with the native SDK arguments and map SDK construction
 * failures.
 */
export const createLMNT = (...args: Parameters<typeof sdkCreateLMNT>) =>
  runSync('createLMNT', () => wrapProvider(sdkCreateLMNT(...args)));
/**
 * Adapt the preconfigured provider from the LMNT SDK. Use the factory to supply explicit
 * settings.
 */
export const lmnt: LMNTProvider = wrapProvider(sdkLmnt);
