import { describe, expect, it } from '@effect/vitest';
import { Context, Effect } from 'effect';
import { jsonSchema, parseJSON } from '../src/protocols/provider-utils.js';

class SchemaNumber extends Context.Service<SchemaNumber, number>()(
  '@jambudipa/ai-effect/test/SchemaNumber',
) {}

describe('Core schemas', () => {
  it.effect('binds a shared schema to each validation context', () =>
    Effect.gen(function* () {
      const schema = yield* jsonSchema<number, SchemaNumber>(
        { type: 'number' },
        {
          validate: () =>
            Effect.gen(function* () {
              const value = yield* SchemaNumber;
              return { success: true as const, value };
            }),
        },
      );
      const parse = parseJSON({ text: '0', schema });
      const results = yield* Effect.all(
        [
          parse.pipe(Effect.provideService(SchemaNumber, 1)),
          parse.pipe(Effect.provideService(SchemaNumber, 2)),
        ],
        { concurrency: 2 },
      );
      expect(results).toEqual([1, 2]);
    }),
  );
});
