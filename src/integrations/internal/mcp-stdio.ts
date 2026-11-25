import { Cause, Effect } from 'effect';
import {
  type AiSdkError,
  openOperation,
  sdkError,
} from '../../internal/operation.js';
import type {
  JSONRPCMessage,
  MCPTransport as NativeTransport,
} from './mcp-contract.js';

export const transports = new WeakMap<object, NativeTransport>();

export interface MCPTransportListeners<R = never, E = never> {
  readonly onMessage?: (message: JSONRPCMessage) => Effect.Effect<void, E, R>;
  readonly onClose?: () => Effect.Effect<void, E, R>;
  readonly onError?: (error: AiSdkError) => Effect.Effect<void, E, R>;
}

export const registerTransport = (
  key: object,
  native: NativeTransport,
  operation: string,
) => {
  let listeners: ReadonlyArray<{
    readonly onMessage: (message: JSONRPCMessage) => void;
    readonly onClose: () => void;
    readonly onError: (error: AiSdkError) => void;
  }> = [];
  // The SDK client assigns its own handlers. Keep them separate from listeners.
  const transport: NativeTransport = {
    start: () => native.start(),
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
    subscribe: <R = never, E = never>(callbacks: MCPTransportListeners<R, E>) =>
      Effect.gen(function* () {
        const owner = yield* openOperation<R>();
        const notify = (
          callback: () => Effect.Effect<void, E, R> | undefined,
        ) => {
          void owner
            .runCallback(
              Effect.suspend(() => callback() ?? Effect.void).pipe(
                Effect.catchCause((cause) =>
                  Effect.logWarning(
                    'MCP transport listener failed',
                    sdkError(`${operation}.listener`, Cause.squash(cause)),
                  ),
                ),
              ),
            )
            .catch(() => {});
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
              listeners = listeners.filter((listener) => listener !== observer);
            }),
        );
      }),
  };
};
