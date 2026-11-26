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

export type Experimental_RealtimeFactory = ReturnType<
  typeof wrapRealtimeFactory
>;
export type Experimental_RealtimeModel = RealtimeModelV4;

type ToolCall = Parameters<NonNullable<NativeOptions['onToolCall']>>[0];
type ServerEvent = Parameters<NonNullable<NativeOptions['onEvent']>>[0];
type ClientEvent = Parameters<NativeSession['sendEvent']>[0];
type ConnectOptions = Parameters<NativeSession['connect']>[0];
type ConnectResult<R> = Effect.Effect<undefined, AiSdkError, Scope.Scope | R>;
type CloseOptions = Parameters<NativeSession['close']>[0];
type ResponseOptions = Parameters<NativeSession['requestResponse']>[0];
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type Connection<R> = { scope: Scope.Closeable; owner: Owner<R> };

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

type Publish = <Key extends keyof RealtimeState>(
  key: Key,
  value: RealtimeState[Key],
) => void;

class SessionBridge extends NativeSession {
  active = false;

  constructor(
    options: NativeOptions,
    private readonly publish: Publish,
  ) {
    super(options);
  }

  protected setState<Key extends keyof RealtimeState>(
    key: Key,
    value: RealtimeState[Key],
  ): void {
    this.publish(key, value);
  }

  start(options: ConnectOptions | undefined, maxEvents: number) {
    this.maxEvents = maxEvents;
    this.active = true;
    return options ? this.connect(options) : this.connect();
  }

  override disconnect(): void {
    this.active = false;
    super.disconnect();
  }
}

export abstract class Experimental_AbstractRealtimeSession<R = never> {
  #session?: SessionBridge;
  #connection = Option.none<Connection<R>>();
  #connecting = false;

  protected state: RealtimeState = {
    status: 'disconnected',
    messages: [],
    events: [],
    isCapturing: false,
    isPlaying: false,
  };
  protected maxEvents: number;
  onToolCall: Experimental_RealtimeSessionOptions<R>['onToolCall'];
  onEvent: Experimental_RealtimeSessionOptions<R>['onEvent'];
  onError: Experimental_RealtimeSessionOptions<R>['onError'];

  constructor(
    private readonly options: Experimental_RealtimeSessionOptions<R>,
  ) {
    this.maxEvents = options.maxEvents ?? 500;
    this.onToolCall = options.onToolCall;
    this.onEvent = options.onEvent;
    this.onError = options.onError;
  }

  protected abstract setState<Key extends keyof RealtimeState>(
    key: Key,
    value: RealtimeState[Key],
  ): void;

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

  #run<A>(method: string, use: (session: SessionBridge) => A) {
    return this.#getSession().pipe(
      Effect.flatMap((session) =>
        runSync(`RealtimeSession.${method}`, () => use(session)),
      ),
    );
  }

  #request<A>(method: string, use: (session: SessionBridge) => Promise<A>) {
    return this.#getSession().pipe(
      Effect.flatMap((session) =>
        runRequest(`RealtimeSession.${method}`, {}, () => use(session)),
      ),
    );
  }

  #end<E>(operation: Effect.Effect<void, E>) {
    return Effect.suspend(() => {
      const scope = Option.getOrUndefined(this.#connection)?.scope;
      return scope
        ? operation.pipe(Effect.ensuring(Scope.close(scope, Exit.void)))
        : operation;
    });
  }

  connect(): ConnectResult<R>;
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

  disconnect() {
    return this.#end(
      this.#run('disconnect', (session) => session.disconnect()),
    );
  }

  close(options?: CloseOptions) {
    return this.#end(
      this.#request('close', (session) => session.close(options)),
    );
  }

  sendEvent(event: ClientEvent) {
    return this.#request('sendEvent', (session) => session.sendEvent(event));
  }

  sendTextMessage(text: string) {
    return this.#run('sendTextMessage', (session) =>
      session.sendTextMessage(text),
    );
  }

  sendAudio(audio: string) {
    return this.#run('sendAudio', (session) => session.sendAudio(audio));
  }

  commitAudio() {
    return this.#run('commitAudio', (session) => session.commitAudio());
  }

  clearAudioBuffer() {
    return this.#run('clearAudioBuffer', (session) =>
      session.clearAudioBuffer(),
    );
  }

  requestResponse(options?: ResponseOptions) {
    return this.#run('requestResponse', (session) =>
      session.requestResponse(options),
    );
  }

  cancelResponse() {
    return this.#run('cancelResponse', (session) => session.cancelResponse());
  }

  addToolOutput(callId: string, result: unknown) {
    return this.#run('addToolOutput', (session) =>
      session.addToolOutput(callId, result),
    );
  }

  startAudioCapture(stream: MediaStream) {
    return this.#run('startAudioCapture', (session) =>
      session.startAudioCapture(stream),
    );
  }

  resumeAudioCapture() {
    return this.#request('resumeAudioCapture', (session) =>
      session.resumeAudioCapture(),
    );
  }

  stopAudioCapture() {
    return this.#run('stopAudioCapture', (session) =>
      session.stopAudioCapture(),
    );
  }

  stopPlayback() {
    return this.#run('stopPlayback', (session) => session.stopPlayback());
  }

  resumePlayback() {
    return this.#request('resumePlayback', (session) =>
      session.resumePlayback(),
    );
  }

  dispose() {
    return this.#end(this.#run('dispose', (session) => session.dispose()));
  }
}
