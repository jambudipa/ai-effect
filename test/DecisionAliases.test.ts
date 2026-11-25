import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import type { Experimental_DecisionModelV4CallOptions } from '../src/protocols/provider.js';
import { Experimental_DecisionLanguageModel } from '../src/protocols/provider-utils/experimental-decision.js';
import {
  Experimental_DecisionMockModelV4,
  MockLanguageModelV4,
} from '../src/testing.js';

const options: Experimental_DecisionModelV4CallOptions = {
  state: [{ type: 'text', text: 'Fixture state' }],
  questions: {
    verdict: { type: 'choice', criteria: { alpha: 'First choice' } },
  },
};

const verdict = { type: 'choice' as const, choice: 'alpha' };

it.effect('calls the decision mock through its Effect evaluation alias', () =>
  Effect.gen(function* () {
    let calls = 0;
    const model = yield* Experimental_DecisionMockModelV4({
      doEvaluate: ({ abortSignal }) =>
        Effect.sync(() => {
          expect(abortSignal).toBeInstanceOf(AbortSignal);
          calls++;
          return { answers: { verdict }, warnings: [] };
        }),
    });
    const evaluate = model.doEvaluate(options);
    expect(calls).toBe(0);
    expect((yield* evaluate).answers.verdict).toEqual(verdict);
    expect(calls).toBe(1);
  }),
);

it.effect(
  'evaluates structured output through the decision language model alias',
  () =>
    Effect.gen(function* () {
      const model = yield* MockLanguageModelV4({
        doGenerate: {
          content: [{ type: 'text', text: '{"q0":"c0"}' }],
          finishReason: { unified: 'stop', raw: void 0 },
          usage: {
            inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 1, text: 1, reasoning: 0 },
          },
          warnings: [],
        },
      });
      const decision = yield* Experimental_DecisionLanguageModel({ model });
      const evaluate = decision.doEvaluate(options);
      expect(model.doGenerateCalls).toHaveLength(0);
      expect((yield* evaluate).answers.verdict).toEqual(verdict);
      expect(model.doGenerateCalls).toHaveLength(1);
    }),
);
