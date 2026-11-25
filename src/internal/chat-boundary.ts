import { Effect, Stream } from 'effect';
import {
  runRequest,
  runSync,
  sdkError,
  type openOperation,
} from './operation.js';

export type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
export type CallbackResult<A, R> =
  A | PromiseLike<A> | Effect.Effect<A, unknown, R>;

export const invoke = <A, R>(
  operation: string,
  callback: () => CallbackResult<A, R>,
) =>
  runSync(operation, callback).pipe(
    Effect.flatMap((result) => {
      if (Effect.isEffect(result)) return result;
      if (
        result &&
        (typeof result === 'object' || typeof result === 'function') &&
        'then' in result &&
        typeof result.then === 'function'
      ) {
        return runRequest(operation, {}, () => result as PromiseLike<A>);
      }
      return Effect.succeed(result as A);
    }),
  );

export const foreignStream = <A>(
  operation: string,
  source: ReadableStream<A>,
) =>
  Stream.fromReadableStream({
    evaluate: () => source,
    onError: (cause) => sdkError(operation, cause),
    releaseLockOnEnd: true,
  });
