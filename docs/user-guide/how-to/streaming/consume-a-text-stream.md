---
title: How to consume a text stream
doc-type: how-to
sources:
  [
    src/AiSdk.ts,
    src/core.ts,
    src/internal/text-stream.ts,
    src/internal/operation.ts,
  ]
---

# How to consume a text stream

> **TL;DR:** Consume the service stream for generation events. Use the direct
> `streamText` function inside a scope when you also need result metadata.

1. Select a [provider and model](../providers/choose-a-provider.md). Add your cancellation
   signal to the SDK options if the application already has one.
2. Choose the stream you need. Use the service stream for events, or use the
   direct function's `textStream` for text chunks and its `fullStream` for
   generation events.
3. Run the consumer inside Effect. Keep the direct result inside the scope that
   acquired it.

   ```ts
   import { streamText } from '@jambudipa/ai-effect/ai';
   import { Effect, Stream } from 'effect';

   const writeSummary = Effect.scoped(
     Effect.gen(function* () {
       const result = yield* streamText({
         model: 'openai/gpt-5-mini',
         prompt: 'Summarize lexical scope.',
       });
       yield* Stream.runForEach(result.textStream, (text) =>
         Effect.sync(() => process.stdout.write(text)),
       );
       return yield* result.usage;
     }),
   );
   ```

The gateway model ID requires gateway credentials. Use the service stream's
`text-delta` events when the application also processes tool calls or finish
events. See [Scopes and cancellation](../../explanation/scopes-and-cancellation.md)
for how early exit affects the request.
