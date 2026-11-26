---
title: Trace your first provider request
doc-type: tutorial
sources:
  [src/providers/openai-compatible.ts, src/core.ts, test/Providers.test.ts]
---

# Trace your first provider request

> **TL;DR:** Send a request through the OpenAI-compatible adapter. See the
> HTTP method, path, and model ID before the adapter returns a fixed response.

Use the Node.js project from [Get your first text result](../getting-started/first-text-result.md).
This lesson uses a `fetch` fixture in the same process. It requires no API key.

1. Create `trace-provider.mjs`.

   ```js
   import { generateText } from '@jambudipa/ai-effect/ai';
   import { createOpenAICompatible } from '@jambudipa/ai-effect/openai-compatible';
   import { Effect } from 'effect';

   const fixtureFetch = async (input, init) => {
     const request = new Request(input, init);
     const body = await request.json();
     console.log(`${request.method} ${new URL(request.url).pathname}`);
     console.log(`Model: ${body.model}`);
     return Response.json({
       id: 'workshop-request',
       model: body.model,
       choices: [
         {
           index: 0,
           message: { role: 'assistant', content: 'The adapter works.' },
           finish_reason: 'stop',
         },
       ],
       usage: { prompt_tokens: 3, completion_tokens: 4, total_tokens: 7 },
     });
   };

   const program = Effect.gen(function* () {
     const provider = yield* createOpenAICompatible({
       name: 'workshop',
       baseURL: 'https://fixture.invalid/v1',
       fetch: fixtureFetch,
     });
     const model = yield* provider.chatModel('workshop-model');
     const result = yield* generateText({
       model,
       prompt: 'Say hello.',
       maxRetries: 0,
     });
     return result.text;
   });

   console.log(await Effect.runPromise(program));
   ```

2. Run `node trace-provider.mjs`. Check the path before you read the response.

   ```text
   POST /v1/chat/completions
   Model: workshop-model
   The adapter works.
   ```

3. Change `workshop-model` in the selector to `second-model`. Run the same
   command. Check that only the model line changes to `Model: second-model`.

The adapter used the selected model ID when it built the HTTP request. Next,
[connect an OpenAI-compatible endpoint](../../how-to/providers/connect-an-openai-compatible-endpoint.md).
