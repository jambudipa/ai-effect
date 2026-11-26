---
title: How to handle a provider rate limit
doc-type: how-to
sources: [src/AiSdk.ts, src/internal/operation.ts, test/AiSdk.test.ts]
---

# How to handle a provider rate limit

> **TL;DR:** Catch `AiSdkError` and check its HTTP status. Return a fallback
> when the provider reports 429 and propagate other failures.

Use this when your application can return a useful result while the remote
provider is rate-limited. The gateway model in this example needs credentials.

1. Disable SDK retries for this call if the caller needs an immediate fallback.
2. Catch the wrapper's typed error and inspect `status`.

   ```ts
   import { AiSdk } from '@jambudipa/ai-effect';
   import { Effect } from 'effect';

   export function createSummary(document: string, cachedSummary: string) {
     return Effect.gen(function* () {
       const ai = yield* AiSdk;
       const result = yield* ai.generateText({
         model: 'openai/gpt-5-mini',
         prompt: 'Write a one-sentence summary:\n' + document,
         maxRetries: 0,
       });
       return result.text;
     }).pipe(
       Effect.provide(AiSdk.layer),
       Effect.catchTag('AiSdkError', (error) =>
         error.status === 429
           ? Effect.succeed(cachedSummary)
           : Effect.fail(error),
       ),
     );
   }
   ```

3. Test a 429 response and a failure without a status. The first returns the
   cached result. The second keeps the failure available to your request
   handler. A status is available when the SDK reports an HTTP status.

Use `operation`, `category`, and `requestId` for diagnostics when they are
available. See the [core reference](../../reference/core.md) for the error fields.
