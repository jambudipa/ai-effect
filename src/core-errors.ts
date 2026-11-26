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

/** Construct or identify the wrapped SDK failure for a failed download of an input resource. */
export const DownloadError = wrapErrorConstructor(
  'DownloadError',
  sdk.DownloadError,
);
/** Shared Effect error type used for a failed download of an input resource. */
export type DownloadError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a request argument that violates an SDK precondition. */
export const InvalidArgumentError = wrapErrorConstructor(
  'InvalidArgumentError',
  sdk.InvalidArgumentError,
);
/** Shared Effect error type used for a request argument that violates an SDK precondition. */
export type InvalidArgumentError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a data value with an unsupported representation. */
export const InvalidDataContentError = wrapErrorConstructor(
  'InvalidDataContentError',
  sdk.InvalidDataContentError,
);
/** Shared Effect error type used for a data value with an unsupported representation. */
export type InvalidDataContentError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an invalid model message role. */
export const InvalidMessageRoleError = wrapErrorConstructor(
  'InvalidMessageRoleError',
  sdk.InvalidMessageRoleError,
);
/** Shared Effect error type used for an invalid model message role. */
export type InvalidMessageRoleError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an unsupported or malformed SDK stream part. */
export const InvalidStreamPartError = wrapErrorConstructor(
  'InvalidStreamPartError',
  sdk.InvalidStreamPartError,
);
/** Shared Effect error type used for an unsupported or malformed SDK stream part. */
export type InvalidStreamPartError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a tool approval response the SDK rejects. */
export const InvalidToolApprovalError = wrapErrorConstructor(
  'InvalidToolApprovalError',
  sdk.InvalidToolApprovalError,
);
/** Shared Effect error type used for a tool approval response the SDK rejects. */
export type InvalidToolApprovalError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a tool approval signature that fails verification. */
export const InvalidToolApprovalSignatureError = wrapErrorConstructor(
  'InvalidToolApprovalSignatureError',
  sdk.InvalidToolApprovalSignatureError,
);
/** Shared Effect error type used for a tool approval signature that fails verification. */
export type InvalidToolApprovalSignatureError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a tool call with input that fails validation. */
export const InvalidToolInputError = wrapErrorConstructor(
  'InvalidToolInputError',
  sdk.InvalidToolInputError,
);
/** Shared Effect error type used for a tool call with input that fails validation. */
export type InvalidToolInputError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a failed conversion from UI history to a model message. */
export const MessageConversionError = wrapErrorConstructor(
  'MessageConversionError',
  sdk.MessageConversionError,
);
/** Shared Effect error type used for a failed conversion from UI history to a model message. */
export type MessageConversionError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a previous tool call whose required result is absent. */
export const MissingToolResultsError = wrapErrorConstructor(
  'MissingToolResultsError',
  sdk.MissingToolResultsError,
);
/** Shared Effect error type used for a previous tool call whose required result is absent. */
export type MissingToolResultsError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an image request that produces no image. */
export const NoImageGeneratedError = wrapErrorConstructor(
  'NoImageGeneratedError',
  sdk.NoImageGeneratedError,
);
/** Shared Effect error type used for an image request that produces no image. */
export type NoImageGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an object request that produces no valid object. */
export const NoObjectGeneratedError = wrapErrorConstructor(
  'NoObjectGeneratedError',
  sdk.NoObjectGeneratedError,
);
/** Shared Effect error type used for an object request that produces no valid object. */
export type NoObjectGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for generation that produces no usable output. */
export const NoOutputGeneratedError = wrapErrorConstructor(
  'NoOutputGeneratedError',
  sdk.NoOutputGeneratedError,
);
/** Shared Effect error type used for generation that produces no usable output. */
export type NoOutputGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a speech request that produces no synthesized audio. */
export const NoSpeechGeneratedError = wrapErrorConstructor(
  'NoSpeechGeneratedError',
  sdk.NoSpeechGeneratedError,
);
/** Shared Effect error type used for a speech request that produces no synthesized audio. */
export type NoSpeechGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a provider identifier absent from the registry. */
export const NoSuchProviderError = wrapErrorConstructor(
  'NoSuchProviderError',
  sdk.NoSuchProviderError,
);
/** Shared Effect error type used for a provider identifier absent from the registry. */
export type NoSuchProviderError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a requested tool name absent from the tool set. */
export const NoSuchToolError = wrapErrorConstructor(
  'NoSuchToolError',
  sdk.NoSuchToolError,
);
/** Shared Effect error type used for a requested tool name absent from the tool set. */
export type NoSuchToolError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an audio request that produces no transcription. */
export const NoTranscriptGeneratedError = wrapErrorConstructor(
  'NoTranscriptGeneratedError',
  sdk.NoTranscriptGeneratedError,
);
/** Shared Effect error type used for an audio request that produces no transcription. */
export type NoTranscriptGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a translation request that produces no translated result. */
export const NoTranslationGeneratedError = wrapErrorConstructor(
  'NoTranslationGeneratedError',
  sdk.NoTranslationGeneratedError,
);
/** Shared Effect error type used for a translation request that produces no translated result. */
export type NoTranslationGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a video request that produces no video. */
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
/** Shared Effect error type used for a video request that produces no video. */
export type NoVideoGeneratedError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a request failure after the SDK stops retrying. */
export const RetryError = wrapErrorConstructor('RetryError', sdk.RetryError);
/** Shared Effect error type used for a request failure after the SDK stops retrying. */
export type RetryError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a stream failure reported by the provider. */
export const StreamProviderError = wrapErrorConstructor(
  'StreamProviderError',
  sdk.StreamProviderError,
);
/** Shared Effect error type used for a stream failure reported by the provider. */
export type StreamProviderError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an approval without a matching tool call. */
export const ToolCallNotFoundForApprovalError = wrapErrorConstructor(
  'ToolCallNotFoundForApprovalError',
  sdk.ToolCallNotFoundForApprovalError,
);
/** Shared Effect error type used for an approval without a matching tool call. */
export type ToolCallNotFoundForApprovalError = AiSdkError;

/** Construct or identify the wrapped SDK failure for an SDK failure while repairing a tool call. */
export const ToolCallRepairError = wrapErrorConstructor(
  'ToolCallRepairError',
  sdk.ToolCallRepairError,
);
/** Shared Effect error type used for an SDK failure while repairing a tool call. */
export type ToolCallRepairError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a model response that violates the configured tool choice. */
export const ToolChoiceViolationError = wrapErrorConstructor(
  'ToolChoiceViolationError',
  sdk.ToolChoiceViolationError,
);
/** Shared Effect error type used for a model response that violates the configured tool choice. */
export type ToolChoiceViolationError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a failure while processing a UI message stream. */
export const UIMessageStreamError = wrapErrorConstructor(
  'UIMessageStreamError',
  sdk.UIMessageStreamError,
);
/** Shared Effect error type used for a failure while processing a UI message stream. */
export type UIMessageStreamError = AiSdkError;

/** Construct or identify the wrapped SDK failure for a model protocol version rejected by the SDK. */
export const UnsupportedModelVersionError = wrapErrorConstructor(
  'UnsupportedModelVersionError',
  sdk.UnsupportedModelVersionError,
);
/** Shared Effect error type used for a model protocol version rejected by the SDK. */
export type UnsupportedModelVersionError = AiSdkError;
