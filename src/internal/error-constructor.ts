import { Redacted } from 'effect';
import { AiSdkError, sdkError } from './operation.js';

type NativeErrorConstructor<Arguments extends unknown[]> = {
  new (...args: Arguments): Error;
  isInstance(value: unknown): boolean;
};

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
