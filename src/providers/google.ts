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
  adaptMethod,
  adaptModelConstructor,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
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

export { VERSION } from '@ai-sdk/google';
export type {
  Experimental_GoogleRealtimeModelConfig,
  Experimental_GoogleRealtimeModelId,
  Experimental_GoogleRealtimeModelOptions,
  Experimental_GoogleSpeechTranslationModelConfig,
  Experimental_GoogleSpeechTranslationModelId,
  Experimental_GoogleSpeechTranslationModelOptions,
  Experimental_GoogleTranslationModelConfig,
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

const wrapImage = (
  sdk: SdkProvider,
): AdaptedMethod<SdkProvider['image'], ReturnType<typeof wrapImageModel>> =>
  adaptMethod('google.image', sdk.image.bind(sdk), wrapImageModel);

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
export type GoogleProvider = ReturnType<typeof wrapProviderMethods> & {
  image: AdaptedMethod<SdkProvider['image'], ReturnType<typeof wrapImageModel>>;
};

const wrapProvider = (sdk: SdkProvider): GoogleProvider =>
  Object.assign(wrapProviderMethods(sdk), {
    image: wrapImage(sdk),
  });
export type GoogleGenerativeAIProvider = GoogleProvider;
type ResolverKey = 'apiKey';
export type GoogleGenerativeAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export type GoogleProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createGoogle = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleProvider
>('createGoogle', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGoogle(settings)),
);
export const createGoogleGenerativeAI = createGoogle;
export const google: GoogleProvider = wrapProvider(sdkGoogle);
export const Experimental_GoogleRealtimeModel = adaptModelConstructor(
  'Experimental_GoogleRealtimeModel',
  SdkExperimental_GoogleRealtimeModel,
  wrapRealtimeModel,
);
export type Experimental_GoogleRealtimeModel = ReturnType<
  typeof wrapRealtimeModel
>;
export const Experimental_GoogleSpeechTranslationModel = adaptModelConstructor(
  'Experimental_GoogleSpeechTranslationModel',
  SdkExperimental_GoogleSpeechTranslationModel,
  wrapSpeechTranslationModel,
);
export type Experimental_GoogleSpeechTranslationModel = ReturnType<
  typeof wrapSpeechTranslationModel
>;
export const Experimental_GoogleTranslationModel =
  Experimental_GoogleSpeechTranslationModel;
export type Experimental_GoogleTranslationModel =
  Experimental_GoogleSpeechTranslationModel;
export const GoogleTranscriptionModel: AdaptedConstructor<
  typeof SdkGoogleTranscriptionModel,
  GoogleTranscriptionModel
> = adaptModelConstructor(
  'GoogleTranscriptionModel',
  SdkGoogleTranscriptionModel,
  wrapTranscriptionModel,
);
export type GoogleTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
