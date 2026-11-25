import { describe, expect, it } from '@effect/vitest';
import { Effect, Ref, Schema, Stream } from 'effect';
import * as v from 'valibot';
import {
  type CodeModeToolExecutionOptions,
  experimental_continueCodeModeInterrupt,
  experimental_getCodeModeInterrupt,
  experimental_requestCodeModeInterrupt,
  experimental_runCodeMode,
} from '../src/integrations/code-mode.js';
import { tool } from '../src/internal/tool.js';
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

describe('Code mode integration', () => {
  it.effect('continues an interruption requested by an Effect tool', () =>
    Effect.gen(function* () {
      const tools = {
        pause: tool({
          inputSchema: Schema.Struct({}),
          execute: (_input, options: CodeModeToolExecutionOptions) =>
            Effect.gen(function* () {
              if (!options.codeModeInterrupt) {
                return yield* experimental_requestCodeModeInterrupt({
                  kind: 'fixture',
                });
              }
              return yield* Schema.decodeUnknownEffect(Schema.String)(
                options.codeModeInterrupt.resolution,
              );
            }),
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
});
