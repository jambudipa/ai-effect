import { Cause, Effect, Exit, Queue, type Scope } from 'effect';
import {
  type AiSdkError,
  runRequest,
  sdkError,
} from '../../internal/operation.js';
import type {
  JSONRPCMessage,
  MCPTransport as NativeTransport,
} from './mcp-contract.js';

/** Exclusive client attachment with an explicit detach operation for early cleanup. */
interface TransportLease {
  /** Native facade that accepts calls only while the attachment owns the registered transport. */
  readonly transport: NativeTransport;
  /** Close once and clear the attachment so ownership can pass to another client. */
  readonly detach: Effect.Effect<void>;
}

/** Lookup for scoped leases keyed by public Effect transport handles. */
export const transports = new WeakMap<
  object,
  Effect.Effect<TransportLease, AiSdkError, Scope.Scope>
>();

/** Optional observers that receive one transport's events in delivery order. */
export interface MCPTransportListeners<
  MessageR = never,
  MessageE = never,
  CloseR = MessageR,
  CloseE = MessageE,
  ErrorR = MessageR,
  ErrorE = MessageE,
> {
  /** Consume a parsed JSON-RPC notification or response without replacing the client's handler. */
  readonly onMessage?: (
    message: JSONRPCMessage,
  ) => Effect.Effect<void, MessageE, MessageR>;
  /** Observe normal transport closure once per successful start. */
  readonly onClose?: () => Effect.Effect<void, CloseE, CloseR>;
  /** Observe native transport errors tagged with the operation name. */
  readonly onError?: (error: AiSdkError) => Effect.Effect<void, ErrorE, ErrorR>;
}

/** Keep client ownership separate from Effect listeners and reject overlapping starts or attachments. */
export const registerTransport = (
  key: object,
  native: NativeTransport,
  operation: string,
) => {
  const attachment: { current?: NativeTransport } = {};
  let state: 'idle' | 'starting' | 'started' = 'idle';
  const start = Effect.suspend(() => {
    state = 'starting';
    return runRequest(`${operation}.start`, {}, () => native.start()).pipe(
      Effect.onExit((exit) =>
        Effect.sync(() => {
          state = Exit.isSuccess(exit) ? 'started' : 'idle';
        }),
      ),
    );
  });
  let listeners: ReadonlyArray<{
    readonly onMessage: (message: JSONRPCMessage) => void;
    readonly onClose: () => void;
    readonly onError: (error: AiSdkError) => void;
  }> = [];
  // The SDK client assigns its own handlers. Keep them separate from listeners.
  native.onmessage = (message) => {
    attachment.current?.onmessage?.(message);
    for (const entry of listeners) entry.onMessage(message);
  };
  native.onclose = () => {
    if (state !== 'started') return;
    state = 'idle';
    attachment.current?.onclose?.();
    for (const entry of listeners) entry.onClose();
  };
  native.onerror = (cause) => {
    attachment.current?.onerror?.(cause);
    const error = sdkError(`${operation}.error`, cause);
    for (const entry of listeners) entry.onError(error);
  };
  const inUse = () => attachment.current || state !== 'idle';
  const occupied = (name: 'attach' | 'start') =>
    sdkError(`${operation}.${name}`, 'MCP transport is already in use');
  const detached = (name: 'start' | 'send') =>
    Effect.runPromise(
      sdkError(
        `${operation}.${name}`,
        'MCP client no longer owns this transport',
      ),
    );
  const lease = Effect.acquireRelease(
    Effect.gen(function* () {
      let startCalled = false;
      const close = yield* Effect.cached(
        Effect.suspend(() =>
          startCalled
            ? runRequest(`${operation}.close`, {}, () => native.close())
            : Effect.void,
        ).pipe(Effect.uninterruptible),
      );
      const transport: NativeTransport = {
        start: () => {
          if (attachment.current !== transport) return detached('start');
          startCalled = true;
          return Effect.runPromise(start);
        },
        send: (message, options) =>
          attachment.current === transport
            ? native.send(message, options)
            : detached('send'),
        close: () => Effect.runPromise(close),
        ...(native.supportsProtocolVersionDiscovery !== undefined && {
          supportsProtocolVersionDiscovery:
            native.supportsProtocolVersionDiscovery,
        }),
      };
      const detach = yield* Effect.cached(
        close.pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('MCP transport release failed', error),
          ),
          Effect.ensuring(
            Effect.sync(() => {
              if (attachment.current === transport) delete attachment.current;
            }),
          ),
          Effect.uninterruptible,
        ),
      );
      if (inUse()) return yield* occupied('attach');
      attachment.current = transport;
      return { transport, detach };
    }),
    ({ detach }) => detach,
  );
  transports.set(key, lease);

  return {
    start: Effect.suspend(() => (inUse() ? occupied('start') : start)),
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
