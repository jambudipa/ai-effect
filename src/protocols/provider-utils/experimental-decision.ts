import { Experimental_DecisionLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-decision';
import {
  unwrapDecisionModel,
  wrapEvaluationModel,
} from '../../internal/provider-model.js';
import { adaptWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';
import type { WrappedWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';

/** Effect model for decision requests through the native workflow-capable model. */
export type Experimental_DecisionLanguageModel = ReturnType<
  typeof wrapEvaluationModel
>;

/**
 * Construct the native decision model lazily and expose its workflow serialization hooks.
 */
export const Experimental_DecisionLanguageModel: WrappedWorkflowLanguageConstructor<
  typeof NativeModel,
  Experimental_DecisionLanguageModel
> = adaptWorkflowLanguageConstructor(
  'Experimental_DecisionLanguageModel',
  NativeModel,
  wrapEvaluationModel,
  unwrapDecisionModel,
);
