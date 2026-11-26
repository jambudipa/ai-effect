import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { CartesiaProviderSettings as SdkSettings } from '@ai-sdk/cartesia';
import type { AdaptedConstructor } from '../internal/provider-adapter.js';
import {
  wrapRealtimeModel,
  wrapRealtimeFactory,
} from '../internal/provider-realtime.js';
import { CartesiaTranscriptionModel as SdkCartesiaTranscriptionModel } from '@ai-sdk/cartesia';
import { CartesiaSpeechModel as SdkCartesiaSpeechModel } from '@ai-sdk/cartesia';
import { CartesiaRealtimeModel as SdkCartesiaRealtimeModel } from '@ai-sdk/cartesia';
import {
  createCartesia as sdkCreateCartesia,
  cartesia as sdkCartesia,
} from '@ai-sdk/cartesia';
import type { CartesiaProvider as SdkProvider } from '@ai-sdk/cartesia';
import {
  adaptMethod,
  adaptModelConstructor,
  adaptUnsupportedMethod,
  wrapLegacySpeech,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import {
  unwrapSpeechModel,
  unwrapTranscriptionModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';
import {
  adaptWorkflowModelConstructor,
  type AdaptedWorkflowConstructor,
} from '../internal/workflow-model.js';

export { VERSION } from '@ai-sdk/cartesia';
export type {
  CartesiaRealtimeModelId,
  CartesiaRealtimeModelOptions,
  CartesiaSpeechModelId,
  CartesiaSpeechModelOptions,
  CartesiaSpeechVoiceId,
  CartesiaTranscriptionModelId,
  CartesiaTranscriptionModelOptions,
} from '@ai-sdk/cartesia';

/** Adapt speech and transcription model selection from the Cartesia SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('cartesia', sdk, wrapLegacySpeech), {
    ...wrapProviderBase('cartesia', sdk),
    transcription: adaptMethod(
      'cartesia.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    speech: adaptMethod(
      'cartesia.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'cartesia.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    experimental_realtime: wrapRealtimeFactory(
      'cartesia.experimental_realtime',
      sdk.experimental_realtime,
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for Cartesia. */
export type CartesiaProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Cartesia options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type CartesiaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Cartesia provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createCartesia = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  CartesiaProvider
>('createCartesia', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateCartesia(settings)),
);
/**
 * Adapt the preconfigured provider from the Cartesia SDK. Use the factory to supply
 * explicit settings.
 */
export const cartesia: CartesiaProvider = wrapProvider(sdkCartesia);
/** Construct the SDK Cartesia realtime model lazily with its native options. */
export const CartesiaRealtimeModel: AdaptedConstructor<
  typeof SdkCartesiaRealtimeModel,
  CartesiaRealtimeModel
> = adaptModelConstructor(
  'CartesiaRealtimeModel',
  SdkCartesiaRealtimeModel,
  wrapRealtimeModel,
);
/**
 * Effect model returned by `CartesiaRealtimeModel`. Use its realtime connection operations
 * in an Effect program.
 */
export type CartesiaRealtimeModel = ReturnType<typeof wrapRealtimeModel>;
/**
 * Construct the SDK Cartesia speech model lazily with its native options. It exposes the
 * workflow serialization hooks.
 */
export const CartesiaSpeechModel: AdaptedWorkflowConstructor<
  typeof SdkCartesiaSpeechModel,
  CartesiaSpeechModel
> = adaptWorkflowModelConstructor(
  'CartesiaSpeechModel',
  SdkCartesiaSpeechModel,
  wrapSpeechModel,
  unwrapSpeechModel,
);
/**
 * Effect model returned by `CartesiaSpeechModel`. Use its speech synthesis operations in
 * an Effect program.
 */
export type CartesiaSpeechModel = ReturnType<typeof wrapSpeechModel>;
/**
 * Construct the SDK Cartesia transcription model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
export const CartesiaTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkCartesiaTranscriptionModel,
  CartesiaTranscriptionModel
> = adaptWorkflowModelConstructor(
  'CartesiaTranscriptionModel',
  SdkCartesiaTranscriptionModel,
  wrapTranscriptionModel,
  unwrapTranscriptionModel,
);
/**
 * Effect model returned by `CartesiaTranscriptionModel`. Use its transcription operations
 * in an Effect program.
 */
export type CartesiaTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
