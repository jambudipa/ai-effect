import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import type { Experimental_DecisionModelV4CallOptions } from '../src/protocols/provider.js';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '../src/protocols/provider-utils.js';
import { Experimental_DecisionLanguageModel } from '../src/protocols/provider-utils/experimental-decision.js';
import {
  DecisionLanguageModel,
  Experimental_EvaluationLanguageModel,
} from '../src/protocols/provider-utils/experimental-evaluation.js';
import { Experimental_ExtractionLanguageModel } from '../src/protocols/provider-utils/experimental-extraction.js';
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

      expect(DecisionLanguageModel).toBe(Experimental_EvaluationLanguageModel);
      for (const make of [
        Experimental_DecisionLanguageModel,
        Experimental_EvaluationLanguageModel,
      ]) {
        const original = yield* make({ model, provider: 'decision.fixture' });
        const data = yield* make[WORKFLOW_SERIALIZE](original);
        expect(data).toEqual({ model, provider: 'decision.fixture' });
        expect(data.model).toBe(model);
        const restored = yield* make[WORKFLOW_DESERIALIZE](data);
        expect((yield* restored.doDecide(options)).answers.verdict).toEqual(
          verdict,
        );
      }
    }),
);

it.effect('retains extraction limits and the wrapped language model', () =>
  Effect.gen(function* () {
    const model = yield* MockLanguageModelV4();
    const make = Experimental_ExtractionLanguageModel;
    const original = yield* make({ model, provider: 'extract.fixture' });
    const data = yield* make[WORKFLOW_SERIALIZE](original);
    expect(data.model).toBe(model);
    expect(data.maxFieldsPerCall).toBe(Infinity);

    const restored = yield* make[WORKFLOW_DESERIALIZE]({
      ...data,
      maxFieldsPerCall: 5,
    });
    const saved = yield* make[WORKFLOW_SERIALIZE](restored);
    expect(saved).toEqual({ ...data, maxFieldsPerCall: 5 });
    expect(saved.model).toBe(model);
  }),
);
