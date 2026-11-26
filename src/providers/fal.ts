import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { FalProviderSettings as SdkSettings } from '@ai-sdk/fal';
import { createFal as sdkCreateFal, fal as sdkFal } from '@ai-sdk/fal';
import type { FalProvider as SdkProvider } from '@ai-sdk/fal';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import {
  wrapImageModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/fal';
export type {
  FalImageModelOptions,
  FalImageProviderOptions,
  FalSpeechModelOptions,
  FalTranscriptionModelOptions,
  FalVideoModelId,
  FalVideoModelOptions,
  FalVideoProviderOptions,
} from '@ai-sdk/fal';

/**
 * Adapt image, video, speech, and transcription model selection from the fal SDK to
 * Effect.
 */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('fal', sdk),
  image: adaptMethod('fal.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'fal.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  transcription: adaptMethod(
    'fal.transcription',
    sdk.transcription.bind(sdk),
    wrapTranscriptionModel,
  ),
  video: adaptMethod('fal.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'fal.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
  speech: adaptMethod('fal.speech', sdk.speech.bind(sdk), wrapSpeechModel),
  textEmbeddingModel: adaptUnsupportedMethod(
    'fal.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for fal. */
export type FalProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native fal options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type FalProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
/**
 * Construct the fal provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createFal = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  FalProvider
>('createFal', ['apiKey'], (settings) => wrapProvider(sdkCreateFal(settings)));
/**
 * Adapt the preconfigured provider from the fal SDK. Use the factory to supply explicit
 * settings.
 */
export const fal: FalProvider = wrapProvider(sdkFal);
