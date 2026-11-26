---
title: How to set a deadline for a model request
doc-type: how-to
sources: [src/AiSdk.ts, src/internal/operation.ts, test/AiSdk.test.ts]
---

# How to set a deadline for a model request

> **TL;DR:** Apply `Effect.timeout` to the work that must finish within your
> budget. Convert the deadline failure at your application boundary.

Use this when a request must complete within a fixed time. The example uses an
AI Gateway model, which needs credentials.

1. Put the timeout on the complete operation whose duration you want to limit.
2. Decide which output to return when the budget expires.

   ```ts
   import { AiSdk } from '@jambudipa/ai-effect';
   import { Effect } from 'effect';

   export function suggestTitle(body: string) {
     return Effect.gen(function* () {
       const ai = yield* AiSdk;
       const result = yield* ai.generateText({
         model: 'openai/gpt-5-mini',
         prompt: 'Suggest a short title for:\n' + body,
       });
       return result.text;
     }).pipe(
       Effect.provide(AiSdk.layer),
       Effect.timeout('2 seconds'),
       Effect.catchTag('TimeoutError', () => Effect.succeed('Untitled draft')),
     );
   }
   ```

   When the deadline expires, the timeout interrupts the model operation. The
   wrapper sends the abort signal to the SDK.

3. For a stream, put the timeout on the Effect that drains the stream. For a
   deadline shared by several model calls, apply it around all their work.

Use [Stop generation when a client disconnects](cancel-a-disconnected-request.md)
when the time to stop depends on the client.
