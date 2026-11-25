import { Context, Effect, Layer, ManagedRuntime } from 'effect';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { createTestServer as makeTestServer } from '../test-server.js';

export { TestResponseController } from '../test-server.js';
export type { UrlHandler, UrlHandlers, UrlResponse } from '../test-server.js';

/** Register the fixture with the active Vitest suite. */
export const createTestServer = <
  URLS extends Parameters<typeof makeTestServer>[0],
>(
  routes: URLS,
) => {
  const make = makeTestServer(routes);
  const Fixture = Context.Service<Effect.Success<typeof make>>(
    '@jambudipa/ai-effect/test-server/with-vitest/Fixture',
  );
  const layer = Layer.effect(
    Fixture,
    Effect.gen(function* () {
      const fixture = yield* make;
      yield* fixture.server.start;
      return fixture;
    }),
  );
  const runtime = ManagedRuntime.make(layer);
  const fixture = Effect.map(runtime.contextEffect, Context.get(Fixture));
  const reset = Effect.flatMap(
    fixture,
    (testServer) => testServer.server.reset,
  );

  beforeAll(() => runtime.runPromise(Effect.void));
  afterEach(() => runtime.runPromise(reset));
  afterAll(() => runtime.dispose());
  return {
    urls: Effect.map(fixture, (testServer) => testServer.urls),
    calls: Effect.flatMap(fixture, (testServer) => testServer.calls),
  };
};
