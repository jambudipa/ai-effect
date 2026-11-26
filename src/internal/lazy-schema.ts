import { jsonSchema as nativeJsonSchema } from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { bindSchema, type FlexibleSchema } from '../core-schema.js';
import type { Owner } from './chat-boundary.js';
import { runRequest } from './operation.js';
import { lazyValue } from './provider-model.js';

/** Track the native schema type whose conversion and validation the public handle defers. */
type NativeSchema<A> = ReturnType<typeof nativeJsonSchema<A>>;

/** Bind a lazy schema once per SDK operation and own validation callbacks. */
export const bindLazySchema = <A, R>(
  input: FlexibleSchema<A, R>,
  owner: Owner<R>,
  operation: string,
) => {
  let cached: Promise<NativeSchema<A>> | undefined;
  const schema = runRequest(operation, { abortSignal: owner.signal }, () => {
    cached ??= owner.runCallback(bindSchema(input, owner));
    return cached;
  });
  return nativeJsonSchema<A>(
    () =>
      owner.runCallback(
        schema.pipe(
          Effect.flatMap((native) =>
            lazyValue(operation, () => native.jsonSchema),
          ),
        ),
      ),
    {
      validate: (value) =>
        owner.runCallback(
          schema.pipe(
            Effect.flatMap((native) => {
              const validate = native.validate;
              return validate
                ? lazyValue(operation, () => validate.call(native, value))
                : Effect.succeed({ success: true as const, value: value as A });
            }),
          ),
        ),
    },
  );
};
