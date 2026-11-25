import { Effect, Stream } from 'effect';
import { type AiSdkError, sdkError } from '../../internal/operation.js';
import { ownReadable } from '../../internal/readable.js';

/** Register ownership of a foreign reader before exposing the stream. */
export const ownStream = <A>(operation: string, source: ReadableStream<A>) =>
  Effect.map(ownReadable(operation, source), (readable) =>
    Stream.fromReadableStream({
      evaluate: () => readable,
      onError: (cause): AiSdkError => sdkError(operation, cause),
      releaseLockOnEnd: true,
    }),
  );

/** Turn a foreign readable into a single scoped Effect stream. */
export const fromReadable = <A, E, R>(
  operation: string,
  acquire: Effect.Effect<ReadableStream<A>, E, R>,
) =>
  Stream.unwrap(
    Effect.flatMap(acquire, (source) => ownStream(operation, source)),
  );
