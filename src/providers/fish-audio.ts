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

/** Adapt speech and transcription model selection from the Fish Audio SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for Fish Audio. */
export type FishAudioProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Fish Audio options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type FishAudioProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Fish Audio provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createFishAudio = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  FishAudioProvider
>('createFishAudio', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateFishAudio(settings)),
);
/**
 * Adapt the preconfigured provider from the Fish Audio SDK. Use the factory to supply
 * explicit settings.
 */
export const fishAudio: FishAudioProvider = wrapProvider(sdkFishAudio);
/**
 * Construct the SDK Fish Audio speech model lazily with its native options. It exposes the
 * workflow serialization hooks.
 */
export const FishAudioSpeechModel: AdaptedWorkflowConstructor<
  typeof SdkFishAudioSpeechModel,
  FishAudioSpeechModel
> = adaptWorkflowModelConstructor(
  'FishAudioSpeechModel',
  SdkFishAudioSpeechModel,
  wrapSpeechModel,
  unwrapSpeechModel,
);
/**
 * Effect model returned by `FishAudioSpeechModel`. Use its speech synthesis operations in
 * an Effect program.
 */
export type FishAudioSpeechModel = ReturnType<typeof wrapSpeechModel>;
/**
 * Construct the SDK Fish Audio transcription model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
export const FishAudioTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkFishAudioTranscriptionModel,
  FishAudioTranscriptionModel
> = adaptWorkflowModelConstructor(
  'FishAudioTranscriptionModel',
  SdkFishAudioTranscriptionModel,
  wrapTranscriptionModel,
  unwrapTranscriptionModel,
);
/**
 * Effect model returned by `FishAudioTranscriptionModel`. Use its transcription operations
 * in an Effect program.
 */
export type FishAudioTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
