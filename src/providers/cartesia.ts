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
export type CartesiaProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type CartesiaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createCartesia = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  CartesiaProvider
>('createCartesia', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateCartesia(settings)),
);
export const cartesia: CartesiaProvider = wrapProvider(sdkCartesia);
export const CartesiaRealtimeModel: AdaptedConstructor<
  typeof SdkCartesiaRealtimeModel,
  CartesiaRealtimeModel
> = adaptModelConstructor(
  'CartesiaRealtimeModel',
  SdkCartesiaRealtimeModel,
  wrapRealtimeModel,
);
export type CartesiaRealtimeModel = ReturnType<typeof wrapRealtimeModel>;
export const CartesiaSpeechModel: AdaptedWorkflowConstructor<
  typeof SdkCartesiaSpeechModel,
  CartesiaSpeechModel
> = adaptWorkflowModelConstructor(
  'CartesiaSpeechModel',
  SdkCartesiaSpeechModel,
  wrapSpeechModel,
  unwrapSpeechModel,
);
export type CartesiaSpeechModel = ReturnType<typeof wrapSpeechModel>;
export const CartesiaTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkCartesiaTranscriptionModel,
  CartesiaTranscriptionModel
> = adaptWorkflowModelConstructor(
  'CartesiaTranscriptionModel',
  SdkCartesiaTranscriptionModel,
  wrapTranscriptionModel,
  unwrapTranscriptionModel,
);
export type CartesiaTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
