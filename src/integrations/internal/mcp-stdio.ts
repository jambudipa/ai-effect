import { Cause, Effect, Queue } from 'effect';
import { type AiSdkError, sdkError } from '../../internal/operation.js';
import type {
  JSONRPCMessage,
  MCPTransport as NativeTransport,
} from './mcp-contract.js';

export const transports = new WeakMap<object, NativeTransport>();

export interface MCPTransportListeners<
  MessageR = never,
  MessageE = never,
  CloseR = MessageR,
  CloseE = MessageE,
  ErrorR = MessageR,
  ErrorE = MessageE,
> {
  readonly onMessage?: (
    message: JSONRPCMessage,
  ) => Effect.Effect<void, MessageE, MessageR>;
  readonly onClose?: () => Effect.Effect<void, CloseE, CloseR>;
  readonly onError?: (error: AiSdkError) => Effect.Effect<void, ErrorE, ErrorR>;
}

export const registerTransport = (
  key: object,
  native: NativeTransport,
  operation: string,
) => {
  let started = false;
  const start = () =>
    native.start().then(() => {
      started = true;
    });
  let listeners: ReadonlyArray<{
    readonly onMessage: (message: JSONRPCMessage) => void;
    readonly onClose: () => void;
    readonly onError: (error: AiSdkError) => void;
  }> = [];
  // The SDK client assigns its own handlers. Keep them separate from listeners.
  const transport: NativeTransport = {
    start,
    send: (message, options) => native.send(message, options),
    close: (options) => native.close(options),
    ...(native.supportsProtocolVersionDiscovery !== undefined && {
      supportsProtocolVersionDiscovery: native.supportsProtocolVersionDiscovery,
    }),
  };
  native.onmessage = (message) => {
    transport.onmessage?.(message);
    for (const entry of listeners) entry.onMessage(message);
  };
  native.onclose = () => {
    if (!started) return;
    started = false;
    transport.onclose?.();
    for (const entry of listeners) entry.onClose();
  };
  native.onerror = (cause) => {
    transport.onerror?.(cause);
    const error = sdkError(`${operation}.error`, cause);
    for (const entry of listeners) entry.onError(error);
  };
  transports.set(key, transport);

  return {
    start,
    events: {
      subscribe: <
        MessageR = never,
        MessageE = never,
        CloseR = never,
        CloseE = never,
        ErrorR = never,
        ErrorE = never,
      >(
        callbacks: MCPTransportListeners<
          MessageR,
          MessageE,
          CloseR,
          CloseE,
          ErrorR,
          ErrorE
        >,
      ) =>
        Effect.gen(function* () {
          type Notification = Effect.Effect<
            void,
            MessageE | CloseE | ErrorE,
            MessageR | CloseR | ErrorR
          >;
          const pending = yield* Queue.unbounded<Notification>();
          yield* Effect.forkScoped(
            Effect.forever(
              Effect.flatMap(Queue.take(pending), (next) =>
                next.pipe(
                  Effect.catchCause((cause) =>
                    Effect.logWarning(
                      'MCP transport listener failed',
                      sdkError(`${operation}.listener`, Cause.squash(cause)),
                    ),
                  ),
                ),
              ),
            ),
          );
          const notify = (callback: () => Notification | undefined) => {
            Queue.offerUnsafe(
              pending,
              Effect.suspend(() => callback() ?? Effect.void),
            );
          };
          const observer = {
            onMessage: (message: JSONRPCMessage) =>
              notify(() => callbacks.onMessage?.(message)),
            onClose: () => notify(() => callbacks.onClose?.()),
            onError: (error: AiSdkError) =>
              notify(() => callbacks.onError?.(error)),
          };
          yield* Effect.acquireRelease(
            Effect.sync(() => {
              listeners = [...listeners, observer];
            }),
            () =>
              Effect.sync(() => {
                listeners = listeners.filter(
                  (listener) => listener !== observer,
                );
              }),
          );
        }),
    },
  };
};
