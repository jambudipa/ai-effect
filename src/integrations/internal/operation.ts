import { Effect, Predicate } from 'effect';
import { runRequest, runSync } from '../../internal/operation.js';

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
