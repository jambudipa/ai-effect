import { Experimental_ExtractionLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-extraction';
import {
  unwrapExtractionModel,
  wrapExtractionModel,
} from '../../internal/provider-model.js';
import { adaptWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';
import type { WrappedWorkflowLanguageConstructor } from '../../internal/workflow-language-model.js';

/** Effect model for structured extraction through the native workflow-capable model. */
export type Experimental_ExtractionLanguageModel = ReturnType<
  typeof wrapExtractionModel
>;

/**
 * Construct the native extraction model lazily and expose its workflow serialization
 * hooks.
 */
export const Experimental_ExtractionLanguageModel: WrappedWorkflowLanguageConstructor<
  typeof NativeModel,
  Experimental_ExtractionLanguageModel
> = adaptWorkflowLanguageConstructor(
  'Experimental_ExtractionLanguageModel',
  NativeModel,
  wrapExtractionModel,
  unwrapExtractionModel,
);
