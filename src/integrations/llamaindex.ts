import { toUIMessageStream as sdkToUIMessageStream } from '@ai-sdk/llamaindex';
import { Effect, Stream } from 'effect';
import { openOperation, runSync } from '../internal/operation.js';
import { fromReadable } from './internal/stream.js';

/** The text delta in a LlamaIndex response. */
export interface EngineResponse {
  readonly delta: string;
}

/** Lifecycle callbacks run in the scope and context of each reader. */
export interface StreamCallbacks<R = never, E = never> {
  readonly onStart?: () => Effect.Effect<void, E, R>;
  readonly onFinal?: (completion: string) => Effect.Effect<void, E, R>;
  readonly onToken?: (token: string) => Effect.Effect<void, E, R>;
  readonly onText?: (text: string) => Effect.Effect<void, E, R>;
}

/** Convert an ordered sequence of LlamaIndex deltas to AI SDK UI chunks. */
export const toUIMessageStream = <R = never, E = never, RI = never, EI = never>(
  input: Stream.Stream<EngineResponse, EI, RI> | AsyncIterable<EngineResponse>,
  callbacks: StreamCallbacks<R, E> = {},
) => {
  const operation = 'LlamaIndex.toUIMessageStream';
  return fromReadable(
    operation,
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const source =
        Symbol.asyncIterator in input
          ? input
          : yield* Stream.toAsyncIterableEffect(input);
      const { onStart, onFinal, onToken, onText } = callbacks;
      return yield* runSync(operation, () =>
        sdkToUIMessageStream(source, {
          ...(onStart && { onStart: () => owner.runCallback(onStart()) }),
          ...(onFinal && {
            onFinal: (text) => owner.runCallback(onFinal(text)),
          }),
          ...(onToken && {
            onToken: (text) => owner.runCallback(onToken(text)),
          }),
          ...(onText && { onText: (text) => owner.runCallback(onText(text)) }),
        }),
      );
    }),
  );
};
