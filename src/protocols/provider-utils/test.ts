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

export const convertArrayToAsyncIterable = <A>(values: A[]) =>
  Stream.fromIterable(values);
export const convertArrayToReadableStream = <A>(values: A[]) =>
  Stream.fromIterable(values);

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

export const isNodeVersion = (version: number) =>
  runSync('isNodeVersion', () => sdk.isNodeVersion(version));

export const isNodeVersionAtLeast = (
  major: number,
  minor?: number,
  patch?: number,
) =>
  runSync('isNodeVersionAtLeast', () =>
    sdk.isNodeVersionAtLeast(major, minor, patch),
  );

export const mockId = (options?: Parameters<typeof sdk.mockId>[0]) =>
  runSync('mockId', () => sdk.mockId(options)).pipe(
    Effect.map(
      (next): IdGenerator =>
        () =>
          runSync('mockId.next', next),
    ),
  );
