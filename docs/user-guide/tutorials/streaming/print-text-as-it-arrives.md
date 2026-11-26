---
title: Print text as it arrives
doc-type: tutorial
sources: [src/AiSdk.ts, src/internal/text-stream.ts, src/testing.ts]
---

# Print text as it arrives

> **TL;DR:** Make a program that prints two text fragments from a model fixture
> as the stream delivers them. The fixture gives the same response every time.

Use Node.js 24 and the project from
[Get your first text result](../getting-started/first-text-result.md). The fixture runs in your
process and needs no credentials.

1. Create `live-text.mjs`. The fixture sends two deltas and then finishes.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import {
     MockLanguageModelV4,
     simulateReadableStream,
   } from '@jambudipa/ai-effect/ai/test';
   import { Effect, Stream } from 'effect';

   const printAnswer = Effect.gen(function* () {
     const ai = yield* AiSdk;
     const model = yield* MockLanguageModelV4({
       doStream: () =>
         simulateReadableStream({
           chunks: [
             { type: 'text-start', id: 'answer' },
             { type: 'text-delta', id: 'answer', delta: 'Room ' },
             { type: 'text-delta', id: 'answer', delta: '101' },
             { type: 'text-end', id: 'answer' },
             {
               type: 'finish',
               finishReason: { unified: 'stop', raw: undefined },
               usage: {
                 inputTokens: { total: 4, noCache: 4 },
                 outputTokens: { total: 2, text: 2 },
               },
             },
           ],
         }).pipe(Effect.map((stream) => ({ stream }))),
     });
     yield* ai.streamText({ model, prompt: 'Where is the workshop?' }).pipe(
       Stream.filter((part) => part.type === 'text-delta'),
       Stream.runForEach((part) =>
         Effect.sync(() => console.log('Received:', JSON.stringify(part.text))),
       ),
     );
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   await Effect.runPromise(printAnswer);
   console.log('Answer complete.');
   ```

2. Run the program.

   ```sh
   node live-text.mjs
   ```

   The first two lines show the fragments in order. Notice the space after
   `Room`. The last line appears after the stream finishes.

   ```text
   Received: "Room "
   Received: "101"
   Answer complete.
   ```

3. Change the second delta from `101` to `204`. Run the command again. The
   second line now reads `Received: "204"`.

You printed each delta as it arrived. Next,
[stop after the first fragment](stop-after-first-fragment.md).
