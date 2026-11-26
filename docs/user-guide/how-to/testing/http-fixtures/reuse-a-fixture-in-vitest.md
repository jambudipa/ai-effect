---
title: How to reuse an HTTP fixture in Vitest
doc-type: how-to
sources:
  [
    src/integrations/test-server.ts,
    src/integrations/test-server/with-vitest.ts,
    package.json,
  ]
---

# How to reuse an HTTP fixture in Vitest

> **TL;DR:** Create the fixture once in a test suite with the Vitest integration.
> Its hooks start the fixture, reset routes and calls before each test, and
> release it after the suite.

Use Vitest 5 and `@effect/vitest` at the same version as Effect. Register the
fixture inside the suite. Keep tests that share the fixture sequential.

```ts
import { createTestServer } from '@jambudipa/ai-effect/test-server/with-vitest';
import { describe, expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { FetchHttpClient, HttpClient } from 'effect/http';

describe('inventory', () => {
  const url = 'https://inventory.example.test/items/42';
  const fixture = createTestServer({
    [url]: { response: { type: 'json-value', body: { available: true } } },
  });

  it.effect('uses a changed response', () =>
    Effect.gen(function* () {
      const urls = yield* fixture.urls;
      yield* urls[url].setResponse({
        type: 'json-value',
        body: { available: false },
      });
      const response = yield* HttpClient.get(url);
      expect(yield* response.json).toEqual({ available: false });
      expect(yield* fixture.calls).toHaveLength(1);
    }).pipe(Effect.provide(FetchHttpClient.layer)),
  );

  it.effect('starts with the original response and empty history', () =>
    Effect.gen(function* () {
      expect(yield* fixture.calls).toHaveLength(0);
      const response = yield* HttpClient.get(url);
      expect(yield* response.json).toEqual({ available: true });
    }).pipe(Effect.provide(FetchHttpClient.layer)),
  );
});
```

If the tests need independent fetch state, put them in separate test files
that run in isolated Vitest workers. For a script or a different test runner,
use the [scoped fixture](../../../tutorials/testing/reset-an-http-fixture.md).
