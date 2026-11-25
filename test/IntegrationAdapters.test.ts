import { describe, expect, it } from '@effect/vitest';
import { Effect, Ref, Stream } from 'effect';
import * as v from 'valibot';
import { toUIMessageStream } from '../src/integrations/llamaindex.js';
import { createMCPClient } from '../src/integrations/mcp.js';
import { createTestServer } from '../src/integrations/test-server.js';
import { createJustBashNetworkSandboxSession } from '../src/integrations/sandbox-just-bash.js';
import { valibotSchema } from '../src/integrations/valibot.js';

describe('LlamaIndex adapter', () => {
  it.effect('preserves UI chunks and callback order', () =>
    Effect.gen(function* () {
      const events = yield* Ref.make<ReadonlyArray<string>>([]);
      const callbacks = {
        onStart: () => Ref.update(events, (values) => [...values, 'start']),
        onToken: (token: string) =>
          Ref.update(events, (values) => [...values, token]),
        onFinal: (completion: string) =>
          Ref.update(events, (values) => [...values, completion]),
      };
      const chunks = yield* Stream.runCollect(
        toUIMessageStream(
          Stream.make({ delta: ' a' }, { delta: 'b' }),
          callbacks,
        ),
      );
      expect(chunks).toEqual([
        { type: 'text-start', id: '1' },
        { type: 'text-delta', id: '1', delta: 'a' },
        { type: 'text-delta', id: '1', delta: 'b' },
        { type: 'text-end', id: '1' },
      ]);
      expect(yield* Ref.get(events)).toEqual(['start', 'a', 'b', 'ab']);
    }),
  );
});

describe('Valibot adapter', () => {
  it.effect(
    'preserves validation and maps an invalid input to a tagged error',
    () =>
      Effect.gen(function* () {
        const schema = yield* valibotSchema(v.object({ id: v.number() }));
        expect(yield* schema.validate({ id: 42 })).toEqual({ id: 42 });
        expect((yield* schema.jsonSchema).type).toBe('object');
        const failure = yield* Effect.flip(schema.validate({ id: '42' }));
        expect(failure._tag).toBe('AiSdkError');
        expect(failure.operation).toBe('Valibot.validate');
      }),
  );
});

describe('MCP integration', () => {
  it.effect('uses a scoped HTTP fixture for a JSON-RPC request', () =>
    Effect.gen(function* () {
      const url = 'https://local-mcp.example.test/messages';
      const fixture = yield* createTestServer({
        [url]: {
          response: {
            type: 'json-value',
            body: { jsonrpc: '2.0', id: 0, result: { tools: [] } },
          },
        },
      });
      yield* fixture.server.start;
      const client = yield* createMCPClient({
        transport: { type: 'http', url, terminateSessionOnClose: false },
        initialInitializeResult: {
          protocolVersion: '2025-11-25',
          capabilities: { tools: {} },
          serverInfo: { name: 'scoped fixture', version: '1.0' },
        },
      });
      expect((yield* client.listTools()).tools).toEqual([]);
      const calls = yield* fixture.calls;
      const request = calls.find(
        (call) => call.requestMethod === 'POST',
      )?.requestBodyJson;
      expect(request).toBeDefined();
      if (request)
        expect(yield* request).toMatchObject({ method: 'tools/list' });
    }),
  );
});

describe('Just Bash integration', () => {
  it.effect('reads the result of a command in a scoped sandbox', () =>
    Effect.gen(function* () {
      const sandbox = yield* createJustBashNetworkSandboxSession();
      const result = yield* sandbox.run({ command: 'printf adapter' });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('adapter');
    }),
  );
});
