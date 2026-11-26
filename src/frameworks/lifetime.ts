import { Effect } from 'effect';
import { guardedFetch } from '../internal/fetch.js';
import {
  abortable,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';

/**
 * Allow host callbacks to return a value, Promise, or Effect without an extra service
 * requirement.
 */
export type HostResult<A> = A | PromiseLike<A> | Effect.Effect<A, unknown>;

/**
 * Suspend the host callback and settle its value or Promise through the named Effect error
 * boundary.
 */
const invoke = <A>(operation: string, callback: () => HostResult<A>) =>
  runSync(operation, callback).pipe(
    Effect.flatMap((result) => {
      if (Effect.isEffect(result)) return result;
      return runRequest(operation, {}, () => Promise.resolve(result));
    }),
  );

/** Attach a native command and its transport to the lifetime of a host view. */
export class ViewLifetime {
  /**
   * Share a cancellation controller across commands, callbacks, and fetches for the
   * current view.
   */
  #controller = new AbortController();

  /**
   * Expose the current view abort signal. Activation after disposal assigns a new signal.
   */
  get signal() {
    return this.#controller.signal;
  }

  /** Renew a disposed lifetime when a host activates the same view again. */
  activate() {
    if (this.signal.aborted) this.#controller = new AbortController();
  }

  /** Abort work tied to the current view signal. */
  dispose() {
    this.#controller.abort();
  }

  /**
   * Run a native command lazily, link cancellation to the view, and call its optional stop
   * action on interruption.
   */
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

  /**
   * Run a synchronous SDK action lazily. A disposed view fails before calling the SDK.
   */
  action<A>(operation: string, run: () => A) {
    return Effect.suspend(() =>
      this.signal.aborted
        ? Effect.fail(sdkError(operation, this.signal.reason))
        : runSync(operation, run),
    );
  }

  /**
   * Schedule an optional callback in the live view and suppress notification failures.
   */
  notify<Args extends unknown[]>(
    operation: string,
    callback: ((...args: Args) => HostResult<void>) | undefined,
    ...args: Args
  ) {
    if (!callback || this.signal.aborted) return;
    Effect.runFork(Effect.ignore(invoke(operation, () => callback(...args))), {
      signal: this.signal,
    });
  }

  /** Run the Effect callback from a framework boundary that needs a Promise result. */
  callback<A>(operation: string, callback: () => HostResult<A>) {
    return Effect.runPromise(invoke(operation, callback), {
      signal: this.signal,
    });
  }

  /**
   * Bind each fetch call to the current view signal, including calls after the lifetime
   * renews.
   */
  fetch(fetcher?: typeof globalThis.fetch): typeof globalThis.fetch {
    return (input, init) => guardedFetch(this.signal, fetcher)(input, init);
  }
}

/**
 * Register host cleanup that aborts the view before invoking its native cleanup action.
 */
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

/**
 * Adapt the current host error when present while preserving an absent error as
 * `undefined`.
 */
export const viewError = (operation: string, cause: Error | undefined) =>
  cause ? sdkError(operation, cause) : undefined;
