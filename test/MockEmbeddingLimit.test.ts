import { expect, it } from '@effect/vitest';
import { Context, Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import { EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL as inputByteLimit } from '../src/protocols/provider-utils.js';
import { MockEmbeddingModelV4 } from '../src/testing.js';

class EmbeddingLimit extends Context.Service<EmbeddingLimit, number>()(
  '@jambudipa/ai-effect/tests/MockEmbeddingLimit',
) {}

it.effect(
  'exposes the configured mock embedding byte limit on its symbol',
  () =>
    Effect.gen(function* () {
      const missing = yield* MockEmbeddingModelV4();
      const fixed = yield* MockEmbeddingModelV4({ maxInputBytesPerCall: 16 });
      const provided = yield* MockEmbeddingModelV4({
        maxInputBytesPerCall: EmbeddingLimit,
      }).pipe(Effect.provideService(EmbeddingLimit, 32));

      expect(yield* missing[inputByteLimit]).toBeUndefined();
      expect(yield* fixed[inputByteLimit]).toBe(16);
      expectTypeOf<
        Effect.Success<(typeof provided)[typeof inputByteLimit]>
      >().toEqualTypeOf<number | undefined>();
      expect(yield* provided[inputByteLimit]).toBe(32);
    }),
);
