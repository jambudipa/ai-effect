import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect, Ref, Scope } from 'effect';
import { StdioMCPTransport as NativeStdioTransport } from '@ai-sdk/mcp/mcp-stdio';
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

class CloseObserver extends Context.Service<
  CloseObserver,
  Deferred.Deferred<boolean>
>()('@jambudipa/ai-effect/test/MCPTransportEvents/CloseObserver') {}

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
          onClose: () =>
            Effect.flatMap(CloseObserver, (observer) =>
              Deferred.succeed(observer, true),
            ).pipe(Effect.asVoid),
        })
        .pipe(
          Effect.provideService(WebObserver, response),
          Effect.provideService(CloseObserver, closed),
        );
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
  'preserves event order within each subscription while one listener waits',
  () =>
    Effect.gen(function* () {
      const started = yield* Deferred.make<boolean>();
      const release = yield* Deferred.make<boolean>();
      const otherClosed = yield* Deferred.make<boolean>();
      const drained = yield* Deferred.make<boolean>();
      const events = yield* Ref.make<readonly string[]>([]);
      const record = (event: string) =>
        Ref.update(events, (items) => [...items, event]);
      const transport = yield* Experimental_WebMCPTransport.make({
        modelContext: {
          getTools: () => Effect.succeed([]),
          executeTool: () => Effect.succeed('ok'),
        },
      });
      yield* transport.events.subscribe({
        onMessage: (message) =>
          Effect.gen(function* () {
            if ('id' in message && message.id === 1) {
              yield* Deferred.succeed(started, true);
              yield* Deferred.await(release);
              yield* record('first');
            } else {
              yield* record('second');
            }
          }),
        onClose: () =>
          record('close').pipe(
            Effect.andThen(Deferred.succeed(drained, true)),
            Effect.asVoid,
          ),
      });
      yield* transport.events.subscribe({
        onClose: () => Deferred.succeed(otherClosed, true).pipe(Effect.asVoid),
      });
      yield* transport.start;
      yield* transport.send({ jsonrpc: '2.0', id: 1, method: 'ping' });
      yield* Deferred.await(started);
      yield* transport.send({ jsonrpc: '2.0', id: 2, method: 'ping' });
      yield* transport.close;
      yield* Deferred.await(otherClosed);
      expect(yield* Ref.get(events)).toEqual([]);
      yield* Deferred.succeed(release, true);
      yield* Deferred.await(drained);
      expect(yield* Ref.get(events)).toEqual(['first', 'second', 'close']);
    }),
);

it.effect('keeps a built-in transport exclusive until its client closes', () =>
  Effect.gen(function* () {
    const parent = yield* Effect.scope;
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
    const aborted = new AbortController();
    aborted.abort();
    yield* Effect.flip(
      createMCPClient({
        transport,
        initializationOptions: { signal: aborted.signal },
      }),
    );

    const replacement = yield* Effect.scoped(
      Effect.gen(function* () {
        const client = yield* createMCPClient({ transport });
        const rejected = yield* Effect.flip(createMCPClient({ transport }));
        expect(rejected.operation).toBe('WebMCPTransport.attach');
        expect(
          (yield* client.listTools()).tools.map((item) => item.name),
        ).toEqual(['local']);
        yield* client.close;
        return yield* Scope.provide(createMCPClient({ transport }), parent);
      }),
    );
    expect(
      (yield* replacement.listTools()).tools.map((item) => item.name),
    ).toEqual(['local']);
  }),
);

it.effect(
  'publishes one close when a stdio abort triggers two native callbacks',
  () =>
    Effect.gen(function* () {
      const ready = yield* Deferred.make<boolean>();
      const drained = yield* Deferred.make<boolean>();
      const rawClose = vi.fn<() => void>();
      const published = vi.fn<() => void>();
      const nativeStart = NativeStdioTransport.prototype.start;
      yield* Effect.acquireRelease(
        Effect.sync(() =>
          vi
            .spyOn(NativeStdioTransport.prototype, 'start')
            .mockImplementation(function (this: NativeStdioTransport) {
              const onClose = this.onclose;
              this.onclose = () => {
                onClose?.();
                rawClose();
                if (rawClose.mock.calls.length === 2) {
                  this.onmessage?.({ jsonrpc: '2.0', id: 2, result: {} });
                }
              };
              return nativeStart.call(this);
            }),
        ),
        (spy) =>
          Effect.sync(() => {
            spy.mockRestore();
          }),
      );
      const transport = yield* StdioMCPTransport.make({
        command: process.execPath,
        args: [
          '-e',
          `console.log('{"jsonrpc":"2.0","id":1,"result":{}}'); setInterval(() => {}, 1000);`,
        ],
        stderr: 'ignore',
      });
      yield* transport.events.subscribe({
        onMessage: (message) =>
          Deferred.succeed(
            'id' in message && message.id === 2 ? drained : ready,
            true,
          ).pipe(Effect.asVoid),
        onClose: () => Effect.sync(published),
      });
      yield* transport.start;
      yield* Deferred.await(ready);
      yield* transport.close;
      yield* transport.close;
      yield* Deferred.await(drained);
      expect(rawClose).toHaveBeenCalledTimes(2);
      expect(published).toHaveBeenCalledTimes(1);
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
