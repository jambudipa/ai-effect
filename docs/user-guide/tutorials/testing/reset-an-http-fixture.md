---
title: Reset an HTTP fixture
doc-type: tutorial
sources: [src/integrations/test-server.ts]
---

# Reset an HTTP fixture

> **TL;DR:** Send a request to a local fetch fixture. Change its response, then
> reset the fixture and see the original response return.

Use Node.js 24 and the project from [Get your first text result](../getting-started/first-text-result.md).
Keep all requests and the fetch fixture in one scope.

1. Create `inventory-fixture.mjs`.

   ```js
   import { createTestServer } from '@jambudipa/ai-effect/test-server';
   import { Effect } from 'effect';
   import { FetchHttpClient, HttpClient } from 'effect/http';

   const url = 'https://inventory.example.test/items/42';

   const program = Effect.gen(function* () {
     const fixture = yield* createTestServer({
       [url]: {
         response: { type: 'json-value', body: { available: true } },
       },
     });
     yield* fixture.server.start;

     const first = yield* HttpClient.get(url);
     const initialBody = yield* first.json;
     yield* fixture.urls[url].setResponse({
       type: 'json-value',
       body: { available: false },
     });
     const second = yield* HttpClient.get(url);
     const changedBody = yield* second.json;

     const beforeReset = (yield* fixture.calls).length;
     yield* fixture.server.reset;
     const afterReset = (yield* fixture.calls).length;
     const third = yield* HttpClient.get(url);
     const restoredBody = yield* third.json;

     return { initialBody, changedBody, beforeReset, afterReset, restoredBody };
   }).pipe(Effect.scoped, Effect.provide(FetchHttpClient.layer));

   const result = await Effect.runPromise(program);
   console.log(JSON.stringify(result.initialBody));
   console.log(JSON.stringify(result.changedBody));
   console.log('Calls before reset: ' + result.beforeReset);
   console.log('Calls after reset: ' + result.afterReset);
   console.log(JSON.stringify(result.restoredBody));
   ```

2. Run the program.

   ```sh
   node inventory-fixture.mjs
   ```

   ```text
   {"available":true}
   {"available":false}
   Calls before reset: 2
   Calls after reset: 0
   {"available":true}
   ```

   The reset clears the request history and restores the starting response.
   The third request takes place after the reset.

Next, [reuse an HTTP fixture across Vitest tests](../../how-to/testing/http-fixtures/reuse-a-fixture-in-vitest.md).
