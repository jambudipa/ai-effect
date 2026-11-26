---
title: How to simulate an upstream outage
doc-type: how-to
sources: [src/integrations/test-server.ts]
---

# How to simulate an upstream outage

> **TL;DR:** Configure a fixture to return `503` followed by `200`. Use the
> recorded calls to check that a retry took place.

Use this pattern to exercise a client that tries again after a temporary
service failure. Supply the response for each attempt in order.

```js
import assert from 'node:assert/strict';
import { createTestServer } from '@jambudipa/ai-effect/test-server';
import { Effect } from 'effect';
import { FetchHttpClient, HttpClient } from 'effect/http';

const url = 'https://catalog.example.test/items/42';

const program = Effect.gen(function* () {
  const fixture = yield* createTestServer({
    [url]: {
      response: [
        { type: 'error', status: 503, body: 'unavailable' },
        { type: 'json-value', body: { id: 42 } },
      ],
    },
  });
  yield* fixture.server.start;

  const first = yield* HttpClient.get(url);
  const response = first.status === 503 ? yield* HttpClient.get(url) : first;
  return {
    firstStatus: first.status,
    item: yield* response.json,
    calls: (yield* fixture.calls).length,
  };
}).pipe(Effect.scoped, Effect.provide(FetchHttpClient.layer));

assert.deepEqual(await Effect.runPromise(program), {
  firstStatus: 503,
  item: { id: 42 },
  calls: 2,
});
```

Replace the sample retry branch with your client call when you test an
application. If the client must stop after an attempt limit, return the error
response for every attempt and assert that the call count equals that limit.

See [Reset an HTTP fixture](../../../tutorials/testing/reset-an-http-fixture.md)
for restoring the initial routes and clearing call history.
