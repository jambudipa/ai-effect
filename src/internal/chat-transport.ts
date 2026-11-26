import type {
  ChatTransport as SdkChatTransport,
  UIMessage,
  UIMessageChunk,
} from 'ai';
import { Effect, Option, Stream } from 'effect';
import type { Scope } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './operation.js';
import { ownReadable } from './readable.js';

/** Preserve the native send fields for the chat's declared UI message type. */
export type ChatSendOptions<Message extends UIMessage> = Parameters<
  SdkChatTransport<Message>['sendMessages']
>[0];

/** Use the same identifiers and request data as native SDK reconnects. */
export type ChatReconnectOptions = Parameters<
  SdkChatTransport<UIMessage>['reconnectToStream']
>[0];

/** Expose chat send, replay, and closing operations under Effect. */
export interface ChatTransport<Message extends UIMessage = UIMessage> {
  /** Specify whether reconnect output must be replayed from the beginning of the response. */
  readonly resumeStreamIsReplay?: boolean;
  /** Send SDK message history and retain the response reader in the caller's scope. */
  readonly sendMessages: (
    options: ChatSendOptions<Message>,
  ) => Effect.Effect<
    Stream.Stream<UIMessageChunk, AiSdkError>,
    AiSdkError,
    Scope.Scope
  >;
  /** Return a scoped replay or resumed stream when the transport can reconnect. */
  readonly reconnectToStream: (
    options: ChatReconnectOptions,
  ) => Effect.Effect<
    Option.Option<Stream.Stream<UIMessageChunk, AiSdkError>>,
    AiSdkError,
    Scope.Scope
  >;
  /** Close native transport resources through the Effect error channel. */
  readonly close: () => Effect.Effect<void, AiSdkError>;
}

/** Retain the native transport associated with each public handle. */
const nativeTransports = new WeakMap<object, unknown>();

/** Resolve the cached native transport for a handle registered by this module. */
export const unwrapChatTransport = <Message extends UIMessage>(
  transport: ChatTransport<Message>,
): SdkChatTransport<Message> | undefined =>
  nativeTransports.get(transport) as SdkChatTransport<Message> | undefined;

/** Own and release a response reader in the scope that consumes its UI chunks. */
const ownResponse = (
  operation: string,
  readable: ReadableStream<UIMessageChunk>,
) =>
  ownReadable(operation, readable).pipe(
    Effect.map((source) =>
      Stream.fromReadableStream({
        evaluate: () => source,
        onError: (cause) => sdkError(operation, cause),
        releaseLockOnEnd: true,
      }),
    ),
  );

/** Adapt native send and reconnect operations with scoped response consumption. */
export const wrapChatTransport = <Message extends UIMessage>(
  native: SdkChatTransport<Message>,
): ChatTransport<Message> => {
  const transport: ChatTransport<Message> = {
    ...(native.resumeStreamIsReplay === undefined
      ? {}
      : {
          resumeStreamIsReplay: native.resumeStreamIsReplay,
        }),
    sendMessages: Effect.fnUntraced(function* (
      options: ChatSendOptions<Message>,
    ) {
      const operation = 'ChatTransport.sendMessages';
      const owner = yield* openOperation(options.abortSignal);
      const source = yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) => native.sendMessages({ ...options, abortSignal }),
      );
      const stream = yield* ownResponse(operation, source);
      return stream.pipe(Stream.onEnd(owner.markComplete));
    }),
    reconnectToStream: Effect.fnUntraced(function* (
      options: ChatReconnectOptions,
    ) {
      const operation = 'ChatTransport.reconnectToStream';
      const owner = yield* openOperation(options.abortSignal);
      const source = yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) => native.reconnectToStream({ ...options, abortSignal }),
      );
      return yield* Option.match(Option.fromNullishOr(source), {
        onNone: () => owner.markComplete.pipe(Effect.as(Option.none())),
        onSome: (readable) =>
          ownResponse(operation, readable).pipe(
            Effect.map((stream) =>
              Option.some(stream.pipe(Stream.onEnd(owner.markComplete))),
            ),
          ),
      });
    }),
    close: () => runSync('ChatTransport.close', () => native.close?.()),
  };
  nativeTransports.set(transport, native);
  return transport;
};

/** Carry SDK UI chunks and SDK failure as separate stream values and errors. */
type ResponseChunks = Stream.Stream<UIMessageChunk, AiSdkError>;

/** Implement send and reconnect as Effect operations that can serve an SDK transport. */
export interface ChatTransportHandlers<Message extends UIMessage> {
  /** Preserve reconnect replay semantics when wrapping custom transport handlers. */
  readonly resumeStreamIsReplay?: boolean;
  /** Produce a UI chunk stream for the outgoing typed history request. */
  readonly sendMessages: (
    options: ChatSendOptions<Message>,
  ) => Effect.Effect<ResponseChunks, AiSdkError>;
  /** Return `None` when no active response exists for the request. */
  readonly reconnectToStream: (
    options: ChatReconnectOptions,
  ) => Effect.Effect<Option.Option<ResponseChunks>, AiSdkError>;
}

/** Convert an Effect chunk stream to a native readable and observe caller cancellation. */
function asReadable(chunks: ResponseChunks, signal?: AbortSignal) {
  if (!signal) return Stream.toReadableStream(chunks);

  const aborted = Effect.callback<void>((resume) => {
    const stop = () => resume(Effect.void);
    signal.addEventListener('abort', stop, { once: true });
    if (signal.aborted) stop();
    return Effect.sync(() => signal.removeEventListener('abort', stop));
  });
  return Stream.toReadableStream(chunks.pipe(Stream.interruptWhen(aborted)));
}

/** Supply Effect commands for a custom transport used in a framework host. */
export const makeChatTransport = <Message extends UIMessage = UIMessage>(
  handlers: ChatTransportHandlers<Message>,
): ChatTransport<Message> =>
  wrapChatTransport<Message>({
    ...('resumeStreamIsReplay' in handlers
      ? { resumeStreamIsReplay: handlers.resumeStreamIsReplay }
      : {}),
    sendMessages: (options) =>
      Effect.runPromise(
        Effect.suspend(() => handlers.sendMessages(options)).pipe(
          Effect.map((chunks) => asReadable(chunks, options.abortSignal)),
        ),
        options.abortSignal ? { signal: options.abortSignal } : {},
      ),
    reconnectToStream: (options) =>
      Effect.runPromise(
        Effect.suspend(() => handlers.reconnectToStream(options)).pipe(
          Effect.map(
            Option.map((chunks) => asReadable(chunks, options.abortSignal)),
          ),
          Effect.map(Option.getOrNull),
        ),
        options.abortSignal ? { signal: options.abortSignal } : {},
      ),
  });
