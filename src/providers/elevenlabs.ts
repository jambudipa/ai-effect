import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ElevenLabsProviderSettings as SdkSettings } from '@ai-sdk/elevenlabs';
import {
  createElevenLabs as sdkCreateElevenLabs,
  elevenLabs as sdkElevenLabs,
} from '@ai-sdk/elevenlabs';
import type { ElevenLabsProvider as SdkProvider } from '@ai-sdk/elevenlabs';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapLegacyTranscription,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import {
  wrapSpeechModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/elevenlabs';
export type {
  ElevenLabsSpeechModelId,
  ElevenLabsSpeechModelOptions,
  ElevenLabsSpeechVoiceId,
  ElevenLabsTranscriptionModelOptions,
} from '@ai-sdk/elevenlabs';

/** Adapt speech and transcription model selection from the ElevenLabs SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('elevenLabs', sdk, wrapLegacyTranscription), {
    ...wrapProviderBase('elevenLabs', sdk),
    transcription: adaptMethod(
      'elevenLabs.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    speech: adaptMethod(
      'elevenLabs.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'elevenLabs.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for ElevenLabs. */
export type ElevenLabsProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native ElevenLabs options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type ElevenLabsProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the ElevenLabs provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createElevenLabs = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ElevenLabsProvider
>('createElevenLabs', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateElevenLabs(settings)),
);
/**
 * Adapt the preconfigured provider from the ElevenLabs SDK. Use the factory to supply
 * explicit settings.
 */
export const elevenLabs: ElevenLabsProvider = wrapProvider(sdkElevenLabs);
/** Expose the same ElevenLabs provider as `elevenLabs` under the SDK alias. */
export const elevenlabs: ElevenLabsProvider = elevenLabs;
