import { Experimental_EvaluationLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-evaluation';
import {
  unwrapDecisionModel,
  wrapEvaluationModel,
} from '../../internal/provider-model.js';
import { adaptWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';
import type { WrappedWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';

/** Effect model for evaluation requests through the native workflow-capable model. */
export type Experimental_EvaluationLanguageModel = ReturnType<
  typeof wrapEvaluationModel
>;

/**
 * Construct the native evaluation model lazily and expose its workflow serialization
 * hooks.
 */
export const Experimental_EvaluationLanguageModel: WrappedWorkflowLanguageConstructor<
  typeof NativeModel,
  Experimental_EvaluationLanguageModel
> = adaptWorkflowLanguageConstructor(
  'Experimental_EvaluationLanguageModel',
  NativeModel,
  wrapEvaluationModel,
  unwrapDecisionModel,
);

export { Experimental_EvaluationLanguageModel as DecisionLanguageModel };
