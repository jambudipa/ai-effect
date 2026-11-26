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

/** Adapt speech and transcription model selection from the AssemblyAI SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for AssemblyAI. */
export type AssemblyAIProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native AssemblyAI options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type AssemblyAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the AssemblyAI provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createAssemblyAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AssemblyAIProvider
>('createAssemblyAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateAssemblyAI(settings)),
);
/**
 * Adapt the preconfigured provider from the AssemblyAI SDK. Use the factory to supply
 * explicit settings.
 */
export const assemblyai: AssemblyAIProvider = wrapProvider(sdkAssemblyai);
