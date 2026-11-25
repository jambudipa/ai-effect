import { describe, expect, it } from '@effect/vitest';
import { Effect, Ref, Stream } from 'effect';
import * as v from 'valibot';
import { toUIMessageStream } from '../src/integrations/llamaindex.js';
import { valibotSchema } from '../src/integrations/valibot.js';

describe('LlamaIndex adapter', () => {
  it.effect('preserves UI chunks and callback order', () =>
    Effect.gen(function* () {
      const events = yield* Ref.make<ReadonlyArray<string>>([]);
      const callbacks = {
        onStart: () => Ref.update(events, (values) => [...values, 'start']),
        onToken: (token: string) =>
          Ref.update(events, (values) => [...values, token]),
        onFinal: (completion: string) =>
          Ref.update(events, (values) => [...values, completion]),
      };
      const chunks = yield* Stream.runCollect(
        toUIMessageStream(
          Stream.make({ delta: ' a' }, { delta: 'b' }),
          callbacks,
        ),
      );
      expect(chunks).toEqual([
        { type: 'text-start', id: '1' },
        { type: 'text-delta', id: '1', delta: 'a' },
        { type: 'text-delta', id: '1', delta: 'b' },
        { type: 'text-end', id: '1' },
      ]);
      expect(yield* Ref.get(events)).toEqual(['start', 'a', 'b', 'ab']);
    }),
  );
});

describe('Valibot adapter', () => {
  it.effect(
    'preserves validation and maps an invalid input to a tagged error',
    () =>
      Effect.gen(function* () {
        const schema = yield* valibotSchema(v.object({ id: v.number() }));
        expect(yield* schema.validate({ id: 42 })).toEqual({ id: 42 });
        expect((yield* schema.jsonSchema).type).toBe('object');
        const failure = yield* Effect.flip(schema.validate({ id: '42' }));
        expect(failure._tag).toBe('AiSdkError');
        expect(failure.operation).toBe('Valibot.validate');
      }),
  );
});
