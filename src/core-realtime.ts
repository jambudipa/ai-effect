import {
  Experimental_AbstractRealtimeSession as NativeSession,
  type Experimental_RealtimeSessionOptions as NativeOptions,
  type Experimental_RealtimeState as RealtimeState,
} from 'ai';
import { Effect, Exit, Option, Scope } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from './internal/operation.js';
import {
  type RealtimeModelV4,
  unwrapRealtimeModel,
  type wrapRealtimeFactory,
} from './internal/provider-realtime.js';

/** Type the adapter factory that creates Effect-backed realtime model handles. */
export type Experimental_RealtimeFactory = ReturnType<
  typeof wrapRealtimeFactory
>;
/** Represent a model that supports the version 4 realtime protocol. */
export type Experimental_RealtimeModel = RealtimeModelV4;

/** Preserve the native tool-call data supplied to a session callback. */
type ToolCall = Parameters<NonNullable<NativeOptions['onToolCall']>>[0];
/** Preserve the server event shape used by the installed realtime SDK. */
type ServerEvent = Parameters<NonNullable<NativeOptions['onEvent']>>[0];
/** Keep outbound client event types in sync with the underlying session protocol. */
type ClientEvent = Parameters<NativeSession['sendEvent']>[0];
/** Forward connection options accepted by the native realtime session. */
type ConnectOptions = Parameters<NativeSession['connect']>[0];
/** Require a caller scope so closing it also ends the active connection. */
type ConnectResult<R> = Effect.Effect<undefined, AiSdkError, Scope.Scope | R>;
/** Retain the native options for closing a realtime connection. */
type CloseOptions = Parameters<NativeSession['close']>[0];
/** Retain native response options when asking the server to generate a response. */
type ResponseOptions = Parameters<NativeSession['requestResponse']>[0];
/** Keep the callback runtime and native connection lifetime together. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Associate one open connection with its own closeable scope and callback owner. */
type Connection<R> = { scope: Scope.Closeable; owner: Owner<R> };

/** Preserve native session configuration and replace SDK callbacks with Effect functions. */
export type Experimental_RealtimeSessionOptions<R = never> = {
  [Name in keyof NativeOptions]: Name extends 'model'
    ? RealtimeModelV4
    : Name extends 'onToolCall'
      ? (args: ToolCall) => Effect.Effect<unknown, unknown, R>
      : Name extends 'onEvent'
        ? (event: ServerEvent) => Effect.Effect<void, unknown, R>
        : Name extends 'onError'
          ? (error: Error) => Effect.Effect<void, unknown, R>
          : NativeOptions[Name];
};

/** Publish a change without losing the type associated with the selected state key. */
type Publish = <Key extends keyof RealtimeState>(
  key: Key,
  value: RealtimeState[Key],
) => void;

/** Use the native session implementation and mirror its state changes to an Effect wrapper. */
class SessionBridge extends NativeSession {
  /** Track whether the native bridge still has a connection to disconnect. */
  active = false;

  /** Install the function that mirrors native state into the public session. */
  constructor(
    options: NativeOptions,
    private readonly publish: Publish,
  ) {
    super(options);
  }

  /** Record the native state first and then publish the updated state field. */
  protected setState<Key extends keyof RealtimeState>(
    key: Key,
    value: RealtimeState[Key],
  ): void {
    this.publish(key, value);
  }

  /** Apply the event retention limit before opening the native connection. */
  start(options: ConnectOptions | undefined, maxEvents: number) {
    this.maxEvents = maxEvents;
    this.active = true;
    return options ? this.connect(options) : this.connect();
  }

  /** Record the inactive state before disconnecting the native transport. */
  override disconnect(): void {
    this.active = false;
    super.disconnect();
  }
}

/** Extend this wrapper to publish state changes while Effect owns connection setup and cleanup. */
export abstract class Experimental_AbstractRealtimeSession<R = never> {
  /** Delay construction of the native bridge until the first operation needs it. */
  #session?: SessionBridge;
  /** Track the currently owned connection scope for callback dispatch and cleanup. */
  #connection = Option.none<Connection<R>>();
  /** Block duplicate connection attempts while the next connection is being acquired. */
  #connecting = false;

  /** Start with an empty disconnected snapshot before any native state updates arrive. */
  protected state: RealtimeState = {
    status: 'disconnected',
    messages: [],
    events: [],
    isCapturing: false,
    isPlaying: false,
  };
  /** Limit how many native session events the state snapshot retains. */
  protected maxEvents: number;
  /** Handle a native tool call with access to the current connection context. */
  onToolCall: Experimental_RealtimeSessionOptions<R>['onToolCall'];
  /** Observe realtime server events as they arrive on the active connection. */
  onEvent: Experimental_RealtimeSessionOptions<R>['onEvent'];
  /** Report native session errors through the caller's Effect handler. */
  onError: Experimental_RealtimeSessionOptions<R>['onError'];

  /** Store session options and initial callbacks without opening a transport. */
  constructor(
    private readonly options: Experimental_RealtimeSessionOptions<R>,
  ) {
    this.maxEvents = options.maxEvents ?? 500;
    this.onToolCall = options.onToolCall;
    this.onEvent = options.onEvent;
    this.onError = options.onError;
  }

  /** Implement the notification path for native session state changes in a host adapter. */
  protected abstract setState<Key extends keyof RealtimeState>(
    key: Key,
    value: RealtimeState[Key],
  ): void;

  /** Run a configured callback only when a connection owner is available. */
  #dispatch<Args extends unknown[], A>(
    handler: ((...args: Args) => Effect.Effect<A, unknown, R>) | undefined,
    ...args: Args
  ): Promise<A> | undefined {
    return (
      handler &&
      Option.getOrUndefined(this.#connection)?.owner.runCallback(
        Effect.suspend(() => handler.apply(this, args)),
      )
    );
  }

  /** Construct the native bridge on demand and retain it for subsequent operations. */
  #getSession() {
    return Effect.suspend(() => {
      if (this.#session) return Effect.succeed(this.#session);
      const model = unwrapRealtimeModel(this.options.model);
      if (!model) {
        return Effect.fail(
          sdkError(
            'RealtimeSession.constructor',
            'Expected an ai-effect realtime model',
          ),
        );
      }
      return runSync('RealtimeSession.constructor', () => {
        const session = (this.#session ??= new SessionBridge(
          {
            ...this.options,
            model,
            onToolCall: (args) => this.#dispatch(this.onToolCall, args),
            onEvent: (event) => this.#dispatch(this.onEvent, event),
            onError: (error) => this.#dispatch(this.onError, error),
          },
          (key, value) => {
            this.state = { ...this.state, [key]: value };
            this.setState(key, value);
          },
        ));
        Object.defineProperty(session, 'onToolCall', {
          get: () => {
            const handler = this.onToolCall;
            return (
              handler && ((args: ToolCall) => this.#dispatch(handler, args))
            );
          },
        });
        return session;
      });
    });
  }

  /** Invoke a synchronous native operation lazily and label any thrown failure. */
  #run<A>(method: string, use: (session: SessionBridge) => A) {
    return this.#getSession().pipe(
      Effect.flatMap((session) =>
        runSync(`RealtimeSession.${method}`, () => use(session)),
      ),
    );
  }

  /** Invoke an asynchronous native operation lazily and label any rejected failure. */
  #request<A>(method: string, use: (session: SessionBridge) => Promise<A>) {
    return this.#getSession().pipe(
      Effect.flatMap((session) =>
        runRequest(`RealtimeSession.${method}`, {}, () => use(session)),
      ),
    );
  }

  /** Run a terminal operation and close the connection scope even if the operation fails. */
  #end<E>(operation: Effect.Effect<void, E>) {
    return Effect.suspend(() => {
      const scope = Option.getOrUndefined(this.#connection)?.scope;
      return scope
        ? operation.pipe(Effect.ensuring(Scope.close(scope, Exit.void)))
        : operation;
    });
  }

  /** Open one connection with native defaults under the caller's scope. */
  connect(): ConnectResult<R>;
  /** Open a connection with explicit transport options under the caller's scope. */
  connect(options: ConnectOptions): ConnectResult<R>;
  connect(options?: ConnectOptions) {
    return Effect.uninterruptibleMask((restore) =>
      Effect.gen({ self: this }, function* () {
        const session = yield* this.#getSession();
        if (this.#connecting || session.active) {
          return yield* Effect.fail(
            sdkError(
              'RealtimeSession.connect',
              'Realtime session is already active',
            ),
          );
        }
        this.#connecting = true;
        const previous = Option.getOrUndefined(this.#connection)?.scope;
        if (previous) yield* Scope.close(previous, Exit.void);
        const parent = yield* Effect.scope;
        const scope = yield* Scope.fork(parent);
        const owner = yield* Scope.provide(openOperation<R>(), scope);
        const connection = { scope, owner };
        this.#connection = Option.some(connection);
        yield* Scope.addFinalizer(
          scope,
          Effect.suspend(() => {
            if (Option.getOrUndefined(this.#connection) !== connection) {
              return Effect.void;
            }
            this.#connection = Option.none();
            if (!session.active) return Effect.void;
            return this.#run('disconnect', (native) =>
              native.disconnect(),
            ).pipe(
              Effect.catch((error) =>
                Effect.logWarning('Realtime session disposal failed', error),
              ),
            );
          }),
        );
        this.#connecting = false;
        if (Option.isNone(this.#connection)) return yield* Effect.interrupt;
        const connect = this.#request('connect', (native) =>
          native.start(options, this.maxEvents),
        );
        yield* restore(connect).pipe(
          Effect.onExit((exit) =>
            Exit.isSuccess(exit) ? Effect.void : Scope.close(scope, exit),
          ),
        );
      }),
    );
  }

  /** Disconnect the current transport and release its callback scope. */
  disconnect() {
    return this.#end(
      this.#run('disconnect', (session) => session.disconnect()),
    );
  }

  /** Close the native session with optional close settings and release its scope. */
  close(options?: CloseOptions) {
    return this.#end(
      this.#request('close', (session) => session.close(options)),
    );
  }

  /** Send a native protocol event and expose any rejection through the Effect error channel. */
  sendEvent(event: ClientEvent) {
    return this.#request('sendEvent', (session) => session.sendEvent(event));
  }

  /** Add user text to the current realtime conversation. */
  sendTextMessage(text: string) {
    return this.#run('sendTextMessage', (session) =>
      session.sendTextMessage(text),
    );
  }

  /** Send one encoded audio chunk to the server's current input buffer. */
  sendAudio(audio: string) {
    return this.#run('sendAudio', (session) => session.sendAudio(audio));
  }

  /** Commit buffered input audio to the server conversation. */
  commitAudio() {
    return this.#run('commitAudio', (session) => session.commitAudio());
  }

  /** Clear the current server input buffer before sending replacement audio. */
  clearAudioBuffer() {
    return this.#run('clearAudioBuffer', (session) =>
      session.clearAudioBuffer(),
    );
  }

  /** Ask the server to generate a response with optional output settings. */
  requestResponse(options?: ResponseOptions) {
    return this.#run('requestResponse', (session) =>
      session.requestResponse(options),
    );
  }

  /** Request cancellation of the active server response. */
  cancelResponse() {
    return this.#run('cancelResponse', (session) => session.cancelResponse());
  }

  /** Send a tool result to the server under the originating call identifier. */
  addToolOutput(callId: string, result: unknown) {
    return this.#run('addToolOutput', (session) =>
      session.addToolOutput(callId, result),
    );
  }

  /** Capture audio from the supplied browser media stream. */
  startAudioCapture(stream: MediaStream) {
    return this.#run('startAudioCapture', (session) =>
      session.startAudioCapture(stream),
    );
  }

  /** Resume native audio capture and report initialization failures through Effect. */
  resumeAudioCapture() {
    return this.#request('resumeAudioCapture', (session) =>
      session.resumeAudioCapture(),
    );
  }

  /** Stop the native input capture operation. */
  stopAudioCapture() {
    return this.#run('stopAudioCapture', (session) =>
      session.stopAudioCapture(),
    );
  }

  /** Stop playing the received realtime audio locally. */
  stopPlayback() {
    return this.#run('stopPlayback', (session) => session.stopPlayback());
  }

  /** Resume local playback and expose native playback rejection through Effect. */
  resumePlayback() {
    return this.#request('resumePlayback', (session) =>
      session.resumePlayback(),
    );
  }

  /** Dispose of native session resources and close the callback scope. */
  dispose() {
    return this.#end(this.#run('dispose', (session) => session.dispose()));
  }
}
