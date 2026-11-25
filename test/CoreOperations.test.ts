import { describe, expect, it } from '@effect/vitest';
import { Context, Deferred, Effect, Fiber, Ref, Schema, Stream } from 'effect';
import type { Scope } from 'effect/Scope';
import { expectTypeOf } from 'vitest';
import {
  SerialJobExecutor,
  defaultSettingsMiddleware,
  generateObject,
  generateText,
  registerTelemetry,
  stepCountIs,
  streamObject,
  streamText,
  wrapLanguageModel,
} from '../src/core.js';
import type {
  LanguageModelV4GenerateResult,
  LanguageModelV4StreamPart,
} from '../src/protocols/provider.js';
import {
  jsonSchema,
  parseJSON,
  safeParseJSON,
} from '../src/protocols/provider-utils.js';
import { MockLanguageModelV4 } from '../src/testing.js';

class Temperature extends Context.Service<Temperature, number>()(
  'CoreOperations/Temperature',
) {}

const result = (text: string): LanguageModelV4GenerateResult => ({
  content: [{ type: 'text', text }],
  finishReason: { unified: 'stop', raw: void 0 },
  usage: {
    inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
    outputTokens: { total: 1, text: 1, reasoning: 0 },
  },
  warnings: [],
});

describe('Core operations', () => {
  it.effect('runs model and generation callbacks in their Effect context', () =>
    Effect.gen(function* () {
      const base = yield* MockLanguageModelV4({
        doGenerate: result('wrapped'),
      });
      const model = yield* wrapLanguageModel({
        model: base,
        middleware: [
          defaultSettingsMiddleware({ settings: { maxOutputTokens: 16 } }),
          {
            specificationVersion: 'v4',
            transformParams: ({ params }) =>
              Temperature.pipe(
                Effect.map((temperature) => ({ ...params, temperature })),
              ),
            wrapGenerate: ({ doGenerate }) => doGenerate(),
          },
        ],
      });
      const starts = yield* Ref.make<readonly number[]>([]);
      yield* generateText({
        model,
        prompt: 'Fixture prompt',
        stopWhen: stepCountIs(1),
        onStart: ({ output }) =>
          Temperature.pipe(
            Effect.tap(() =>
              Effect.sync(() => expect(output?.name).toBeUndefined()),
            ),
            Effect.tap((value) =>
              Ref.update(starts, (seen) => [...seen, value]),
            ),
            Effect.asVoid,
          ),
      });
      expect(yield* Ref.get(starts)).toEqual([0.25]);
      expect(base.doGenerateCalls[0]?.temperature).toBe(0.25);
      expect(base.doGenerateCalls[0]?.maxOutputTokens).toBe(16);
    }).pipe(Effect.provideService(Temperature, 0.25)),
  );

  it.effect('preserves the structured object and its JSON response', () =>
    Effect.gen(function* () {
      const model = yield* MockLanguageModelV4({
        doGenerate: result('{"count":3}'),
      });
      const generated = yield* generateObject({
        model,
        prompt: 'Return an object',
        schema: Schema.Struct({ count: Schema.Number }),
      });
      const count: number = generated.object.count;
      expect(count).toBe(3);
      expect(
        (yield* generated.toJsonResponse()).headers.get('content-type'),
      ).toContain('application/json');
    }),
  );

  it.effect('preserves schema services in the JSON and object overloads', () =>
    Effect.gen(function* () {
      const schema = yield* jsonSchema<{ count: number }, Temperature>(
        {
          type: 'object',
          properties: { count: { type: 'number' } },
          required: ['count'],
        },
        {
          validate: () =>
            Temperature.pipe(
              Effect.map((count) => ({ success: true, value: { count } })),
            ),
        },
      );
      const model = yield* MockLanguageModelV4({
        doGenerate: result('{"count":1}'),
      });
      const parsed = parseJSON({ text: '{"count":1}', schema });
      const safe = safeParseJSON({ text: '{"count":1}', schema });
      const generated = generateObject({
        model,
        prompt: 'Return an object',
        schema,
      });
      const streamed = streamObject({
        model,
        prompt: 'Return an object',
        schema,
      });
      expectTypeOf<
        Effect.Services<typeof parsed>
      >().toEqualTypeOf<Temperature>();
      expectTypeOf<Effect.Services<typeof safe>>().toEqualTypeOf<Temperature>();
      expectTypeOf<
        Effect.Services<typeof generated>
      >().toEqualTypeOf<Temperature>();
      expectTypeOf<Effect.Services<typeof streamed>>().toEqualTypeOf<
        Temperature | Scope
      >();
      expect(yield* parsed).toEqual({ count: 4 });
      expect(yield* safe).toMatchObject({ success: true, value: { count: 4 } });
      expect((yield* generated).object).toEqual({ count: 4 });
    }).pipe(Effect.provideService(Temperature, 4)),
  );

  it.effect('streams through a transform that needs an Effect service', () =>
    Effect.gen(function* () {
      const metadata = result('unused');
      const model = yield* MockLanguageModelV4({
        doStream: {
          stream: new ReadableStream<LanguageModelV4StreamPart>({
            start(controller) {
              controller.enqueue({ type: 'text-start', id: 'stream' });
              controller.enqueue({
                type: 'text-delta',
                id: 'stream',
                delta: 'sample',
              });
              controller.enqueue({ type: 'text-end', id: 'stream' });
              controller.enqueue({
                type: 'finish',
                finishReason: metadata.finishReason,
                usage: metadata.usage,
              });
              controller.close();
            },
          }),
        },
      });
      const streamed = yield* streamText({
        model,
        prompt: 'Transform the result',
        experimental_transform: () => (source) =>
          Stream.mapEffect(source, (part) =>
            Temperature.pipe(
              Effect.map(() =>
                part.type === 'text-delta'
                  ? { ...part, text: `${part.text} A` }
                  : part,
              ),
            ),
          ),
      }).pipe(Effect.provideService(Temperature, 0.25));
      expect(yield* Stream.runCollect(streamed.textStream)).toEqual([
        'sample A',
      ]);
    }),
  );

  it.effect('removes the telemetry registration when its scope closes', () =>
    Effect.gen(function* () {
      let calls = 0;
      const model = yield* MockLanguageModelV4({
        doGenerate: result('telemetry'),
      });
      const request = generateText({ model, prompt: 'Test telemetry' });
      yield* Effect.scoped(
        Effect.gen(function* () {
          yield* registerTelemetry({
            onStart: () =>
              Effect.sync(() => {
                calls++;
              }),
          });
          yield* request;
        }),
      );
      yield* request;
      expect(calls).toBe(1);
    }),
  );

  it.effect('waits for queued jobs after an interrupted job', () =>
    Effect.gen(function* () {
      const queue = yield* SerialJobExecutor;
      const started = yield* Deferred.make<void>();
      const first = yield* queue
        .run(
          Deferred.succeed(started, void 0).pipe(Effect.andThen(Effect.never)),
        )
        .pipe(Effect.forkScoped);
      yield* Deferred.await(started);
      const second = yield* queue
        .run(Effect.succeed(7))
        .pipe(Effect.forkScoped);
      yield* Fiber.interrupt(first);
      yield* queue.waitForIdle();
      expect(yield* Fiber.join(second)).toBe(7);
    }),
  );
});
