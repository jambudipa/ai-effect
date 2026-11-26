---
title: How to test an AI feature
doc-type: how-to
sources:
  [
    src/AiSdk.ts,
    src/testing.ts,
    src/internal/mock-model.ts,
    test/AiSdk.test.ts,
    test/ModelFixtures.test.ts,
  ]
---

# How to test an AI feature

> **TL;DR:** Use an `ai/test` fixture to exercise the core request with a fixed
> response. Use a replacement `AiSdk` layer when the test focuses on application
> behavior around the service.

### Exercise the request adapter

Use a fixed response to test an application's fallback. This example sends a
support ticket to a model fixture and routes an unfamiliar label to review.

1. Choose a model fixture for the capability and protocol version you use.
   For text generation on the v4 protocol, use `MockLanguageModelV4`.
2. Create the fixture inside the test scope. Supply fixed results or callbacks
   that return Effects. Use the model handle in the application request.
3. Check the result and the recorded mock calls before the scope closes. For
   example, check `model.doGenerateCalls` for the number of calls or forwarded
   request options.

Save this example as `classify.test.mjs`. Run `node --test classify.test.mjs`
and check that Node reports one passing test.

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AiSdk } from '@jambudipa/ai-effect';
import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
import { Effect } from 'effect';

const routeTicket = (model, ticket) =>
  Effect.gen(function* () {
    const ai = yield* AiSdk;
    const { text } = yield* ai.generateText({ model, prompt: ticket });
    return text === 'billing' ? 'billing' : 'manual-review';
  });

test('routes an unfamiliar model label to manual review', async () => {
  const program = Effect.gen(function* () {
    const model = yield* MockLanguageModelV4({
      doGenerate: {
        content: [{ type: 'text', text: 'unknown' }],
        finishReason: { unified: 'stop', raw: undefined },
        usage: {
          inputTokens: { total: 3, noCache: 3 },
          outputTokens: { total: 1, text: 1 },
        },
        warnings: [],
      },
    });
    return yield* routeTicket(model, 'Classify: I need help with my invoice.');
  }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

  assert.equal(await Effect.runPromise(program), 'manual-review');
});
```

For a streaming test, use a fresh stream factory for each request. See
[Check a model request](../../tutorials/testing/check-a-model-request.md) for
an example that asserts the forwarded prompt and the call count.

### Replace the application service

1. Define an implementation that satisfies `AiSdkService`.
2. Build the replacement layer with `Layer.succeed(AiSdk, AiSdk.of(stub))`.
3. Provide the replacement layer at the test boundary. Assert the application
   output or tagged failure.

See [Replace the AI service](replace-the-ai-service.md) for a complete layer
example and the [Core API reference](../../reference/core.md) for the contract.
