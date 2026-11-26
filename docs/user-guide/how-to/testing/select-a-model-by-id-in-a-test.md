---
title: How to select a model by ID in a test
doc-type: how-to
sources:
  [
    src/testing.ts,
    src/internal/mock-model.ts,
    src/core-models.ts,
    test/ModelFixtures.test.ts,
  ]
---

# How to select a model by ID in a test

> **TL;DR:** Register a model fixture with a mock provider. Pass its ID through
> the same selection path that the application uses.

Use the fixture version that matches the provider protocol your application
uses. This example exercises a V3 embedding integration. It checks that the
selected model received the value.

```js
import assert from 'node:assert/strict';
import { embed } from '@jambudipa/ai-effect/ai';
import {
  MockEmbeddingModelV3,
  MockProviderV3,
} from '@jambudipa/ai-effect/ai/test';
import { Effect } from 'effect';

const program = Effect.gen(function* () {
  const fixture = yield* MockEmbeddingModelV3({
    doEmbed: { embeddings: [[1, 2]], usage: { tokens: 2 }, warnings: [] },
  });
  const provider = yield* MockProviderV3({
    embeddingModels: { search: fixture.model },
  });
  const model = yield* provider.embeddingModel('search');
  const result = yield* embed({ model, value: 'refund policy', maxRetries: 0 });

  return {
    vector: result.embedding,
    input: fixture.doEmbedCalls[0]?.values,
  };
}).pipe(Effect.scoped);

assert.deepEqual(await Effect.runPromise(program), {
  vector: [1, 2],
  input: ['refund policy'],
});
```

Register each supported model ID explicitly if the application chooses among
several models. Use different responses to detect a wrong selection.

See the [first model request tutorial](../../tutorials/testing/check-a-model-request.md)
for call assertions on a V4 text model.
