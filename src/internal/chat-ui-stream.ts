import {
  createTextStreamResponse as nativeCreateTextStreamResponse,
  createUIMessageStream as nativeCreateUIMessageStream,
  createUIMessageStreamResponse as nativeCreateUIMessageStreamResponse,
  pipeTextStreamToResponse as nativePipeTextStreamToResponse,
  pipeUIMessageStreamToResponse as nativePipeUIMessageStreamToResponse,
  readUIMessageStream as nativeReadUIMessageStream,
  toUIMessageChunk as nativeToUIMessageChunk,
  toUIMessageStream as nativeToUIMessageStream,
  type InferUIMessageChunk,
  type TextStreamPart,
  type ToolSet,
  type UIMessageStreamOnEndCallback as NativeEndCallback,
  type UIMessageStreamOnStepEndCallback as NativeStepEndCallback,
  type UIMessageStreamOutcome,
  type UIMessage,
  type UIMessageChunk,
} from 'ai';
import { Effect, Option, Stream } from 'effect';
import type { ServerResponse } from 'node:http';
import {
  foreignStream,
  invoke,
  type CallbackResult,
  type Owner,
} from './chat-boundary.js';
import {
  abortable,
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './operation.js';
import { ownReadable } from './readable.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from './tool.js';

type StreamInput<A, R> = Stream.Stream<A, unknown, R> | ReadableStream<A>;
const webStream = <A, R>(stream: StreamInput<A, R>, signal?: AbortSignal) => {
  if (Stream.isStream(stream)) {
    return Effect.context<R>().pipe(
      Effect.map((context) =>
        Stream.toReadableStreamWith(
          stream as Stream.Stream<A, unknown, R>,
          context,
          { signal },
        ),
      ),
    );
  }
  return signal
    ? runSync('ReadableStream', () =>
        stream.pipeThrough(new TransformStream<A, A>(), { signal }),
      )
    : Effect.succeed(stream);
};

export const scopedStream = <A>(operation: string, source: ReadableStream<A>) =>
  ownReadable(operation, source).pipe(
    Effect.map((owned) => foreignStream(operation, owned)),
  );

type StepEvent<Message extends UIMessage> = Parameters<
  NativeStepEndCallback<Message>
>[0];
type NativeEndEvent<Message extends UIMessage> = Parameters<
  NativeEndCallback<Message>
>[0];
type EndEvent<Message extends UIMessage> = Omit<
  NativeEndEvent<Message>,
  'outcome'
> & {
  readonly outcome:
    | Exclude<UIMessageStreamOutcome, { status: 'failed' }>
    | {
        readonly status: 'failed';
        readonly error?: AiSdkError;
      };
};
type MessageMetadata<Message extends UIMessage> =
  Message extends UIMessage<infer Metadata> ? Metadata : unknown;

export type UiLifecycle<Message extends UIMessage, R> = {
  readonly originalMessages?: Message[];
  readonly onStepEnd?: UIMessageStreamOnStepEndCallback<Message, R>;
  readonly onStepFinish?: UIMessageStreamOnStepFinishCallback<Message, R>;
  readonly onEnd?: UIMessageStreamOnEndCallback<Message, R>;
  readonly onFinish?: UIMessageStreamOnFinishCallback<Message, R>;
  readonly onError?: (cause: AiSdkError) => string;
};

export type UIMessageStreamOnStepEndCallback<
  Message extends UIMessage = UIMessage,
  R = never,
> = (event: StepEvent<Message>) => CallbackResult<void, R>;

/** @deprecated Use UIMessageStreamOnStepEndCallback. */
export type UIMessageStreamOnStepFinishCallback<
  Message extends UIMessage = UIMessage,
  R = never,
> = UIMessageStreamOnStepEndCallback<Message, R>;

export type UIMessageStreamOnEndCallback<
  Message extends UIMessage = UIMessage,
  R = never,
> = (event: EndEvent<Message>) => CallbackResult<void, R>;

/** @deprecated Use UIMessageStreamOnEndCallback. */
export type UIMessageStreamOnFinishCallback<
  Message extends UIMessage = UIMessage,
  R = never,
> = UIMessageStreamOnEndCallback<Message, R>;

export type UIMessageStreamOptions<
  Message extends UIMessage = UIMessage,
  R = never,
> = UiLifecycle<Message, R> & {
  readonly generateMessageId?: () => string;
  readonly messageMetadata?: (options: {
    part: TextStreamPart<ToolSet>;
  }) => MessageMetadata<Message> | undefined;
  readonly sendReasoning?: boolean;
  readonly sendSources?: boolean;
  readonly sendStart?: boolean;
  readonly sendFinish?: boolean;
  readonly redactToolErrors?: boolean;
};

export const bindLifecycle = <Message extends UIMessage, R>(
  operation: string,
  owner: Owner<R>,
  {
    originalMessages,
    onStepEnd,
    onStepFinish,
    onEnd,
    onFinish,
    onError,
  }: UiLifecycle<Message, R>,
) => {
  const bind =
    <A>(name: string, handler: (event: A) => CallbackResult<void, R>) =>
    (event: A) =>
      owner.runCallback(invoke(`${operation}.${name}`, () => handler(event)));
  const bindEnd =
    (
      name: string,
      handler: (event: EndEvent<Message>) => CallbackResult<void, R>,
    ) =>
    (event: NativeEndEvent<Message>) => {
      const outcome = event.outcome;
      const publicOutcome =
        outcome.status === 'failed'
          ? {
              status: 'failed' as const,
              ...('error' in outcome
                ? { error: sdkError(operation, outcome.error) }
                : {}),
            }
          : outcome;
      return bind(name, handler)({ ...event, outcome: publicOutcome });
    };
  return {
    ...(originalMessages ? { originalMessages } : {}),
    ...(onStepEnd ? { onStepEnd: bind('onStepEnd', onStepEnd) } : {}),
    ...(onStepFinish
      ? { onStepFinish: bind('onStepFinish', onStepFinish) }
      : {}),
    ...(onEnd ? { onEnd: bindEnd('onEnd', onEnd) } : {}),
    ...(onFinish ? { onFinish: bindEnd('onFinish', onFinish) } : {}),
    ...(onError
      ? { onError: (cause: unknown) => onError(sdkError(operation, cause)) }
      : {}),
  };
};

export const bindUiOptions = <Message extends UIMessage, R>(
  operation: string,
  owner: Owner<R>,
  {
    originalMessages,
    onStepEnd,
    onStepFinish,
    onEnd,
    onFinish,
    onError,
    ...options
  }: UIMessageStreamOptions<Message, R>,
) => ({
  ...options,
  ...bindLifecycle(operation, owner, {
    ...(originalMessages ? { originalMessages } : {}),
    ...(onStepEnd ? { onStepEnd } : {}),
    ...(onStepFinish ? { onStepFinish } : {}),
    ...(onEnd ? { onEnd } : {}),
    ...(onFinish ? { onFinish } : {}),
    ...(onError ? { onError } : {}),
  }),
});

export type ToUIMessageChunkOptions<
  T extends EffectTools = {},
  Message extends UIMessage = UIMessage,
> = Pick<
  UIMessageStreamOptions<Message, never>,
  | 'sendReasoning'
  | 'sendSources'
  | 'sendStart'
  | 'sendFinish'
  | 'redactToolErrors'
  | 'onError'
> & {
  readonly tools?: T;
  readonly messageMetadata?: MessageMetadata<Message>;
  readonly responseMessageId?: string;
};

/** Convert one model event. Return None for events without a UI representation. */
export const toUIMessageChunk = <
  T extends EffectTools = {},
  Message extends UIMessage = UIMessage,
>(
  part: TextStreamPart<BoundTools<T>>,
  { tools, onError, ...options }: ToUIMessageChunkOptions<T, Message> = {},
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'toUIMessageChunk';
      const owner = yield* openOperation<ToolServices<T>>();
      return yield* runSync(operation, () =>
        Option.fromUndefinedOr(
          nativeToUIMessageChunk<BoundTools<T>, Message>(part, {
            ...options,
            ...(tools ? { tools: bindTools(tools, owner) } : {}),
            ...(onError
              ? {
                  onError: (cause: unknown) =>
                    onError(sdkError(operation, cause)),
                }
              : {}),
          }),
        ),
      );
    }),
  );

/** Convert model stream events into UI chunks with scoped callbacks. */
export const toUIMessageStream = <
  T extends EffectTools = {},
  Message extends UIMessage = UIMessage,
  StreamServices = never,
  CallbackServices = never,
>({
  stream,
  tools,
  ...options
}: UIMessageStreamOptions<Message, CallbackServices> & {
  readonly stream: StreamInput<TextStreamPart<BoundTools<T>>, StreamServices>;
  readonly tools?: T;
}) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const operation = 'toUIMessageStream';
      const owner = yield* openOperation<CallbackServices | ToolServices<T>>();
      const readable = yield* webStream(stream, owner.signal);
      const source = yield* runSync(operation, () =>
        nativeToUIMessageStream<BoundTools<T>, Message>({
          ...bindUiOptions(operation, owner, options),
          stream: readable,
          ...(tools ? { tools: bindTools(tools, owner) } : {}),
        }),
      );
      return yield* scopedStream(operation, source);
    }),
  );

export interface UIMessageStreamWriter<Message extends UIMessage = UIMessage> {
  readonly write: (
    part: InferUIMessageChunk<Message>,
  ) => Effect.Effect<void, AiSdkError>;
  readonly merge: <R>(
    stream: StreamInput<InferUIMessageChunk<Message>, R>,
  ) => Effect.Effect<void, AiSdkError, R>;
  readonly onError?: (cause: unknown) => Effect.Effect<void, AiSdkError>;
}

export interface UIMessageStreamWriterWithOutcome<
  Message extends UIMessage = UIMessage,
> extends UIMessageStreamWriter<Message> {
  readonly setOutcome: (
    outcome: UIMessageStreamOutcome,
  ) => Effect.Effect<void, AiSdkError>;
}

type CreateUiStreamOptions<Message extends UIMessage, R> = UiLifecycle<
  Message,
  R
> & {
  readonly execute: (options: {
    writer: UIMessageStreamWriterWithOutcome<Message>;
  }) => Effect.Effect<void, unknown, R>;
  readonly generateId?: () => string;
};

/** Create a UI stream whose writer and callbacks share its Effect scope. */
export const createUIMessageStream = <
  Message extends UIMessage = UIMessage,
  R = never,
>({
  execute,
  generateId,
  ...options
}: CreateUiStreamOptions<Message, R>) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const operation = 'createUIMessageStream';
      const owner = yield* openOperation<R>();
      const readable = yield* runSync(operation, () =>
        nativeCreateUIMessageStream<Message>({
          ...bindLifecycle(operation, owner, options),
          ...(generateId ? { generateId } : {}),
          execute: ({ writer }) =>
            owner.runCallback(
              Effect.suspend(() =>
                execute({
                  writer: {
                    write: (chunk) =>
                      runSync(`${operation}.write`, () => writer.write(chunk)),
                    merge: (stream) =>
                      webStream(stream, owner.signal).pipe(
                        Effect.flatMap((source) =>
                          runSync(`${operation}.merge`, () =>
                            writer.merge(source),
                          ),
                        ),
                      ),
                    ...(writer.onError
                      ? {
                          onError: (cause: unknown) =>
                            runSync(`${operation}.onError`, () =>
                              writer.onError!(sdkError(operation, cause)),
                            ),
                        }
                      : {}),
                    setOutcome: (outcome) =>
                      runSync(`${operation}.setOutcome`, () =>
                        writer.setOutcome(outcome),
                      ),
                  },
                }),
              ),
            ),
        }),
      );
      return yield* scopedStream(operation, readable);
    }),
  );

/** Reconstruct UI messages from a Web or Effect message stream. */
export const readUIMessageStream = <
  Message extends UIMessage = UIMessage,
  R = never,
  CallbackServices = never,
>({
  stream,
  onError,
  ...options
}: {
  readonly message?: Message;
  readonly stream: StreamInput<UIMessageChunk, R>;
  readonly onError?: (
    cause: AiSdkError,
  ) => CallbackResult<void, CallbackServices>;
  readonly terminateOnError?: boolean;
}) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const operation = 'readUIMessageStream';
      const owner = yield* openOperation<CallbackServices>();
      const input = yield* webStream(stream, owner.signal);
      const readable = yield* runSync(operation, () =>
        nativeReadUIMessageStream<Message>({
          ...options,
          stream: input,
          ...(onError
            ? {
                onError: (cause: unknown) => {
                  void owner
                    .runCallback(
                      invoke(`${operation}.onError`, () =>
                        onError(sdkError(operation, cause)),
                      ),
                    )
                    .catch(() => {});
                },
              }
            : {}),
        }),
      );
      return yield* scopedStream(operation, readable);
    }),
  );

/** Read a host ReadableStream as a scoped Effect Stream. */
export const createAsyncIterableStream = <A>(source: ReadableStream<A>) =>
  Stream.unwrap(scopedStream('createAsyncIterableStream', source));

/** Drain an Effect or host stream, with an optional scoped error handler. */
export const consumeStream = <A, R, CallbackServices = never>({
  stream,
  onError,
  abortSignal,
}: {
  readonly stream: StreamInput<A, R>;
  readonly onError?: (
    cause: AiSdkError,
  ) => CallbackResult<void, CallbackServices>;
  readonly abortSignal?: AbortSignal;
}) => {
  const operation = 'consumeStream';
  const source = Stream.isStream(stream)
    ? (stream as Stream.Stream<A, unknown, R>).pipe(
        Stream.mapError((cause) => sdkError(operation, cause)),
      )
    : Stream.unwrap(scopedStream(operation, stream));
  const read = Stream.runDrain(source);
  const consume = abortSignal ? abortable(operation, abortSignal, read) : read;
  return onError
    ? Effect.catch(consume, (cause) =>
        invoke(`${operation}.onError`, () => onError(cause)).pipe(
          Effect.mapError((cause) => sdkError(operation, cause)),
        ),
      )
    : consume;
};

type TextHostOptions<R> = ResponseInit & {
  readonly stream: StreamInput<string, R>;
};

export const createTextStreamResponse = <R>({
  stream,
  ...options
}: TextHostOptions<R>) =>
  webStream(stream).pipe(
    Effect.flatMap((readable) =>
      runSync('createTextStreamResponse', () =>
        nativeCreateTextStreamResponse({ ...options, stream: readable }),
      ),
    ),
  );

export const pipeTextStreamToResponse = <R>({
  stream,
  ...options
}: TextHostOptions<R> & { readonly response: ServerResponse }) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation();
      const readable = yield* webStream(stream, owner.signal);
      return yield* runRequest(
        'pipeTextStreamToResponse',
        { abortSignal: owner.signal },
        () => nativePipeTextStreamToResponse({ ...options, stream: readable }),
      );
    }),
  );

export type UiHostOptions<R, CallbackServices> = ResponseInit & {
  readonly stream: StreamInput<UIMessageChunk, R>;
  readonly keepAliveMs?: number;
  readonly consumeSseStream?: (options: {
    stream: Stream.Stream<string, AiSdkError>;
  }) => CallbackResult<void, CallbackServices>;
};

export const bindConsume =
  <R>(
    owner: Owner<R>,
    operation: string,
    consume: NonNullable<UiHostOptions<never, R>['consumeSseStream']>,
  ) =>
  ({ stream }: { stream: ReadableStream<string> }) =>
    owner
      .runCallback(
        Effect.scoped(
          scopedStream(operation, stream).pipe(
            Effect.flatMap((owned) =>
              invoke(`${operation}.consumeSseStream`, () =>
                consume({ stream: owned }),
              ),
            ),
            Effect.ignore,
          ),
        ),
      )
      .catch(() => {});

export function createUIMessageStreamResponse<R>(
  options: UiHostOptions<R, never> & { readonly consumeSseStream?: never },
): Effect.Effect<Response, AiSdkError, R>;
export function createUIMessageStreamResponse<R, CallbackServices>(
  options: UiHostOptions<R, CallbackServices>,
): Effect.Effect<
  Response,
  AiSdkError,
  R | CallbackServices | import('effect').Scope.Scope
>;
export function createUIMessageStreamResponse<R, CallbackServices>({
  stream,
  consumeSseStream,
  ...options
}: UiHostOptions<R, CallbackServices>) {
  const operation = 'createUIMessageStreamResponse';
  return Effect.gen(function* () {
    if (!consumeSseStream) {
      const readable = yield* webStream(stream);
      return yield* runSync(operation, () =>
        nativeCreateUIMessageStreamResponse({ ...options, stream: readable }),
      );
    }
    const owner = yield* openOperation<CallbackServices>();
    const readable = yield* webStream(stream, owner.signal);
    return yield* runSync(operation, () =>
      nativeCreateUIMessageStreamResponse({
        ...options,
        stream: readable,
        consumeSseStream: bindConsume(owner, operation, consumeSseStream),
      }),
    );
  });
}

export const pipeUIMessageStreamToResponse = <R, CallbackServices>({
  stream,
  consumeSseStream,
  ...options
}: UiHostOptions<R, CallbackServices> & {
  readonly response: ServerResponse;
}) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'pipeUIMessageStreamToResponse';
      const owner = yield* openOperation<CallbackServices>();
      const readable = yield* webStream(stream, owner.signal);
      return yield* runRequest(operation, { abortSignal: owner.signal }, () =>
        nativePipeUIMessageStreamToResponse({
          ...options,
          stream: readable,
          ...(consumeSseStream
            ? {
                consumeSseStream: bindConsume(
                  owner,
                  operation,
                  consumeSseStream,
                ),
              }
            : {}),
        }),
      );
    }),
  );

type TextEvent = { readonly type: string; readonly text?: string };

export const toTextStream = <E, R>({
  stream,
}: {
  readonly stream: Stream.Stream<TextEvent, E, R>;
}) =>
  stream.pipe(
    Stream.filter(
      (part): part is TextEvent & { text: string } =>
        part.type === 'text-delta' && typeof part.text === 'string',
    ),
    Stream.map((part) => part.text),
  );
