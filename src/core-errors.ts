import * as sdk from 'ai';
import { Redacted } from 'effect';
import { wrapErrorConstructor } from './internal/error-constructor.js';
import { AiSdkError } from './internal/operation.js';

export {
  AISDKError,
  APICallError,
  EmptyResponseBodyError,
  Experimental_DecisionRefusalError,
  Experimental_DecisionUnsupportedQuestionTypeError,
  Experimental_EvaluationUnsupportedQuestionTypeError,
  Experimental_ExtractionRefusalError,
  Experimental_ExtractionUnsupportedFieldTypeError,
  InvalidPromptError,
  InvalidResponseDataError,
  JSONParseError,
  LoadAPIKeyError,
  LoadSettingError,
  NoContentGeneratedError,
  NoSuchModelError,
  NoSuchProviderReferenceError,
  TooManyEmbeddingValuesForCallError,
  TypeValidationError,
  UnsupportedFunctionalityError,
} from './protocols/provider-errors.js';

export const DownloadError = wrapErrorConstructor(
  'DownloadError',
  sdk.DownloadError,
);
export type DownloadError = AiSdkError;

export const InvalidArgumentError = wrapErrorConstructor(
  'InvalidArgumentError',
  sdk.InvalidArgumentError,
);
export type InvalidArgumentError = AiSdkError;

export const InvalidDataContentError = wrapErrorConstructor(
  'InvalidDataContentError',
  sdk.InvalidDataContentError,
);
export type InvalidDataContentError = AiSdkError;

export const InvalidMessageRoleError = wrapErrorConstructor(
  'InvalidMessageRoleError',
  sdk.InvalidMessageRoleError,
);
export type InvalidMessageRoleError = AiSdkError;

export const InvalidStreamPartError = wrapErrorConstructor(
  'InvalidStreamPartError',
  sdk.InvalidStreamPartError,
);
export type InvalidStreamPartError = AiSdkError;

export const InvalidToolApprovalError = wrapErrorConstructor(
  'InvalidToolApprovalError',
  sdk.InvalidToolApprovalError,
);
export type InvalidToolApprovalError = AiSdkError;

export const InvalidToolApprovalSignatureError = wrapErrorConstructor(
  'InvalidToolApprovalSignatureError',
  sdk.InvalidToolApprovalSignatureError,
);
export type InvalidToolApprovalSignatureError = AiSdkError;

export const InvalidToolInputError = wrapErrorConstructor(
  'InvalidToolInputError',
  sdk.InvalidToolInputError,
);
export type InvalidToolInputError = AiSdkError;

export const MessageConversionError = wrapErrorConstructor(
  'MessageConversionError',
  sdk.MessageConversionError,
);
export type MessageConversionError = AiSdkError;

export const MissingToolResultsError = wrapErrorConstructor(
  'MissingToolResultsError',
  sdk.MissingToolResultsError,
);
export type MissingToolResultsError = AiSdkError;

export const NoImageGeneratedError = wrapErrorConstructor(
  'NoImageGeneratedError',
  sdk.NoImageGeneratedError,
);
export type NoImageGeneratedError = AiSdkError;

export const NoObjectGeneratedError = wrapErrorConstructor(
  'NoObjectGeneratedError',
  sdk.NoObjectGeneratedError,
);
export type NoObjectGeneratedError = AiSdkError;

export const NoOutputGeneratedError = wrapErrorConstructor(
  'NoOutputGeneratedError',
  sdk.NoOutputGeneratedError,
);
export type NoOutputGeneratedError = AiSdkError;

export const NoSpeechGeneratedError = wrapErrorConstructor(
  'NoSpeechGeneratedError',
  sdk.NoSpeechGeneratedError,
);
export type NoSpeechGeneratedError = AiSdkError;

export const NoSuchProviderError = wrapErrorConstructor(
  'NoSuchProviderError',
  sdk.NoSuchProviderError,
);
export type NoSuchProviderError = AiSdkError;

export const NoSuchToolError = wrapErrorConstructor(
  'NoSuchToolError',
  sdk.NoSuchToolError,
);
export type NoSuchToolError = AiSdkError;

export const NoTranscriptGeneratedError = wrapErrorConstructor(
  'NoTranscriptGeneratedError',
  sdk.NoTranscriptGeneratedError,
);
export type NoTranscriptGeneratedError = AiSdkError;

export const NoTranslationGeneratedError = wrapErrorConstructor(
  'NoTranslationGeneratedError',
  sdk.NoTranslationGeneratedError,
);
export type NoTranslationGeneratedError = AiSdkError;

export const NoVideoGeneratedError = Object.assign(
  wrapErrorConstructor('NoVideoGeneratedError', sdk.NoVideoGeneratedError),
  {
    /** @deprecated Use `isInstance` instead. */
    isNoVideoGeneratedError: (error: unknown): error is AiSdkError =>
      error instanceof AiSdkError &&
      sdk.NoVideoGeneratedError.isNoVideoGeneratedError(
        Redacted.value(error.cause),
      ),
  },
);
export type NoVideoGeneratedError = AiSdkError;

export const RetryError = wrapErrorConstructor('RetryError', sdk.RetryError);
export type RetryError = AiSdkError;

export const StreamProviderError = wrapErrorConstructor(
  'StreamProviderError',
  sdk.StreamProviderError,
);
export type StreamProviderError = AiSdkError;

export const ToolCallNotFoundForApprovalError = wrapErrorConstructor(
  'ToolCallNotFoundForApprovalError',
  sdk.ToolCallNotFoundForApprovalError,
);
export type ToolCallNotFoundForApprovalError = AiSdkError;

export const ToolCallRepairError = wrapErrorConstructor(
  'ToolCallRepairError',
  sdk.ToolCallRepairError,
);
export type ToolCallRepairError = AiSdkError;

export const ToolChoiceViolationError = wrapErrorConstructor(
  'ToolChoiceViolationError',
  sdk.ToolChoiceViolationError,
);
export type ToolChoiceViolationError = AiSdkError;

export const UIMessageStreamError = wrapErrorConstructor(
  'UIMessageStreamError',
  sdk.UIMessageStreamError,
);
export type UIMessageStreamError = AiSdkError;

export const UnsupportedModelVersionError = wrapErrorConstructor(
  'UnsupportedModelVersionError',
  sdk.UnsupportedModelVersionError,
);
export type UnsupportedModelVersionError = AiSdkError;
