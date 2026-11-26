---
title: Check a model request
doc-type: tutorial
sources: [src/AiSdk.ts, src/testing.ts, src/internal/mock-model.ts]
---

# Check a model request

> **TL;DR:** Run a text request against a local model fixture. Check the returned
> answer, the prompt sent to the model, and the number of requests.

Use Node.js 24, npm, and the project from [Get your first text result](../getting-started/first-text-result.md).
You need no provider account or network connection to run this test.

1. Create `ticket.test.mjs` in that project.

   ```js
   import assert from 'node:assert/strict';
   import { test } from 'node:test';
   import { AiSdk } from '@jambudipa/ai-effect';
   import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
   import { Effect } from 'effect';

   test('forwards the ticket and sends one request', async () => {
     const program = Effect.gen(function* () {
       const ai = yield* AiSdk;
       const model = yield* MockLanguageModelV4({
         doGenerate: {
           content: [{ type: 'text', text: 'billing' }],
           finishReason: { unified: 'stop', raw: undefined },
           usage: {
             inputTokens: { total: 4, noCache: 4 },
             outputTokens: { total: 1, text: 1 },
           },
           warnings: [],
         },
       });

       const result = yield* ai.generateText({
         model,
         prompt: 'Classify this ticket: charged twice.',
         maxRetries: 0,
       });

       return { text: result.text, calls: model.doGenerateCalls };
     }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

     const { text, calls } = await Effect.runPromise(program);
     assert.equal(text, 'billing');
     assert.equal(calls.length, 1);
     const message = calls[0].prompt.at(-1);
     assert.equal(message?.role, 'user');
     assert.deepEqual(message.content, [
       { type: 'text', text: 'Classify this ticket: charged twice.' },
     ]);
   });
   ```

2. Run the test.

   ```sh
   node --test ticket.test.mjs
   ```

   Node reports one passing test, named `forwards the ticket and sends one request`.

3. Change `charged twice` to `invoice missing` in the prompt passed to
   `ai.generateText`. Run the test again. The prompt assertion fails.

4. Change the prompt back and run the test. It passes again.

Next, [recover from a model failure](recover-from-a-model-failure.md) or use the
[fixture guide](../../how-to/testing/test-an-ai-feature.md) with your own request.
