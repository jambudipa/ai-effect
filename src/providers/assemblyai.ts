import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AssemblyAIProviderSettings as SdkSettings } from '@ai-sdk/assemblyai';
import {
  createAssemblyAI as sdkCreateAssemblyAI,
  assemblyai as sdkAssemblyai,
} from '@ai-sdk/assemblyai';
import type { AssemblyAIProvider as SdkProvider } from '@ai-sdk/assemblyai';
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

export { VERSION } from '@ai-sdk/assemblyai';
export type {
  AssemblyAISpeechModelId,
  AssemblyAISpeechModelOptions,
  AssemblyAITranscriptionModelOptions,
} from '@ai-sdk/assemblyai';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('assemblyai', sdk, wrapLegacyTranscription), {
    ...wrapProviderBase('assemblyai', sdk),
    transcription: adaptMethod(
      'assemblyai.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    speech: adaptMethod(
      'assemblyai.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'assemblyai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type AssemblyAIProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type AssemblyAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createAssemblyAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AssemblyAIProvider
>('createAssemblyAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateAssemblyAI(settings)),
);
export const assemblyai: AssemblyAIProvider = wrapProvider(sdkAssemblyai);
