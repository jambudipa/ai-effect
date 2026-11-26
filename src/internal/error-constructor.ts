import { Redacted } from 'effect';
import { AiSdkError, sdkError } from './operation.js';

/** Describe a native SDK error constructor and its package-safe identity check. */
type NativeErrorConstructor<Arguments extends unknown[]> = {
  new (...args: Arguments): Error;
  isInstance(value: unknown): boolean;
};

/** Keep native constructor arguments while exposing a redacted Effect error and matching guard. */
type WrappedErrorConstructor<Arguments extends unknown[]> = {
  new (...args: Arguments): AiSdkError;
  isInstance(value: unknown): value is AiSdkError;
};

/** Preserve SDK error construction and identification with redacted diagnostics. */
export function wrapErrorConstructor<Arguments extends unknown[]>(
  operation: string,
  NativeError: NativeErrorConstructor<Arguments>,
): WrappedErrorConstructor<Arguments> {
  return class WrappedError extends AiSdkError {
    constructor(...args: Arguments) {
      super(sdkError(operation, new NativeError(...args)));
    }

    static isInstance(value: unknown): value is AiSdkError {
      return (
        value instanceof AiSdkError &&
        NativeError.isInstance(Redacted.value(value.cause))
      );
    }
  };
}
