import { Effect } from 'effect';
import { guardedFetch } from '../internal/fetch.js';
import {
  abortable,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';

/** Attach a native command and its transport to the lifetime of a host view. */
export class ViewLifetime {
  #controller = new AbortController();

  get signal() {
    return this.#controller.signal;
  }

  activate() {
    if (this.signal.aborted) this.#controller = new AbortController();
  }

  dispose() {
    this.#controller.abort();
  }

  command<A>(
    operation: string,
    run: () => A | PromiseLike<A>,
    stop?: () => unknown,
  ) {
    return Effect.suspend(() =>
      abortable(
        operation,
        this.signal,
        runRequest(operation, {}, () => Promise.resolve(run())).pipe(
          Effect.onInterrupt(() =>
            stop
              ? Effect.ignore(
                  runRequest(operation, {}, () => Promise.resolve(stop())),
                )
              : Effect.void,
          ),
        ),
      ),
    );
  }

  action<A>(operation: string, run: () => A) {
    return Effect.suspend(() =>
      this.signal.aborted
        ? Effect.fail(sdkError(operation, this.signal.reason))
        : runSync(operation, run),
    );
  }

  fetch(fetcher?: typeof globalThis.fetch): typeof globalThis.fetch {
    return (input, init) => guardedFetch(this.signal, fetcher)(input, init);
  }
}

export const withLifetime = (
  register: (cleanup: () => void) => void,
  cleanup: () => void,
) => {
  const view = new ViewLifetime();
  register(() => {
    view.dispose();
    cleanup();
  });
  return view;
};

export const viewError = (operation: string, cause: Error | undefined) =>
  cause ? sdkError(operation, cause) : undefined;
