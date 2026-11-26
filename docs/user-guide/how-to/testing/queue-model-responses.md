---
title: How to queue model responses for successive calls
doc-type: how-to
sources: [src/testing.ts, src/internal/mock-model.ts, src/core.ts]
---

# How to queue model responses for successive calls

> **TL;DR:** Supply a response array to a model fixture when the answer should
> change across requests. Check the fixture history to confirm that the
> application made each request.

Use this pattern to test a follow-up request with a different answer. Keep the
two requests in the same scope as the fixture.

1. Build a response for each request you expect.
2. Disable SDK retries when each call in your test must consume exactly one response.
3. Assert both the results and the call count.

```js
import assert from 'node:assert/strict';
import { generateText } from '@jambudipa/ai-effect/ai';
import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
import { Effect } from 'effect';

const reply = (text) => ({
  content: [{ type: 'text', text }],
  finishReason: { unified: 'stop', raw: undefined },
  usage: {
    inputTokens: { total: 4, noCache: 4 },
    outputTokens: { total: 1, text: 1 },
  },
  warnings: [],
});

const program = Effect.gen(function* () {
  const model = yield* MockLanguageModelV4({
    doGenerate: [reply('queued'), reply('shipped')],
  });
  const first = yield* generateText({
    model,
    prompt: 'What is the order status?',
    maxRetries: 0,
  });
  const second = yield* generateText({
    model,
    prompt: 'Check the status again.',
    maxRetries: 0,
  });
  return {
    states: [first.text, second.text],
    calls: model.doGenerateCalls.length,
  };
}).pipe(Effect.scoped);

assert.deepEqual(await Effect.runPromise(program), {
  states: ['queued', 'shipped'],
  calls: 2,
});
```

For a response that depends on the input, use a `doGenerate` callback that
returns an Effect. Create a separate fixture for each test if the tests must
have independent histories.

See the [model request tutorial](../../tutorials/testing/check-a-model-request.md)
for an assertion on the forwarded prompt.
