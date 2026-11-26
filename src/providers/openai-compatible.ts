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
import {
  unwrapLanguageModel,
  wrapLanguageModel,
} from '../internal/language-model.js';
import { wrapOpenAICompatibleProvider } from '../internal/provider-openai-compatible.js';
import { runRequest } from '../internal/operation.js';
import {
  requestMethod,
  unwrapEmbeddingModel,
  unwrapImageModel,
  wrapEmbeddingModel,
  wrapImageModel,
} from '../internal/provider-model.js';
import {
  workflowModelHooks,
  type AdaptedWorkflowHooks,
} from '../internal/workflow-model.js';

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
> &
  AdaptedWorkflowHooks<typeof SdkChatModel, OpenAICompatibleChatLanguageModel> =
  Object.assign(
    adaptCompatibleModel(
      'OpenAICompatibleChatLanguageModel',
      SdkChatModel,
      wrapChatModel,
    ),
    workflowModelHooks(
      'OpenAICompatibleChatLanguageModel',
      SdkChatModel,
      wrapChatModel,
      unwrapLanguageModel,
    ),
  );
export type OpenAICompatibleChatLanguageModel = ReturnType<
  typeof wrapChatModel
>;

export const OpenAICompatibleCompletionLanguageModel: CompatibleModelConstructor<
  typeof SdkCompletionModel,
  OpenAICompatibleCompletionLanguageModel
> &
  AdaptedWorkflowHooks<
    typeof SdkCompletionModel,
    OpenAICompatibleCompletionLanguageModel
  > = Object.assign(
  adaptCompatibleModel(
    'OpenAICompatibleCompletionLanguageModel',
    SdkCompletionModel,
    wrapLanguageModel,
  ),
  workflowModelHooks(
    'OpenAICompatibleCompletionLanguageModel',
    SdkCompletionModel,
    wrapLanguageModel,
    unwrapLanguageModel,
  ),
);
export type OpenAICompatibleCompletionLanguageModel = ReturnType<
  typeof wrapLanguageModel
>;

export const OpenAICompatibleEmbeddingModel: CompatibleModelConstructor<
  typeof SdkEmbeddingModel,
  OpenAICompatibleEmbeddingModel
> &
  AdaptedWorkflowHooks<
    typeof SdkEmbeddingModel,
    OpenAICompatibleEmbeddingModel
  > = Object.assign(
  adaptCompatibleModel(
    'OpenAICompatibleEmbeddingModel',
    SdkEmbeddingModel,
    wrapEmbeddingModel,
  ),
  workflowModelHooks(
    'OpenAICompatibleEmbeddingModel',
    SdkEmbeddingModel,
    wrapEmbeddingModel,
    unwrapEmbeddingModel,
  ),
);
export type OpenAICompatibleEmbeddingModel = ReturnType<
  typeof wrapEmbeddingModel
>;

export const OpenAICompatibleImageModel: CompatibleModelConstructor<
  typeof SdkImageModel,
  OpenAICompatibleImageModel
> &
  AdaptedWorkflowHooks<typeof SdkImageModel, OpenAICompatibleImageModel> =
  Object.assign(
    adaptCompatibleModel(
      'OpenAICompatibleImageModel',
      SdkImageModel,
      wrapImageModel,
    ),
    workflowModelHooks(
      'OpenAICompatibleImageModel',
      SdkImageModel,
      wrapImageModel,
      unwrapImageModel,
    ),
  );
export type OpenAICompatibleImageModel = ReturnType<typeof wrapImageModel>;
