import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { FishAudioProviderSettings as SdkSettings } from '@ai-sdk/fish-audio';
import { FishAudioTranscriptionModel as SdkFishAudioTranscriptionModel } from '@ai-sdk/fish-audio';
import { FishAudioSpeechModel as SdkFishAudioSpeechModel } from '@ai-sdk/fish-audio';
import {
  createFishAudio as sdkCreateFishAudio,
  fishAudio as sdkFishAudio,
} from '@ai-sdk/fish-audio';
import type { FishAudioProvider as SdkProvider } from '@ai-sdk/fish-audio';
import {
  adaptMethod,
  wrapLegacySpeech,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import {
  unwrapSpeechModel,
  unwrapTranscriptionModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';
import {
  adaptWorkflowModelConstructor,
  type AdaptedWorkflowConstructor,
} from '../internal/workflow-model.js';

export { VERSION } from '@ai-sdk/fish-audio';
export type {
  FishAudioSpeechModelId,
  FishAudioSpeechModelOptions,
  FishAudioSpeechVoiceId,
  FishAudioTranscriptionModelId,
  FishAudioTranscriptionModelOptions,
} from '@ai-sdk/fish-audio';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('fishAudio', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('fishAudio', sdk),
    speech: adaptMethod(
      'fishAudio.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    speechModel: adaptMethod(
      'fishAudio.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    transcription: adaptMethod(
      'fishAudio.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'fishAudio.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
  });
export type FishAudioProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type FishAudioProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createFishAudio = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  FishAudioProvider
>('createFishAudio', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateFishAudio(settings)),
);
export const fishAudio: FishAudioProvider = wrapProvider(sdkFishAudio);
export const FishAudioSpeechModel: AdaptedWorkflowConstructor<
  typeof SdkFishAudioSpeechModel,
  FishAudioSpeechModel
> = adaptWorkflowModelConstructor(
  'FishAudioSpeechModel',
  SdkFishAudioSpeechModel,
  wrapSpeechModel,
  unwrapSpeechModel,
);
export type FishAudioSpeechModel = ReturnType<typeof wrapSpeechModel>;
export const FishAudioTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkFishAudioTranscriptionModel,
  FishAudioTranscriptionModel
> = adaptWorkflowModelConstructor(
  'FishAudioTranscriptionModel',
  SdkFishAudioTranscriptionModel,
  wrapTranscriptionModel,
  unwrapTranscriptionModel,
);
export type FishAudioTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
