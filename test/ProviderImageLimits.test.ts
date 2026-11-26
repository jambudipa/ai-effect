import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import type { ImageModel } from '../src/core-models.js';
import { unwrapImageModel } from '../src/internal/provider-model.js';
import { ByteDanceImageModel, byteDance } from '../src/providers/bytedance.js';
import { FireworksImageModel, fireworks } from '../src/providers/fireworks.js';

it.effect('reads the ByteDance and Fireworks class limits as Effects', () =>
  Effect.gen(function* () {
    const config = {
      provider: 'fixture',
      baseURL: 'https://example.invalid',
      headers: {},
    };
    const danceId = 'seedream-4-5-251128';
    const fireworksId = 'accounts/fireworks/models/flux-1-dev-fp8';
    const dance = yield* ByteDanceImageModel(danceId, config);
    const fire = yield* FireworksImageModel(fireworksId, config);
    expectTypeOf(dance).toExtend<ImageModel>();
    expectTypeOf(fire).toExtend<ImageModel>();
    expectTypeOf<
      Effect.Success<typeof dance.maxImagesPerCall>
    >().toEqualTypeOf<number>();
    expectTypeOf<
      Effect.Success<typeof fire.maxImagesPerCall>
    >().toEqualTypeOf<1>();

    expect(yield* dance.maxImagesPerCall).toBe(1);
    expect(yield* fire.maxImagesPerCall).toBe(1);
    expect(unwrapImageModel(dance)?.modelId).toBe(danceId);
    expect(unwrapImageModel(fire)?.modelId).toBe(fireworksId);

    const selectedDance = yield* byteDance.image(danceId);
    const selectedFire = yield* fireworks.image(fireworksId);
    expect(yield* selectedDance.maxImagesPerCall({ modelId: danceId })).toBe(1);
    expect(yield* selectedFire.maxImagesPerCall({ modelId: fireworksId })).toBe(
      1,
    );
  }),
);
