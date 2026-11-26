---
title: How to record completed embedding operations
doc-type: how-to
sources: [src/core-models.ts, src/testing.ts, test/ModelFixtures.test.ts]
---

# How to record completed embedding operations

> **TL;DR:** Supply an Effect callback as `onEnd`. Update a counter or call
> the telemetry service from the context that owns the request.

Use this recipe when an embedding operation must update a local metric. The
example uses a fixture to check that the callback runs with the request.

```js
import assert from 'node:assert/strict';
import { embed } from '@jambudipa/ai-effect/ai';
import { MockEmbeddingModelV3 } from '@jambudipa/ai-effect/ai/test';
import { Effect, Ref } from 'effect';

const program = Effect.gen(function* () {
  const completed = yield* Ref.make(0);
  const model = yield* MockEmbeddingModelV3({
    doEmbed: { embeddings: [[1, 2]], usage: { tokens: 2 }, warnings: [] },
  });

  const result = yield* embed({
    model,
    value: 'refund policy',
    maxRetries: 0,
    onEnd: () => Ref.update(completed, (count) => count + 1),
  });

  return {
    vector: result.embedding,
    completed: yield* Ref.get(completed),
  };
}).pipe(Effect.scoped);

assert.deepEqual(await Effect.runPromise(program), {
  vector: [1, 2],
  completed: 1,
});
```

Provide your metrics service in the request's Effect context if the callback
needs it. To count starts separately, register an `onStart` callback.
Use the [OpenTelemetry integration](../../../reference/api/integrations/otel.md)
when your application sends operation traces.
