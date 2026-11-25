import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { GladiaProviderSettings as SdkSettings } from '@ai-sdk/gladia';
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

export { VERSION } from '@ai-sdk/gladia';
export type {
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
type ResolverKey = 'apiKey';
export type GladiaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createGladia = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GladiaProvider
>('createGladia', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGladia(settings)),
);
export const gladia: GladiaProvider = wrapProvider(sdkGladia);
