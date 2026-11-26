import type { ProviderHostConfiguration } from '../internal/provider-host-configuration.js';
import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AdaptedTools } from '../internal/provider-tool.js';
import type { AdaptedConstructor } from '../internal/provider-adapter.js';
import {
  wrapRealtimeModel,
  wrapTypedRealtimeModel,
} from '../internal/provider-realtime.js';
import type {
  RealtimeModelV4,
  TypedRealtimeModel,
} from '../internal/provider-realtime.js';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createOpenAI as sdkCreateOpenAI,
  Experimental_OpenAIRealtimeModel as NativeRealtimeModel,
  Experimental_OpenAIRealtimeModelLive as NativeRealtimeModelLive,
  Experimental_OpenAISpeechTranslationModel as NativeSpeechTranslationModel,
  openai as sdkOpenai,
  VERSION as sdkVersion,
} from '@ai-sdk/openai';
import type {
  Experimental_OpenAIRealtimeModel as SdkExperimental_OpenAIRealtimeModel,
  Experimental_OpenAIRealtimeModelConfig as SdkExperimental_OpenAIRealtimeModelConfig,
  Experimental_OpenAIRealtimeModelLive as SdkExperimental_OpenAIRealtimeModelLive,
  Experimental_OpenAIRealtimeModelLiveConfig as SdkExperimental_OpenAIRealtimeModelLiveConfig,
  Experimental_OpenAIRealtimeModelLiveId,
  Experimental_OpenAIRealtimeOptions,
  Experimental_OpenAISpeechTranslationModel as SdkExperimental_OpenAISpeechTranslationModel,
  OpenAIProvider as SdkProvider,
  OpenAIProviderSettings as SdkSettings,
} from '../internal/provider-contracts/openai.js';
import {
  adaptMethod,
  adaptModelConstructor,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  unwrapSpeechTranslationModel,
  wrapDecisionModel,
  wrapEmbeddingModel,
  wrapEvaluationModel,
  wrapExtractionModel,
  wrapImageModel,
  wrapSpeechModel,
  wrapSpeechTranslationModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';
import {
  adaptWorkflowModelConstructor,
  type AdaptedWorkflowConstructor,
} from '../internal/workflow-model.js';
import {
  wrapBatch,
  wrapFiles,
  wrapSkills,
} from '../internal/provider-resource.js';
import type { Effect } from 'effect';
import type { AiSdkError } from '../internal/operation.js';
import { runRequest, runSync } from '../internal/operation.js';

/** Expose the version of the OpenAI SDK used by this adapter. */
export const VERSION: string = sdkVersion;
export type {
  Experimental_OpenAIRealtimeModelLiveId,
  Experimental_OpenAIRealtimeModelLiveOptions,
  Experimental_OpenAIRealtimeOptions,
  Experimental_OpenAISpeechTranslationModelId,
  Experimental_OpenAISpeechTranslationModelOptions,
  Experimental_OpenAITranslationModelId,
  Experimental_OpenAITranslationModelOptions,
  OpenAIChatLanguageModelOptions,
  OpenAIChatMessageProviderOptions,
  OpenAIComputerAction,
  OpenAIComputerSafetyCheck,
  OpenAIDecisionModelId,
  OpenAIDecisionModelOptions,
  OpenAIEmbeddingModelOptions,
  OpenAIFilesOptions,
  OpenAIImageModelEditOptions,
  OpenAIImageModelGenerationOptions,
  OpenAIImageModelOptions,
  OpenAILanguageModelChatOptions,
  OpenAILanguageModelCompletionOptions,
  OpenAILanguageModelResponsesOptions,
  OpenAIResponsesProviderOptions,
  OpenAIResponsesSystemMessageOptions,
  OpenAIResponsesToolResultOptions,
  OpenAISpeechModelOptions,
  OpenAIToolOptions,
  OpenAITranscriptionModelOptions,
  OpenaiResponsesCompactionProviderMetadata,
  OpenaiResponsesProviderMetadata,
  OpenaiResponsesReasoningProviderMetadata,
  OpenaiResponsesSourceDocumentProviderMetadata,
  OpenaiResponsesTextProviderMetadata,
  OpenaiResponsesToolCallProviderMetadata,
} from '../internal/provider-contracts/openai.js';

/**
 * Use the SDK realtime factory as the source for model selection and token request
 * signatures.
 */
type SdkRealtimeFactory = SdkProvider['experimental_realtime'];

/**
 * Remove the open string member of an SDK model ID union so inference can distinguish
 * known live IDs.
 */
type LiteralModelIds<Id extends string> = Id extends string
  ? string extends Id
    ? never
    : Id
  : never;

/**
 * Identify the literal live model IDs that select the live return type without an explicit
 * API option.
 */
type KnownLiveModelId = LiteralModelIds<Experimental_OpenAIRealtimeModelLiveId>;

/** Keep the live and realtime overloads and adapt the token request to a lazy Effect. */
const wrapOpenAIRealtime = (factory: SdkRealtimeFactory) => {
  function select(
    modelId: string,
    options: { api: 'live' },
  ): Effect.Effect<Experimental_OpenAIRealtimeModelLive, AiSdkError>;
  function select(
    modelId: string,
    options: { api: 'realtime' },
  ): Effect.Effect<Experimental_OpenAIRealtimeModel, AiSdkError>;
  function select(
    modelId: KnownLiveModelId,
    options?: { api?: undefined },
  ): Effect.Effect<Experimental_OpenAIRealtimeModelLive, AiSdkError>;
  function select(
    modelId: string,
    options?: Experimental_OpenAIRealtimeOptions,
  ): Effect.Effect<RealtimeModelV4, AiSdkError>;
  function select(
    modelId: string,
    options?: Experimental_OpenAIRealtimeOptions | { api?: undefined },
  ) {
    return runSync('openai.experimental_realtime', () =>
      wrapRealtimeModel(
        options?.api
          ? factory(modelId, { api: options.api })
          : factory(modelId),
      ),
    );
  }

  return Object.assign(select, {
    getToken: (options: Parameters<SdkRealtimeFactory['getToken']>[0]) =>
      runRequest('openai.experimental_realtime.getToken', {}, () =>
        factory.getToken(options),
      ),
  });
};

/**
 * Select a live or realtime model with the native API hint, or use `getToken` to acquire a
 * token.
 */
export type Experimental_OpenAIRealtimeFactory = ReturnType<
  typeof wrapOpenAIRealtime
>;

/**
 * Adapt native OpenAI tool factories and classify failures during descriptor construction.
 */
const wrapTools = (
  tools: SdkProvider['tools'],
): AdaptedTools<SdkProvider['tools']> =>
  wrapProviderTools('openai.tools', tools);

/**
 * Assemble the OpenAI Effect model selectors and include the typed experimental realtime
 * factory.
 */
const wrapProviderMethods = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('openai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('openai', sdk),
    decisionModel: adaptMethod(
      'openai.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
    evaluationModel: adaptMethod(
      'openai.evaluationModel',
      sdk.evaluationModel.bind(sdk),
      wrapEvaluationModel,
    ),
    extractionModel: adaptMethod(
      'openai.extractionModel',
      sdk.extractionModel.bind(sdk),
      wrapExtractionModel,
    ),
    languageModel: adaptMethod(
      'openai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('openai.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    responses: adaptMethod(
      'openai.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    completion: adaptMethod(
      'openai.completion',
      sdk.completion.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'openai.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'openai.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbedding: adaptMethod(
      'openai.textEmbedding',
      sdk.textEmbedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'openai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    image: adaptMethod('openai.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'openai.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    transcription: adaptMethod(
      'openai.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    translation: adaptMethod(
      'openai.translation',
      sdk.translation.bind(sdk),
      wrapSpeechTranslationModel,
    ),
    speechTranslationModel: adaptMethod(
      'openai.speechTranslationModel',
      sdk.speechTranslationModel.bind(sdk),
      wrapSpeechTranslationModel,
    ),
    speech: adaptMethod('openai.speech', sdk.speech.bind(sdk), wrapSpeechModel),
    files: adaptMethod('openai.files', sdk.files.bind(sdk), wrapFiles),
    skills: adaptMethod('openai.skills', sdk.skills.bind(sdk), wrapSkills),
    experimental_batch: adaptMethod(
      'openai.experimental_batch',
      sdk.experimental_batch.bind(sdk),
      wrapBatch,
    ),
    experimental_realtime: wrapOpenAIRealtime(sdk.experimental_realtime),
  });
/** Provider returned by the adapter, with Effect-based model selection for OpenAI. */
export type OpenAIProvider = ReturnType<typeof wrapProviderMethods> & {
  tools: AdaptedTools<SdkProvider['tools']>;
};

/**
 * Keep the callable provider and named model selectors from the OpenAI SDK available as
 * Effects.
 */
const wrapProvider = (native: typeof sdkOpenai): OpenAIProvider => {
  // The normalized declarations mirror the native classes under the same pin.
  const sdk = native as unknown as SdkProvider;
  return Object.assign(wrapProviderMethods(sdk), {
    tools: wrapTools(sdk.tools),
  });
};
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native OpenAI options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type OpenAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the OpenAI provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createOpenAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  OpenAIProvider
>('createOpenAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateOpenAI(settings)),
);
/**
 * Adapt the preconfigured provider from the OpenAI SDK. Use the factory to supply
 * explicit settings.
 */
export const openai: OpenAIProvider = wrapProvider(sdkOpenai);
/** Construct the SDK OpenAI realtime model lazily with its native options. */
export const Experimental_OpenAIRealtimeModel: AdaptedConstructor<
  typeof SdkExperimental_OpenAIRealtimeModel,
  Experimental_OpenAIRealtimeModel
> = adaptModelConstructor(
  'Experimental_OpenAIRealtimeModel',
  NativeRealtimeModel as unknown as typeof SdkExperimental_OpenAIRealtimeModel,
  wrapTypedRealtimeModel<SdkExperimental_OpenAIRealtimeModel>,
);
/**
 * Effect model returned by `Experimental_OpenAIRealtimeModel`. Use its realtime connection
 * operations in an Effect program.
 */
export type Experimental_OpenAIRealtimeModel =
  TypedRealtimeModel<SdkExperimental_OpenAIRealtimeModel>;
/** Construct the SDK OpenAI live model lazily with its native options. */
export const Experimental_OpenAIRealtimeModelLive: AdaptedConstructor<
  typeof SdkExperimental_OpenAIRealtimeModelLive,
  Experimental_OpenAIRealtimeModelLive
> = adaptModelConstructor(
  'Experimental_OpenAIRealtimeModelLive',
  NativeRealtimeModelLive as unknown as typeof SdkExperimental_OpenAIRealtimeModelLive,
  wrapTypedRealtimeModel<SdkExperimental_OpenAIRealtimeModelLive>,
);
/**
 * Effect model returned by `Experimental_OpenAIRealtimeModelLive`. Use its session
 * connection operations in an Effect program.
 */
export type Experimental_OpenAIRealtimeModelLive =
  TypedRealtimeModel<SdkExperimental_OpenAIRealtimeModelLive>;
/**
 * Construct the SDK OpenAI speech translation model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
export const Experimental_OpenAISpeechTranslationModel: AdaptedWorkflowConstructor<
  typeof SdkExperimental_OpenAISpeechTranslationModel,
  Experimental_OpenAISpeechTranslationModel
> = adaptWorkflowModelConstructor(
  'Experimental_OpenAISpeechTranslationModel',
  NativeSpeechTranslationModel as unknown as typeof SdkExperimental_OpenAISpeechTranslationModel,
  wrapSpeechTranslationModel,
  unwrapSpeechTranslationModel,
);
/**
 * Effect model returned by `Experimental_OpenAISpeechTranslationModel`. Use its speech
 * translation operations in an Effect program.
 */
export type Experimental_OpenAISpeechTranslationModel = ReturnType<
  typeof wrapSpeechTranslationModel
>;
/**
 * Expose the same OpenAI provider as `Experimental_OpenAISpeechTranslationModel` under the
 * SDK alias.
 */
export const Experimental_OpenAITranslationModel =
  Experimental_OpenAISpeechTranslationModel;
/**
 * Expose the same OpenAI contract as `Experimental_OpenAISpeechTranslationModel` under the
 * SDK alias.
 */
export type Experimental_OpenAITranslationModel =
  Experimental_OpenAISpeechTranslationModel;

/** Expose the SDK realtime model configuration accepted at the adapter host boundary. */
export type Experimental_OpenAIRealtimeModelConfig =
  ProviderHostConfiguration<SdkExperimental_OpenAIRealtimeModelConfig>;

/** Expose the SDK live model configuration accepted at the adapter host boundary. */
export type Experimental_OpenAIRealtimeModelLiveConfig =
  ProviderHostConfiguration<SdkExperimental_OpenAIRealtimeModelLiveConfig>;
