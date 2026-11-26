---
title: Inspect a streamed chat response
doc-type: tutorial
sources:
  [
    src/core.ts,
    src/core-chat.ts,
    src/internal/chat-ui-stream.ts,
    src/internal/text-stream.ts,
    src/testing.ts,
    test/CoreChat.test.ts,
  ]
---

# Inspect a streamed chat response

> **TL;DR:** Convert the output of a model fixture to UI message events. Read
> an in-memory HTTP response and find the two text deltas and the final marker.

Use Node.js 24 and the project from
[Get your first text result](../getting-started/first-text-result.md). This lesson builds a
Fetch `Response` in the same program that reads it.

1. Create `chat-response.mjs`. The program opens the model inside its response
   body stream.

   ```js
   import {
     createUIMessageStreamResponse,
     streamText,
   } from '@jambudipa/ai-effect/ai';
   import {
     MockLanguageModelV4,
     simulateReadableStream,
   } from '@jambudipa/ai-effect/ai/test';
   import { Effect, Stream } from 'effect';

   const stream = Stream.unwrap(
     Effect.gen(function* () {
       const model = yield* MockLanguageModelV4({
         doStream: () =>
           simulateReadableStream({
             chunks: [
               { type: 'text-start', id: 'reply' },
               { type: 'text-delta', id: 'reply', delta: 'See ' },
               { type: 'text-delta', id: 'reply', delta: 'you!' },
               { type: 'text-end', id: 'reply' },
               {
                 type: 'finish',
                 finishReason: { unified: 'stop', raw: undefined },
                 usage: {
                   inputTokens: { total: 3, noCache: 3 },
                   outputTokens: { total: 2, text: 2 },
                 },
               },
             ],
           }).pipe(Effect.map((body) => ({ stream: body }))),
       });
       const result = yield* streamText({ model, prompt: 'Say goodbye.' });
       return result.toUIMessageStream();
     }),
   );

   const response = await Effect.runPromise(
     createUIMessageStreamResponse({ stream }),
   );
   console.log('Content type:', response.headers.get('content-type'));

   const lines = (await response.text()).split('\n');
   for (const line of lines) {
     if (line.includes('"type":"text-delta"')) {
       const part = JSON.parse(line.slice('data: '.length));
       console.log('Delta:', JSON.stringify(part.delta));
     }
   }
   console.log('Done:', lines.includes('data: [DONE]'));
   ```

2. Run the program.

   ```sh
   node chat-response.mjs
   ```

   The content type identifies an event stream. The program prints the two
   deltas before it reports the closing marker.

   ```text
   Content type: text/event-stream
   Delta: "See "
   Delta: "you!"
   Done: true
   ```

3. Add `console.log(lines.join('\n'));` at the end and run again. Find the line
   with `"type":"text-start"` before the first delta.

You made a response with the same format a chat client reads. Next,
[serve these events from a chat endpoint](../../how-to/streaming/serve-a-ui-message-response.md).
