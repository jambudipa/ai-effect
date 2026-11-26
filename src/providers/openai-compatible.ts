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

/**
 * Preserve the SDK endpoint and option shape and allow Effect-based credentials and
 * supported hooks.
 */
export type OpenAICompatibleProviderSettings<
  E = never,
  R = never,
> = CompatibleSettings<SdkSettings, E, R>;

/**
 * Carry the model ID types for each operation and overload setup according to the settings
 * scope.
 */
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

/**
 * Bind compatible settings to the current scope and retain the four independent model ID
 * types.
 */
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

/**
 * Build a provider for an OpenAI-compatible endpoint. Give effectful settings a scope that
 * covers its requests.
 */
export const createOpenAICompatible =
  createOpenAICompatibleScoped as CreateOpenAICompatible;

/**
 * Keep structured-output capability and offer request preparation and response conversion
 * as Effects.
 */
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

/**
 * Construct the SDK OpenAI-compatible chat model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
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
/**
 * Effect model returned by `OpenAICompatibleChatLanguageModel`. Use its chat generation
 * operations in an Effect program.
 */
export type OpenAICompatibleChatLanguageModel = ReturnType<
  typeof wrapChatModel
>;

/**
 * Construct the SDK OpenAI-compatible completion model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
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
/**
 * Effect model returned by `OpenAICompatibleCompletionLanguageModel`. Use its completion
 * operations in an Effect program.
 */
export type OpenAICompatibleCompletionLanguageModel = ReturnType<
  typeof wrapLanguageModel
>;

/**
 * Construct the SDK OpenAI-compatible embedding model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
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
/**
 * Effect model returned by `OpenAICompatibleEmbeddingModel`. Use its embedding operations
 * in an Effect program.
 */
export type OpenAICompatibleEmbeddingModel = ReturnType<
  typeof wrapEmbeddingModel
>;

/**
 * Construct the SDK OpenAI-compatible image model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
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
/**
 * Effect model returned by `OpenAICompatibleImageModel`. Use its image generation
 * operations in an Effect program.
 */
export type OpenAICompatibleImageModel = ReturnType<typeof wrapImageModel>;
