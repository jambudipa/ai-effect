// Generated from @ai-sdk/azure@4.0.131. Do not edit.
// Original license: openai.LICENSE.
// Preserve discriminator literals with the Zod 3.25.76 bridge.
/* eslint-disable effect/no-zod-use-schema -- Pinned SDK declaration types use Zod. */
import type {
  OpenAIProvider,
  OpenaiResponsesProviderMetadata as ResponsesProviderMetadata,
  OpenaiResponsesReasoningProviderMetadata as ResponsesReasoningProviderMetadata,
  OpenaiResponsesSourceDocumentProviderMetadata as ResponsesSourceDocumentProviderMetadata,
  OpenaiResponsesTextProviderMetadata as ResponsesTextProviderMetadata,
} from './openai.js';
import {
  EmbeddingModelV4,
  ImageModelV4,
  LanguageModelV4,
  ProviderV4,
  SpeechModelV4,
  TranscriptionModelV4,
} from '@ai-sdk/provider';
import {
  FetchFunction,
  InferSchema,
  Resolvable,
  WebSocketConstructor,
} from '@ai-sdk/provider-utils';
import { DeepSeekLanguageModelChatOptions } from '@ai-sdk/deepseek';
import {
  OpenAILanguageModelChatOptions,
  OpenAILanguageModelChatOptions as OpenAIChatLanguageModelOptions,
  OpenAILanguageModelResponsesOptions,
  OpenAILanguageModelResponsesOptions as OpenAIResponsesProviderOptions,
  OpenAIResponsesSystemMessageOptions,
} from './openai.js';
declare const azureOpenaiTools: {
  applyPatch: OpenAIProvider['tools']['applyPatch'];
  codeInterpreter: OpenAIProvider['tools']['codeInterpreter'];
  customTool: OpenAIProvider['tools']['customTool'];
  fileSearch: OpenAIProvider['tools']['fileSearch'];
  imageGeneration: OpenAIProvider['tools']['imageGeneration'];
  shell: OpenAIProvider['tools']['shell'];
  toolSearch: OpenAIProvider['tools']['toolSearch'];
  webSearch: OpenAIProvider['tools']['webSearch'];
  webSearchPreview: OpenAIProvider['tools']['webSearchPreview'];
};
interface AzureOpenAILanguageModelSettings {
  modelId?: string;
}
interface AzureOpenAIProvider extends ProviderV4 {
  (
    deploymentId: string,
    settings?: AzureOpenAILanguageModelSettings,
  ): LanguageModelV4;
  languageModel(
    deploymentId: string,
    settings?: AzureOpenAILanguageModelSettings,
  ): LanguageModelV4;
  chat(
    deploymentId: string,
    settings?: AzureOpenAILanguageModelSettings,
  ): LanguageModelV4;
  deepseek(deploymentId: string): LanguageModelV4;
  responses(
    deploymentId: string,
    settings?: AzureOpenAILanguageModelSettings,
  ): LanguageModelV4;
  completion(
    deploymentId: string,
    settings?: AzureOpenAILanguageModelSettings,
  ): LanguageModelV4;
  embedding(deploymentId: string): EmbeddingModelV4;
  embeddingModel(deploymentId: string): EmbeddingModelV4;
  textEmbedding(deploymentId: string): EmbeddingModelV4;
  textEmbeddingModel(deploymentId: string): EmbeddingModelV4;
  image(deploymentId: string): ImageModelV4;
  imageModel(deploymentId: string): ImageModelV4;
  transcription(deploymentId: string): TranscriptionModelV4;
  transcriptionModel(deploymentId: string): TranscriptionModelV4;
  speech(deploymentId: string): SpeechModelV4;
  speechModel(deploymentId: string): SpeechModelV4;
  tools: typeof azureOpenaiTools;
}
interface AzureOpenAIProviderSettings {
  resourceName?: string;
  baseURL?: string;
  apiKey?: Resolvable<string>;
  tokenProvider?: (() => Promise<string>) | undefined;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
  apiVersion?: string;
  useDeploymentBasedUrls?: boolean;
  speechBaseURL?: string;
  maiBaseURL?: string;
  webSocket?: WebSocketConstructor;
}
export declare function createAzure(
  options?: AzureOpenAIProviderSettings,
): AzureOpenAIProvider;
export declare const azure: AzureOpenAIProvider;
type AzureResponsesProviderMetadata = {
  azure: ResponsesProviderMetadata;
};
type AzureResponsesReasoningProviderMetadata = {
  azure: ResponsesReasoningProviderMetadata;
};
type AzureResponsesTextProviderMetadata = {
  azure: ResponsesTextProviderMetadata;
};
type AzureResponsesSourceDocumentProviderMetadata = {
  azure: ResponsesSourceDocumentProviderMetadata;
};
export declare const VERSION: string;
declare const azureImageModelOptions: import('@ai-sdk/provider-utils').LazySchema<{
  background?: 'transparent' | 'opaque' | 'auto' | undefined;
  autoAspectRatio?: boolean | undefined;
  webGrounding?: boolean | undefined;
  api?: 'openai' | 'mai' | undefined;
}>;
type AzureImageModelOptions = InferSchema<typeof azureImageModelOptions>;
declare const azureSpeechModelOptions: import('@ai-sdk/provider-utils').LazySchema<{
  style?: string | undefined;
  styleDegree?: number | undefined;
  instructions?: string | null | undefined;
  speed?: number | null | undefined;
  api?: 'openai' | 'speech' | undefined;
}>;
type AzureSpeechModelOptions = InferSchema<typeof azureSpeechModelOptions>;
declare const azureTranscriptionModelOptions: import('@ai-sdk/provider-utils').LazySchema<{
  language?: string | undefined;
  timestamps?: 'word' | 'segment' | 'none' | undefined;
  transcribeStyle?: 'verbatim' | 'clean' | undefined;
  locales?: string[] | undefined;
  diarization?:
    | {
        enabled: boolean;
      }
    | undefined;
  phraseList?:
    | {
        phrases: string[];
      }
    | undefined;
  include?: string[] | undefined;
  languages?: string[] | undefined;
  keywords?: string[] | undefined;
  prompt?: string | undefined;
  temperature?: number | undefined;
  timestampGranularities?: ('word' | 'segment')[] | undefined;
  responseFormat?: 'verbose_json' | 'diarized_json' | 'json' | undefined;
  chunkingStrategy?:
    | 'auto'
    | {
        type: 'server_vad';
        threshold?: number | undefined;
        prefixPaddingMs?: number | undefined;
        silenceDurationMs?: number | undefined;
      }
    | undefined;
  streaming?:
    | {
        delay?: 'low' | 'medium' | 'high' | 'xhigh' | 'minimal' | undefined;
        include?: string[] | undefined;
      }
    | undefined;
  api?: 'openai' | 'mai' | 'speech' | undefined;
}>;
type AzureTranscriptionModelOptions = InferSchema<
  typeof azureTranscriptionModelOptions
>;
type AzureTranscriptionProviderMetadata = {
  azure: {
    phrases: Array<{
      text: string;
      offsetMilliseconds?: number | null;
      durationMilliseconds?: number | null;
      locale?: string | null;
      speaker?: number | null;
      confidence?: number | null;
      words?: Array<{
        text: string;
        offsetMilliseconds?: number | null;
        durationMilliseconds?: number | null;
      }> | null;
    }>;
  };
};
export type AzureDeepSeekLanguageModelOptions = Omit<
  DeepSeekLanguageModelChatOptions,
  'thinking'
>;
export type AzureDeepSeekChatOptions = AzureDeepSeekLanguageModelOptions;
export type {
  AzureImageModelOptions,
  AzureOpenAILanguageModelSettings,
  AzureOpenAIProvider,
  AzureOpenAIProviderSettings,
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
};
