---
title: Stop a stream after its first fragment
doc-type: tutorial
sources:
  [
    src/AiSdk.ts,
    src/internal/text-stream.ts,
    src/internal/operation.ts,
    src/testing.ts,
    test/AiSdk.test.ts,
  ]
---

# Stop a stream after its first fragment

> **TL;DR:** Read one text fragment and stop the stream. Check that the SDK's
> request signal shows an abort when the consumer exits early.

Use Node.js 24 and the project from
[Get your first text result](../getting-started/first-text-result.md). Start with the two
fragments from [Print text as it arrives](print-text-as-it-arrives.md).

1. Create `first-fragment.mjs`. This program uses `Stream.take(1)` to stop.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import {
     MockLanguageModelV4,
     simulateReadableStream,
   } from '@jambudipa/ai-effect/ai/test';
   import { Effect, Stream } from 'effect';

   const preview = Effect.gen(function* () {
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
     const parts = yield* ai
       .streamText({ model, prompt: 'Where is the workshop?' })
       .pipe(
         Stream.filter((part) => part.type === 'text-delta'),
         Stream.take(1),
         Stream.map((part) => part.text),
         Stream.runCollect,
       );
     return {
       text: parts.join(''),
       aborted: model.doStreamCalls[0]?.abortSignal?.aborted,
     };
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   const result = await Effect.runPromise(preview);
   console.log('Preview:', JSON.stringify(result.text));
   console.log('Request aborted:', result.aborted);
   ```

2. Run the program.

   ```sh
   node first-fragment.mjs
   ```

   Check that the preview contains only `Room `. The request signal now shows
   that the consumer stopped before the end.

   ```text
   Preview: "Room "
   Request aborted: true
   ```

3. Remove the `Stream.take(1),` line and run the program again. The stream now
   finishes and the request signal stays clear.

   ```text
   Preview: "Room 101"
   Request aborted: false
   ```

You saw the difference between early exit and normal completion. See
[Scopes and cancellation](../../explanation/scopes-and-cancellation.md) for the
request lifetime and
[Stop generation when a client disconnects](../../how-to/reliability/cancel-a-disconnected-request.md)
for a task guide.
