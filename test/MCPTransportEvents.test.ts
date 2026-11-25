import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect } from 'effect';
import { vi } from 'vitest';
import {
  createMCPClient,
  Experimental_WebMCPTransport,
  type JSONRPCMessage,
} from '../src/integrations/mcp.js';
import { StdioMCPTransport } from '../src/integrations/mcp/mcp-stdio.js';
import { AiSdkError } from '../src/internal/operation.js';

class WebObserver extends Context.Service<
  WebObserver,
  Deferred.Deferred<JSONRPCMessage>
>()('@jambudipa/ai-effect/test/MCPTransportEvents/WebObserver') {}

it.effect(
  'delivers WebMCP messages and close events alongside the client',
  () =>
    Effect.gen(function* () {
      const response = yield* Deferred.make<JSONRPCMessage>();
      const closed = yield* Deferred.make<boolean>();
      const transport = yield* Experimental_WebMCPTransport.make({
        modelContext: {
          getTools: () =>
            Effect.succeed([
              {
                name: 'local',
                description: 'Local fixture',
                origin: 'https://example.test',
                window: {},
              },
            ]),
          executeTool: () => Effect.succeed('ok'),
        },
      });
      const removed = vi.fn<(message: JSONRPCMessage) => void>();
      yield* Effect.scoped(
        transport.events.subscribe({
          onMessage: (message) => Effect.sync(() => removed(message)),
        }),
      );
      yield* transport.events
        .subscribe({
          onMessage: (message) =>
            Effect.flatMap(WebObserver, (observer) =>
              Deferred.succeed(observer, message),
            ).pipe(Effect.asVoid),
          onClose: () => Deferred.succeed(closed, true).pipe(Effect.asVoid),
        })
        .pipe(Effect.provideService(WebObserver, response));
      yield* Effect.scoped(
        Effect.gen(function* () {
          const client = yield* createMCPClient({ transport });
          expect(
            (yield* client.listTools()).tools.map((tool) => tool.name),
          ).toEqual(['local']);
          expect(yield* Deferred.await(response)).toMatchObject({
            result: { serverInfo: { name: 'webmcp' } },
          });
        }),
      );
      expect(yield* Deferred.await(closed)).toBe(true);
      expect(removed).not.toHaveBeenCalled();
    }),
);

it.effect(
  'delivers JSON-RPC frames, parse errors, and child closure from stdio',
  () =>
    Effect.gen(function* () {
      const response = yield* Deferred.make<JSONRPCMessage>();
      const error = yield* Deferred.make<AiSdkError>();
      const closed = yield* Deferred.make<boolean>();
      const frame = { jsonrpc: '2.0', id: 1, result: { local: true } } as const;
      const transport = yield* StdioMCPTransport.make({
        command: process.execPath,
        args: [
          '-e',
          `console.log('unparseable'); console.log('{"jsonrpc":"2.0","id":1,"result":{"local":true}}');`,
        ],
        stderr: 'ignore',
      });
      const received = vi.fn<(message: JSONRPCMessage) => void>();
      yield* transport.messages.subscribe(received);
      yield* transport.events.subscribe({
        onMessage: (message) =>
          Deferred.succeed(response, message).pipe(Effect.asVoid),
        onError: (cause) => Deferred.succeed(error, cause).pipe(Effect.asVoid),
        onClose: () => Deferred.succeed(closed, true).pipe(Effect.asVoid),
      });
      yield* transport.start;
      expect(yield* Deferred.await(response)).toEqual(frame);
      const failure = yield* Deferred.await(error);
      expect(failure).toBeInstanceOf(AiSdkError);
      expect(failure.operation).toBe('StdioMCPTransport.error');
      expect(yield* Deferred.await(closed)).toBe(true);
      expect(received).toHaveBeenCalledWith(frame);
    }),
);
