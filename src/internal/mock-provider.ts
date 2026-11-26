import { NoSuchModelError } from '@ai-sdk/provider';
import { Effect } from 'effect';
import { sdkError, type AiSdkError } from './operation.js';

/** Define the capability-specific test model types accepted by fixture provider builders. */
export interface FixtureModels {
  /** Supply a language fixture that supports the tested generation or stream path. */
  readonly language: unknown;
  /** Supply an embedding fixture for assertions on embedding calls. */
  readonly embedding: unknown;
  /** Supply an image fixture for provider image lookup tests. */
  readonly image: unknown;
  /** Supply a transcription fixture for provider audio lookup tests. */
  readonly transcription: unknown;
  /** Supply a speech fixture for provider synthesis lookup tests. */
  readonly speech: unknown;
  /** Supply a reranking fixture for provider document-scoring lookup tests. */
  readonly reranking: unknown;
}

/** Configure optional per-capability maps indexed by the model IDs under test. */
type Settings<Models extends FixtureModels> = {
  readonly [Name in keyof Models & string as `${Name}Models`]?: Readonly<
    Record<string, Models[Name]>
  >;
};

/** Label missing fixture model errors using the native SDK capability name. */
type ModelType = ConstructorParameters<typeof NoSuchModelError>[0]['modelType'];

/** Select a registered fixture ID or return a typed SDK missing-model error. */
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

/** Build a provider test double with versioned identity and configured model lookups. */
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
