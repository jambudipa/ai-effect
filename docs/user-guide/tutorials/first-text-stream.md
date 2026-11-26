---
title: Read your first text stream
doc-type: tutorial
sources: [src/AiSdk.ts, src/testing.ts, src/internal/text-stream.ts]
---

# Read your first text stream

> **TL;DR:** Run a model fixture through `AiSdk.streamText`. Collect the text
> deltas and join them into one line of output.

Use the project from [Get your first text result](first-text-result.md).

1. Create `first-stream.mjs` in that project.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import {
     MockLanguageModelV4,
     simulateReadableStream,
   } from '@jambudipa/ai-effect/ai/test';
   import { Effect, Stream } from 'effect';

   const program = Effect.gen(function* () {
     const ai = yield* AiSdk;
     const model = yield* MockLanguageModelV4({
       doStream: () =>
         simulateReadableStream({
           chunks: [
             { type: 'text-start', id: 'message' },
             { type: 'text-delta', id: 'message', delta: 'Hello ' },
             { type: 'text-delta', id: 'message', delta: 'stream.' },
             { type: 'text-end', id: 'message' },
             {
               type: 'finish',
               finishReason: { unified: 'stop', raw: undefined },
               usage: {
                 inputTokens: { total: 2, noCache: 2 },
                 outputTokens: { total: 3, text: 3 },
               },
             },
           ],
         }).pipe(Effect.map((stream) => ({ stream }))),
     });
     const parts = yield* ai.streamText({ model, prompt: 'Say hello.' }).pipe(
       Stream.filter((part) => part.type === 'text-delta'),
       Stream.map((part) => part.text),
       Stream.runCollect,
     );
     return parts.join('');
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   console.log(await Effect.runPromise(program));
   ```

2. Run the program.

   ```sh
   node first-stream.mjs
   ```

   ```text
   Hello stream.
   ```

The model fixture emits four text events. The filter keeps the two deltas. See
[Consume a text stream](../how-to/consume-a-text-stream.md) for a live consumer
and [Scopes and cancellation](../explanation/scopes-and-cancellation.md) for the
stream lifetime.
