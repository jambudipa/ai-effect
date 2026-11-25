import type { Effect, Scope } from 'effect';
import type { AiSdkError } from './operation.js';
import type { LanguageModelV4 } from './language-model.js';
import { buildWithCompatibleSettings } from './provider-openai-configuration.js';
import type {
  CompatibleSettings,
  StaticCompatibleSettings,
} from './provider-openai-configuration.js';
import type { OpenAICompatibleProvider as SdkProvider } from '@ai-sdk/openai-compatible';
import { wrapLanguageModel } from './language-model.js';
import { adaptMethod, wrapProviderBase } from './provider-adapter.js';
import { wrapEmbeddingModel, wrapImageModel } from './provider-model.js';

type NativeLanguageModelOptions = NonNullable<
  Parameters<SdkProvider['languageModel']>[1]
>;

const selectLanguageModel = <Id extends string>(
  name: string,
  select: (
    modelId: Id,
    options?: NativeLanguageModelOptions,
  ) => Parameters<typeof wrapLanguageModel>[0],
) => {
  function selected(
    modelId: Id,
    config?: StaticCompatibleSettings<NativeLanguageModelOptions>,
  ): Effect.Effect<LanguageModelV4, AiSdkError>;
  function selected<E, R>(
    modelId: Id,
    config: CompatibleSettings<NativeLanguageModelOptions, E, R>,
  ): Effect.Effect<LanguageModelV4, AiSdkError, R | Scope.Scope>;
  function selected<E, R>(
    modelId: Id,
    config?: CompatibleSettings<NativeLanguageModelOptions, E, R>,
  ) {
    return buildWithCompatibleSettings<
      NativeLanguageModelOptions,
      R,
      LanguageModelV4
    >(name, config, (settings) => wrapLanguageModel(select(modelId, settings)));
  }
  return selected;
};

export const wrapOpenAICompatibleProvider = <
  Chat extends string,
  Completion extends string,
  Embedding extends string,
  Image extends string,
>(
  name: string,
  sdk: SdkProvider<Chat, Completion, Embedding, Image>,
) =>
  Object.assign(adaptMethod(name, sdk, wrapLanguageModel), {
    ...wrapProviderBase(name, sdk),
    languageModel: selectLanguageModel(
      `${name}.languageModel`,
      sdk.languageModel.bind(sdk),
    ),
    chatModel: adaptMethod(
      `${name}.chatModel`,
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    completionModel: adaptMethod(
      `${name}.completionModel`,
      sdk.completionModel.bind(sdk),
      wrapLanguageModel,
    ),
    embeddingModel: adaptMethod(
      `${name}.embeddingModel`,
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      `${name}.textEmbeddingModel`,
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    imageModel: adaptMethod(
      `${name}.imageModel`,
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
  });

export type OpenAICompatibleProvider<
  Chat extends string = string,
  Completion extends string = string,
  Embedding extends string = string,
  Image extends string = string,
> = ReturnType<
  typeof wrapOpenAICompatibleProvider<Chat, Completion, Embedding, Image>
>;
