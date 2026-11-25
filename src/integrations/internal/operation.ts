import { Effect, Predicate } from 'effect';
import {
  combineSignals,
  runRequest,
  runSync,
  sdkError,
} from '../../internal/operation.js';

const isPromiseLike = <A>(value: A | PromiseLike<A>): value is PromiseLike<A> =>
  Predicate.isObject(value) &&
  'then' in value &&
  typeof value.then === 'function';

/** Normalize a foreign operation with a synchronous or thenable result. */
export const runValue = <A>(
  operation: string,
  invoke: () => A | PromiseLike<A>,
) =>
  Effect.flatMap(runSync(operation, invoke), (value) =>
    isPromiseLike(value)
      ? runRequest(operation, {}, () => value)
      : Effect.succeed(value),
  );

/** Bridge synchronous or async calls that accept cancellation. */
export const runResult = <A>(
  operation: string,
  invoke: (signal: AbortSignal) => A | PromiseLike<A>,
  options: { readonly abortSignal?: AbortSignal } = {},
) =>
  Effect.suspend(() => {
    const controller = new AbortController();
    return runValue(operation, () =>
      invoke(combineSignals(controller.signal, options.abortSignal)),
    ).pipe(Effect.onInterrupt(() => Effect.sync(() => controller.abort())));
  });
