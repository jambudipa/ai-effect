import * as sdk from 'ai';
import { Deferred, Effect, Option, Ref, Semaphore } from 'effect';
import { runSync } from './internal/operation.js';

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

export type DefaultGeneratedFile = Effect.Success<
  ReturnType<typeof DefaultGeneratedFile>
>;

export const JsonToSseTransformStream = () =>
  runSync('JsonToSseTransformStream', () => {
    const { readable, writable } = new sdk.JsonToSseTransformStream();
    return { readable, writable };
  });

export type JsonToSseTransformStream = Effect.Success<
  ReturnType<typeof JsonToSseTransformStream>
>;

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

export type SerialJobExecutor = Effect.Success<typeof SerialJobExecutor>;
