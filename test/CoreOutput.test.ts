import { describe, expect, it } from '@effect/vitest';
import { Context, DateTime, Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import { z } from 'zod';
import * as zod4 from 'zod/v4';
import { jsonSchema } from '../src/core-schema.js';
import { AiSdkError } from '../src/internal/operation.js';
import { Output } from '../src/internal/output.js';

class SchemaValue extends Context.Service<SchemaValue, number>()(
  '@jambudipa/ai-effect/test/SchemaValue',
) {}

const context = {
  finishReason: 'stop' as const,
  usage: {
    inputTokens: 1,
    inputTokenDetails: {
      noCacheTokens: 1,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    },
    outputTokens: 1,
    outputTokenDetails: { textTokens: 1, reasoningTokens: 0 },
    totalTokens: 2,
  },
  response: {
    id: 'test',
    timestamp: DateTime.toDateUtc(DateTime.makeUnsafe(0)),
    modelId: 'test-model',
  },
};

describe('Core output', () => {
  it.effect('accepts Zod object and array schemas with typed output', () =>
    Effect.gen(function* () {
      const object = yield* Output.object({
        schema: z.object({ answer: z.number() }),
      });
      const result = yield* object.parseCompleteOutput(
        { text: '{"answer":42}' },
        context,
      );
      expectTypeOf(result).toEqualTypeOf<{ answer: number }>();
      expect(result).toEqual({ answer: 42 });
      const failure = yield* Effect.flip(
        object.parseCompleteOutput({ text: '{"answer":"private"}' }, context),
      );
      expect(failure).toBeInstanceOf(AiSdkError);
      expect(String(failure)).not.toContain('private');

      const array = yield* Output.array({ element: zod4.number() });
      const elements = yield* array.parseCompleteOutput(
        { text: '{"elements":[1,2]}' },
        context,
      );
      expectTypeOf(elements).toEqualTypeOf<number[]>();
      expect(elements).toEqual([1, 2]);
    }),
  );

  it.effect('binds a lazy schema separately for each operation', () =>
    Effect.gen(function* () {
      let loads = 0;
      const schema = Effect.gen(function* () {
        const value = yield* SchemaValue;
        loads++;
        return yield* jsonSchema<{ value: number }>(
          {
            type: 'object',
            properties: { value: { type: 'number' } },
            required: ['value'],
          },
          {
            validate: () => Effect.succeed({ success: true, value: { value } }),
          },
        );
      });
      const output = yield* Output.object({ schema });
      expect(loads).toBe(0);
      const responseFormat = yield* output.responseFormat.pipe(
        Effect.provideService(SchemaValue, 0),
      );
      expect(responseFormat?.type).toBe('json');
      const parse = output.parseCompleteOutput(
        { text: '{"value":0}' },
        context,
      );
      expect(yield* parse.pipe(Effect.provideService(SchemaValue, 1))).toEqual({
        value: 1,
      });
      expect(yield* parse.pipe(Effect.provideService(SchemaValue, 2))).toEqual({
        value: 2,
      });
      expect(loads).toBe(3);
    }),
  );
});
