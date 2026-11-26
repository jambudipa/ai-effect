import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { DeepgramProviderSettings as SdkSettings } from '@ai-sdk/deepgram';
import { DeepgramSpeechModel as SdkDeepgramSpeechModel } from '@ai-sdk/deepgram';
import {
  createDeepgram as sdkCreateDeepgram,
  deepgram as sdkDeepgram,
} from '@ai-sdk/deepgram';
import type { DeepgramProvider as SdkProvider } from '@ai-sdk/deepgram';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapLegacyTranscription,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import {
  unwrapSpeechModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';
import {
  adaptWorkflowModelConstructor,
  type AdaptedWorkflowConstructor,
} from '../internal/workflow-model.js';

export { VERSION } from '@ai-sdk/deepgram';
export type {
  DeepgramSpeechCallOptions,
  DeepgramSpeechModelId,
  DeepgramSpeechModelOptions,
  DeepgramTranscriptionModelOptions,
} from '@ai-sdk/deepgram';

/** Adapt speech and transcription model selection from the Deepgram SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('deepgram', sdk, wrapLegacyTranscription), {
    ...wrapProviderBase('deepgram', sdk),
    transcription: adaptMethod(
      'deepgram.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    speech: adaptMethod(
      'deepgram.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'deepgram.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for Deepgram. */
export type DeepgramProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Deepgram options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type DeepgramProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Deepgram provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createDeepgram = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  DeepgramProvider
>('createDeepgram', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateDeepgram(settings)),
);
/**
 * Adapt the preconfigured provider from the Deepgram SDK. Use the factory to supply
 * explicit settings.
 */
export const deepgram: DeepgramProvider = wrapProvider(sdkDeepgram);
/**
 * Construct the SDK Deepgram speech model lazily with its native options. It exposes the
 * workflow serialization hooks.
 */
export const DeepgramSpeechModel: AdaptedWorkflowConstructor<
  typeof SdkDeepgramSpeechModel,
  DeepgramSpeechModel
> = adaptWorkflowModelConstructor(
  'DeepgramSpeechModel',
  SdkDeepgramSpeechModel,
  wrapSpeechModel,
  unwrapSpeechModel,
);
/**
 * Effect model returned by `DeepgramSpeechModel`. Use its speech synthesis operations in
 * an Effect program.
 */
export type DeepgramSpeechModel = ReturnType<typeof wrapSpeechModel>;
