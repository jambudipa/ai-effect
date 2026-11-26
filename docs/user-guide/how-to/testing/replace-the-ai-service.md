---
title: How to replace the AI service in an application test
doc-type: how-to
sources: [src/AiSdk.ts, src/core-models.ts]
---

# How to replace the AI service in an application test

> **TL;DR:** Provide an `AiSdk` layer that returns a fixed result. Use a model
> fixture when the test also needs to exercise the SDK call.

Use this example to test a feature that reads a vector from the AI service.
Capture a baseline service from `AiSdk.layer`, then construct the replacement.
The production methods you leave on this object still make their usual calls,
so restrict the test to the operation you replace.

```ts
import assert from 'node:assert/strict';
import { AiSdk } from '@jambudipa/ai-effect';
import { Effect, Layer } from 'effect';

const searchVector = Effect.gen(function* () {
  const ai = yield* AiSdk;
  const result = yield* ai.embed({
    model: 'fixture/search',
    value: 'refund policy',
  });
  return result.embedding;
});

const test = Effect.gen(function* () {
  const baseline = yield* AiSdk;
  const stub = AiSdk.of({
    ...baseline,
    embed: ({ value }) =>
      Effect.succeed({
        value,
        embedding: [1, 0],
        usage: { tokens: 0 },
        warnings: [],
      }),
  });

  return yield* searchVector.pipe(Effect.provide(Layer.succeed(AiSdk, stub)));
}).pipe(Effect.provide(AiSdk.layer));

assert.deepEqual(await Effect.runPromise(test), [1, 0]);
```

For a test of a recoverable failure, make the replacement return
`Effect.fail(error)` with the error that the feature handles. Provide it at
the same boundary as the success stub.

See the [core service reference](../../reference/core.md) for the operation list.
