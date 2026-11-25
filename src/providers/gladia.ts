import {
  createGladia as sdkCreateGladia,
  gladia as sdkGladia,
} from '@ai-sdk/gladia';
import type { GladiaProvider as SdkProvider } from '@ai-sdk/gladia';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapLegacyTranscription,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapTranscriptionModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/gladia';
export type {
  GladiaProviderSettings,
  GladiaTranscriptionModelId,
  GladiaTranscriptionModelOptions,
} from '@ai-sdk/gladia';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('gladia', sdk, wrapLegacyTranscription), {
    ...wrapProviderBase('gladia', sdk),
    transcription: adaptMethod(
      'gladia.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'gladia.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type GladiaProvider = ReturnType<typeof wrapProvider>;
export const createGladia = (...args: Parameters<typeof sdkCreateGladia>) =>
  runSync('createGladia', () => wrapProvider(sdkCreateGladia(...args)));
export const gladia: GladiaProvider = wrapProvider(sdkGladia);
