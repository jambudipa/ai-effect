import { asSchema } from '@ai-sdk/provider-utils';
import type { FlexibleSchema } from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { sdkError } from '../../internal/operation.js';
import { runValue } from './operation.js';

/** Wrap an SDK schema without exposing the SDK validator. */
export const wrapSchema = <A>(
  operation: string,
  source: FlexibleSchema<A>,
) => ({
  jsonSchema: runValue(operation, () => asSchema(source).jsonSchema),
  validate: (input: unknown) =>
    runValue(operation, () => {
      const schema = asSchema(source);
      return schema.validate
        ? schema.validate(input)
        : { success: true as const, value: input as A };
    }).pipe(
      Effect.flatMap((result) =>
        result.success
          ? Effect.succeed(result.value)
          : Effect.fail(sdkError(operation, result.error)),
      ),
    ),
});
