import { describe, expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { embed } from '../src/core.js';
import { MockEmbeddingModelV3, MockProviderV3 } from '../src/testing.js';

describe('legacy model fixtures', () => {
  it.effect(
    'selects a V3 model and runs it through the Core embedding adapter',
    () =>
      Effect.gen(function* () {
        const fixture = yield* MockEmbeddingModelV3({
          doEmbed: { embeddings: [[1, 2]], usage: { tokens: 2 }, warnings: [] },
        });
        const provider = yield* MockProviderV3({
          embeddingModels: { fixture: fixture.model },
        });
        const model = yield* provider.embeddingModel('fixture');
        const result = yield* embed({ model, value: 'example', maxRetries: 0 });
        expect(model.specificationVersion).toBe('v3');
        expect(result.embedding).toEqual([1, 2]);
        expect(result.usage.tokens).toBe(2);
        expect(fixture.doEmbedCalls[0]?.values).toEqual(['example']);
      }),
  );
});
