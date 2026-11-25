import { Experimental_DecisionLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-decision';
import { withLanguageModel } from '../../internal/derived-language-model.js';
import type { LanguageModelV4 } from '../../internal/language-model.js';
import { wrapEvaluationModel } from '../../internal/provider-model.js';

export type Experimental_DecisionLanguageModel = ReturnType<
  typeof wrapEvaluationModel
>;

export const Experimental_DecisionLanguageModel = (options: {
  readonly model: LanguageModelV4;
  readonly provider?: string;
}) =>
  withLanguageModel(
    'Experimental_DecisionLanguageModel',
    options.model,
    (model) => wrapEvaluationModel(new NativeModel({ ...options, model })),
  );
