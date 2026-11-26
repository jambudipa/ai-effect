---
title: How to stop generation when a client disconnects
doc-type: how-to
sources:
  [
    src/AiSdk.ts,
    src/internal/operation.ts,
    src/internal/stream-aborted.ts,
    test/AiSdk.test.ts,
  ]
---

# How to stop generation when a client disconnects

> **TL;DR:** Pass the HTTP request's `AbortSignal` to `streamText`. Keep the
> stream consumer in the Effect that owns the request.

Use this when a request handler consumes model output and your HTTP host aborts
its Fetch `Request` when the connection closes. The gateway model in this
example requires credentials. Substitute your configured model.

1. Pass `request.signal` when you open the stream.
2. Consume the stream in the same Effect. Handle a streamed cancellation once
   at the request boundary.

   ```ts
   import { AiSdk } from '@jambudipa/ai-effect';
   import { Effect, Stream } from 'effect';

   export function summarizeRequest(request: Request, document: string) {
     return Effect.gen(function* () {
       const ai = yield* AiSdk;
       const parts = yield* ai
         .streamText({
           model: 'openai/gpt-5-mini',
           prompt: 'Summarize this document:\n' + document,
           abortSignal: request.signal,
         })
         .pipe(
           Stream.filter((part) => part.type === 'text-delta'),
           Stream.map((part) => part.text),
           Stream.runCollect,
         );
       return parts.join('');
     }).pipe(
       Effect.provide(AiSdk.layer),
       Effect.map((text) => ({ status: 'complete', text }) as const),
       Effect.catchTag('AiSdkStreamAborted', () =>
         Effect.succeed({ status: 'cancelled' } as const),
       ),
     );
   }
   ```

3. Add a disconnect test for your host. Start the request, close the connection,
   and verify that the model receives an aborted signal. The host decides when
   its `Request.signal` fires. If the host gives you a separate disconnect event,
   pass a signal from an `AbortController` and abort it from that event.

If your server interrupts the Effect fiber that owns the handler, the wrapper
also propagates cancellation. See
[Scopes and cancellation](../../explanation/scopes-and-cancellation.md).
