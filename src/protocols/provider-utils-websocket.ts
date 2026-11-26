import * as sdk from '@ai-sdk/provider-utils';
import { Cause, Effect, type Scope } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';

/** Pass through the host event payload for native text decoding. */
type Message = { data: unknown };
/** Preserve native text and binary payloads when the Effect socket sends data. */
type SocketData = string | Uint8Array | ArrayBuffer;
/** Carry optional header values into hosts that implement the SDK constructor options. */
type Headers = Record<string, string | undefined>;
/** Model the host callback slot, which is synchronous at the native boundary. */
type HostListener<Event> = (event: Event) => void;
/** Pass transport headers to the configured constructor when the host accepts them. */
type SocketOptions = { headers?: Headers };

/**
 * Describe the native host operations and single listener slots used by the SDK adapter.
 */
interface WebSocketHost {
  /** Read the native websocket lifecycle state using the host state codes. */
  readyState: number;
  /** Report bytes still queued for transmission if the host exposes buffering. */
  readonly bufferedAmount?: number;
  /** Send native text or binary data through the open host socket. */
  send(data: SocketData): void;
  /** Forward optional close code and reason to the host. */
  close(code?: number, reason?: string): void;
  /** Receive the host open event. The adapter sets this slot while subscribed. */
  onopen: HostListener<unknown> | null;
  /** Receive the raw native message so the SDK can decode it. */
  onmessage: HostListener<Message> | null;
  /** Receive host transport failures through the error event. */
  onerror: HostListener<unknown> | null;
  /** Receive the native termination event through the current listener slot. */
  onclose: HostListener<unknown> | null;
}

/**
 * Inject a runtime constructor that can create the host socket and expose its listener
 * slots.
 */
export type WebSocketConstructor = new (
  url: string | URL,
  protocols?: string | string[],
  options?: SocketOptions,
) => WebSocketHost;

/**
 * Install an Effect event listener for the current scope and release its callback when the
 * scope closes.
 */
type Subscribe<Event> = <E, R>(
  listener: (event: Event) => Effect.Effect<void, E, R>,
) => Effect.Effect<void, AiSdkError, R | Scope.Scope>;

/** Expose reads, sends, closure, and scoped listener registration as Effects. */
export interface WebSocketLike {
  /** Read the current host state when the Effect runs. */
  readonly readyState: Effect.Effect<number, AiSdkError>;
  /** Read pending bytes. An undefined value means the host does not expose buffering. */
  readonly bufferedAmount: Effect.Effect<number | undefined, AiSdkError>;
  /** Send native text or binary data when the Effect runs. */
  send(data: SocketData): Effect.Effect<void, AiSdkError>;
  /** Close the socket once. Forward the optional native close code and reason. */
  close(code?: number, reason?: string): Effect.Effect<void, AiSdkError>;
  /** Install an open listener owned by the current scope. */
  onopen: Subscribe<unknown>;
  /** Subscribe to raw message events within the current scope. */
  onmessage: Subscribe<Message>;
  /** Subscribe to native socket error events within the current scope. */
  onerror: Subscribe<unknown>;
  /** Subscribe to native close events within the current scope. */
  onclose: Subscribe<unknown>;
}

/** Use the operation scope to run Effect callbacks from host events. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Retain the original socket for SDK operations that need access to native buffers. */
const hosts = new WeakMap<object, WebSocketHost>();
/**
 * Reuse a wrapper for each host so it shares its close guard and native listener slots.
 */
const sockets = new WeakMap<WebSocketHost, WebSocketLike>();

/** Log native cleanup failures while allowing scope finalization to continue. */
const cleanup = (name: string, close: () => void) =>
  runSync(name, close).pipe(
    Effect.catch((error) =>
      Effect.logWarning('WebSocket cleanup failed', error),
    ),
  );

/** Run a synchronous cleanup at most once after it completes successfully. */
const once = <Args extends unknown[]>(action: (...args: Args) => void) => {
  let done = false;
  return (...args: Args) => {
    if (done) return;
    action(...args);
    done = true;
  };
};

/** Suspend each event callback and run it in the environment captured by the owner. */
const bindListener =
  <Args extends unknown[], E, R>(
    owner: Owner<R>,
    listener: (...args: Args) => Effect.Effect<void, E, R>,
  ) =>
  (...args: Args) =>
    owner.runCallback(Effect.suspend(() => listener(...args)));

/**
 * Remember the previous native listener and restore it on release if this scope still owns
 * the slot.
 */
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

/**
 * Expose Effect operations over the native host and share one close operation for each
 * socket.
 */
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

/**
 * Decode a native websocket message with the SDK and report decoding failures in the
 * Effect.
 */
export const readWebSocketMessageText = (data: unknown) =>
  runRequest('ProviderUtils.readWebSocketMessageText', {}, () =>
    sdk.readWebSocketMessageText(data),
  );

/**
 * Configure the buffered byte threshold, polling interval in milliseconds, and optional
 * cancellation signal.
 */
type DrainOptions = {
  readonly abortSignal?: AbortSignal;
  readonly highWaterMark?: number;
  readonly pollIntervalMs?: number;
};

/**
 * Use the SDK backpressure wait with the native socket and propagate interruption to its
 * poll.
 */
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

/**
 * Resolve the configured or runtime SDK constructor and return a factory for wrapped
 * sockets.
 */
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

/**
 * Carry the native transport inputs and the Effect callbacks owned by the connection
 * scope.
 */
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

/**
 * Open a scoped connection and route native events to Effect callbacks. Scope release or
 * abort closes the connection.
 */
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

/**
 * Expose optional open socket access and a close Effect for a connection owned by the
 * calling scope.
 */
export type WebSocketConnection = Effect.Success<
  ReturnType<typeof connectToWebSocket>
>;
