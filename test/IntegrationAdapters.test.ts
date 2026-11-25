import { jsonSchema as nativeJsonSchema } from '@ai-sdk/provider-utils';
import { describe, expect, it } from '@effect/vitest';
import { Deferred, Effect, Ref, Schema, Stream } from 'effect';
import * as v from 'valibot';
import {
  type CodeModeToolExecutionOptions,
  experimental_continueCodeModeInterrupt,
  experimental_getCodeModeInterrupt,
  experimental_requestCodeModeInterrupt,
  experimental_runCodeMode,
} from '../src/integrations/code-mode.js';
import { tool } from '../src/internal/tool.js';
import { createCodex } from '../src/integrations/harness-codex.js';
import { harnessV1BridgeReadySchema } from '../src/integrations/harness.js';
import { wrapSchema } from '../src/integrations/internal/schema.js';
import { toUIMessageStream } from '../src/integrations/llamaindex.js';
import {
  createMCPClient,
  experimental_createMCPEventWebhook,
} from '../src/integrations/mcp.js';
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
      const sessionId = yield* Deferred.make<string | undefined>();
      const fixture = yield* createTestServer({
        [url]: {
          response: {
            type: 'json-value',
            body: { jsonrpc: '2.0', id: 0, result: { tools: [] } },
            headers: { 'mcp-session-id': 'local-session' },
          },
        },
      });
      yield* fixture.server.start;
      const client = yield* createMCPClient({
        transport: {
          type: 'http',
          url,
          terminateSessionOnClose: false,
          onSessionIdChange: (value) =>
            Deferred.succeed(sessionId, value).pipe(Effect.asVoid),
        },
        initialInitializeResult: {
          protocolVersion: '2025-11-25',
          capabilities: { tools: {} },
          serverInfo: { name: 'scoped fixture', version: '1.0' },
        },
      });
      expect((yield* client.listTools()).tools).toEqual([]);
      expect(yield* Deferred.await(sessionId)).toBe('local-session');
      const calls = yield* fixture.calls;
      const request = calls.find(
        (call) => call.requestMethod === 'POST',
      )?.requestBodyJson;
      expect(request).toBeDefined();
      if (request)
        expect(yield* request).toMatchObject({ method: 'tools/list' });
      const tools = yield* client.toolsFromDefinitions(
        { tools: [{ name: 'typed', inputSchema: { type: 'object' } }] },
        {
          schemas: {
            typed: { inputSchema: Schema.Struct({ subject: Schema.String }) },
          },
        },
      );
      expect(
        yield* tools.typed.inputSchema.validate({ subject: 'fixture' }),
      ).toEqual({ subject: 'fixture' });
      const managedSubscription = {
        id: 's-1',
        name: 'updates',
        arguments: {},
        status: 'active',
        expiresAt: '2026-11-26T00:00:00.000Z',
      } as const;
      const managed = yield* createMCPClient({
        transport: { type: 'http', url, terminateSessionOnClose: false },
        initialInitializeResult: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          serverInfo: { name: 'managed fixture', version: '1.0' },
        },
        experimental_events: {
          adapter: {
            createAdapter: () => ({
              subscribe: () => Effect.succeed(managedSubscription),
              getSubscription: () => Effect.succeed(managedSubscription),
              listSubscriptions: () =>
                Effect.succeed({ subscriptions: [managedSubscription] }),
              unsubscribe: () => Effect.succeed(managedSubscription),
            }),
          },
        },
      });
      expect(
        yield* managed.experimental_events.getSubscription({ id: 's-1' }),
      ).toEqual(managedSubscription);
    }),
  );

  it.effect('runs a webhook error callback before returning the response', () =>
    Effect.gen(function* () {
      const reported = yield* Ref.make(false);
      const webhook = experimental_createMCPEventWebhook({
        store: {
          get: () => Effect.fail('unavailable'),
          getById: () => Effect.fail('unused'),
          set: () => Effect.void,
          update: () => Effect.void,
          delete: () => Effect.void,
        },
        onEvent: () => Effect.void,
        onError: () => Ref.set(reported, true),
      });
      const response = yield* webhook(
        new Request(
          'https://local-mcp.example.test/events?mcp_event_subscription=fixture',
          {
            method: 'POST',
            body: '{}',
            headers: {
              'content-type': 'application/json',
              'x-mcp-subscription-id': 'fixture',
            },
          },
        ),
      );
      expect(response.status).toBe(503);
      expect(yield* Ref.get(reported)).toBe(true);
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

describe('Code mode integration', () => {
  for (const mode of ['Effect', 'Stream'] as const) {
    it.effect(
      `continues an interruption from a tool that returns ${mode}`,
      () =>
        Effect.gen(function* () {
          const tools = {
            pause: tool({
              inputSchema: Schema.Struct({}),
              execute: (_input, options: CodeModeToolExecutionOptions) => {
                const result = Effect.gen(function* () {
                  if (!options.codeModeInterrupt) {
                    return yield* experimental_requestCodeModeInterrupt({
                      kind: 'fixture',
                    });
                  }
                  return yield* Schema.decodeUnknownEffect(Schema.String)(
                    options.codeModeInterrupt.resolution,
                  );
                });
                return mode === 'Effect' ? result : Stream.fromEffect(result);
              },
            }),
          };
          const first = yield* experimental_runCodeMode({
            js: 'return await tools.pause({})',
            tools,
          });
          const interrupt = experimental_getCodeModeInterrupt(first);
          expect(interrupt?.payload.kind).toBe('fixture');
          if (interrupt) {
            const result = yield* experimental_continueCodeModeInterrupt({
              interrupt,
              resolution: 'confirmed',
              tools,
            });
            expect(result).toBe('confirmed');
          }
        }),
    );
  }
});

describe('Harness declaration boundary', () => {
  it.effect('passes through the input of a schema without a validator', () =>
    Effect.gen(function* () {
      const schema = wrapSchema(
        'Harness.schema',
        nativeJsonSchema<number>({ type: 'number' }),
      );
      expect(yield* schema.validate(7)).toBe(7);
    }),
  );

  it.effect('retains the harness identity and validates a bridge frame', () =>
    Effect.gen(function* () {
      const harness = yield* createCodex();
      expect(harness.harnessId).toBe('codex');
      expect(
        yield* harness.builtinTools.bash.inputSchema.validate({
          command: 'printf fixture',
        }),
      ).toEqual({ command: 'printf fixture' });
      expect(
        yield* harnessV1BridgeReadySchema.validate({
          type: 'bridge-ready',
          port: 4321,
        }),
      ).toEqual({ type: 'bridge-ready', port: 4321 });
      const error = yield* Effect.flip(
        harnessV1BridgeReadySchema.validate({
          type: 'bridge-ready',
          port: 'x',
        }),
      );
      expect(error._tag).toBe('AiSdkError');
    }),
  );
});
