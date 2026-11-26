import type { Experimental_GoogleTranslationModelConfig as SdkExperimental_GoogleTranslationModelConfig } from '@ai-sdk/google';
import type { Experimental_GoogleSpeechTranslationModelConfig as SdkExperimental_GoogleSpeechTranslationModelConfig } from '@ai-sdk/google';
import type { Experimental_GoogleRealtimeModelConfig as SdkExperimental_GoogleRealtimeModelConfig } from '@ai-sdk/google';
import type { ProviderHostConfiguration } from '../internal/provider-host-configuration.js';
import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { GoogleGenerativeAIProviderSettings as SdkSettings } from '@ai-sdk/google';
import type {
  AdaptedConstructor,
  AdaptedMethod,
} from '../internal/provider-adapter.js';
import {
  wrapRealtimeModel,
  wrapRealtimeFactory,
} from '../internal/provider-realtime.js';
import { GoogleTranscriptionModel as SdkGoogleTranscriptionModel } from '@ai-sdk/google';
import { Experimental_GoogleSpeechTranslationModel as SdkExperimental_GoogleSpeechTranslationModel } from '@ai-sdk/google';
import { Experimental_GoogleRealtimeModel as SdkExperimental_GoogleRealtimeModel } from '@ai-sdk/google';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createGoogle as sdkCreateGoogle,
  google as sdkGoogle,
} from '@ai-sdk/google';
import type { GoogleProvider as SdkProvider } from '@ai-sdk/google';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { Context, Effect } from 'effect';
import {
  adaptMethod,
  adaptModelConstructor,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  unwrapSpeechTranslationModel,
  unwrapTranscriptionModel,
  wrapDecisionModel,
  wrapEmbeddingModel,
  wrapEvaluationModel,
  wrapExtractionModel,
  wrapImageModel,
  wrapSpeechModel,
  wrapSpeechTranslationModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';
import { wrapBatch, wrapFiles } from '../internal/provider-resource.js';
import {
  adaptWorkflowModelConstructor,
  type AdaptedWorkflowConstructor,
} from '../internal/workflow-model.js';

export { VERSION } from '@ai-sdk/google';
export type {
  Experimental_GoogleRealtimeModelId,
  Experimental_GoogleRealtimeModelOptions,
  Experimental_GoogleSpeechTranslationModelId,
  Experimental_GoogleSpeechTranslationModelOptions,
  Experimental_GoogleTranslationModelId,
  Experimental_GoogleTranslationModelOptions,
  GoogleDecisionModelId,
  GoogleDecisionModelOptions,
  GoogleEmbeddingModelOptions,
  GoogleErrorData,
  GoogleFilePartOptions,
  GoogleFilesUploadOptions,
  GoogleGenerativeAIEmbeddingProviderOptions,
  GoogleGenerativeAIImageProviderOptions,
  GoogleGenerativeAIProviderMetadata,
  GoogleGenerativeAIProviderOptions,
  GoogleGenerativeAIVideoModelId,
  GoogleGenerativeAIVideoProviderOptions,
  GoogleImageModelOptions,
  GoogleInteractionsAgentName,
  GoogleInteractionsFileOptions,
  GoogleInteractionsModelId,
  GoogleInteractionsProviderMetadata,
  GoogleInteractionsVideoOptions,
  GoogleLanguageModelInteractionsOptions,
  GoogleLanguageModelOptions,
  GoogleProviderMetadata,
  GoogleSpeechModelId,
  GoogleSpeechModelOptions,
  GoogleTranscriptionModelId,
  GoogleTranscriptionModelOptions,
  GoogleVideoMetadata,
  GoogleVideoModelId,
  GoogleVideoModelOptions,
} from '@ai-sdk/google';

/**
 * Bind the native Google image selector and adapt its image model without widening
 * accepted model IDs.
 */
const wrapImage = (
  sdk: SdkProvider,
): AdaptedMethod<SdkProvider['image'], ReturnType<typeof wrapImageModel>> =>
  adaptMethod('google.image', sdk.image.bind(sdk), wrapImageModel);

/**
 * Keep the native Google language, embedding, streaming, and experimental model selectors
 * available as Effects.
 */
const wrapProviderMethods = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('google', sdk, wrapLanguageModel), {
    ...wrapProviderBase('google', sdk),
    languageModel: adaptMethod(
      'google.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('google.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    decisionModel: adaptMethod(
      'google.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
    evaluationModel: adaptMethod(
      'google.evaluationModel',
      sdk.evaluationModel.bind(sdk),
      wrapEvaluationModel,
    ),
    extractionModel: adaptMethod(
      'google.extractionModel',
      sdk.extractionModel.bind(sdk),
      wrapExtractionModel,
    ),
    experimental_batch: adaptMethod(
      'google.experimental_batch',
      sdk.experimental_batch.bind(sdk),
      wrapBatch,
    ),
    generativeAI: adaptMethod(
      'google.generativeAI',
      sdk.generativeAI.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'google.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'google.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbedding: adaptMethod(
      'google.textEmbedding',
      sdk.textEmbedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'google.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    video: adaptMethod('google.video', sdk.video.bind(sdk), wrapVideoModel),
    videoModel: adaptMethod(
      'google.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
    translation: adaptMethod(
      'google.translation',
      sdk.translation.bind(sdk),
      wrapSpeechTranslationModel,
    ),
    speechTranslationModel: adaptMethod(
      'google.speechTranslationModel',
      sdk.speechTranslationModel.bind(sdk),
      wrapSpeechTranslationModel,
    ),
    speech: adaptMethod('google.speech', sdk.speech.bind(sdk), wrapSpeechModel),
    speechModel: adaptMethod(
      'google.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    transcription: adaptMethod(
      'google.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'google.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
    files: adaptMethod('google.files', sdk.files.bind(sdk), wrapFiles),
    interactions: adaptMethod(
      'google.interactions',
      sdk.interactions.bind(sdk),
      wrapLanguageModel,
    ),
    experimental_realtime: wrapRealtimeFactory(
      'google.experimental_realtime',
      sdk.experimental_realtime,
    ),
    tools: wrapProviderTools('google.tools', sdk.tools),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for Google
 * Generative AI.
 */
export type GoogleProvider = ReturnType<typeof wrapProviderMethods> & {
  image: AdaptedMethod<SdkProvider['image'], ReturnType<typeof wrapImageModel>>;
};

/**
 * Keep the callable provider and named model selectors from the Google Generative AI SDK
 * available as Effects.
 */
const wrapProvider = (sdk: SdkProvider): GoogleProvider =>
  Object.assign(wrapProviderMethods(sdk), {
    image: wrapImage(sdk),
  });
/**
 * Expose the same Google Generative AI contract as `GoogleProvider` under the SDK alias.
 */
export type GoogleGenerativeAIProvider = GoogleProvider;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Google Generative AI options and allow `apiKey` to resolve through
 * Effect when the SDK requests the value.
 */
export type GoogleGenerativeAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Keep the native Google Generative AI options and allow `apiKey` to resolve through
 * Effect when the SDK requests the value.
 */
export type GoogleProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Google Generative AI provider inside an Effect. Keep the scope open when
 * using an Effect resolver for `apiKey`.
 */
export const createGoogle = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleProvider
>('createGoogle', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGoogle(settings)),
);
/** Expose the same Google Generative AI factory as `createGoogle` under the SDK alias. */
export const createGoogleGenerativeAI = createGoogle;
/**
 * Adapt the preconfigured provider from the Google Generative AI SDK. Use the factory to
 * supply explicit settings.
 */
export const google: GoogleProvider = wrapProvider(sdkGoogle);
/** Construct the SDK Google realtime model lazily with its native options. */
export const Experimental_GoogleRealtimeModel: AdaptedConstructor<
  typeof SdkExperimental_GoogleRealtimeModel,
  Experimental_GoogleRealtimeModel
> = adaptModelConstructor(
  'Experimental_GoogleRealtimeModel',
  SdkExperimental_GoogleRealtimeModel,
  wrapRealtimeModel,
);
/**
 * Effect model returned by `Experimental_GoogleRealtimeModel`. Use its realtime connection
 * operations in an Effect program.
 */
export type Experimental_GoogleRealtimeModel = ReturnType<
  typeof wrapRealtimeModel
>;
// Workflow calls these host hooks synchronously. The Effects have no services.
/**
 * Run the synchronous serialization hooks with an empty Effect context for the workflow
 * host.
 */
const runWorkflowHook = Effect.runSyncWith(Context.empty());

/**
 * Expose synchronous workflow hooks on Google speech translation models instances
 * reconstructed by the Effect adapter.
 */
class GoogleSpeechTranslationWorkflowCarrier {
  /** Serialize the adapted model through its synchronous SDK workflow hook. */
  static [WORKFLOW_SERIALIZE](
    model: Experimental_GoogleSpeechTranslationModel,
  ) {
    return runWorkflowHook(
      Experimental_GoogleSpeechTranslationModel[WORKFLOW_SERIALIZE](model),
    );
  }

  /**
   * Restore the Effect model from the native workflow payload before handing it to the
   * host.
   */
  static [WORKFLOW_DESERIALIZE](
    input: Parameters<
      (typeof SdkExperimental_GoogleSpeechTranslationModel)[typeof WORKFLOW_DESERIALIZE]
    >[0],
  ) {
    return runWorkflowHook(
      Experimental_GoogleSpeechTranslationModel[WORKFLOW_DESERIALIZE](input),
    );
  }
}

/**
 * Attach the workflow carrier to the adapted Google speech translation models so the
 * workflow host can round-trip the instance.
 */
const wrapWorkflowSpeechTranslationModel = (
  model: SdkExperimental_GoogleSpeechTranslationModel,
) => {
  const wrapped = wrapSpeechTranslationModel(model);
  Object.defineProperty(wrapped, 'constructor', {
    value: GoogleSpeechTranslationWorkflowCarrier,
  });
  return wrapped;
};

/**
 * Expose synchronous workflow hooks on Google transcription models instances reconstructed
 * by the Effect adapter.
 */
class GoogleTranscriptionWorkflowCarrier {
  /** Serialize the adapted model through its synchronous SDK workflow hook. */
  static [WORKFLOW_SERIALIZE](model: GoogleTranscriptionModel) {
    return runWorkflowHook(GoogleTranscriptionModel[WORKFLOW_SERIALIZE](model));
  }

  /**
   * Restore the Effect model from the native workflow payload before handing it to the
   * host.
   */
  static [WORKFLOW_DESERIALIZE](
    input: Parameters<
      (typeof SdkGoogleTranscriptionModel)[typeof WORKFLOW_DESERIALIZE]
    >[0],
  ) {
    return runWorkflowHook(
      GoogleTranscriptionModel[WORKFLOW_DESERIALIZE](input),
    );
  }
}

/**
 * Attach the workflow carrier to the adapted Google transcription models so the workflow
 * host can round-trip the instance.
 */
const wrapWorkflowTranscriptionModel = (model: SdkGoogleTranscriptionModel) => {
  const wrapped = wrapTranscriptionModel(model);
  Object.defineProperty(wrapped, 'constructor', {
    value: GoogleTranscriptionWorkflowCarrier,
  });
  return wrapped;
};

/**
 * Construct the SDK Google speech translation model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
export const Experimental_GoogleSpeechTranslationModel: AdaptedWorkflowConstructor<
  typeof SdkExperimental_GoogleSpeechTranslationModel,
  Experimental_GoogleSpeechTranslationModel
> = adaptWorkflowModelConstructor(
  'Experimental_GoogleSpeechTranslationModel',
  SdkExperimental_GoogleSpeechTranslationModel,
  wrapWorkflowSpeechTranslationModel,
  unwrapSpeechTranslationModel,
);
/**
 * Effect model returned by `Experimental_GoogleSpeechTranslationModel`. Use its speech
 * translation operations in an Effect program.
 */
export type Experimental_GoogleSpeechTranslationModel = ReturnType<
  typeof wrapSpeechTranslationModel
>;
/**
 * Expose the same Google Generative AI constructor as
 * `Experimental_GoogleSpeechTranslationModel` under the SDK alias.
 */
export const Experimental_GoogleTranslationModel =
  Experimental_GoogleSpeechTranslationModel;
/**
 * Expose the same Google Generative AI contract as
 * `Experimental_GoogleSpeechTranslationModel` under the SDK alias.
 */
export type Experimental_GoogleTranslationModel =
  Experimental_GoogleSpeechTranslationModel;
/**
 * Construct the SDK Google transcription model lazily with its native options. It exposes
 * the workflow serialization hooks.
 */
export const GoogleTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkGoogleTranscriptionModel,
  GoogleTranscriptionModel
> = adaptWorkflowModelConstructor(
  'GoogleTranscriptionModel',
  SdkGoogleTranscriptionModel,
  wrapWorkflowTranscriptionModel,
  unwrapTranscriptionModel,
);
/**
 * Effect model returned by `GoogleTranscriptionModel`. Use its transcription operations in
 * an Effect program.
 */
export type GoogleTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;

/** Carry the native Google realtime configuration through the adapter host boundary. */
export type Experimental_GoogleRealtimeModelConfig =
  ProviderHostConfiguration<SdkExperimental_GoogleRealtimeModelConfig>;

/** Carry the native Google speech translation configuration through the host boundary. */
export type Experimental_GoogleSpeechTranslationModelConfig =
  ProviderHostConfiguration<SdkExperimental_GoogleSpeechTranslationModelConfig>;

/** Alias the speech translation configuration under the SDK translation model name. */
export type Experimental_GoogleTranslationModelConfig =
  ProviderHostConfiguration<SdkExperimental_GoogleTranslationModelConfig>;
