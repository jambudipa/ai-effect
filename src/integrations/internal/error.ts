import { Redacted } from 'effect';
import { AiSdkError, runSync, sdkError } from '../../internal/operation.js';

type NativeError<Args extends unknown[], E extends Error> = new (
  ...args: Args
) => E;

/** Adapt an SDK error constructor and its optional brand predicate. */
export const wrapError = <Args extends unknown[], E extends Error>(
  operation: string,
  ErrorClass: NativeError<Args, E> & {
    isInstance?: (cause: unknown) => boolean;
  },
) => ({
  make: (...args: Args) =>
    runSync(operation, () => sdkError(operation, new ErrorClass(...args))),
  isInstance: (value: unknown): value is AiSdkError => {
    if (!(value instanceof AiSdkError)) return false;
    const cause = Redacted.value(value.cause);
    return ErrorClass.isInstance?.(cause) ?? cause instanceof ErrorClass;
  },
});
