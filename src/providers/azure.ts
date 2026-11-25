import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AzureOpenAIProviderSettings as SdkSettings } from '../internal/provider-contracts/azure.js';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createAzure as sdkCreateAzure,
  azure as sdkAzure,
  VERSION as sdkVersion,
} from '@ai-sdk/azure';
import type { AzureOpenAIProvider as SdkProvider } from '../internal/provider-contracts/azure.js';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapImageModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
} from '../internal/provider-model.js';

export const VERSION: string = sdkVersion;
export type {
  AzureDeepSeekChatOptions,
  AzureDeepSeekLanguageModelOptions,
  AzureImageModelOptions,
  AzureOpenAILanguageModelSettings,
  AzureResponsesProviderMetadata,
  AzureResponsesReasoningProviderMetadata,
  AzureResponsesSourceDocumentProviderMetadata,
  AzureResponsesTextProviderMetadata,
  AzureSpeechModelOptions,
  AzureTranscriptionModelOptions,
  AzureTranscriptionProviderMetadata,
  OpenAIChatLanguageModelOptions,
  OpenAILanguageModelChatOptions,
  OpenAILanguageModelResponsesOptions,
  OpenAIResponsesProviderOptions,
  OpenAIResponsesSystemMessageOptions,
} from '../internal/provider-contracts/azure.js';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('azure', sdk, wrapLanguageModel), {
    ...wrapProviderBase('azure', sdk),
    languageModel: adaptMethod(
      'azure.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('azure.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    deepseek: adaptMethod(
      'azure.deepseek',
      sdk.deepseek.bind(sdk),
      wrapLanguageModel,
    ),
    responses: adaptMethod(
      'azure.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    completion: adaptMethod(
      'azure.completion',
      sdk.completion.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'azure.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'azure.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbedding: adaptMethod(
      'azure.textEmbedding',
      sdk.textEmbedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'azure.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    image: adaptMethod('azure.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'azure.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    transcription: adaptMethod(
      'azure.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'azure.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
    speech: adaptMethod('azure.speech', sdk.speech.bind(sdk), wrapSpeechModel),
    speechModel: adaptMethod(
      'azure.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    tools: wrapProviderTools('azure.tools', sdk.tools),
  });
export type AzureOpenAIProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey' | 'tokenProvider';
export type AzureOpenAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createAzure = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AzureOpenAIProvider
>('createAzure', ['apiKey', 'tokenProvider'], (settings) =>
  wrapProvider(sdkCreateAzure(settings)),
);
export const azure: AzureOpenAIProvider = wrapProvider(sdkAzure);
