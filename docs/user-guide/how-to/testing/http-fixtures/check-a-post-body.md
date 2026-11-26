---
title: How to check a JSON request body
doc-type: how-to
sources: [src/integrations/test-server.ts]
---

# How to check a JSON request body

> **TL;DR:** Route a request to an in-process HTTP fixture. Read the recorded
> JSON body inside the fixture scope and assert the fields you expect.

Use this pattern when your test needs to prove that the application serializes a
request correctly. Point the application at a unique fixture URL and use the
same HTTP client that the adapter uses.

```js
import assert from 'node:assert/strict';
import { createTestServer } from '@jambudipa/ai-effect/test-server';
import { Effect } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';

const url = 'https://delivery.example.test/quotes';

const program = Effect.gen(function* () {
  const fixture = yield* createTestServer({
    [url]: { response: { type: 'json-value', body: { fee: 8 } } },
  });
  yield* fixture.server.start;

  const request = yield* HttpClientRequest.post(url).pipe(
    HttpClientRequest.bodyJson({ postcode: 'SW1A 1AA', parcels: 2 }),
  );
  const response = yield* HttpClient.execute(request);
  const quote = yield* response.json;
  const calls = yield* fixture.calls;
  const post = calls.find((call) => call.requestMethod === 'POST');
  const body = post && (yield* post.requestBodyJson);
  return { quote, body };
}).pipe(Effect.scoped, Effect.provide(FetchHttpClient.layer));

assert.deepEqual(await Effect.runPromise(program), {
  quote: { fee: 8 },
  body: { postcode: 'SW1A 1AA', parcels: 2 },
});
```

If an adapter sends multipart data, use `requestBodyMultipart` on the recorded
call. If it makes several requests, filter by `requestUrl` and
`requestMethod` before selecting the call.

See [Reset an HTTP fixture](../../../tutorials/testing/reset-an-http-fixture.md)
to reuse the same URL with a different response.
