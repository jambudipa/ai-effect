import type {
  experimental_streamTextLowMemory,
  StreamTextResult,
  TextStreamPart,
  ToolSet,
  OutputInterface,
  UIMessage,
  InferUIMessageChunk,
} from 'ai';
import { Effect, Option, Stream, type Scope } from 'effect';
import type { ServerResponse } from 'node:http';
import { invoke, type CallbackResult } from './chat-boundary.js';
import {
  bindUiOptions,
  createTextStreamResponse,
  createUIMessageStreamResponse,
  pipeTextStreamToResponse,
  pipeUIMessageStreamToResponse,
  scopedStream,
  type UIMessageStreamOptions,
  type UiHostOptions,
} from './chat-ui-stream.js';
import { AiSdkStreamAborted } from './stream-aborted.js';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './operation.js';

type NativeResult<
  Tools extends ToolSet,
  Runtime extends Record<string, unknown>,
  Output extends OutputInterface,
> = StreamTextResult<Tools, Runtime, Output>;

type TextEvent<Tools extends ToolSet> = TextStreamPart<Tools> & {
  type: Exclude<TextStreamPart<ToolSet>['type'], 'error' | 'abort'>;
};

type StreamValue<Value> = Value extends ReadableStream<infer A> ? A : never;
type AsyncFieldKeys<Value> = {
  [K in keyof Value]: Exclude<Value[K], undefined> extends PromiseLike<unknown>
    ? K
    : never;
}[keyof Value] &
  keyof Value;

type Metadata<Value> = {
  [K in AsyncFieldKeys<Value>]-?: Effect.Effect<Resolved<Value[K]>, AiSdkError>;
};
type Resolved<Value> = Value extends PromiseLike<infer A> ? A : Value;

type ConsumerOptions<R> = {
  readonly onError?: (cause: AiSdkError) => CallbackResult<void, R>;
};

type UiResponseOptions<Message extends UIMessage, R> = UIMessageStreamOptions<
  Message,
  R
> &
  Omit<UiHostOptions<never, R>, 'stream'>;

interface UiResponse {
  <Message extends UIMessage = UIMessage, R = never>(
    options?: UiResponseOptions<Message, R> & {
      readonly consumeSseStream?: never;
    },
  ): Effect.Effect<Response, AiSdkError, R>;
  <Message extends UIMessage = UIMessage, R = never>(
    options: UiResponseOptions<Message, R>,
  ): Effect.Effect<Response, AiSdkError, R | Scope.Scope>;
}

export type TextStreamResult<
  Tools extends ToolSet,
  Runtime extends Record<string, unknown>,
  Output extends OutputInterface,
  Native extends NativeResult<Tools, Runtime, Output> = NativeResult<
    Tools,
    Runtime,
    Output
  >,
> = Metadata<Native> & {
  readonly textStream: Stream.Stream<string, AiSdkError>;
  readonly stream: Stream.Stream<
    TextEvent<Tools>,
    AiSdkError | AiSdkStreamAborted
  >;
  readonly fullStream: Stream.Stream<
    TextEvent<Tools>,
    AiSdkError | AiSdkStreamAborted
  >;
  readonly experimental_partialOutputStream: Stream.Stream<
    StreamValue<Native['partialOutputStream']>,
    AiSdkError
  >;
  readonly partialOutputStream: Stream.Stream<
    StreamValue<Native['partialOutputStream']>,
    AiSdkError
  >;
  readonly elementStream: Stream.Stream<
    StreamValue<Native['elementStream']>,
    AiSdkError
  >;
  readonly consumeStream: <R = never>(
    options?: ConsumerOptions<R>,
  ) => Effect.Effect<void, AiSdkError, R>;
  readonly toUIMessageStream: <
    Message extends UIMessage = UIMessage,
    R = never,
  >(
    options?: UIMessageStreamOptions<Message, R>,
  ) => Stream.Stream<InferUIMessageChunk<Message>, AiSdkError, R>;
  readonly pipeUIMessageStreamToResponse: <
    Message extends UIMessage = UIMessage,
    R = never,
  >(
    response: ServerResponse,
    options?: UiResponseOptions<Message, R>,
  ) => Effect.Effect<void, AiSdkError, R>;
  readonly pipeTextStreamToResponse: (
    response: ServerResponse,
    options?: ResponseInit,
  ) => Effect.Effect<void, AiSdkError>;
  readonly toUIMessageStreamResponse: UiResponse;
  readonly toTextStreamResponse: (
    options?: ResponseInit,
  ) => Effect.Effect<Response, AiSdkError>;
};

type NativeSingleConsumer<
  Tools extends ToolSet,
  Runtime extends Record<string, unknown>,
  Output extends OutputInterface,
> = ReturnType<typeof experimental_streamTextLowMemory<Tools, Runtime, Output>>;

export type StreamTextSingleConsumerResult<
  Tools extends ToolSet,
  Runtime extends Record<string, unknown>,
  Output extends OutputInterface,
> = Pick<
  TextStreamResult<Tools, Runtime, Output>,
  keyof NativeSingleConsumer<Tools, Runtime, Output>
>;

const streamParts = <A>(operation: string, get: () => ReadableStream<A>) =>
  Stream.unwrap(
    runSync(operation, get).pipe(
      Effect.map((readable) =>
        Stream.fromReadableStream({
          evaluate: () => readable,
          onError: (cause) => sdkError(operation, cause),
          // An unread replay branch can prevent source cancellation from resolving.
          releaseLockOnEnd: true,
        }),
      ),
    ),
  );

export const wrapSingleConsumerTextStream = <
  Tools extends ToolSet,
  Runtime extends Record<string, unknown>,
  Output extends OutputInterface,
>(
  operation: string,
  sdk: NativeSingleConsumer<Tools, Runtime, Output>,
  markComplete: Effect.Effect<void> = Effect.void,
): StreamTextSingleConsumerResult<Tools, Runtime, Output> => {
  const read = <A>(get: () => PromiseLike<A>) => runRequest(operation, {}, get);
  const parts = <A>(get: () => ReadableStream<A>) =>
    streamParts(operation, get);
  const events = (get: () => ReadableStream<TextStreamPart<Tools>>) =>
    parts(get).pipe(
      Stream.mapEffect(
        Effect.fnUntraced(function* (part: TextStreamPart<Tools>) {
          if (part.type === 'error')
            return yield* sdkError(operation, part.error);
          if (part.type === 'abort') return yield* new AiSdkStreamAborted(part);
          return part;
        }),
      ),
      Stream.onEnd(markComplete),
    );
  const textStream = parts(() => sdk.textStream).pipe(
    Stream.onEnd(markComplete),
  );
  const uiStream = <Message extends UIMessage = UIMessage, R = never>(
    options: UIMessageStreamOptions<Message, R> = {},
  ) =>
    Stream.unwrap(
      Effect.gen(function* () {
        const owner = yield* openOperation<R>();
        const source = yield* runSync(operation, () =>
          sdk.toUIMessageStream<Message>(
            bindUiOptions(operation, owner, options),
          ),
        );
        return yield* scopedStream(operation, source);
      }),
    ).pipe(Stream.onEnd(markComplete));

  function uiResponse<Message extends UIMessage, R>(
    options?: UiResponseOptions<Message, R> & {
      readonly consumeSseStream?: never;
    },
  ): Effect.Effect<Response, AiSdkError, R>;
  function uiResponse<Message extends UIMessage, R>(
    options: UiResponseOptions<Message, R>,
  ): Effect.Effect<Response, AiSdkError, R | Scope.Scope>;
  function uiResponse<Message extends UIMessage, R>({
    headers,
    status,
    statusText,
    keepAliveMs,
    consumeSseStream,
    ...options
  }: UiResponseOptions<Message, R> = {}) {
    const settings = {
      ...(headers ? { headers } : {}),
      ...(status === undefined ? {} : { status }),
      ...(statusText === undefined ? {} : { statusText }),
      ...(keepAliveMs === undefined ? {} : { keepAliveMs }),
      stream: uiStream(options),
    };
    return consumeSseStream
      ? createUIMessageStreamResponse({ ...settings, consumeSseStream })
      : createUIMessageStreamResponse(settings);
  }

  return {
    finishReason: read(() => sdk.finishReason),
    rawFinishReason: read(() => sdk.rawFinishReason),
    usage: read(() => sdk.usage),
    totalUsage: read(() => sdk.totalUsage),
    textStream,
    stream: events(() => sdk.stream),
    fullStream: events(() => sdk.fullStream),
    partialOutputStream: parts(() => sdk.partialOutputStream),
    elementStream: parts(() => sdk.elementStream),
    consumeStream: ({ onError } = {}) =>
      Effect.gen(function* () {
        let failure = Option.none<AiSdkError>();
        yield* read(() =>
          sdk.consumeStream({
            onError: (cause) => {
              failure = Option.some(sdkError(operation, cause));
            },
          }),
        );
        if (Option.isNone(failure)) {
          yield* markComplete;
        } else if (onError) {
          yield* invoke(operation, () =>
            onError(Option.getOrThrow(failure)),
          ).pipe(Effect.mapError((cause) => sdkError(operation, cause)));
        }
      }),
    toUIMessageStream: uiStream,
    pipeUIMessageStreamToResponse: (response, options = {}) =>
      pipeUIMessageStreamToResponse({
        ...options,
        response,
        stream: uiStream(options),
      }),
    pipeTextStreamToResponse: (response, init) =>
      pipeTextStreamToResponse({ ...init, response, stream: textStream }),
    toUIMessageStreamResponse: uiResponse,
    toTextStreamResponse: (init) =>
      createTextStreamResponse({ ...init, stream: textStream }),
  };
};

export const wrapTextStream = <
  Tools extends ToolSet,
  Runtime extends Record<string, unknown>,
  Output extends OutputInterface,
>(
  operation: string,
  sdk: StreamTextResult<Tools, Runtime, Output>,
  markComplete: Effect.Effect<void> = Effect.void,
): TextStreamResult<Tools, Runtime, Output> => {
  const read = <A>(get: () => PromiseLike<A>) => runRequest(operation, {}, get);
  return {
    ...wrapSingleConsumerTextStream<Tools, Runtime, Output>(
      operation,
      sdk,
      markComplete,
    ),
    content: read(() => sdk.content),
    text: read(() => sdk.text),
    reasoning: read(() => sdk.reasoning),
    reasoningText: read(() => sdk.reasoningText),
    files: read(() => sdk.files),
    sources: read(() => sdk.sources),
    toolCalls: read(() => sdk.toolCalls),
    staticToolCalls: read(() => sdk.staticToolCalls),
    dynamicToolCalls: read(() => sdk.dynamicToolCalls),
    staticToolResults: read(() => sdk.staticToolResults),
    dynamicToolResults: read(() => sdk.dynamicToolResults),
    toolResults: read(() => sdk.toolResults),
    stoppedBy: read(() => Promise.resolve(sdk.stoppedBy)),
    warnings: read(() => sdk.warnings),
    steps: read(() => sdk.steps),
    finalStep: read(() => sdk.finalStep),
    request: read(() => sdk.request),
    response: read(() => sdk.response),
    responseMessages: read(() => sdk.responseMessages),
    providerMetadata: read(() => sdk.providerMetadata),
    experimental_partialOutputStream: streamParts(
      operation,
      () => sdk.experimental_partialOutputStream,
    ),
    output: read(() => sdk.output),
  };
};
