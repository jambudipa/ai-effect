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

/** Adapt transcription model selection from the Gladia SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for Gladia. */
export type GladiaProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Gladia options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type GladiaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Gladia provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createGladia = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GladiaProvider
>('createGladia', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGladia(settings)),
);
/**
 * Adapt the preconfigured provider from the Gladia SDK. Use the factory to supply
 * explicit settings.
 */
export const gladia: GladiaProvider = wrapProvider(sdkGladia);
