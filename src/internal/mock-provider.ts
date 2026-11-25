import { NoSuchModelError } from '@ai-sdk/provider';
import { Effect } from 'effect';
import { sdkError, type AiSdkError } from './operation.js';

export interface FixtureModels {
  readonly language: unknown;
  readonly embedding: unknown;
  readonly image: unknown;
  readonly transcription: unknown;
  readonly speech: unknown;
  readonly reranking: unknown;
}

type Settings<Models extends FixtureModels> = {
  readonly [Name in keyof Models & string as `${Name}Models`]?: Readonly<
    Record<string, Models[Name]>
  >;
};

type ModelType = ConstructorParameters<typeof NoSuchModelError>[0]['modelType'];

const select =
  <Model>(
    operation: string,
    modelType: ModelType,
    models?: Readonly<Record<string, Model>>,
  ) =>
  (modelId: string): Effect.Effect<Model, AiSdkError> =>
    Effect.suspend(() => {
      if (models && Object.hasOwn(models, modelId))
        return Effect.succeed(models[modelId] as Model);
      return Effect.fail(
        sdkError(operation, new NoSuchModelError({ modelType, modelId })),
      );
    });

export function mockProvider<
  Version extends 'v3' | 'v4',
  Models extends FixtureModels,
>(version: Version) {
  return (settings?: Settings<Models>) =>
    Effect.sync(() => ({
      specificationVersion: version,
      languageModel: select<Models['language']>(
        'MockProvider.languageModel',
        'languageModel',
        settings?.languageModels,
      ),
      embeddingModel: select<Models['embedding']>(
        'MockProvider.embeddingModel',
        'embeddingModel',
        settings?.embeddingModels,
      ),
      imageModel: select<Models['image']>(
        'MockProvider.imageModel',
        'imageModel',
        settings?.imageModels,
      ),
      transcriptionModel: select<Models['transcription']>(
        'MockProvider.transcriptionModel',
        'transcriptionModel',
        settings?.transcriptionModels,
      ),
      speechModel: select<Models['speech']>(
        'MockProvider.speechModel',
        'speechModel',
        settings?.speechModels,
      ),
      rerankingModel: select<Models['reranking']>(
        'MockProvider.rerankingModel',
        'rerankingModel',
        settings?.rerankingModels,
      ),
    }));
}
