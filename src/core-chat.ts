import {
  AbstractChat as NativeAbstractChat,
  DefaultChatTransport as NativeDefaultChatTransport,
  DirectChatTransport as NativeDirectChatTransport,
  HttpChatTransport as NativeHttpChatTransport,
  safeValidateWebSocketChatTransportRequest as nativeValidateSocketRequest,
  TextStreamChatTransport as NativeTextStreamChatTransport,
  WebSocketChatTransport as NativeWebSocketChatTransport,
  type Agent,
  type ChatState as NativeChatState,
  type ChatTransport as NativeTransport,
  type InferUITools,
  type OutputInterface,
  type UIMessage,
  type UIMessageChunk,
  type WebSocketChatTransportRequest,
} from 'ai';
import { Effect, Option, Stream } from 'effect';
import type { ToolLoopAgent } from './core.js';
import {
  foreignStream,
  invoke,
  type CallbackResult,
  type Owner,
} from './internal/chat-boundary.js';
import {
  bindUiOptions,
  type UIMessageStreamOptions,
} from './internal/chat-ui-stream.js';
import {
  HostChat,
  nativeChatOptions,
  type ChatInit,
} from './frameworks/chat.js';
import { ViewLifetime } from './frameworks/lifetime.js';
import {
  makeChatTransport,
  wrapChatTransport,
  type ChatTransport,
} from './internal/chat-transport.js';
import { guardedFetch } from './internal/fetch.js';
import { bindNativeAgent } from './internal/native-agent.js';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import { ownReadable } from './internal/readable.js';
import type { BoundTools, EffectTools, ToolServices } from './internal/tool.js';

export type { ChatInit } from './frameworks/chat.js';
export type { CompletionOptions as UseCompletionOptions } from './frameworks/options.js';
export {
  createAgentUIStream,
  createAgentUIStreamResponse,
  pipeAgentUIStreamToResponse,
  type AgentUIMessageStreamOptions,
} from './internal/chat-agent.js';
export {
  createSteering as experimental_createSteering,
  type Steering as Experimental_Steering,
} from './internal/steering.js';
export {
  consumeStream,
  createAsyncIterableStream,
  createTextStreamResponse,
  createUIMessageStream,
  createUIMessageStreamResponse,
  pipeTextStreamToResponse,
  pipeUIMessageStreamToResponse,
  readUIMessageStream,
  toTextStream,
  toUIMessageChunk,
  toUIMessageStream,
  type UIMessageStreamOptions,
  type UIMessageStreamOnEndCallback,
  type UIMessageStreamOnFinishCallback,
  type UIMessageStreamOnStepEndCallback,
  type UIMessageStreamOnStepFinishCallback,
  type UIMessageStreamWriter,
  type UIMessageStreamWriterWithOutcome,
  type ToUIMessageChunkOptions,
} from './internal/chat-ui-stream.js';
export {
  convertToModelMessages,
  safeValidateUIMessages,
  validateUIMessages,
  type SafeValidateUIMessagesResult,
  type UIDataPartSchemas,
  type ValidateUIMessagesOptions,
} from './internal/chat-validation.js';

export type ChatAddToolApproveResponseFunction =
  HostChat<UIMessage>['addToolApprovalResponse'];
export type ChatAddToolOutputFunction<Message extends UIMessage = UIMessage> =
  HostChat<Message>['addToolOutput'];
export type ChatOnErrorCallback = NonNullable<ChatInit<UIMessage>['onError']>;
export type ChatOnDataCallback<Message extends UIMessage = UIMessage> =
  NonNullable<ChatInit<Message>['onData']>;
export type ChatOnFinishCallback<Message extends UIMessage = UIMessage> =
  NonNullable<ChatInit<Message>['onFinish']>;
export type ChatOnToolCallCallback<Message extends UIMessage = UIMessage> =
  NonNullable<ChatInit<Message>['onToolCall']>;

/** The synchronous host state contract for an abstract chat. */
export interface ChatState<Message extends UIMessage> {
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  error: AiSdkError | undefined;
  messages: Message[];
  experimental_queuedMessages?: Message[];
  pushMessage(message: Message): void;
  popMessage(): void;
  replaceMessage(index: number, message: Message): void;
  snapshot<A>(value: A): A;
}

const nativeState = <Message extends UIMessage>(
  state: ChatState<Message>,
): NativeChatState<Message> => ({
  get status() {
    return state.status;
  },
  set status(value) {
    state.status = value;
  },
  get error() {
    return state.error;
  },
  set error(error) {
    state.error = error && sdkError('AbstractChat', error);
  },
  get messages() {
    return state.messages;
  },
  set messages(value) {
    state.messages = value;
  },
  get experimental_queuedMessages() {
    return state.experimental_queuedMessages ?? [];
  },
  set experimental_queuedMessages(value) {
    state.experimental_queuedMessages = value;
  },
  pushMessage: (message) => state.pushMessage(message),
  popMessage: () => state.popMessage(),
  replaceMessage: (index, message) => state.replaceMessage(index, message),
  snapshot: (value) => state.snapshot(value),
});

class NativeStateChat<
  Message extends UIMessage,
> extends NativeAbstractChat<Message> {}

class StateChat<Message extends UIMessage> extends HostChat<Message> {
  constructor({
    state,
    ...config
  }: ChatInit<Message> & { state: ChatState<Message> }) {
    const lifetime = new ViewLifetime();
    super(
      new NativeStateChat({
        ...nativeChatOptions(config, lifetime),
        state: nativeState(state),
      }),
      lifetime,
    );
  }
}

export type AbstractChat<Message extends UIMessage = UIMessage> =
  HostChat<Message>;

/** Extend the SDK chat with host state and release it with the Effect scope. */
export const AbstractChat = <Message extends UIMessage = UIMessage>(
  config: ChatInit<Message> & { readonly state: ChatState<Message> },
) =>
  Effect.acquireRelease(
    runSync(
      'AbstractChat',
      () => new StateChat<Message>(config) as AbstractChat<Message>,
    ),
    (chat) => Effect.ignore(chat.dispose()),
  );

type Resolvable<A, R> = CallbackResult<A, R> | (() => CallbackResult<A, R>);

const resolve =
  <A, R>(
    owner: Owner<R>,
    name: string,
    value: Resolvable<A, R>,
    signal?: AbortSignal,
  ) =>
  () =>
    owner.runCallback(
      invoke(name, () =>
        typeof value === 'function'
          ? (value as () => CallbackResult<A, R>)()
          : value,
      ),
      signal,
    );

type HttpRequest = {
  id: string;
  requestMetadata: unknown;
  body: Record<string, unknown> | undefined;
  credentials: RequestCredentials | undefined;
  headers: HeadersInit | undefined;
  api: string;
};

type HttpSend<Message> = HttpRequest & {
  messages: Message[];
  trigger: 'submit-message' | 'regenerate-message';
  messageId: string | undefined;
};

type HttpReconfiguration = {
  readonly api?: string;
  readonly headers?: HeadersInit;
  readonly credentials?: RequestCredentials;
};

export type PrepareSendMessagesRequest<
  Message extends UIMessage = UIMessage,
  R = never,
> = (
  options: HttpSend<Message>,
) => CallbackResult<HttpReconfiguration & { readonly body: object }, R>;

export type PrepareReconnectToStreamRequest<R = never> = (
  options: HttpRequest,
) => CallbackResult<HttpReconfiguration, R>;

export type HttpChatTransportInitOptions<
  Message extends UIMessage,
  R = never,
> = {
  readonly api?: string;
  readonly credentials?: Resolvable<RequestCredentials, R>;
  readonly headers?: Resolvable<Record<string, string> | Headers, R>;
  readonly body?: Resolvable<object, R>;
  readonly fetch?: typeof globalThis.fetch;
  readonly prepareSendMessagesRequest?: PrepareSendMessagesRequest<Message, R>;
  readonly prepareReconnectToStreamRequest?: PrepareReconnectToStreamRequest<R>;
};

const bindHttp = <Message extends UIMessage, R>(
  owner: Owner<R>,
  options: HttpChatTransportInitOptions<Message, R>,
  signal?: AbortSignal,
) => {
  const {
    credentials,
    body,
    headers,
    fetch,
    prepareSendMessagesRequest,
    prepareReconnectToStreamRequest,
    ...data
  } = options;
  return {
    ...data,
    fetch: guardedFetch(owner.signal, fetch),
    ...(credentials === undefined
      ? {}
      : {
          credentials: resolve(
            owner,
            'HttpChatTransport.credentials',
            credentials,
            signal,
          ),
        }),
    ...(headers === undefined
      ? {}
      : {
          headers: resolve(owner, 'HttpChatTransport.headers', headers, signal),
        }),
    ...(body === undefined
      ? {}
      : { body: resolve(owner, 'HttpChatTransport.body', body, signal) }),
    ...(prepareSendMessagesRequest
      ? {
          prepareSendMessagesRequest: (request: HttpSend<Message>) =>
            owner.runCallback(
              invoke('HttpChatTransport.prepareSendMessagesRequest', () =>
                prepareSendMessagesRequest(request),
              ),
              signal,
            ),
        }
      : {}),
    ...(prepareReconnectToStreamRequest
      ? {
          prepareReconnectToStreamRequest: (request: HttpRequest) =>
            owner.runCallback(
              invoke('HttpChatTransport.prepareReconnectToStreamRequest', () =>
                prepareReconnectToStreamRequest(request),
              ),
              signal,
            ),
        }
      : {}),
  };
};

const httpTransport = <Message extends UIMessage, R>(
  settings: HttpChatTransportInitOptions<Message, R>,
  make: (
    options: ReturnType<typeof bindHttp<Message, R>>,
    signal: AbortSignal,
  ) => NativeTransport<Message>,
  resumeStreamIsReplay?: boolean,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    return wrapChatTransport<Message>({
      ...(resumeStreamIsReplay === undefined ? {} : { resumeStreamIsReplay }),
      sendMessages: (options) => {
        const signal = options.abortSignal ?? owner.signal;
        return make(bindHttp(owner, settings, signal), signal).sendMessages(
          options,
        );
      },
      reconnectToStream: (options) => {
        const signal = options.abortSignal ?? owner.signal;
        return make(
          bindHttp(owner, settings, signal),
          signal,
        ).reconnectToStream(options);
      },
    });
  });

export type DefaultChatTransport<Message extends UIMessage = UIMessage> =
  ChatTransport<Message>;
export type TextStreamChatTransport<Message extends UIMessage = UIMessage> =
  ChatTransport<Message>;
export type HttpChatTransport<Message extends UIMessage = UIMessage> =
  ChatTransport<Message>;
export type DirectChatTransport<Message extends UIMessage = UIMessage> =
  ChatTransport<Message>;
export type WebSocketChatTransport<Message extends UIMessage = UIMessage> =
  ChatTransport<Message>;

export const DefaultChatTransport = <
  Message extends UIMessage = UIMessage,
  R = never,
>({
  resumeStreamIsReplay = true,
  ...settings
}: HttpChatTransportInitOptions<Message, R> & {
  readonly resumeStreamIsReplay?: boolean;
} = {}) =>
  httpTransport(
    settings,
    (options) => new NativeDefaultChatTransport<Message>(options),
    resumeStreamIsReplay,
  );

export const TextStreamChatTransport = <
  Message extends UIMessage = UIMessage,
  R = never,
>(
  settings: HttpChatTransportInitOptions<Message, R> = {},
) =>
  httpTransport(
    settings,
    (options) => new NativeTextStreamChatTransport<Message>(options),
  );

/** Extend the HTTP protocol with an Effect Stream decoder. */
export const HttpChatTransport = <
  Message extends UIMessage = UIMessage,
  R = never,
>({
  processResponseStream,
  ...settings
}: HttpChatTransportInitOptions<Message, R> & {
  readonly processResponseStream: (
    source: Stream.Stream<Uint8Array, AiSdkError>,
  ) => Stream.Stream<UIMessageChunk, AiSdkError, R>;
}) =>
  Effect.gen(function* () {
    const context = yield* Effect.context<R>();
    return yield* httpTransport(settings, (options, signal) => {
      const operation = 'HttpChatTransport.processResponseStream';
      class Native extends NativeHttpChatTransport<Message> {
        protected processResponseStream(source: ReadableStream<Uint8Array>) {
          const decoded = Stream.unwrap(
            ownReadable(operation, source).pipe(
              Effect.map((readable) =>
                processResponseStream(foreignStream(operation, readable)),
              ),
            ),
          );
          return Stream.toReadableStreamWith(decoded, context, { signal });
        }
      }
      return new Native(options);
    });
  });

type SocketSettings = {
  id: string;
  requestMetadata: unknown;
  body: object;
  headers: Record<string, string>;
};

type SocketSend<Message> = SocketSettings & {
  messages: Message[];
  trigger: 'submit-message' | 'regenerate-message';
  messageId: string | undefined;
};

type WebSocketHost = {
  readyState: number;
  readonly bufferedAmount?: number;
  send(data: string | Uint8Array | ArrayBuffer): void;
  close(code?: number, reason?: string): void;
  onopen: ((event: unknown) => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onclose: ((event: unknown) => void) | null;
};

type WebSocketConstructor = new (
  url: string | URL,
  protocols?: string | string[],
  options?: { headers?: Record<string, string | undefined> },
) => WebSocketHost;

export type PrepareWebSocketChatTransportSendMessagesRequest<
  Message extends UIMessage = UIMessage,
  R = never,
> = (
  request: SocketSend<Message>,
) => CallbackResult<
  { messages?: Message[]; body?: object; headers?: HeadersInit },
  R
>;

export type PrepareWebSocketChatTransportReconnectToStreamRequest<R = never> = (
  request: SocketSettings,
) => CallbackResult<{ body?: object; headers?: HeadersInit }, R>;

export type WebSocketChatTransportInitOptions<
  Message extends UIMessage,
  R = never,
> = {
  readonly url: string;
  readonly protocols?: string | string[];
  readonly params?: Resolvable<Record<string, string>, R>;
  readonly body?: Resolvable<object, R>;
  readonly headers?: Resolvable<Record<string, string> | Headers, R>;
  readonly webSocket?: WebSocketConstructor;
  readonly prepareSendMessagesRequest?: PrepareWebSocketChatTransportSendMessagesRequest<
    Message,
    R
  >;
  readonly prepareReconnectToStreamRequest?: PrepareWebSocketChatTransportReconnectToStreamRequest<R>;
};

export type SafeValidateWebSocketChatTransportRequestResult<
  Message extends UIMessage = UIMessage,
> =
  | {
      readonly success: true;
      readonly data: WebSocketChatTransportRequest<Message>;
    }
  | { readonly success: false; readonly error: AiSdkError };

export const safeValidateWebSocketChatTransportRequest = <
  Message extends UIMessage = UIMessage,
>({
  value,
}: {
  readonly value: unknown;
}) => {
  const operation = 'safeValidateWebSocketChatTransportRequest';
  return runRequest(operation, {}, () =>
    nativeValidateSocketRequest<Message>({ value }),
  ).pipe(
    Effect.map(
      (result): SafeValidateWebSocketChatTransportRequestResult<Message> =>
        result.success
          ? result
          : { success: false, error: sdkError(operation, result.error) },
    ),
  );
};

export const WebSocketChatTransport = <
  Message extends UIMessage = UIMessage,
  R = never,
>({
  params,
  body,
  headers,
  prepareSendMessagesRequest,
  prepareReconnectToStreamRequest,
  ...settings
}: WebSocketChatTransportInitOptions<Message, R>) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const native = yield* Effect.acquireRelease(
      runSync(
        'WebSocketChatTransport',
        () =>
          new NativeWebSocketChatTransport<Message>({
            ...settings,
            ...(params === undefined
              ? {}
              : {
                  params: resolve(
                    owner,
                    'WebSocketChatTransport.params',
                    params,
                  ),
                }),
            ...(headers === undefined
              ? {}
              : {
                  headers: resolve(
                    owner,
                    'WebSocketChatTransport.headers',
                    headers,
                  ),
                }),
            ...(body === undefined
              ? {}
              : { body: resolve(owner, 'WebSocketChatTransport.body', body) }),
            ...(prepareSendMessagesRequest
              ? {
                  prepareSendMessagesRequest: (request: SocketSend<Message>) =>
                    owner.runCallback(
                      invoke(
                        'WebSocketChatTransport.prepareSendMessagesRequest',
                        () => prepareSendMessagesRequest(request),
                      ),
                    ),
                }
              : {}),
            ...(prepareReconnectToStreamRequest
              ? {
                  prepareReconnectToStreamRequest: (request: SocketSettings) =>
                    owner.runCallback(
                      invoke(
                        'WebSocketChatTransport.prepareReconnectToStreamRequest',
                        () => prepareReconnectToStreamRequest(request),
                      ),
                    ),
                }
              : {}),
          }),
      ),
      (native) =>
        Effect.ignore(
          runSync('WebSocketChatTransport.close', () => native.close()),
        ),
    );
    return wrapChatTransport(native);
  });

type Runtime = Record<string, unknown>;
type DirectMessage<Tools extends EffectTools> = UIMessage<
  unknown,
  never,
  InferUITools<BoundTools<Tools>>
>;

export type DirectChatTransportOptions<
  C,
  T extends EffectTools,
  R extends Runtime,
  A,
  P,
  I,
  Message extends DirectMessage<T>,
  Callbacks = never,
> = Omit<UIMessageStreamOptions<Message, Callbacks>, 'onFinish'> & {
  readonly agent: ToolLoopAgent<C, T, R, A, P, I>;
  readonly options?: C;
};

export const DirectChatTransport = <
  C = never,
  T extends EffectTools = {},
  R extends Runtime = Runtime,
  A = string,
  P = A,
  I = never,
  Message extends DirectMessage<T> = DirectMessage<T>,
  Callbacks = never,
>({
  agent,
  options: agentOptions,
  ...settings
}: DirectChatTransportOptions<C, T, R, A, P, I, Message, Callbacks>) =>
  Effect.gen(function* () {
    const context = yield* Effect.context<ToolServices<T> | Callbacks>();
    return makeChatTransport<Message>({
      sendMessages: (options) =>
        Effect.succeed(
          Stream.unwrap(
            Effect.gen(function* () {
              const operation = 'DirectChatTransport.sendMessages';
              const owner = yield* openOperation<ToolServices<T> | Callbacks>(
                options.abortSignal,
              );
              const nativeAgent = yield* runSync(operation, () =>
                bindNativeAgent<
                  Agent<C, BoundTools<T>, R, OutputInterface<A, P, I>>,
                  ToolServices<T>
                >(agent, owner),
              );
              if (!nativeAgent) {
                return yield* Effect.fail(
                  sdkError(operation, 'Unknown agent handle'),
                );
              }
              const response = yield* runRequest(
                operation,
                { abortSignal: owner.signal },
                (abortSignal) =>
                  new NativeDirectChatTransport<
                    C,
                    BoundTools<T>,
                    R,
                    OutputInterface<A, P, I>,
                    Message
                  >({
                    ...bindUiOptions(operation, owner, settings),
                    agent: nativeAgent,
                    ...(agentOptions === undefined
                      ? {}
                      : { options: agentOptions }),
                  }).sendMessages({ ...options, abortSignal }),
              );
              const readable = yield* ownReadable(operation, response);
              return foreignStream(operation, readable).pipe(
                Stream.onEnd(owner.markComplete),
              );
            }).pipe(Effect.provideContext(context)),
          ),
        ),
      reconnectToStream: () => Effect.succeed(Option.none()),
    });
  });
