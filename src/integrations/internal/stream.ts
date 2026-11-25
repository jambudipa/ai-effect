import { Effect, Stream } from 'effect';
import { type AiSdkError, sdkError } from '../../internal/operation.js';
import { ownReadable } from '../../internal/readable.js';

/** Turn a foreign readable into a single scoped Effect stream. */
export const fromReadable = <A, E, R>(
  operation: string,
  acquire: Effect.Effect<ReadableStream<A>, E, R>,
) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const source = yield* acquire;
      const readable = yield* ownReadable(operation, source);
      return Stream.fromReadableStream({
        evaluate: () => readable,
        onError: (cause): AiSdkError => sdkError(operation, cause),
        releaseLockOnEnd: true,
      });
    }),
  );
