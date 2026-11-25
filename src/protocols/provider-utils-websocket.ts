import * as sdk from '@ai-sdk/provider-utils';
import { Cause, Effect, type Scope } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';

type Message = { data: unknown };
type SocketData = string | Uint8Array | ArrayBuffer;
type Headers = Record<string, string | undefined>;
type HostListener<Event> = (event: Event) => void;
type SocketOptions = { headers?: Headers };

interface WebSocketHost {
  readyState: number;
  readonly bufferedAmount?: number;
  send(data: SocketData): void;
  close(code?: number, reason?: string): void;
  onopen: HostListener<unknown> | null;
  onmessage: HostListener<Message> | null;
  onerror: HostListener<unknown> | null;
  onclose: HostListener<unknown> | null;
}

export type WebSocketConstructor = new (
  url: string | URL,
  protocols?: string | string[],
  options?: SocketOptions,
) => WebSocketHost;

type Subscribe<Event> = <E, R>(
  listener: (event: Event) => Effect.Effect<void, E, R>,
) => Effect.Effect<void, AiSdkError, R | Scope.Scope>;

export interface WebSocketLike {
  readonly readyState: Effect.Effect<number, AiSdkError>;
  readonly bufferedAmount: Effect.Effect<number | undefined, AiSdkError>;
  send(data: SocketData): Effect.Effect<void, AiSdkError>;
  close(code?: number, reason?: string): Effect.Effect<void, AiSdkError>;
  onopen: Subscribe<unknown>;
  onmessage: Subscribe<Message>;
  onerror: Subscribe<unknown>;
  onclose: Subscribe<unknown>;
}

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
const hosts = new WeakMap<object, WebSocketHost>();
const sockets = new WeakMap<WebSocketHost, WebSocketLike>();

const cleanup = (name: string, close: () => void) =>
  runSync(name, close).pipe(
    Effect.catch((error) =>
      Effect.logWarning('WebSocket cleanup failed', error),
    ),
  );

const once = <Args extends unknown[]>(action: (...args: Args) => void) => {
  let done = false;
  return (...args: Args) => {
    if (done) return;
    action(...args);
    done = true;
  };
};

const bindListener =
  <Args extends unknown[], E, R>(
    owner: Owner<R>,
    listener: (...args: Args) => Effect.Effect<void, E, R>,
  ) =>
  (...args: Args) =>
    owner.runCallback(Effect.suspend(() => listener(...args)));

const subscribe =
  <Event>(
    name: string,
    get: () => HostListener<Event> | null,
    set: (listener: HostListener<Event> | null) => void,
  ): Subscribe<Event> =>
  (listener) =>
    Effect.gen(function* () {
      const owner =
        yield* openOperation<Effect.Services<ReturnType<typeof listener>>>();
      const notify = bindListener(owner, listener);
      const installed = (event: Event) => {
        void notify(event).catch(() => {});
      };
      yield* Effect.acquireRelease(
        runSync(name, () => {
          const previous = get();
          set(installed);
          return previous;
        }),
        (previous) =>
          cleanup(name, () => {
            if (get() === installed) set(previous);
          }),
      );
    });

const wrapSocket = (host: WebSocketHost): WebSocketLike => {
  const existing = sockets.get(host);
  if (existing) return existing;
  const close = once((code?: number, reason?: string) =>
    host.close(code, reason),
  );
  const socket: WebSocketLike = {
    readyState: runSync(
      'ProviderUtils.WebSocket.readyState',
      () => host.readyState,
    ),
    bufferedAmount: runSync(
      'ProviderUtils.WebSocket.bufferedAmount',
      () => host.bufferedAmount,
    ),
    send: (data) =>
      runSync('ProviderUtils.WebSocket.send', () => host.send(data)),
    close: (code, reason) =>
      runSync('ProviderUtils.WebSocket.close', () => close(code, reason)),
    onopen: subscribe(
      'ProviderUtils.WebSocket.onopen',
      () => host.onopen,
      (handler) => {
        host.onopen = handler;
      },
    ),
    onmessage: subscribe(
      'ProviderUtils.WebSocket.onmessage',
      () => host.onmessage,
      (handler) => {
        host.onmessage = handler;
      },
    ),
    onerror: subscribe(
      'ProviderUtils.WebSocket.onerror',
      () => host.onerror,
      (handler) => {
        host.onerror = handler;
      },
    ),
    onclose: subscribe(
      'ProviderUtils.WebSocket.onclose',
      () => host.onclose,
      (handler) => {
        host.onclose = handler;
      },
    ),
  };
  hosts.set(socket, host);
  sockets.set(host, socket);
  return socket;
};

export const readWebSocketMessageText = (data: unknown) =>
  runRequest('ProviderUtils.readWebSocketMessageText', {}, () =>
    sdk.readWebSocketMessageText(data),
  );

type DrainOptions = {
  readonly abortSignal?: AbortSignal;
  readonly highWaterMark?: number;
  readonly pollIntervalMs?: number;
};

export const waitForWebSocketBufferDrain = (
  socket: WebSocketLike | WebSocketHost,
  options?: DrainOptions,
) =>
  runRequest(
    'ProviderUtils.waitForWebSocketBufferDrain',
    options ?? {},
    (abortSignal) =>
      sdk.waitForWebSocketBufferDrain(
        hosts.get(socket) ?? (socket as WebSocketHost),
        { ...options, abortSignal },
      ),
  );

export const getWebSocketConstructor = (webSocket?: WebSocketConstructor) =>
  runSync('ProviderUtils.getWebSocketConstructor', () => {
    const Constructor = sdk.getWebSocketConstructor(webSocket);
    return (
      url: string | URL,
      protocols?: string | string[],
      options?: SocketOptions,
    ) =>
      Effect.acquireRelease(
        runSync('ProviderUtils.createWebSocket', () =>
          wrapSocket(new Constructor(url, protocols, options)),
        ),
        (socket) =>
          socket
            .close()
            .pipe(
              Effect.catch((error) =>
                Effect.logWarning('WebSocket cleanup failed', error),
              ),
            ),
      );
  });

type ConnectOptions<E, R> = {
  readonly url: string | URL;
  readonly protocols?: string | string[];
  readonly headers?: Headers;
  readonly webSocket?: WebSocketConstructor;
  readonly abortSignal?: AbortSignal;
  readonly onOpen?: (socket: WebSocketLike) => Effect.Effect<void, E, R>;
  readonly onMessageText: (text: string) => Effect.Effect<void, E, R>;
  readonly onProcessingError: (error: unknown) => Effect.Effect<void, E, R>;
  readonly onSocketError?: () => Effect.Effect<void, E, R>;
  readonly onClose?: (info: {
    code?: number;
    reason?: string;
  }) => Effect.Effect<void, E, R>;
  readonly onAbort?: (reason: unknown) => Effect.Effect<void, E, R>;
};

export const connectToWebSocket = <E = never, R = never>(
  options: ConnectOptions<E, R>,
) =>
  Effect.gen(function* () {
    const {
      onOpen,
      onMessageText,
      onProcessingError,
      onSocketError,
      onClose,
      onAbort,
      ...host
    } = options;
    const owner = yield* openOperation<R>(options.abortSignal);
    const report = bindListener(owner, onProcessingError);
    const connection = yield* Effect.acquireRelease(
      runSync('ProviderUtils.connectToWebSocket', () => {
        let close: ((code?: number) => void) | undefined;
        const abort = once((reason: unknown) => {
          close?.();
          if (onAbort) {
            void owner
              .runCleanup(Effect.suspend(() => onAbort(reason)))
              .catch(() => {});
          }
        });
        const native = sdk.connectToWebSocket({
          ...host,
          abortSignal: owner.signal,
          ...(onOpen
            ? {
                onOpen: (socket: WebSocketHost) => {
                  const opened = Effect.suspend(() =>
                    onOpen(wrapSocket(socket)),
                  );
                  void owner
                    .runCallback(
                      opened.pipe(
                        Effect.catchCause((cause) =>
                          Effect.suspend(() =>
                            onProcessingError(Cause.squash(cause)),
                          ),
                        ),
                      ),
                    )
                    .catch(() => {});
                },
              }
            : {}),
          onMessageText: bindListener(owner, onMessageText),
          onAbort: abort,
          onProcessingError: (error) => {
            void report(error).catch(() => {});
          },
          ...(onSocketError
            ? { onSocketError: bindListener(owner, onSocketError) }
            : {}),
          ...(onClose ? { onClose: bindListener(owner, onClose) } : {}),
        });
        close = once((code?: number) => native.close(code));
        if (owner.signal.aborted) {
          abort(owner.signal.reason);
          close();
        }
        return { native, close };
      }),
      ({ close }) => cleanup('ProviderUtils.closeWebSocket', close),
    );

    return {
      socket: runSync('ProviderUtils.WebSocket.socket', () => {
        const socket = connection.native.socket;
        return socket && wrapSocket(socket);
      }),
      close: (code?: number) =>
        runSync('ProviderUtils.closeWebSocket', () => connection.close(code)),
    };
  });

export type WebSocketConnection = Effect.Success<
  ReturnType<typeof connectToWebSocket>
>;
