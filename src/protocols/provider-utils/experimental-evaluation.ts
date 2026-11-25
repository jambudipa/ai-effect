import { Experimental_EvaluationLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-evaluation';
import { withLanguageModel } from '../../internal/derived-language-model.js';
import type { LanguageModelV4 } from '../../internal/language-model.js';
import { wrapEvaluationModel } from '../../internal/provider-model.js';

export type Experimental_EvaluationLanguageModel = ReturnType<
  typeof wrapEvaluationModel
>;

export const Experimental_EvaluationLanguageModel = (options: {
  readonly model: LanguageModelV4;
  readonly provider?: string;
}) =>
  withLanguageModel(
    'Experimental_EvaluationLanguageModel',
    options.model,
    (model) => wrapEvaluationModel(new NativeModel({ ...options, model })),
  );

export { Experimental_EvaluationLanguageModel as DecisionLanguageModel };
