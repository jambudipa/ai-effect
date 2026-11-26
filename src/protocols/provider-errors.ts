import * as sdk from '@ai-sdk/provider';
import { Redacted } from 'effect';
import { wrapErrorConstructor } from '../internal/error-constructor.js';
import { type AiSdkError, runSync, sdkError } from '../internal/operation.js';

/** Wrap a general SDK failure with the native arguments and expose its SDK type guard. */
export const AISDKError = wrapErrorConstructor('AISDKError', sdk.AISDKError);
/**
 * Use the shared `AiSdkError` type for a general SDK failure. `AISDKError.isInstance`
 * checks its SDK cause.
 */
export type AISDKError = AiSdkError;

/**
 * Wrap a provider API request failure with the native arguments and expose its SDK type
 * guard.
 */
export const APICallError = wrapErrorConstructor(
  'APICallError',
  sdk.APICallError,
);
/**
 * Use the shared `AiSdkError` type for a provider API request failure.
 * `APICallError.isInstance` checks its SDK cause.
 */
export type APICallError = AiSdkError;

/**
 * Wrap a provider response with no body with the native arguments and expose its SDK type
 * guard.
 */
export const EmptyResponseBodyError = wrapErrorConstructor(
  'EmptyResponseBodyError',
  sdk.EmptyResponseBodyError,
);
/**
 * Use the shared `AiSdkError` type for a provider response with no body.
 * `EmptyResponseBodyError.isInstance` checks its SDK cause.
 */
export type EmptyResponseBodyError = AiSdkError;

/**
 * Wrap a decision model refusal with the native arguments and expose its SDK type guard.
 */
export const Experimental_DecisionRefusalError = wrapErrorConstructor(
  'Experimental_DecisionRefusalError',
  sdk.Experimental_DecisionRefusalError,
);
/**
 * Use the shared `AiSdkError` type for a decision model refusal.
 * `Experimental_DecisionRefusalError.isInstance` checks its SDK cause.
 */
export type Experimental_DecisionRefusalError = AiSdkError;

/**
 * Wrap a question kind unsupported by the decision model with the native arguments and
 * expose its SDK type guard.
 */
export const Experimental_DecisionUnsupportedQuestionTypeError =
  wrapErrorConstructor(
    'Experimental_DecisionUnsupportedQuestionTypeError',
    sdk.Experimental_DecisionUnsupportedQuestionTypeError,
  );
/**
 * Use the shared `AiSdkError` type for a question kind unsupported by the decision model.
 * `Experimental_DecisionUnsupportedQuestionTypeError.isInstance` checks its SDK cause.
 */
export type Experimental_DecisionUnsupportedQuestionTypeError = AiSdkError;

/**
 * Wrap a question kind unsupported by the evaluation model with the native arguments and
 * expose its SDK type guard.
 */
export const Experimental_EvaluationUnsupportedQuestionTypeError =
  wrapErrorConstructor(
    'Experimental_EvaluationUnsupportedQuestionTypeError',
    sdk.Experimental_EvaluationUnsupportedQuestionTypeError,
  );
/**
 * Use the shared `AiSdkError` type for a question kind unsupported by the evaluation
 * model. `Experimental_EvaluationUnsupportedQuestionTypeError.isInstance` checks its SDK
 * cause.
 */
export type Experimental_EvaluationUnsupportedQuestionTypeError = AiSdkError;

/**
 * Wrap an extraction model refusal with the native arguments and expose its SDK type
 * guard.
 */
export const Experimental_ExtractionRefusalError = wrapErrorConstructor(
  'Experimental_ExtractionRefusalError',
  sdk.Experimental_ExtractionRefusalError,
);
/**
 * Use the shared `AiSdkError` type for an extraction model refusal.
 * `Experimental_ExtractionRefusalError.isInstance` checks its SDK cause.
 */
export type Experimental_ExtractionRefusalError = AiSdkError;

/**
 * Wrap a schema field type unsupported by the extraction model with the native arguments
 * and expose its SDK type guard.
 */
export const Experimental_ExtractionUnsupportedFieldTypeError =
  wrapErrorConstructor(
    'Experimental_ExtractionUnsupportedFieldTypeError',
    sdk.Experimental_ExtractionUnsupportedFieldTypeError,
  );
/**
 * Use the shared `AiSdkError` type for a schema field type unsupported by the extraction
 * model. `Experimental_ExtractionUnsupportedFieldTypeError.isInstance` checks its SDK
 * cause.
 */
export type Experimental_ExtractionUnsupportedFieldTypeError = AiSdkError;

/**
 * Wrap an invalid argument at an SDK validation boundary with the native arguments and
 * expose its SDK type guard.
 */
export const InvalidArgumentError = wrapErrorConstructor(
  'InvalidArgumentError',
  sdk.InvalidArgumentError,
);
/**
 * Use the shared `AiSdkError` type for an invalid argument at an SDK validation boundary.
 * `InvalidArgumentError.isInstance` checks its SDK cause.
 */
export type InvalidArgumentError = AiSdkError;

/**
 * Wrap a prompt rejected during SDK validation with the native arguments and expose its
 * SDK type guard.
 */
export const InvalidPromptError = wrapErrorConstructor(
  'InvalidPromptError',
  sdk.InvalidPromptError,
);
/**
 * Use the shared `AiSdkError` type for a prompt rejected during SDK validation.
 * `InvalidPromptError.isInstance` checks its SDK cause.
 */
export type InvalidPromptError = AiSdkError;

/**
 * Wrap response data rejected during SDK validation with the native arguments and expose
 * its SDK type guard.
 */
export const InvalidResponseDataError = wrapErrorConstructor(
  'InvalidResponseDataError',
  sdk.InvalidResponseDataError,
);
/**
 * Use the shared `AiSdkError` type for response data rejected during SDK validation.
 * `InvalidResponseDataError.isInstance` checks its SDK cause.
 */
export type InvalidResponseDataError = AiSdkError;

/**
 * Wrap a failure to parse an SDK JSON payload with the native arguments and expose its SDK
 * type guard.
 */
export const JSONParseError = wrapErrorConstructor(
  'JSONParseError',
  sdk.JSONParseError,
);
/**
 * Use the shared `AiSdkError` type for a failure to parse an SDK JSON payload.
 * `JSONParseError.isInstance` checks its SDK cause.
 */
export type JSONParseError = AiSdkError;

/**
 * Wrap an SDK API key lookup failure with the native arguments and expose its SDK type
 * guard.
 */
export const LoadAPIKeyError = wrapErrorConstructor(
  'LoadAPIKeyError',
  sdk.LoadAPIKeyError,
);
/**
 * Use the shared `AiSdkError` type for an SDK API key lookup failure.
 * `LoadAPIKeyError.isInstance` checks its SDK cause.
 */
export type LoadAPIKeyError = AiSdkError;

/**
 * Wrap an SDK configuration lookup failure with the native arguments and expose its SDK
 * type guard.
 */
export const LoadSettingError = wrapErrorConstructor(
  'LoadSettingError',
  sdk.LoadSettingError,
);
/**
 * Use the shared `AiSdkError` type for an SDK configuration lookup failure.
 * `LoadSettingError.isInstance` checks its SDK cause.
 */
export type LoadSettingError = AiSdkError;

/**
 * Wrap a response without the expected generated content with the native arguments and
 * expose its SDK type guard.
 */
export const NoContentGeneratedError = wrapErrorConstructor(
  'NoContentGeneratedError',
  sdk.NoContentGeneratedError,
);
/**
 * Use the shared `AiSdkError` type for a response without the expected generated content.
 * `NoContentGeneratedError.isInstance` checks its SDK cause.
 */
export type NoContentGeneratedError = AiSdkError;

/**
 * Wrap a model selection failure for an unavailable model with the native arguments and
 * expose its SDK type guard.
 */
export const NoSuchModelError = wrapErrorConstructor(
  'NoSuchModelError',
  sdk.NoSuchModelError,
);
/**
 * Use the shared `AiSdkError` type for a model selection failure for an unavailable model.
 * `NoSuchModelError.isInstance` checks its SDK cause.
 */
export type NoSuchModelError = AiSdkError;

/**
 * Wrap an unresolved provider reference with the native arguments and expose its SDK type
 * guard.
 */
export const NoSuchProviderReferenceError = wrapErrorConstructor(
  'NoSuchProviderReferenceError',
  sdk.NoSuchProviderReferenceError,
);
/**
 * Use the shared `AiSdkError` type for an unresolved provider reference.
 * `NoSuchProviderReferenceError.isInstance` checks its SDK cause.
 */
export type NoSuchProviderReferenceError = AiSdkError;

/**
 * Wrap an embedding request that exceeds the model input count per call with the native
 * arguments and expose its SDK type guard.
 */
export const TooManyEmbeddingValuesForCallError = wrapErrorConstructor(
  'TooManyEmbeddingValuesForCallError',
  sdk.TooManyEmbeddingValuesForCallError,
);
/**
 * Use the shared `AiSdkError` type for an embedding request that exceeds the model input
 * count per call. `TooManyEmbeddingValuesForCallError.isInstance` checks its SDK cause.
 */
export type TooManyEmbeddingValuesForCallError = AiSdkError;

/**
 * Provide the base SDK validation error constructor and cause guard for the extended
 * wrapper.
 */
const typeValidationConstructor = wrapErrorConstructor(
  'TypeValidationError',
  sdk.TypeValidationError,
);
/**
 * Construct or wrap a validation failure while preserving the SDK cause for the type
 * guard.
 */
export const TypeValidationError = Object.assign(typeValidationConstructor, {
  wrap: (options: Parameters<typeof sdk.TypeValidationError.wrap>[0]) =>
    runSync('TypeValidationError.wrap', () => {
      const { cause } = options;
      const wrapped = typeValidationConstructor.isInstance(cause);
      const nativeCause = wrapped ? Redacted.value(cause.cause) : cause;
      const error = sdk.TypeValidationError.wrap({
        ...options,
        cause: nativeCause,
      });
      return wrapped && error === nativeCause
        ? cause
        : sdkError('TypeValidationError.wrap', error);
    }),
});
/**
 * Use the shared `AiSdkError` type for validation failures. Inspect the cause with
 * `TypeValidationError.isInstance`.
 */
export type TypeValidationError = AiSdkError;

/**
 * Wrap an operation that the selected SDK model cannot perform with the native arguments
 * and expose its SDK type guard.
 */
export const UnsupportedFunctionalityError = wrapErrorConstructor(
  'UnsupportedFunctionalityError',
  sdk.UnsupportedFunctionalityError,
);
/**
 * Use the shared `AiSdkError` type for an operation that the selected SDK model cannot
 * perform. `UnsupportedFunctionalityError.isInstance` checks its SDK cause.
 */
export type UnsupportedFunctionalityError = AiSdkError;
