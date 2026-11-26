import { Effect, Scope, Stream } from 'effect';
import { type openOperation, runRequest } from './operation.js';

/** Run tool producer fibers under the same scope as their native SDK callback. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Require `return` so native consumers can release the Effect iterator early. */
type StreamIterator<A> = AsyncIterator<A> &
  Required<Pick<AsyncIterator<A>, 'return'>>;

/** Expose an Effect stream as a cancellable asynchronous iterable for the native tool. */
export const streamTool = <A, E, R>(
  stream: Stream.Stream<A, E, R>,
  owner: Owner<R>,
  operation: string,
  abortSignal?: AbortSignal,
): AsyncIterable<A> => ({
  [Symbol.asyncIterator]() {
    const close = (source: StreamIterator<A>) =>
      runRequest(operation, {}, () => source.return());
    const start = owner.runCallback(
      Effect.gen(function* () {
        const iterable = yield* Stream.toAsyncIterableEffect(stream);
        const source = iterable[Symbol.asyncIterator]() as StreamIterator<A>;
        yield* Scope.addFinalizer(owner.scope, Effect.ignore(close(source)));
        return source;
      }),
      abortSignal,
    );
    const iterator = runRequest(operation, {}, () => start);
    const release = iterator.pipe(Effect.flatMap(close));
    return {
      next: () =>
        owner.runCallback(
          iterator.pipe(
            Effect.flatMap((source) =>
              // Code Mode must see the original tool rejection.
              // @effect-diagnostics-next-line effect/unknownInEffectCatch:off
              Effect.tryPromise({
                try: () => source.next(),
                catch: (cause) => cause,
              }),
            ),
            Effect.onInterrupt(() => Effect.ignore(release)),
          ),
          abortSignal,
        ),
      return: () => Effect.runPromise(release),
    };
  },
});
