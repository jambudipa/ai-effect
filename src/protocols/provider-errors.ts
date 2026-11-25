import * as sdk from '@ai-sdk/provider';
import { wrapErrorConstructor } from '../internal/error-constructor.js';
import type { AiSdkError } from '../internal/operation.js';

export const AISDKError = wrapErrorConstructor('AISDKError', sdk.AISDKError);
export type AISDKError = AiSdkError;

export const APICallError = wrapErrorConstructor(
  'APICallError',
  sdk.APICallError,
);
export type APICallError = AiSdkError;

export const EmptyResponseBodyError = wrapErrorConstructor(
  'EmptyResponseBodyError',
  sdk.EmptyResponseBodyError,
);
export type EmptyResponseBodyError = AiSdkError;

export const Experimental_DecisionRefusalError = wrapErrorConstructor(
  'Experimental_DecisionRefusalError',
  sdk.Experimental_DecisionRefusalError,
);
export type Experimental_DecisionRefusalError = AiSdkError;

export const Experimental_DecisionUnsupportedQuestionTypeError =
  wrapErrorConstructor(
    'Experimental_DecisionUnsupportedQuestionTypeError',
    sdk.Experimental_DecisionUnsupportedQuestionTypeError,
  );
export type Experimental_DecisionUnsupportedQuestionTypeError = AiSdkError;

export const Experimental_EvaluationUnsupportedQuestionTypeError =
  wrapErrorConstructor(
    'Experimental_EvaluationUnsupportedQuestionTypeError',
    sdk.Experimental_EvaluationUnsupportedQuestionTypeError,
  );
export type Experimental_EvaluationUnsupportedQuestionTypeError = AiSdkError;

export const Experimental_ExtractionRefusalError = wrapErrorConstructor(
  'Experimental_ExtractionRefusalError',
  sdk.Experimental_ExtractionRefusalError,
);
export type Experimental_ExtractionRefusalError = AiSdkError;

export const Experimental_ExtractionUnsupportedFieldTypeError =
  wrapErrorConstructor(
    'Experimental_ExtractionUnsupportedFieldTypeError',
    sdk.Experimental_ExtractionUnsupportedFieldTypeError,
  );
export type Experimental_ExtractionUnsupportedFieldTypeError = AiSdkError;

export const InvalidArgumentError = wrapErrorConstructor(
  'InvalidArgumentError',
  sdk.InvalidArgumentError,
);
export type InvalidArgumentError = AiSdkError;

export const InvalidPromptError = wrapErrorConstructor(
  'InvalidPromptError',
  sdk.InvalidPromptError,
);
export type InvalidPromptError = AiSdkError;

export const InvalidResponseDataError = wrapErrorConstructor(
  'InvalidResponseDataError',
  sdk.InvalidResponseDataError,
);
export type InvalidResponseDataError = AiSdkError;

export const JSONParseError = wrapErrorConstructor(
  'JSONParseError',
  sdk.JSONParseError,
);
export type JSONParseError = AiSdkError;

export const LoadAPIKeyError = wrapErrorConstructor(
  'LoadAPIKeyError',
  sdk.LoadAPIKeyError,
);
export type LoadAPIKeyError = AiSdkError;

export const LoadSettingError = wrapErrorConstructor(
  'LoadSettingError',
  sdk.LoadSettingError,
);
export type LoadSettingError = AiSdkError;

export const NoContentGeneratedError = wrapErrorConstructor(
  'NoContentGeneratedError',
  sdk.NoContentGeneratedError,
);
export type NoContentGeneratedError = AiSdkError;

export const NoSuchModelError = wrapErrorConstructor(
  'NoSuchModelError',
  sdk.NoSuchModelError,
);
export type NoSuchModelError = AiSdkError;

export const NoSuchProviderReferenceError = wrapErrorConstructor(
  'NoSuchProviderReferenceError',
  sdk.NoSuchProviderReferenceError,
);
export type NoSuchProviderReferenceError = AiSdkError;

export const TooManyEmbeddingValuesForCallError = wrapErrorConstructor(
  'TooManyEmbeddingValuesForCallError',
  sdk.TooManyEmbeddingValuesForCallError,
);
export type TooManyEmbeddingValuesForCallError = AiSdkError;

export const TypeValidationError = wrapErrorConstructor(
  'TypeValidationError',
  sdk.TypeValidationError,
);
export type TypeValidationError = AiSdkError;

export const UnsupportedFunctionalityError = wrapErrorConstructor(
  'UnsupportedFunctionalityError',
  sdk.UnsupportedFunctionalityError,
);
export type UnsupportedFunctionalityError = AiSdkError;
