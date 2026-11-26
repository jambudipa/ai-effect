import { Experimental_ExtractionLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-extraction';
import {
  unwrapExtractionModel,
  wrapExtractionModel,
} from '../../internal/provider-model.js';
import { adaptWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';
import type { WrappedWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';

export type Experimental_ExtractionLanguageModel = ReturnType<
  typeof wrapExtractionModel
>;

export const Experimental_ExtractionLanguageModel: WrappedWorkflowLanguageConstructor<
  typeof NativeModel,
  Experimental_ExtractionLanguageModel
> = adaptWorkflowLanguageConstructor(
  'Experimental_ExtractionLanguageModel',
  NativeModel,
  wrapExtractionModel,
  unwrapExtractionModel,
);
