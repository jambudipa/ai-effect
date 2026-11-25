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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/assemblyai';
export type {
  AssemblyAIProviderSettings,
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
export const createAssemblyAI = (
  ...args: Parameters<typeof sdkCreateAssemblyAI>
) =>
  runSync('createAssemblyAI', () => wrapProvider(sdkCreateAssemblyAI(...args)));
export const assemblyai: AssemblyAIProvider = wrapProvider(sdkAssemblyai);
