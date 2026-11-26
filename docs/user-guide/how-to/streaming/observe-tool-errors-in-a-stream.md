---
title: How to observe tool failures during a streamed answer
doc-type: how-to
sources:
  [
    src/AiSdk.ts,
    src/core-tools.ts,
    src/internal/text-stream.ts,
    test/AiSdk.test.ts,
  ]
---

# How to observe tool failures during a streamed answer

> **TL;DR:** Consume generation events and inspect `tool-error` events as they
> arrive. Handle a failed generation in the stream's Effect error channel.

Use this when your app already streams text and the request enables tools. Keep
your existing model, prompt, and tools when you add the observer.

1. Read the service stream or the direct result's `fullStream`. The text-only
   stream has no tool events.
2. Branch on the event type inside your collector. This function accepts the
   event stream from your call.

   ```ts
   import { Effect, Stream } from 'effect';

   type ObservedEvent =
     | { type: 'text-delta'; text: string }
     | { type: 'tool-error'; toolCallId: string };

   export function observeAnswer<E, R>(
     events: Stream.Stream<ObservedEvent, E, R>,
   ) {
     return events.pipe(
       Stream.runForEach((part) =>
         part.type === 'text-delta'
           ? Effect.sync(() => process.stdout.write(part.text))
           : Effect.logWarning('Tool call failed', part.toolCallId),
       ),
     );
   }
   ```

   Filter the stream before passing it to `observeAnswer`. Use
   `Stream.filter((part) => part.type === 'text-delta' || part.type === 'tool-error')`
   to retain just these two events.

3. Run a request with a tool that fails. Check your logs for the call ID. The
   tool loop can still use the error to continue its work. If the model stream
   fails, the Effect from `observeAnswer` also fails.

See [Define an Effect tool](../tools/define-a-tool.md) for the tool setup and
[Scopes and cancellation](../../explanation/scopes-and-cancellation.md) for
stream failure behavior.
