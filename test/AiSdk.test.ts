import { describe, expect, it } from '@effect/vitest';
import { jsonSchema, Output, simulateReadableStream } from 'ai';
import { MockEmbeddingModelV4, MockLanguageModelV4 } from 'ai/test';
import { Deferred, Effect, Fiber, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import { AiSdk, AiSdkError, AiSdkStreamAborted } from '../src/index.js';

const usage = {
  inputTokens: {
    total: 3,
    noCache: 3,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: 2, text: 2, reasoning: undefined },
};

const finishReason = { unified: 'stop', raw: undefined } as const;

describe('AiSdk', () => {
  it.effect('generates typed structured output on demand', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const model = new MockLanguageModelV4({
        doGenerate: {
          content: [{ type: 'text', text: '{"answer":42}' }],
          finishReason,
          usage,
          warnings: [],
        },
      });
      const request = ai.generateText({
        model,
        prompt: 'Give an answer.',
        output: Output.object({
          schema: jsonSchema<{ answer: number }>({
            type: 'object',
            properties: { answer: { type: 'number' } },
            required: ['answer'],
          }),
        }),
      });

      expect(model.doGenerateCalls).toHaveLength(0);
      const result = yield* request;
      expectTypeOf(result.output).toEqualTypeOf<{ answer: number }>();
      expect(result.output.answer).toBe(42);
      expect(model.doGenerateCalls).toHaveLength(1);
    }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect('retains the operation and cause when a request fails', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const cause = new TypeError('provider rejected the request');
      const model = new MockLanguageModelV4({
        doGenerate: () => Promise.reject(cause),
      });

      const error = yield* Effect.flip(
        ai.generateText({ model, prompt: 'Hello.', maxRetries: 0 }),
      );

      expect(error).toBeInstanceOf(AiSdkError);
      expect(error.operation).toBe('generateText');
      expect(error.cause).toBe(cause);
    }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect('aborts the model request when its fiber is interrupted', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const started = yield* Deferred.make<AbortSignal>();
      const model = new MockLanguageModelV4({
        doGenerate: ({ abortSignal }) => {
          const signal = abortSignal ?? AbortSignal.abort();
          Effect.runSync(Deferred.succeed(started, signal));
          return new Promise((_, reject) => {
            signal.addEventListener('abort', () => reject(signal.reason), {
              once: true,
            });
          });
        },
      });

      const fiber = yield* Effect.forkChild(
        ai.generateText({ model, prompt: 'Hello.', maxRetries: 0 }),
      );
      const signal = yield* Deferred.await(started);
      expect(signal.aborted).toBe(false);

      yield* Fiber.interrupt(fiber);
      expect(signal.aborted).toBe(true);
    }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect('starts a new request for each stream consumption', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const model = new MockLanguageModelV4({
        doStream: () =>
          Promise.resolve({
            stream: simulateReadableStream({
              chunks: [
                { type: 'text-start', id: 'text-1' },
                { type: 'text-delta', id: 'text-1', delta: 'Hello' },
                { type: 'text-end', id: 'text-1' },
                { type: 'finish', finishReason, usage },
              ],
            }),
          }),
      });
      const events = ai.streamText({ model, prompt: 'Hello.' });
      expect(model.doStreamCalls).toHaveLength(0);

      const first = yield* Stream.runCollect(events);
      const second = yield* Stream.runCollect(events);
      expect(first.find((event) => event.type === 'text-delta')?.text).toBe(
        'Hello',
      );
      expect(second.some((event) => event.type === 'finish')).toBe(true);
      expect(model.doStreamCalls).toHaveLength(2);
      expect(model.doStreamCalls[0]?.abortSignal?.aborted).toBe(false);
    }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect('fails the stream when the SDK emits an error part', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const cause = new TypeError('stream failed');
      const model = new MockLanguageModelV4({
        doStream: {
          stream: simulateReadableStream({
            chunks: [{ type: 'error', error: cause }],
          }),
        },
      });

      const error = yield* Effect.flip(
        Stream.runDrain(
          ai.streamText({ model, prompt: 'Hello.', maxRetries: 0 }),
        ),
      );

      expect(error).toBeInstanceOf(AiSdkError);
      if (error._tag === 'AiSdkError') {
        expect(error.operation).toBe('streamText');
        expect(error.cause).toBe(cause);
      }
    }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect(
    'aborts a still-open stream when the consumer takes one delta',
    () =>
      Effect.gen(function* () {
        const ai = yield* AiSdk;
        const model = new MockLanguageModelV4({
          doStream: {
            stream: new ReadableStream({
              start(controller) {
                controller.enqueue({ type: 'text-start', id: 'text-1' });
                controller.enqueue({
                  type: 'text-delta',
                  id: 'text-1',
                  delta: 'Hi',
                });
              },
            }),
          },
        });

        const text = yield* ai.streamText({ model, prompt: 'Hello.' }).pipe(
          Stream.filter((part) => part.type === 'text-delta'),
          Stream.map((part) => part.text),
          Stream.take(1),
          Stream.runCollect,
        );

        expect(text).toEqual(['Hi']);
        expect(model.doStreamCalls[0]?.abortSignal?.aborted).toBe(true);
      }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect('keeps caller cancellation active during a stream', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const caller = new AbortController();
      const started = yield* Deferred.make<void>();
      const model = new MockLanguageModelV4({
        doStream: () => {
          Effect.runSync(Deferred.succeed(started, void 0));
          return Promise.resolve({ stream: new ReadableStream() });
        },
      });
      const fiber = yield* Effect.forkChild(
        ai
          .streamText({
            model,
            prompt: 'Hello.',
            abortSignal: caller.signal,
          })
          .pipe(Stream.runDrain, Effect.flip),
      );
      yield* Deferred.await(started);
      caller.abort('caller cancelled');

      const error = yield* Fiber.join(fiber);
      expect(error).toBeInstanceOf(AiSdkStreamAborted);
      if (error._tag === 'AiSdkStreamAborted') {
        expect(error.reason).toBe('caller cancelled');
      }
      expect(model.doStreamCalls[0]?.abortSignal?.aborted).toBe(true);
    }).pipe(Effect.provide(AiSdk.layer)),
  );

  it.effect('preserves embedding order and SDK usage data', () =>
    Effect.gen(function* () {
      const ai = yield* AiSdk;
      const model = new MockEmbeddingModelV4({
        doEmbed: [
          { embeddings: [[1, 2]], usage: { tokens: 2 }, warnings: [] },
          { embeddings: [[3, 4]], usage: { tokens: 3 }, warnings: [] },
        ],
      });

      const result = yield* ai.embedMany({
        model,
        values: ['first', 'second'],
      });
      expect(result.embeddings).toEqual([
        [1, 2],
        [3, 4],
      ]);
      expect(result.usage).toEqual({ tokens: 5 });
    }).pipe(Effect.provide(AiSdk.layer)),
  );
});
