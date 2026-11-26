import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { expect, it } from '@effect/vitest';
import { MockLanguageModelV4 } from 'ai/test';
import { Context, Effect, type Scope, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import { streamText } from '../src/core.js';
import { wrapLanguageModel } from '../src/internal/language-model.js';
import { openai } from '../src/providers/openai.js';

class SearchContext extends Context.Service<SearchContext, string>()(
  '@jambudipa/ai-effect/tests/ProviderSearchContext',
) {}

it.effect('streams client tool search results through local generation', () =>
  Effect.gen(function* () {
    const search = yield* openai.tools.toolSearch({
      execution: 'client',
      execute: (input) =>
        Stream.make('first', 'last').pipe(
          Stream.mapEffect((name) =>
            Effect.map(SearchContext, (prefix) => {
              expect(input.call_id).toBe('fixture-call');
              return { tools: [{ name: prefix + name }] };
            }),
          ),
        ),
    });
    expectTypeOf<
      ReturnType<NonNullable<typeof search.execute>>
    >().toEqualTypeOf<
      Stream.Stream<{ tools: { name: string }[] }, never, SearchContext>
    >();

    const model = wrapLanguageModel(
      new MockLanguageModelV4({
        doStream: {
          stream: new ReadableStream<LanguageModelV4StreamPart>({
            start(controller) {
              controller.enqueue({ type: 'stream-start', warnings: [] });
              controller.enqueue({
                type: 'tool-call',
                toolName: 'search',
                toolCallId: 'fixture-call',
                input: '{"call_id":"fixture-call"}',
              });
              controller.enqueue({
                type: 'finish',
                finishReason: { unified: 'tool-calls', raw: void 0 },
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
      }),
    );
    const generation = streamText({
      model,
      prompt: 'Find the fixture tools',
      tools: { search },
    });
    expectTypeOf<Effect.Services<typeof generation>>().toEqualTypeOf<
      SearchContext | Scope.Scope
    >();
    const result = yield* Effect.provideService(
      generation,
      SearchContext,
      'fixture-',
    );
    const parts = yield* Stream.runCollect(result.fullStream);
    expect(
      parts
        .filter((part) => part.type === 'tool-result')
        .map(({ output, preliminary }) => ({ output, preliminary })),
    ).toEqual([
      { output: { tools: [{ name: 'fixture-first' }] }, preliminary: true },
      { output: { tools: [{ name: 'fixture-last' }] }, preliminary: true },
      { output: { tools: [{ name: 'fixture-last' }] }, preliminary: void 0 },
    ]);
  }),
);
