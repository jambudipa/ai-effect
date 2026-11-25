import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { describe, expect, it } from '@effect/vitest';
import type { TextStreamPart } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import { Context, Effect, Option, Stream } from 'effect';
import {
  callCompletionApi,
  experimental_streamLanguageModelCall,
  experimental_streamTextLowMemory,
  smoothStream,
} from '../src/core.js';
import { wrapLanguageModel } from '../src/internal/language-model.js';

class FixtureValue extends Context.Service<FixtureValue, string>()(
  '@jambudipa/ai-effect/test/FixtureValue',
) {}

const mockModel = () =>
  new MockLanguageModelV4({
    doStream: {
      stream: new ReadableStream<LanguageModelV4StreamPart>({
        start(controller) {
          controller.enqueue({ type: 'text-start', id: 'test' });
          controller.enqueue({
            type: 'text-delta',
            id: 'test',
            delta: 'hello',
          });
          controller.enqueue({ type: 'text-end', id: 'test' });
          controller.enqueue({
            type: 'finish',
            finishReason: { unified: 'stop', raw: void 0 },
            usage: {
              inputTokens: {
                total: 1,
                noCache: 1,
                cacheRead: 0,
                cacheWrite: 0,
              },
              outputTokens: { total: 1, text: 1, reasoning: 0 },
            },
          });
          controller.close();
        },
      }),
    },
  });

describe('Core stream operations', () => {
  it.effect(
    'updates completion host state and awaits the Effect completion callback',
    () =>
      Effect.gen(function* () {
        let text = '';
        let loading = false;
        let callback = '';
        let sent = false;
        const result = callCompletionApi({
          api: 'https://example.test/complete',
          prompt: 'hello',
          streamProtocol: 'text',
          fetch: () =>
            Effect.runPromise(
              Effect.sync(() => {
                sent = true;
                return new Response('hello!');
              }),
            ),
          setCompletion: (value) => {
            text = value;
          },
          setLoading: (value) => {
            loading = value;
          },
          setError: () => {},
          setAbortController: () => {},
          onFinish: (prompt, completion) =>
            Effect.gen(function* () {
              const prefix = yield* FixtureValue;
              expect(loading).toBe(true);
              callback = `${prefix} ${prompt} ${completion}`;
            }),
        });
        expect(sent).toBe(false);
        expect(yield* result).toEqual(Option.some('hello!'));
        expect(callback).toBe('fixture hello hello!');
        expect(text).toBe('hello!');
        expect(loading).toBe(false);
      }).pipe(Effect.provideService(FixtureValue, 'fixture')),
  );

  it.effect('splits text into words and uses the Effect delay service', () =>
    Effect.gen(function* () {
      let calls = 0;
      const transform = yield* smoothStream({
        chunking: 'word',
        delayInMs: 0,
        _internal: {
          delay: (milliseconds) =>
            Effect.gen(function* () {
              expect(yield* FixtureValue).toBe('timer');
              expect(milliseconds).toBe(0);
              calls++;
            }),
        },
      });
      const parts: TextStreamPart<{}>[] = [
        { type: 'text-start', id: 'test' },
        { type: 'text-delta', id: 'test', text: 'first second ' },
        { type: 'text-end', id: 'test' },
      ];
      const source = Stream.fromIterable(parts);
      const output = yield* Stream.runCollect(transform.apply(source));
      expect(output).toEqual([
        { type: 'text-start', id: 'test' },
        { type: 'text-delta', id: 'test', text: 'first ' },
        { type: 'text-delta', id: 'test', text: 'second ' },
        { type: 'text-end', id: 'test' },
      ]);
      expect(calls).toBe(2);
    }).pipe(Effect.provideService(FixtureValue, 'timer')),
  );

  it.effect('streams one model call and runs its Effect observers', () =>
    Effect.gen(function* () {
      let began = false;
      const call = experimental_streamLanguageModelCall({
        model: wrapLanguageModel(mockModel()),
        prompt: 'hello',
        onStart: ({ promptMessages }) =>
          Effect.gen(function* () {
            expect(yield* FixtureValue).toBe('model');
            expect(promptMessages.map((part) => part.role)).toContain('user');
            began = true;
          }),
      });
      expect(began).toBe(false);
      const response = yield* call;
      const events = yield* Stream.runCollect(response.stream);
      expect(began).toBe(true);
      expect(events).toContainEqual({
        type: 'text-delta',
        id: 'test',
        text: 'hello',
      });
      expect(events.some((part) => part.type === 'model-call-end')).toBe(true);
    }).pipe(Effect.provideService(FixtureValue, 'model')),
  );

  it.effect('preserves the low-memory result and its terminal metadata', () =>
    Effect.gen(function* () {
      const transform = yield* smoothStream({ delayInMs: 0 });
      const result = yield* experimental_streamTextLowMemory({
        model: wrapLanguageModel(mockModel()),
        prompt: 'hello',
        experimental_transform: transform,
      });
      expect('text' in result).toBe(false);
      expect(yield* Stream.runCollect(result.textStream)).toEqual(['hello']);
      expect(yield* result.finishReason).toBe('stop');
    }),
  );
});
