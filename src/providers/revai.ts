import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { RevaiProviderSettings as SdkSettings } from '@ai-sdk/revai';
import {
  createRevai as sdkCreateRevai,
  revai as sdkRevai,
} from '@ai-sdk/revai';
import type { RevaiProvider as SdkProvider } from '@ai-sdk/revai';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapLegacyTranscription,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapTranscriptionModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/revai';
export type { RevaiTranscriptionModelOptions } from '@ai-sdk/revai';

/** Adapt transcription model selection from the Rev AI SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('revai', sdk, wrapLegacyTranscription), {
    ...wrapProviderBase('revai', sdk),
    transcription: adaptMethod(
      'revai.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'revai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for Rev AI. */
export type RevaiProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Rev AI options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type RevaiProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Rev AI provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createRevai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  RevaiProvider
>('createRevai', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateRevai(settings)),
);
/**
 * Adapt the preconfigured provider from the Rev AI SDK. Use the factory to supply
 * explicit settings.
 */
export const revai: RevaiProvider = wrapProvider(sdkRevai);
