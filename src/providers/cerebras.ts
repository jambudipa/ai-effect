import {
  VERSION,
  cerebras as sdkCerebras,
  createCerebras as sdkCreateCerebras,
  type CerebrasProvider as SdkCerebrasProvider,
  type CerebrasProviderSettings,
} from '@ai-sdk/cerebras';
import { Effect } from 'effect';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runRequest, runSync } from '../internal/operation.js';

export { VERSION };
export type {
  CerebrasErrorData,
  CerebrasLanguageModelChatOptions,
  CerebrasProviderSettings,
} from '@ai-sdk/cerebras';
export type { LanguageModelV4 } from '../internal/language-model.js';
export type {
  LanguageModelV4CallOptions,
  LanguageModelV4GenerateResult,
  LanguageModelV4StreamPart,
} from '@ai-sdk/provider';

type ModelId = Parameters<SdkCerebrasProvider>[0];

/** The callable Cerebras provider and its model selectors. */
export type CerebrasProvider = ReturnType<typeof wrapCerebras>;

const wrapCerebras = (sdk: SdkCerebrasProvider) =>
  Object.assign(
    (modelId: ModelId) =>
      runSync('cerebras', () => wrapLanguageModel(sdk(modelId))),
    {
      specificationVersion: sdk.specificationVersion,
      languageModel: (modelId: ModelId) =>
        runSync('cerebras.languageModel', () =>
          wrapLanguageModel(sdk.languageModel(modelId)),
        ),
      chat: (modelId: ModelId) =>
        runSync('cerebras.chat', () => wrapLanguageModel(sdk.chat(modelId))),
      embeddingModel: (modelId: string) =>
        runSync('cerebras.embeddingModel', () =>
          sdk.embeddingModel(modelId),
        ).pipe(
          Effect.map((model) => ({
            specificationVersion: model.specificationVersion,
            provider: model.provider,
            modelId: model.modelId,
            maxEmbeddingsPerCall: runRequest(
              'cerebras.embeddingModel.maxEmbeddingsPerCall',
              {},
              () => Promise.resolve(model.maxEmbeddingsPerCall),
            ),
            supportsParallelCalls: runRequest(
              'cerebras.embeddingModel.supportsParallelCalls',
              {},
              () => Promise.resolve(model.supportsParallelCalls),
            ),
            doEmbed: (options: Parameters<typeof model.doEmbed>[0]) =>
              runRequest(
                'cerebras.embeddingModel.doEmbed',
                options,
                (abortSignal) => model.doEmbed({ ...options, abortSignal }),
              ),
          })),
        ),
      imageModel: (modelId: string) =>
        runSync('cerebras.imageModel', () => sdk.imageModel(modelId)).pipe(
          Effect.map((model) => ({
            specificationVersion: model.specificationVersion,
            provider: model.provider,
            modelId: model.modelId,
            maxImagesPerCall: runRequest(
              'cerebras.imageModel.maxImagesPerCall',
              {},
              () => Promise.resolve(model.maxImagesPerCall),
            ),
            doGenerate: (options: Parameters<typeof model.doGenerate>[0]) =>
              runRequest(
                'cerebras.imageModel.doGenerate',
                options,
                (abortSignal) => model.doGenerate({ ...options, abortSignal }),
              ),
          })),
        ),
      textEmbeddingModel: (modelId: string) =>
        runSync('cerebras.textEmbeddingModel', () =>
          sdk.textEmbeddingModel(modelId),
        ),
    },
  );

/** Use Cerebras with its default settings. Requests start on execution. */
export const cerebras = wrapCerebras(sdkCerebras);

/** Create a Cerebras provider with caller-supplied settings. */
export const createCerebras = (options?: CerebrasProviderSettings) =>
  runSync('createCerebras', () => wrapCerebras(sdkCreateCerebras(options)));
