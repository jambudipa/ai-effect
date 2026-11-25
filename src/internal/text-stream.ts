import type {
  StreamTextResult,
  TextStreamPart,
  ToolSet,
  OutputInterface,
  UIMessage,
  UIMessageStreamOptions,
  InferUIMessageChunk,
} from 'ai';
import { Effect, Stream } from 'effect';
import { AiSdkStreamAborted } from './stream-aborted.js';
import { runRequest, runSync, sdkError, type AiSdkError } from './operation.js';

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
  readonly consumeStream: (
    ...args: Parameters<Native['consumeStream']>
  ) => Effect.Effect<void, AiSdkError>;
  readonly toUIMessageStream: <Message extends UIMessage>(
    options?: UIMessageStreamOptions<Message>,
  ) => Stream.Stream<InferUIMessageChunk<Message>, AiSdkError>;
  readonly pipeUIMessageStreamToResponse: (
    ...args: Parameters<Native['pipeUIMessageStreamToResponse']>
  ) => Effect.Effect<void, AiSdkError>;
  readonly pipeTextStreamToResponse: (
    ...args: Parameters<Native['pipeTextStreamToResponse']>
  ) => Effect.Effect<void, AiSdkError>;
  readonly toUIMessageStreamResponse: (
    ...args: Parameters<Native['toUIMessageStreamResponse']>
  ) => Effect.Effect<Response, AiSdkError>;
  readonly toTextStreamResponse: (
    ...args: Parameters<Native['toTextStreamResponse']>
  ) => Effect.Effect<Response, AiSdkError>;
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
  const parts = <A>(get: () => ReadableStream<A>) =>
    Stream.unwrap(
      runSync(operation, get).pipe(
        Effect.map((readable) =>
          Stream.fromReadableStream({
            evaluate: () => readable,
            onError: (cause) => sdkError(operation, cause),
            // Cancel the SDK request through its scoped signal. An unread
            // replay branch can otherwise prevent cancellation from resolving.
            releaseLockOnEnd: true,
          }),
        ),
      ),
    );
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
  return {
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
    finishReason: read(() => sdk.finishReason),
    rawFinishReason: read(() => sdk.rawFinishReason),
    stoppedBy: read(() => Promise.resolve(sdk.stoppedBy)),
    usage: read(() => sdk.usage),
    totalUsage: read(() => sdk.totalUsage),
    warnings: read(() => sdk.warnings),
    steps: read(() => sdk.steps),
    finalStep: read(() => sdk.finalStep),
    request: read(() => sdk.request),
    response: read(() => sdk.response),
    responseMessages: read(() => sdk.responseMessages),
    providerMetadata: read(() => sdk.providerMetadata),
    textStream: parts(() => sdk.textStream),
    stream: events(() => sdk.stream),
    fullStream: events(() => sdk.fullStream),
    experimental_partialOutputStream: parts(
      () => sdk.experimental_partialOutputStream,
    ),
    partialOutputStream: parts(() => sdk.partialOutputStream),
    elementStream: parts(() => sdk.elementStream),
    output: read(() => sdk.output),
    consumeStream: (...args: Parameters<typeof sdk.consumeStream>) =>
      read(() => sdk.consumeStream(...args)),
    toUIMessageStream: <Message extends import('ai').UIMessage>(
      ...args: Parameters<typeof sdk.toUIMessageStream<Message>>
    ) => parts(() => sdk.toUIMessageStream<Message>(...args)),
    pipeUIMessageStreamToResponse: (
      ...args: Parameters<typeof sdk.pipeUIMessageStreamToResponse>
    ) => read(() => sdk.pipeUIMessageStreamToResponse(...args)),
    pipeTextStreamToResponse: (
      ...args: Parameters<typeof sdk.pipeTextStreamToResponse>
    ) => read(() => sdk.pipeTextStreamToResponse(...args)),
    toUIMessageStreamResponse: (
      ...args: Parameters<typeof sdk.toUIMessageStreamResponse>
    ) => runSync(operation, () => sdk.toUIMessageStreamResponse(...args)),
    toTextStreamResponse: (
      ...args: Parameters<typeof sdk.toTextStreamResponse>
    ) => runSync(operation, () => sdk.toTextStreamResponse(...args)),
  };
};
