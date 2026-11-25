import { expect, it } from '@effect/vitest';
import { Deferred, Effect, Fiber, Option } from 'effect';
import {
  connectToWebSocket,
  readResponseWithSizeLimit,
  waitForWebSocketBufferDrain,
  type WebSocketConstructor,
  type WebSocketLike,
} from '../src/protocols/provider-utils.js';

it.effect('aborts a pending limited HTTP response read', () =>
  Effect.gen(function* () {
    const received = yield* Deferred.make<true>();
    const cancelled = yield* Deferred.make<true>();
    const source = new ReadableStream({
      start: (controller) => controller.enqueue(Uint8Array.of(1)),
      cancel: () =>
        Effect.runPromise(
          Deferred.succeed(cancelled, true).pipe(Effect.asVoid),
        ),
    });
    const read = readResponseWithSizeLimit({
      response: new Response(source),
      url: 'https://fixture.invalid/download',
      maxBytes: 8,
      onChunk: () => {
        void Effect.runPromise(Deferred.succeed(received, true));
      },
    });
    const fiber = yield* Effect.forkChild(read);
    yield* Deferred.await(received);
    yield* Fiber.interrupt(fiber);
    expect(yield* Deferred.await(cancelled)).toBe(true);
    expect(source.locked).toBe(false);
  }),
);

it.effect('keeps native WebSocket methods behind a scoped handle', () =>
  Effect.gen(function* () {
    let hostSocket = Option.none<InstanceType<WebSocketConstructor>>();
    let sent: unknown[] = [];
    let closed: Array<number | undefined> = [];
    class Host implements InstanceType<WebSocketConstructor> {
      readyState = 1;
      bufferedAmount = 0;
      // A native WebSocket uses null for an empty handler slot.
      /* eslint-disable effect/no-null-use-option */
      onopen: InstanceType<WebSocketConstructor>['onopen'] = null;
      onmessage: InstanceType<WebSocketConstructor>['onmessage'] = null;
      onerror: InstanceType<WebSocketConstructor>['onerror'] = null;
      onclose: InstanceType<WebSocketConstructor>['onclose'] = null;
      /* eslint-enable effect/no-null-use-option */
      constructor() {
        hostSocket = Option.some(this);
      }
      send(data: unknown) {
        sent = [...sent, data];
      }
      close(code?: number) {
        closed = [...closed, code];
      }
    }

    const opened = yield* Deferred.make<WebSocketLike>();
    const message = yield* Deferred.make<string>();
    yield* Effect.scoped(
      Effect.gen(function* () {
        const connection = yield* connectToWebSocket({
          url: 'wss://fixture.invalid/socket',
          webSocket: Host,
          onOpen: (socket) =>
            Deferred.succeed(opened, socket).pipe(Effect.asVoid),
          onMessageText: (text) =>
            Deferred.succeed(message, text).pipe(Effect.asVoid),
          onProcessingError: () => Effect.void,
        });
        const host = Option.getOrUndefined(hostSocket);
        const socket = yield* connection.socket;
        if (!host || !socket) return yield* Effect.die('Expected a socket');
        host.onopen?.({});
        host.onmessage?.({ data: 'message' });
        expect(yield* Deferred.await(opened)).toBe(socket);
        expect(yield* Deferred.await(message)).toBe('message');
        expect(yield* socket.readyState).toBe(1);
        yield* socket.send('command');
        yield* waitForWebSocketBufferDrain(socket);
        yield* connection.close(1001);
      }),
    );
    expect(sent).toEqual(['command']);
    expect(closed).toEqual([1001]);
  }),
);
