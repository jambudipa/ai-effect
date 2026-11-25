import type { OpenAICompatibleProvider as SdkProvider } from '@ai-sdk/openai-compatible';
import { wrapLanguageModel } from './language-model.js';
import { adaptMethod, wrapProviderBase } from './provider-adapter.js';
import { wrapEmbeddingModel, wrapImageModel } from './provider-model.js';

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
    languageModel: adaptMethod(
      `${name}.languageModel`,
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
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
