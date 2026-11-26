---
title: How to rotate credentials between requests
doc-type: how-to
sources:
  [src/providers/cerebras.ts, src/internal/fetch.ts, test/Providers.test.ts]
---

# How to rotate credentials between requests

> **TL;DR:** Give the provider an Effect that reads the current key. Replace
> the key while the provider's scope stays open.

Use this pattern when a worker must reuse a model handle while its credential
changes. This example uses the Cerebras adapter. Set `CEREBRAS_API_KEY` to the
current key and `CEREBRAS_NEXT_API_KEY` to its replacement.

1. Create a `Ref` for the current key. Pass `Ref.get` to the factory.
2. Run the request. Update the `Ref` before the next request.

   ```ts
   import { generateText } from '@jambudipa/ai-effect/ai';
   import { createCerebras } from '@jambudipa/ai-effect/cerebras';
   import { Config, Effect, Ref } from 'effect';

   const program = Effect.gen(function* () {
     const current = yield* Config.String('CEREBRAS_API_KEY');
     const replacement = yield* Config.String('CEREBRAS_NEXT_API_KEY');
     const key = yield* Ref.make(current);
     const provider = yield* createCerebras({ apiKey: Ref.get(key) });
     const model = yield* provider.chat('gpt-oss-120b');
     const request = generateText({
       model,
       prompt: 'Reply with one greeting.',
     });

     const first = yield* request;
     yield* Ref.set(key, replacement);
     const second = yield* request;
     return [first.text, second.text];
   }).pipe(Effect.scoped);

   console.log(await Effect.runPromise(program));
   ```

3. Use the worker's credential refresh event to set the `Ref` in the deployed
   application. Keep the provider and the requests inside the same open scope.

For a planned rotation, verify a request with the replacement before revoking
the original key. If the original expires first, set the new key before issuing
the next request. See the [Cerebras contract](../../reference/api/providers/cerebras.md).
