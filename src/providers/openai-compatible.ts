import type { Effect, Scope } from 'effect';
import type { AiSdkError } from '../internal/operation.js';
import {
  adaptCompatibleModel,
  buildWithCompatibleSettings,
} from '../internal/provider-openai-configuration.js';
import type {
  CompatibleModelConstructor,
  CompatibleSettings,
  StaticCompatibleSettings,
} from '../internal/provider-openai-configuration.js';
export type {
  MetadataExtractor,
  ProviderErrorStructure,
} from '../internal/provider-openai-configuration.js';
import type { OpenAICompatibleProvider } from '../internal/provider-openai-compatible.js';
import {
  createOpenAICompatible as sdkCreateOpenAICompatible,
  OpenAICompatibleChatLanguageModel as SdkChatModel,
  OpenAICompatibleCompletionLanguageModel as SdkCompletionModel,
  OpenAICompatibleEmbeddingModel as SdkEmbeddingModel,
  OpenAICompatibleImageModel as SdkImageModel,
} from '@ai-sdk/openai-compatible';
import type { OpenAICompatibleProviderSettings as SdkSettings } from '@ai-sdk/openai-compatible';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapOpenAICompatibleProvider } from '../internal/provider-openai-compatible.js';
import { runRequest } from '../internal/operation.js';
import {
  requestMethod,
  wrapEmbeddingModel,
  wrapImageModel,
} from '../internal/provider-model.js';

export type { OpenAICompatibleProvider } from '../internal/provider-openai-compatible.js';
export { VERSION } from '@ai-sdk/openai-compatible';
export type {
  OpenAICompatibleChatModelId,
  OpenAICompatibleCompletionModelId,
  OpenAICompatibleCompletionProviderOptions,
  OpenAICompatibleEmbeddingModelId,
  OpenAICompatibleEmbeddingModelOptions,
  OpenAICompatibleEmbeddingProviderOptions,
  OpenAICompatibleErrorData,
  OpenAICompatibleImageModelOptions,
  OpenAICompatibleLanguageModelChatOptions,
  OpenAICompatibleLanguageModelCompletionOptions,
  OpenAICompatibleProviderOptions,
} from '@ai-sdk/openai-compatible';

export type OpenAICompatibleProviderSettings<
  E = never,
  R = never,
> = CompatibleSettings<SdkSettings, E, R>;

interface CreateOpenAICompatible {
  <
    Chat extends string,
    Completion extends string,
    Embedding extends string,
    Image extends string,
  >(
    options: StaticCompatibleSettings<SdkSettings>,
  ): Effect.Effect<
    OpenAICompatibleProvider<Chat, Completion, Embedding, Image>,
    AiSdkError
  >;
  <
    Chat extends string,
    Completion extends string,
    Embedding extends string,
    Image extends string,
    E = never,
    R = never,
  >(
    options: OpenAICompatibleProviderSettings<E, R>,
  ): Effect.Effect<
    OpenAICompatibleProvider<Chat, Completion, Embedding, Image>,
    AiSdkError,
    R | Scope.Scope
  >;
}

function createOpenAICompatibleScoped<
  Chat extends string,
  Completion extends string,
  Embedding extends string,
  Image extends string,
  E,
  R,
>(
  options: OpenAICompatibleProviderSettings<E, R>,
): Effect.Effect<
  OpenAICompatibleProvider<Chat, Completion, Embedding, Image>,
  AiSdkError,
  R | Scope.Scope
> {
  return buildWithCompatibleSettings<
    SdkSettings,
    R,
    OpenAICompatibleProvider<Chat, Completion, Embedding, Image>
  >('createOpenAICompatible', options, (settings) =>
    wrapOpenAICompatibleProvider(
      'openai-compatible',
      sdkCreateOpenAICompatible<Chat, Completion, Embedding, Image>(
        settings as SdkSettings,
      ),
    ),
  );
}

export const createOpenAICompatible =
  createOpenAICompatibleScoped as CreateOpenAICompatible;

const wrapChatModel = (model: SdkChatModel) =>
  Object.assign(wrapLanguageModel(model), {
    supportsStructuredOutputs: model.supportsStructuredOutputs,
    prepareRequest: requestMethod(
      'OpenAICompatibleChatLanguageModel.prepareRequest',
      model.prepareRequest.bind(model),
    ),
    convertResponse: (options: Parameters<typeof model.convertResponse>[0]) =>
      runRequest('OpenAICompatibleChatLanguageModel.convertResponse', {}, () =>
        model.convertResponse(options),
      ),
  });

export const OpenAICompatibleChatLanguageModel: CompatibleModelConstructor<
  typeof SdkChatModel,
  OpenAICompatibleChatLanguageModel
> = adaptCompatibleModel(
  'OpenAICompatibleChatLanguageModel',
  SdkChatModel,
  wrapChatModel,
);
export type OpenAICompatibleChatLanguageModel = ReturnType<
  typeof wrapChatModel
>;

export const OpenAICompatibleCompletionLanguageModel: CompatibleModelConstructor<
  typeof SdkCompletionModel,
  OpenAICompatibleCompletionLanguageModel
> = adaptCompatibleModel(
  'OpenAICompatibleCompletionLanguageModel',
  SdkCompletionModel,
  wrapLanguageModel,
);
export type OpenAICompatibleCompletionLanguageModel = ReturnType<
  typeof wrapLanguageModel
>;

export const OpenAICompatibleEmbeddingModel: CompatibleModelConstructor<
  typeof SdkEmbeddingModel,
  OpenAICompatibleEmbeddingModel
> = adaptCompatibleModel(
  'OpenAICompatibleEmbeddingModel',
  SdkEmbeddingModel,
  wrapEmbeddingModel,
);
export type OpenAICompatibleEmbeddingModel = ReturnType<
  typeof wrapEmbeddingModel
>;

export const OpenAICompatibleImageModel: CompatibleModelConstructor<
  typeof SdkImageModel,
  OpenAICompatibleImageModel
> = adaptCompatibleModel(
  'OpenAICompatibleImageModel',
  SdkImageModel,
  wrapImageModel,
);
export type OpenAICompatibleImageModel = ReturnType<typeof wrapImageModel>;
