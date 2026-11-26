import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import type { Schema } from '../src/core-schema.js';
import { openai } from '../src/providers/openai.js';

it.effect('adapts the pinned OpenAI search schemas lazily', () =>
  Effect.gen(function* () {
    const search = yield* openai.tools.toolSearch({ execution: 'client' });
    expectTypeOf(search.inputSchema).toEqualTypeOf<
      Schema<{ arguments?: unknown; call_id?: string | null }>
    >();
    const output = search.outputSchema;
    if (!output) return yield* Effect.die('Search output schema is missing');
    let reads = 0;
    const validation = search.inputSchema.validate({
      get call_id() {
        reads += 1;
        return 'fixture';
      },
    });
    expect(reads).toBe(0);
    expect(yield* validation).toMatchObject({
      success: true,
      value: { call_id: 'fixture' },
    });
    expect(reads).toBeGreaterThan(0);
    expect(yield* output.jsonSchema).toMatchObject({
      type: 'object',
      properties: { tools: { type: 'array' } },
    });
    expect(yield* output.validate({ tools: ['invalid'] })).toMatchObject({
      success: false,
    });
    expect(yield* output.validate({ tools: [{ name: 'fixture' }] })).toEqual({
      success: true,
      value: { tools: [{ name: 'fixture' }] },
    });
  }),
);
