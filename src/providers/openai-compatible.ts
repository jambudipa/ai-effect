import type { Effect, Scope } from 'effect';
import type { AiSdkError } from '../internal/operation.js';
import { createWithProviderSettings } from '../internal/provider-settings.js';
import type {
  EffectProviderSettings,
  StaticProviderSettings,
} from '../internal/provider-settings.js';
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
import { adaptModelConstructor } from '../internal/provider-adapter.js';
import {
  requestMethod,
  wrapEmbeddingModel,
  wrapImageModel,
} from '../internal/provider-model.js';

export type { OpenAICompatibleProvider } from '../internal/provider-openai-compatible.js';
export { VERSION } from '@ai-sdk/openai-compatible';
export type {
  MetadataExtractor,
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
  ProviderErrorStructure,
} from '@ai-sdk/openai-compatible';

export type OpenAICompatibleProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, 'apiKey', E, R>;

export function createOpenAICompatible<
  Chat extends string,
  Completion extends string,
  Embedding extends string,
  Image extends string,
>(
  options: StaticProviderSettings<SdkSettings, 'apiKey'>,
): Effect.Effect<
  OpenAICompatibleProvider<Chat, Completion, Embedding, Image>,
  AiSdkError
>;
export function createOpenAICompatible<
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
export function createOpenAICompatible<
  Chat extends string,
  Completion extends string,
  Embedding extends string,
  Image extends string,
  E,
  R,
>(options: OpenAICompatibleProviderSettings<E, R>) {
  return createWithProviderSettings<
    SdkSettings,
    R,
    OpenAICompatibleProvider<Chat, Completion, Embedding, Image>
  >('createOpenAICompatible', options, ['apiKey'], (settings) =>
    wrapOpenAICompatibleProvider(
      'openai-compatible',
      sdkCreateOpenAICompatible<Chat, Completion, Embedding, Image>(
        settings as SdkSettings,
      ),
    ),
  );
}

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

export const OpenAICompatibleChatLanguageModel = adaptModelConstructor(
  'OpenAICompatibleChatLanguageModel',
  SdkChatModel,
  wrapChatModel,
);
export type OpenAICompatibleChatLanguageModel = ReturnType<
  typeof wrapChatModel
>;

export const OpenAICompatibleCompletionLanguageModel = adaptModelConstructor(
  'OpenAICompatibleCompletionLanguageModel',
  SdkCompletionModel,
  wrapLanguageModel,
);
export type OpenAICompatibleCompletionLanguageModel = ReturnType<
  typeof wrapLanguageModel
>;

export const OpenAICompatibleEmbeddingModel = adaptModelConstructor(
  'OpenAICompatibleEmbeddingModel',
  SdkEmbeddingModel,
  wrapEmbeddingModel,
);
export type OpenAICompatibleEmbeddingModel = ReturnType<
  typeof wrapEmbeddingModel
>;

export const OpenAICompatibleImageModel = adaptModelConstructor(
  'OpenAICompatibleImageModel',
  SdkImageModel,
  wrapImageModel,
);
export type OpenAICompatibleImageModel = ReturnType<typeof wrapImageModel>;
