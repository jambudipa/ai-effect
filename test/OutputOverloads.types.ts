import { Context, Effect, Schema } from 'effect';
import { expectTypeOf } from 'vitest';
import { jsonSchema } from '../src/core-schema.js';
import { Output, type OutputSpecification } from '../src/internal/output.js';

class SchemaValue extends Context.Service<SchemaValue, number>()(
  '@jambudipa/ai-effect/tests/OutputOverloads/SchemaValue',
) {}

export const outputOverloadsProof = Effect.gen(function* () {
  const schema = Schema.Struct({ value: Schema.Number }).annotate({
    identifier: 'OutputOverloadsFixture',
  });
  const explicitSchema = yield* Output.object<never, typeof schema>({ schema });
  const inferredSchema = yield* Output.object({ schema });
  expectTypeOf(explicitSchema).toEqualTypeOf<typeof inferredSchema>();
  expectTypeOf(explicitSchema).toEqualTypeOf<
    OutputSpecification<{ readonly value: number }, { readonly value?: number }>
  >();

  const element = Schema.Number;
  const array = yield* Output.array<number | string, typeof element>({
    element,
    minItems: 1,
  });
  expectTypeOf(array).toEqualTypeOf<
    OutputSpecification<
      (number | string)[],
      (number | string)[],
      number | string
    >
  >();

  const deferred = Effect.gen(function* () {
    yield* SchemaValue;
    return yield* jsonSchema<number>({ type: 'number' });
  });
  const withSchema = yield* Output.array<never, typeof deferred>({
    element: deferred,
  });
  const withServices = yield* Output.array<number, SchemaValue>({
    element: deferred,
  });
  expectTypeOf(withSchema).toEqualTypeOf<typeof withServices>();
  expectTypeOf(withSchema).toEqualTypeOf<
    OutputSpecification<number[], number[], number, SchemaValue>
  >();
});
