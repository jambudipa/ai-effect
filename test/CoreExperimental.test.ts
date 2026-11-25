import { describe, expect, it } from '@effect/vitest';
import { Effect, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import {
  experimental_decide,
  experimental_getBatchStatus,
  experimental_startBatch,
  experimental_streamSpeech,
} from '../src/core-experimental.js';
import {
  wrapDecisionModel,
  wrapSpeechModel,
} from '../src/internal/provider-model.js';
import { wrapBatch } from '../src/internal/provider-resource.js';

describe('experimental Core adapters', () => {
  it.effect('keeps decision criteria in the result type', () =>
    Effect.gen(function* () {
      const model = wrapDecisionModel({
        specificationVersion: 'v4',
        provider: 'fixture',
        modelId: 'decision',
        supportedQuestionTypes: ['choice'],
        doDecide: (options) => {
          expect(options.abortSignal).toBeInstanceOf(AbortSignal);
          return Effect.runPromise(
            Effect.succeed({
              answers: { verdict: { type: 'choice', choice: 'alpha' } },
              warnings: [],
            }),
          );
        },
      });

      const result = yield* experimental_decide({
        model,
        state: 'Fixture state',
        questions: {
          verdict: {
            type: 'choice',
            criteria: { alpha: 'First choice', beta: 'Second choice' },
          },
        },
      });
      expectTypeOf(result.answers.verdict.choice).toEqualTypeOf<
        'alpha' | 'beta'
      >();
      expect(result.answers.verdict.choice).toBe('alpha');
    }),
  );

  it.effect('passes batch operations through a private provider handle', () =>
    Effect.gen(function* () {
      const batch = wrapBatch<{ text: 'batch-model' }>({
        specificationVersion: 'v4',
        provider: 'fixture',
        supportedUrls: {},
        doStartBatch: (options) => {
          expect(options.requests[0]?.modelId).toBe('batch-model');
          return Effect.runPromise(
            Effect.succeed({
              batchId: 'batch-fixture',
              status: 'pending',
              warnings: [],
            }),
          );
        },
        doGetBatchStatus: (options) => {
          expect(options.batchId).toBe('batch-fixture');
          return Effect.runPromise(Effect.succeed({ status: 'completed' }));
        },
        doGetBatchResults: () =>
          Effect.runPromise(
            Effect.succeed(
              new ReadableStream({
                start(controller) {
                  controller.close();
                },
              }),
            ),
          ),
      });

      const start = yield* experimental_startBatch({
        provider: batch,
        requests: [
          {
            type: 'text',
            id: 'request',
            model: 'batch-model',
            prompt: 'Fixture prompt',
          },
        ],
      });
      expect(start.status).toBe('pending');

      const status = yield* experimental_getBatchStatus({
        provider: batch,
        batch: { version: 2, id: 'batch-fixture', provider: 'fixture' },
      });
      expect(status.status).toBe('completed');
    }),
  );

  it.effect('interrupts a speech stream when its scope closes', () =>
    Effect.gen(function* () {
      let callerSignal: AbortSignal | undefined;
      const model = wrapSpeechModel({
        specificationVersion: 'v4',
        provider: 'fixture',
        modelId: 'speech',
        doGenerate: () =>
          Effect.runPromise(Effect.die('Unexpected full speech request.')),
        doStream: (options) => {
          callerSignal = options.abortSignal;
          return Effect.runPromise(
            Effect.succeed({
              stream: new ReadableStream({
                start(controller) {
                  controller.enqueue({
                    type: 'audio',
                    audio: new Uint8Array([1, 2]),
                    audioFormat: { type: 'pcm', rate: 16000 },
                  });
                },
              }),
            }),
          );
        },
      });

      const audio = yield* Effect.scoped(
        Effect.gen(function* () {
          const result = yield* experimental_streamSpeech({
            model,
            text: 'Fixture text',
          });
          return yield* Stream.runCollect(Stream.take(result.audioStream, 1));
        }),
      );
      expect(audio).toEqual([new Uint8Array([1, 2])]);
      expect(callerSignal?.aborted).toBe(true);
    }),
  );
});
