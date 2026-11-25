import { Effect } from 'effect';
import { runSync } from './operation.js';

/**
 * Keep ownership of the source even when an SDK consumer retains its reader.
 * Cancellation can wait for another branch of a teed stream, so release the
 * lock immediately after requesting cancellation.
 */
export const ownReadable = <A>(operation: string, source: ReadableStream<A>) =>
  Effect.acquireRelease(
    runSync(operation, () => ({ reader: source.getReader(), done: false })),
    ({ reader, done }) =>
      Effect.sync(() => {
        if (!done) void reader.cancel().catch(() => {});
        reader.releaseLock();
      }),
  ).pipe(
    Effect.map(
      (owner) =>
        new ReadableStream<A>(
          {
            pull: (controller) =>
              owner.reader.read().then((result) => {
                if (result.done) {
                  owner.done = true;
                  controller.close();
                } else {
                  controller.enqueue(result.value);
                }
              }),
          },
          { highWaterMark: 0 },
        ),
    ),
  );
