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
export type ElevenLabsProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type ElevenLabsProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createElevenLabs = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ElevenLabsProvider
>('createElevenLabs', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateElevenLabs(settings)),
);
export const elevenLabs: ElevenLabsProvider = wrapProvider(sdkElevenLabs);
export const elevenlabs: ElevenLabsProvider = elevenLabs;
