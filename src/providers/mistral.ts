import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { MistralProviderSettings as SdkSettings } from '@ai-sdk/mistral';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createMistral as sdkCreateMistral,
  mistral as sdkMistral,
} from '@ai-sdk/mistral';
import type { MistralProvider as SdkProvider } from '@ai-sdk/mistral';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';
import { wrapRealtimeModel } from '../internal/provider-realtime.js';
import { requestMethod } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/mistral';
export type {
  Experimental_MistralRealtimeModelOptions,
  Experimental_MistralRealtimeSession,
  MistralEmbeddingModelOptions,
  MistralLanguageModelChatOptions,
  MistralLanguageModelConversationOptions,
  MistralLanguageModelOptions,
  MistralSpeechModelId,
  MistralSpeechModelOptions,
  MistralTranscriptionModelId,
  MistralTranscriptionModelOptions,
} from '@ai-sdk/mistral';

/**
 * Use the native Mistral realtime factory to retain its model selectors and session
 * arguments.
 */
type SdkRealtimeFactory = SdkProvider['experimental_realtime'];

/**
 * Adapt the realtime selector and retain the SDK methods to create and close sessions as
 * Effects.
 */
const wrapMistralRealtime = (factory: SdkRealtimeFactory) =>
  Object.assign(
    adaptMethod('mistral.experimental_realtime', factory, wrapRealtimeModel),
    {
      createSession: requestMethod(
        'mistral.experimental_realtime.createSession',
        factory.createSession.bind(factory),
      ),
      closeSession: requestMethod(
        'mistral.experimental_realtime.closeSession',
        factory.closeSession.bind(factory),
      ),
    },
  );

/**
 * Select a Mistral realtime model and manage its sessions with `createSession` and
 * `closeSession` Effects.
 */
export type Experimental_MistralRealtimeFactory = ReturnType<
  typeof wrapMistralRealtime
>;

/**
 * Adapt language, embedding, speech, and transcription model selection from the Mistral
 * SDK to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('mistral', sdk, wrapLanguageModel), {
    ...wrapProviderBase('mistral', sdk),
    languageModel: adaptMethod(
      'mistral.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('mistral.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    conversation: adaptMethod(
      'mistral.conversation',
      sdk.conversation.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'mistral.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'mistral.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    speech: adaptMethod(
      'mistral.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    speechModel: adaptMethod(
      'mistral.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    transcription: adaptMethod(
      'mistral.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'mistral.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
    textEmbedding: adaptMethod(
      'mistral.textEmbedding',
      sdk.textEmbedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'mistral.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    tools: wrapProviderTools('mistral.tools', sdk.tools),
    experimental_realtime: wrapMistralRealtime(sdk.experimental_realtime),
  });
/** Provider returned by the adapter, with Effect-based model selection for Mistral. */
export type MistralProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Mistral options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type MistralProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Mistral provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createMistral = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  MistralProvider
>('createMistral', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateMistral(settings)),
);
/**
 * Adapt the preconfigured provider from the Mistral SDK. Use the factory to supply
 * explicit settings.
 */
export const mistral: MistralProvider = wrapProvider(sdkMistral);
