import { expect, it } from '@effect/vitest';
import { Effect, Option } from 'effect';
import { vi } from 'vitest';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '../src/protocols/provider-utils.js';
import { FireworksImageModel } from '../src/providers/fireworks.js';

it.effect('revives the Fireworks model from native Workflow data', () =>
  Effect.gen(function* () {
    const modelId = 'accounts/fireworks/models/flux-1-dev-fp8';
    const baseURL = 'https://workflow-fixture.invalid';
    const provider = 'fireworks.fixture';
    const headers = vi.fn(() => ({ 'x-fixture': 'retained' }));
    const config = { provider, baseURL, headers, pollTimeoutMillis: 1000 };
    const original = yield* FireworksImageModel(modelId, config);

    const serialize = FireworksImageModel[WORKFLOW_SERIALIZE](original);
    expect(headers).toHaveBeenCalledTimes(0);
    const data = yield* serialize;
    expect(headers).toHaveBeenCalledTimes(1);
    expect(data).toEqual({
      modelId,
      config: { ...config, headers: { 'x-fixture': 'retained' } },
    });
    const carrier = original.constructor as typeof original.constructor & {
      [WORKFLOW_SERIALIZE](model: typeof original): typeof data;
      [WORKFLOW_DESERIALIZE](
        input: Parameters<
          (typeof FireworksImageModel)[typeof WORKFLOW_DESERIALIZE]
        >[0],
      ): typeof original;
    };
    expect(Object.keys(original)).not.toContain('constructor');
    expect(carrier[WORKFLOW_SERIALIZE]).toBeTypeOf('function');
    expect(carrier[WORKFLOW_DESERIALIZE]).toBeTypeOf('function');
    expect(carrier[WORKFLOW_SERIALIZE](original)).toEqual(data);
    expect(headers).toHaveBeenCalledTimes(2);
    const hostRestored = carrier[WORKFLOW_DESERIALIZE]({
      modelId: data.modelId,
      config: { ...data.config, baseURL, provider },
    });
    expect(hostRestored.constructor).toBe(carrier);
    expect(Effect.isEffect(hostRestored.maxImagesPerCall)).toBe(true);

    let configReads = 0;
    const saved = FireworksImageModel[WORKFLOW_DESERIALIZE]({
      modelId: data.modelId,
      get config() {
        configReads += 1;
        return { ...data.config, baseURL, provider };
      },
    });
    expect(configReads).toBe(0);
    const restored = yield* saved;
    expect(configReads).toBe(1);
    expect(restored).not.toBe(original);
    expect(yield* restored.maxImagesPerCall).toBe(1);

    const image = Uint8Array.of(7, 8, 9);
    const fetch = vi.fn<typeof globalThis.fetch>(() =>
      Effect.runPromise(
        Effect.sync(
          () =>
            new Response(image, { headers: { 'content-type': 'image/jpeg' } }),
        ),
      ),
    );
    yield* Effect.acquireRelease(
      Effect.sync(() => vi.stubGlobal('fetch', fetch)),
      () => Effect.sync(() => void vi.unstubAllGlobals()),
    );
    const absent = Option.getOrUndefined(Option.none<never>());
    const result = yield* restored.doGenerate({
      prompt: 'offline fixture',
      n: 1,
      size: absent,
      aspectRatio: absent,
      seed: absent,
      files: absent,
      mask: absent,
      providerOptions: {},
    });
    expect(result.images).toEqual([image]);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      `${baseURL}/workflows/${modelId}/text_to_image`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-fixture': 'retained' }),
      }),
    );

    const invalid = yield* Effect.flip(
      FireworksImageModel[WORKFLOW_SERIALIZE]({ ...original }),
    );
    expect(invalid._tag).toBe('AiSdkError');
  }),
);
