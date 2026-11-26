import * as sdk from '@ai-sdk/provider-utils/test';
import { Effect, Stream } from 'effect';
import type { IdGenerator } from '../../core-data.js';
import {
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from '../../internal/operation.js';
import { ownReadable } from '../../internal/readable.js';

/** Provide finite fixture values in the given order as an Effect stream. */
export const convertArrayToAsyncIterable = <A>(values: A[]) =>
  Stream.fromIterable(values);
/**
 * Feed an ordered finite array through the same Effect stream contract as adapted web
 * readers.
 */
export const convertArrayToReadableStream = <A>(values: A[]) =>
  Stream.fromIterable(values);

/** Collect native or Effect fixture streams and classify native iterator failures. */
export const convertAsyncIterableToArray = <A>(
  source: AsyncIterable<A> | Stream.Stream<A, AiSdkError>,
) =>
  Stream.runCollect(
    Stream.isStream(source)
      ? source
      : Stream.fromAsyncIterable(source, (error) =>
          sdkError('convertAsyncIterableToArray', error),
        ),
  );

/**
 * Collect a native or Effect reader and release the native reader with the collection
 * scope.
 */
export const convertReadableStreamToArray = <A>(
  source: ReadableStream<A> | Stream.Stream<A, AiSdkError>,
) => {
  if (Stream.isStream(source)) return Stream.runCollect(source);
  const effect = Effect.gen(function* () {
    const owned = yield* ownReadable('convertReadableStreamToArray', source);
    return yield* Stream.fromReadableStream({
      evaluate: () => owned,
      onError: (error) => sdkError('convertReadableStreamToArray', error),
      releaseLockOnEnd: true,
    }).pipe(Stream.runCollect);
  });
  return Effect.scoped(effect);
};

/**
 * Read a fixture response through the SDK collector and manage ownership of a native
 * response body.
 */
export const convertResponseStreamToArray = (response: Response) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'convertResponseStreamToArray';
      const body = response.body;
      if (!body)
        return yield* runRequest(operation, {}, () =>
          sdk.convertResponseStreamToArray(response),
        );
      const owned = yield* ownReadable(operation, body);
      return yield* runRequest(operation, {}, () =>
        sdk.convertResponseStreamToArray(new Response(owned, response)),
      );
    }),
  );

/** Check the runtime Node major with the native version detector inside an Effect. */
export const isNodeVersion = (version: number) =>
  runSync('isNodeVersion', () => sdk.isNodeVersion(version));

/**
 * Check a minimum Node version while preserving the SDK defaults for omitted components.
 */
export const isNodeVersionAtLeast = (
  major: number,
  minor?: number,
  patch?: number,
) =>
  runSync('isNodeVersionAtLeast', () =>
    sdk.isNodeVersionAtLeast(major, minor, patch),
  );

/** Create a deterministic fixture ID generator whose successive reads run in Effect. */
export const mockId = (options?: Parameters<typeof sdk.mockId>[0]) =>
  runSync('mockId', () => sdk.mockId(options)).pipe(
    Effect.map(
      (next): IdGenerator =>
        () =>
          runSync('mockId.next', next),
    ),
  );
