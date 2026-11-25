import {
  LangSmithDeploymentTransport as SdkTransport,
  convertModelMessages as sdkConvertModelMessages,
  toBaseMessages as sdkToBaseMessages,
  toUIMessageStream as sdkToUIMessageStream,
} from '@ai-sdk/langchain';
import type { AIMessageChunk } from '@langchain/core/messages';
import type {
  BaseChannel,
  PregelNode,
  PregelParams,
} from '@langchain/langgraph';
import type { Client } from '@langchain/langgraph-sdk';
import type { ModelMessage, UIMessage } from 'ai';
import { Effect, Stream } from 'effect';
import { wrapChatTransport } from '../internal/chat-transport.js';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import { fromReadable } from './internal/stream.js';
import type { StreamCallbacks as BaseCallbacks } from './llamaindex.js';

/** Graph options for a LangSmith deployment. The SDK defaults the graph ID to `agent`. */
export type LangSmithDeploymentTransportOptions = Omit<
  PregelParams<Record<string, PregelNode>, Record<string, BaseChannel>>,
  'channels' | 'nodes' | 'inputChannels' | 'outputChannels'
> & {
  graphId?: string;
  client?: Client;
  url?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  streamResumable?: boolean;
};

/** Lifecycle callbacks for the native LangChain protocol. */
export interface StreamCallbacks<
  TState = unknown,
  R = never,
  E = never,
> extends BaseCallbacks<R, E> {
  readonly onFinish?: (state: TState | undefined) => Effect.Effect<void, E, R>;
  readonly onError?: (error: AiSdkError) => Effect.Effect<void, E, R>;
  readonly onAbort?: () => Effect.Effect<void, E, R>;
}

export interface ToUIMessageStreamOptions<
  TState = unknown,
  R = never,
  E = never,
> extends StreamCallbacks<TState, R, E> {
  readonly sendStart?: boolean;
  readonly sendFinish?: boolean;
}

export const toBaseMessages = (messages: UIMessage[]) =>
  runRequest('LangChain.toBaseMessages', {}, () => sdkToBaseMessages(messages));

export const convertModelMessages = (messages: ModelMessage[]) =>
  runSync('LangChain.convertModelMessages', () =>
    sdkConvertModelMessages(messages),
  );

/** Convert LangChain messages or graph events to an ordered UI stream. */
export const toUIMessageStream = <
  TState = unknown,
  R = never,
  E = never,
  RI = never,
  EI = never,
>(
  input:
    | Stream.Stream<AIMessageChunk, EI, RI>
    | AsyncIterable<AIMessageChunk>
    | ReadableStream,
  options: ToUIMessageStreamOptions<TState, R, E> = {},
) => {
  const operation = 'LangChain.toUIMessageStream';
  return fromReadable(
    operation,
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const source =
        Stream.TypeId in input
          ? yield* Stream.toAsyncIterableEffect(input)
          : input;
      const {
        onStart,
        onFinal,
        onToken,
        onText,
        onFinish,
        onAbort,
        onError,
        ...config
      } = options;
      return yield* runSync(operation, () =>
        sdkToUIMessageStream<TState>(source, {
          ...config,
          ...(onStart && { onStart: () => owner.runCallback(onStart()) }),
          ...(onFinal && {
            onFinal: (text) => owner.runCallback(onFinal(text)),
          }),
          ...(onToken && {
            onToken: (text) => owner.runCallback(onToken(text)),
          }),
          ...(onText && { onText: (text) => owner.runCallback(onText(text)) }),
          ...(onFinish && {
            onFinish: (state) => owner.runCallback(onFinish(state)),
          }),
          ...(onAbort && { onAbort: () => owner.runCallback(onAbort()) }),
          ...(onError && {
            onError: (cause) =>
              owner.runCallback(onError(sdkError(operation, cause))),
          }),
        }),
      );
    }),
  );
};

// This constructor facade produces a transport consumable by the host adapters.
export const LangSmithDeploymentTransport = {
  make: <M extends UIMessage = UIMessage>(
    options: LangSmithDeploymentTransportOptions,
  ) =>
    runSync('LangSmithDeploymentTransport.make', () =>
      wrapChatTransport(new SdkTransport<M>(options)),
    ),
};

export type LangSmithDeploymentTransport<M extends UIMessage = UIMessage> =
  Effect.Success<ReturnType<typeof LangSmithDeploymentTransport.make<M>>>;
