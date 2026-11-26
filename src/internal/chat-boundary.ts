import { Effect, Stream } from 'effect';
import {
  runRequest,
  runSync,
  sdkError,
  type openOperation,
} from './operation.js';

/** Keep SDK callbacks and stream resources under the chat operation's scope. */
export type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Accept a direct value, native promise, or Effect result from a host callback. */
export type CallbackResult<A, R> =
  A | PromiseLike<A> | Effect.Effect<A, unknown, R>;

/** Invoke a host callback lazily and adapt synchronous throws and promise rejections. */
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

/** Read the SDK's native stream through Effect and convert a reader error to `AiSdkError`. */
export const foreignStream = <A>(
  operation: string,
  source: ReadableStream<A>,
) =>
  Stream.fromReadableStream({
    evaluate: () => source,
    onError: (cause) => sdkError(operation, cause),
    releaseLockOnEnd: true,
  });
