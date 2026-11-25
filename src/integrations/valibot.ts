import { valibotSchema as sdkValibotSchema } from '@ai-sdk/valibot';
import { Effect } from 'effect';
import type * as Valibot from 'valibot';
import { runSync, sdkError } from '../internal/operation.js';
import { runValue } from './internal/operation.js';

/** Adapt Valibot validation and JSON Schema conversion to lazy Effects. */
export const valibotSchema = <
  S extends Valibot.GenericSchema<unknown, unknown, Valibot.BaseIssue<unknown>>,
>(
  schema: S,
) =>
  runSync('Valibot.valibotSchema', () => {
    const native = sdkValibotSchema(schema);
    return {
      jsonSchema: runValue('Valibot.jsonSchema', () => native.jsonSchema),
      validate: (input: unknown) =>
        runValue('Valibot.validate', () => native.validate?.(input)).pipe(
          Effect.flatMap((result) =>
            result?.success
              ? Effect.succeed(result.value)
              : Effect.fail(sdkError('Valibot.validate', result?.error)),
          ),
        ),
    };
  });
