import { describe, expect, it } from '@effect/vitest';
import { Effect, Schema, Stream } from 'effect';
import { createTestServer } from '../src/integrations/test-server.js';
import {
  createJsonResponseHandler,
  createStatusCodeErrorResponseHandler,
  executeTool,
  getFromApi,
} from '../src/protocols/provider-utils-operations.js';

describe('Provider utility operations', () => {
  it.effect(
    'decodes an HTTP response and retains the status of a rejected response',
    () =>
      Effect.gen(function* () {
        const url = 'https://provider-fixture.example.test/inference';
        const fixture = yield* createTestServer({
          [url]: { response: { type: 'json-value', body: { count: 2 } } },
        });
        yield* fixture.server.start;
        const get = getFromApi({
          url,
          successfulResponseHandler: createJsonResponseHandler(
            Schema.Struct({ count: Schema.Number }),
          ),
          failedResponseHandler: createStatusCodeErrorResponseHandler(),
        });
        expect((yield* get).value).toEqual({ count: 2 });
        const route = fixture.urls[url];
        expect(route).toBeDefined();
        if (route) {
          yield* route.setResponse({ type: 'error', status: 418 });
          const error = yield* Effect.flip(get);
          expect(error._tag).toBe('AiSdkError');
          expect(error.status).toBe(418);
        }
      }),
  );

  it.effect('emits the last tool chunk again as the final value', () =>
    Effect.gen(function* () {
      const events = yield* Stream.runCollect(
        executeTool({
          tool: {
            execute: () => Effect.succeed(Stream.make(1, 2)),
          },
          input: {},
          options: { toolCallId: 'example', context: {}, messages: [] },
        }),
      );
      expect(events).toEqual([
        { type: 'preliminary', output: 1 },
        { type: 'preliminary', output: 2 },
        { type: 'final', output: 2 },
      ]);
    }),
  );
});
