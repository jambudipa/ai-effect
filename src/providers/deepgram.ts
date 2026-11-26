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
export type DeepgramProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type DeepgramProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createDeepgram = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  DeepgramProvider
>('createDeepgram', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateDeepgram(settings)),
);
export const deepgram: DeepgramProvider = wrapProvider(sdkDeepgram);
export const DeepgramSpeechModel: AdaptedWorkflowConstructor<
  typeof SdkDeepgramSpeechModel,
  DeepgramSpeechModel
> = adaptWorkflowModelConstructor(
  'DeepgramSpeechModel',
  SdkDeepgramSpeechModel,
  wrapSpeechModel,
  unwrapSpeechModel,
);
export type DeepgramSpeechModel = ReturnType<typeof wrapSpeechModel>;
