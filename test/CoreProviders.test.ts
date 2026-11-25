import { describe, expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import {
  createProviderRegistry,
  customProvider,
  experimental_createProviderRegistry,
  wrapProvider,
} from '../src/core-providers.js';
import { wrapSpeechModel } from '../src/internal/provider-model.js';
import { cerebras } from '../src/providers/cerebras.js';

const voice = wrapSpeechModel({
  specificationVersion: 'v4',
  provider: 'fixture',
  modelId: 'voice',
  doGenerate: () => Effect.runPromise(Effect.die('Unexpected generation.')),
});

describe('Core provider adapters', () => {
  it.effect('keeps custom IDs and the registry separator', () =>
    Effect.gen(function* () {
      const provider = yield* customProvider({ speechModels: { voice } });
      expectTypeOf<
        Parameters<typeof provider.speechModel>[0]
      >().toEqualTypeOf<'voice'>();

      const registryEffect = createProviderRegistry(
        { fixture: provider },
        { separator: '/' },
      );
      expectTypeOf<
        Effect.Services<typeof registryEffect>
      >().toEqualTypeOf<never>();
      const registry = yield* registryEffect;
      expectTypeOf<
        Parameters<typeof registry.speechModel>[0]
      >().toEqualTypeOf<`fixture/${string}`>();
      const model = yield* registry.speechModel('fixture/voice');
      expect(model.modelId).toBe(voice.modelId);
      expect(model.provider).toBe(voice.provider);
    }),
  );

  it.effect(
    'retains provider identity through middleware and the registry alias',
    () =>
      Effect.gen(function* () {
        const base = yield* customProvider({ speechModels: { voice } });
        const provider = yield* wrapProvider({
          provider: base,
          languageModelMiddleware: { specificationVersion: 'v4' },
        });
        const registry = yield* experimental_createProviderRegistry({
          fixture: provider,
          cerebras,
        });
        expect((yield* registry.speechModel('fixture:voice')).modelId).toBe(
          voice.modelId,
        );
        const chat = yield* registry.languageModel('cerebras:gpt-oss-120b');
        expect(chat.modelId).toBe('gpt-oss-120b');
      }),
  );
});
