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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/elevenlabs';
export type {
  ElevenLabsProviderSettings,
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
export const createElevenLabs = (
  ...args: Parameters<typeof sdkCreateElevenLabs>
) =>
  runSync('createElevenLabs', () => wrapProvider(sdkCreateElevenLabs(...args)));
export const elevenLabs: ElevenLabsProvider = wrapProvider(sdkElevenLabs);
export const elevenlabs: ElevenLabsProvider = elevenLabs;
