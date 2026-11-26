import * as sdk from 'ai';
import { Deferred, Effect, Option, Ref, Semaphore } from 'effect';
import { runSync } from './internal/operation.js';

/** Wrap a generated file and defer its base64 and byte conversions until requested. */
export const DefaultGeneratedFile = (
  options: ConstructorParameters<typeof sdk.DefaultGeneratedFile>[0],
) =>
  runSync('DefaultGeneratedFile', () => {
    const file = new sdk.DefaultGeneratedFile(options);
    return {
      mediaType: file.mediaType,
      providerMetadata: file.providerMetadata,
      base64: runSync('DefaultGeneratedFile.base64', () => file.base64),
      uint8Array: runSync(
        'DefaultGeneratedFile.uint8Array',
        () => file.uint8Array,
      ),
    };
  });

/** Expose the media metadata and separately executable content encodings of a generated file. */
export type DefaultGeneratedFile = Effect.Success<
  ReturnType<typeof DefaultGeneratedFile>
>;

/** Create paired web-stream endpoints for serializing JSON values as server-sent events. */
export const JsonToSseTransformStream = () =>
  runSync('JsonToSseTransformStream', () => {
    const { readable, writable } = new sdk.JsonToSseTransformStream();
    return { readable, writable };
  });

/** Type the readable and writable endpoints that share one SSE transform. */
export type JsonToSseTransformStream = Effect.Success<
  ReturnType<typeof JsonToSseTransformStream>
>;

/** Create an executor that runs one job at a time and lets callers await the current queue draining. */
export const SerialJobExecutor = Effect.gen(function* () {
  const semaphore = yield* Semaphore.make(1);
  const initial = yield* Deferred.make<void>();
  const state = yield* Ref.make({ pending: 0, idle: initial });

  const enqueue = Effect.flatMap(Deferred.make<void>(), (idle) =>
    Ref.update(state, (queue) => ({
      pending: queue.pending + 1,
      idle: queue.pending === 0 ? idle : queue.idle,
    })),
  );
  const release = Ref.modify(state, ({ pending, idle }) => [
    pending === 1 ? Option.some(idle) : Option.none(),
    { pending: pending - 1, idle },
  ]).pipe(
    Effect.flatMap(
      Option.match({
        onNone: () => Effect.void,
        onSome: (idle) => Deferred.succeed(idle, void 0).pipe(Effect.asVoid),
      }),
    ),
  );

  return {
    run: <A, E, R>(job: Effect.Effect<A, E, R>) =>
      Effect.acquireUseRelease(
        enqueue,
        () => semaphore.withPermits(1)(job),
        () => release,
      ),
    waitForIdle: () =>
      Ref.get(state).pipe(
        Effect.flatMap(({ pending, idle }) =>
          pending === 0 ? Effect.void : Deferred.await(idle),
        ),
      ),
  };
});

/** Expose the executor interface without its semaphore and pending-job state. */
export type SerialJobExecutor = Effect.Success<typeof SerialJobExecutor>;
