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

export type ChatSendOptions<Message extends UIMessage> = Parameters<
  SdkChatTransport<Message>['sendMessages']
>[0];

export type ChatReconnectOptions = Parameters<
  SdkChatTransport<UIMessage>['reconnectToStream']
>[0];

export interface ChatTransport<Message extends UIMessage = UIMessage> {
  readonly resumeStreamIsReplay?: boolean;
  readonly sendMessages: (
    options: ChatSendOptions<Message>,
  ) => Effect.Effect<
    Stream.Stream<UIMessageChunk, AiSdkError>,
    AiSdkError,
    Scope.Scope
  >;
  readonly reconnectToStream: (
    options: ChatReconnectOptions,
  ) => Effect.Effect<
    Option.Option<Stream.Stream<UIMessageChunk, AiSdkError>>,
    AiSdkError,
    Scope.Scope
  >;
  readonly close: () => Effect.Effect<void, AiSdkError>;
}

const nativeTransports = new WeakMap<object, unknown>();

export const unwrapChatTransport = <Message extends UIMessage>(
  transport: ChatTransport<Message>,
): SdkChatTransport<Message> | undefined =>
  nativeTransports.get(transport) as SdkChatTransport<Message> | undefined;

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
      return yield* ownResponse(operation, source);
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
        onNone: () => Effect.succeed(Option.none()),
        onSome: (readable) =>
          ownResponse(operation, readable).pipe(Effect.map(Option.some)),
      });
    }),
    close: () => runSync('ChatTransport.close', () => native.close?.()),
  };
  nativeTransports.set(transport, native);
  return transport;
};

type ResponseChunks = Stream.Stream<UIMessageChunk, AiSdkError>;

export interface ChatTransportHandlers<Message extends UIMessage> {
  readonly resumeStreamIsReplay?: boolean;
  readonly sendMessages: (
    options: ChatSendOptions<Message>,
  ) => Effect.Effect<ResponseChunks, AiSdkError>;
  readonly reconnectToStream: (
    options: ChatReconnectOptions,
  ) => Effect.Effect<Option.Option<ResponseChunks>, AiSdkError>;
}

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
