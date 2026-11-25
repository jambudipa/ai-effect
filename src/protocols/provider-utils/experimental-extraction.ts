import { Experimental_ExtractionLanguageModel as NativeModel } from '@ai-sdk/provider-utils/experimental-extraction';
import { withLanguageModel } from '../../internal/derived-language-model.js';
import type { LanguageModelV4 } from '../../internal/language-model.js';
import { wrapExtractionModel } from '../../internal/provider-model.js';

export type Experimental_ExtractionLanguageModel = ReturnType<
  typeof wrapExtractionModel
>;

export const Experimental_ExtractionLanguageModel = (options: {
  readonly model: LanguageModelV4;
  readonly provider?: string;
  readonly maxFieldsPerCall?: number;
}) =>
  withLanguageModel(
    'Experimental_ExtractionLanguageModel',
    options.model,
    (model) => wrapExtractionModel(new NativeModel({ ...options, model })),
  );
