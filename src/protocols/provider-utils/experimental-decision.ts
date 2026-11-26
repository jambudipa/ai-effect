import { Experimental_DecisionLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-decision';
import {
  unwrapDecisionModel,
  wrapEvaluationModel,
} from '../../internal/provider-model.js';
import { adaptWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';
import type { WrappedWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';

export type Experimental_DecisionLanguageModel = ReturnType<
  typeof wrapEvaluationModel
>;

export const Experimental_DecisionLanguageModel: WrappedWorkflowLanguageConstructor<
  typeof NativeModel,
  Experimental_DecisionLanguageModel
> = adaptWorkflowLanguageConstructor(
  'Experimental_DecisionLanguageModel',
  NativeModel,
  wrapEvaluationModel,
  unwrapDecisionModel,
);
