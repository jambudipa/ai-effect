import { describe, expect, it } from '@effect/vitest';
import type {
  LanguageModelV2 as NativeLanguageV2,
  LanguageModelV3 as NativeLanguageV3,
} from '@ai-sdk/provider';
import { Context, Effect, type Scope } from 'effect';
import { expectTypeOf } from 'vitest';
import {
  createProviderRegistry,
  customProvider,
  experimental_createProviderRegistry,
  wrapProvider,
} from '../src/core-providers.js';
import { wrapSpeechModel } from '../src/internal/provider-model.js';
import { wrapLegacyModel } from '../src/internal/legacy-model.js';
import { wrapFiles, wrapSkills } from '../src/internal/provider-resource.js';
import { cerebras } from '../src/providers/cerebras.js';
import type { ProviderV2, ProviderV3 } from '../src/protocols/provider.js';

const voice = wrapSpeechModel({
  specificationVersion: 'v4',
  provider: 'fixture',
  modelId: 'voice',
  doGenerate: () => Effect.runPromise(Effect.die('Unexpected generation.')),
});

class Tenant extends Context.Service<Tenant, string>()(
  '@jambudipa/ai-effect/tests/LegacyProviderTenant',
) {}

const unexpected = () => Effect.die('Unexpected model operation');
const noGeneration = () => Effect.runPromise(unexpected());

const choose = (id: string) =>
  Effect.gen(function* () {
    const tenant = yield* Tenant;
    yield* Effect.yieldNow;
    return {
      provider: 'fixture',
      modelId: `${tenant}/${id}`,
      supportedUrls: {},
      doGenerate: noGeneration,
      doStream: noGeneration,
    };
  });

describe('Core provider adapters', () => {
  it.effect(
    'omits unconfigured APIs and inherits configured fallback APIs',
    () =>
      Effect.gen(function* () {
        const empty = yield* customProvider({});
        expect(Object.hasOwn(empty, 'files')).toBe(false);
        expect(Object.hasOwn(empty, 'skills')).toBe(false);

        const files = wrapFiles({
          specificationVersion: 'v4',
          provider: 'fixture',
          uploadFile: noGeneration,
        });
        const skills = wrapSkills({
          specificationVersion: 'v4',
          provider: 'fixture',
          uploadSkill: noGeneration,
        });
        const configured = yield* customProvider({ files, skills });
        const fallback = yield* customProvider({
          fallbackProvider: configured,
        });
        expect((yield* configured.files()).provider).toBe('fixture');
        expect((yield* configured.skills()).provider).toBe('fixture');
        expect((yield* fallback.files()).provider).toBe('fixture');
        expect((yield* fallback.skills()).provider).toBe('fixture');
      }),
  );

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

  it.effect('wraps a direct V2 provider and registers its V4 facade', () =>
    Effect.gen(function* () {
      const legacy: ProviderV2<Tenant> = {
        languageModel: (id) =>
          Effect.map(choose(id), (model) =>
            wrapLegacyModel<NativeLanguageV2>({
              ...model,
              specificationVersion: 'v2',
            }),
          ),
        textEmbeddingModel: unexpected,
        imageModel: unexpected,
      };
      const wrap = wrapProvider({
        provider: legacy,
        languageModelMiddleware: {
          specificationVersion: 'v4',
          overrideModelId: ({ model }) => `wrapped/${model.modelId}`,
        },
      });
      expectTypeOf<Effect.Services<typeof wrap>>().toEqualTypeOf<
        Tenant | Scope.Scope
      >();
      const wrapped = yield* Effect.provideService(wrap, Tenant, 'tenant');
      const registry = yield* createProviderRegistry({
        legacy: { ...wrapped },
      });
      const model = yield* registry.languageModel('legacy:dialogue');
      expect(model.modelId).toBe('wrapped/tenant/dialogue');
      expect(model.specificationVersion).toBe('v4');
    }),
  );

  it.effect('selects from a direct V3 provider in a mixed registry', () =>
    Effect.gen(function* () {
      const legacy = {
        specificationVersion: 'v3',
        languageModel: (id: 'dialogue') =>
          Effect.map(choose(id), (model) =>
            wrapLegacyModel<NativeLanguageV3>({
              ...model,
              specificationVersion: 'v3',
            }),
          ),
        embeddingModel: unexpected,
        imageModel: unexpected,
      } satisfies ProviderV3<Tenant>;
      const plain = createProviderRegistry({ legacy });
      expectTypeOf<Effect.Services<typeof plain>>().toEqualTypeOf<
        Tenant | Scope.Scope
      >();
      const plainRegistry = yield* Effect.provideService(
        plain,
        Tenant,
        'plain',
      );
      expect(
        (yield* plainRegistry.languageModel('legacy:dialogue')).modelId,
      ).toBe('plain/dialogue');
      const create = createProviderRegistry(
        { legacy, cerebras },
        {
          separator: '/',
          languageModelMiddleware: {
            specificationVersion: 'v4',
            overrideModelId: ({ model }) => `registry/${model.modelId}`,
          },
        },
      );
      expectTypeOf<Effect.Services<typeof create>>().toEqualTypeOf<
        Tenant | Scope.Scope
      >();
      const registry = yield* Effect.provideService(create, Tenant, 'tenant');
      const old = yield* registry.languageModel('legacy/dialogue');
      expect(old.modelId).toBe('registry/tenant/dialogue');
      const current = yield* registry.languageModel('cerebras/gpt-oss-120b');
      expect(current.modelId).toBe('registry/gpt-oss-120b');
    }),
  );

  it.effect(
    'keeps local IDs and resolves a direct legacy fallback lazily',
    () =>
      Effect.gen(function* () {
        const fallback: ProviderV2<Tenant> = {
          languageModel: (id) =>
            Effect.map(choose(id), (model) =>
              wrapLegacyModel<NativeLanguageV2>({
                ...model,
                specificationVersion: 'v2',
              }),
            ),
          textEmbeddingModel: unexpected,
          imageModel: unexpected,
        };
        const local = yield* cerebras('gpt-oss-120b');
        const create = customProvider({
          languageModels: { local },
          fallbackProvider: fallback,
        });
        expectTypeOf<Effect.Services<typeof create>>().toEqualTypeOf<
          Tenant | Scope.Scope
        >();
        const custom = yield* Effect.provideService(create, Tenant, 'fallback');
        expectTypeOf<
          Parameters<typeof custom.languageModel>[0]
        >().toEqualTypeOf<'local'>();
        expect((yield* custom.languageModel('dialogue')).modelId).toBe(
          'fallback/dialogue',
        );
        expect(Object.hasOwn(custom, 'files')).toBe(false);
        expect(Object.hasOwn(custom, 'skills')).toBe(false);
        const registry = yield* createProviderRegistry({ custom });
        expect((yield* registry.languageModel('custom:local')).modelId).toBe(
          local.modelId,
        );
        expect((yield* registry.languageModel('custom:dialogue')).modelId).toBe(
          'fallback/dialogue',
        );
      }),
  );
});
