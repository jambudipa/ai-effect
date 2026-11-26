import {
  GatewayAccessPolicyDeniedError as SdkAccessPolicyDeniedError,
  GatewayAuthenticationError as SdkAuthenticationError,
  GatewayFailedDependencyError as SdkFailedDependencyError,
  GatewayForbiddenError as SdkForbiddenError,
  GatewayInternalServerError as SdkInternalServerError,
  GatewayInvalidRequestError as SdkInvalidRequestError,
  GatewayModelNotFoundError as SdkModelNotFoundError,
  GatewayNotFoundError as SdkNotFoundError,
  GatewayRateLimitError as SdkRateLimitError,
  GatewayResponseError as SdkResponseError,
} from '@ai-sdk/gateway';
import type { GatewayError as SdkGatewayError } from '@ai-sdk/gateway';
import { Data, Effect, Redacted } from 'effect';
import { runSync } from './operation.js';

/** Represent a gateway failure with its status, retry hint, and redacted native cause. */
export class GatewayError extends Data.TaggedError('GatewayError')<{
  readonly name: string;
  readonly type: string;
  readonly statusCode: number;
  readonly generationId?: string;
  readonly isRetryable: boolean;
  readonly cause?: Redacted.Redacted<unknown>;
}> {
  /** Recognize an error created by this gateway adapter before reading gateway metadata. */
  static isInstance(error: unknown): error is GatewayError {
    return error instanceof GatewayError;
  }

  /** Retain the SDK-compatible marker check for wrapped gateway errors. */
  static hasMarker(error: unknown): error is GatewayError {
    return GatewayError.isInstance(error);
  }
}

/** Narrow a gateway error to its operation-specific kind and diagnostic fields. */
type SpecificError<Kind extends string, Details> = GatewayError & {
  readonly type: Kind;
} & Details;

/** Retain selected gateway diagnostics and redact the original failure cause. */
const wrapFailure = <
  Kind extends string,
  Native extends SdkGatewayError,
  Details,
>(
  type: Kind,
  error: Native,
  details: (error: Native) => Details,
): SpecificError<Kind, Details> =>
  Object.assign(
    new GatewayError({
      name: error.name,
      type,
      statusCode: error.statusCode,
      isRetryable: error.isRetryable,
      ...(error.generationId ? { generationId: error.generationId } : {}),
      ...('cause' in error ? { cause: Redacted.make(error.cause) } : {}),
    }),
    { type },
    details(error),
  );

/** Build a lazy native error adapter with a guard for its gateway error kind. */
const adaptError = <
  Kind extends string,
  Args extends unknown[],
  Native extends SdkGatewayError,
  Details,
>(
  name: string,
  type: Kind,
  ErrorConstructor: new (...args: Args) => Native,
  details: (error: Native) => Details,
) =>
  Object.assign(
    (...args: Args) =>
      runSync(name, () =>
        wrapFailure(type, new ErrorConstructor(...args), details),
      ),
    {
      isInstance: (error: unknown): error is SpecificError<Kind, Details> =>
        GatewayError.isInstance(error) && error.type === type,
      hasMarker: GatewayError.hasMarker,
    },
  );

/** Select only the common fields for gateway error kinds without additional diagnostics. */
const noDetails = () => ({});

/** Construct an access-policy failure with policy IDs and the providers or models removed. */
export const GatewayAccessPolicyDeniedError = adaptError(
  'GatewayAccessPolicyDeniedError',
  'access_policy_denied',
  SdkAccessPolicyDeniedError,
  ({ policyIds, removedModels, removedProviders }) => ({
    policyIds,
    removedModels,
    removedProviders,
  }),
);
/** Construct a gateway authentication failure and retain the contextual SDK constructor. */
export const GatewayAuthenticationError = Object.assign(
  adaptError(
    'GatewayAuthenticationError',
    'authentication_error',
    SdkAuthenticationError,
    noDetails,
  ),
  {
    createContextualError: (
      ...args: Parameters<typeof SdkAuthenticationError.createContextualError>
    ) =>
      runSync('GatewayAuthenticationError.createContextualError', () =>
        wrapFailure(
          'authentication_error',
          SdkAuthenticationError.createContextualError(...args),
          noDetails,
        ),
      ),
  },
);
/** Construct a gateway failure caused by an unavailable downstream dependency. */
export const GatewayFailedDependencyError = adaptError(
  'GatewayFailedDependencyError',
  'failed_dependency',
  SdkFailedDependencyError,
  noDetails,
);
/** Construct an authorization failure and keep the rule that rejected the request. */
export const GatewayForbiddenError = adaptError(
  'GatewayForbiddenError',
  'forbidden',
  SdkForbiddenError,
  ({ ruleId }) => ({ ruleId }),
);
/** Construct a gateway internal error with the native status and retry hint. */
export const GatewayInternalServerError = adaptError(
  'GatewayInternalServerError',
  'internal_server_error',
  SdkInternalServerError,
  noDetails,
);
/** Construct a gateway rejection of invalid request data. */
export const GatewayInvalidRequestError = adaptError(
  'GatewayInvalidRequestError',
  'invalid_request_error',
  SdkInvalidRequestError,
  noDetails,
);
/** Construct a missing-model failure and retain the requested model ID. */
export const GatewayModelNotFoundError = adaptError(
  'GatewayModelNotFoundError',
  'model_not_found',
  SdkModelNotFoundError,
  ({ modelId }) => ({ modelId }),
);
/** Construct a gateway failure when the requested resource does not exist. */
export const GatewayNotFoundError = adaptError(
  'GatewayNotFoundError',
  'not_found',
  SdkNotFoundError,
  noDetails,
);
/** Construct a gateway rate-limit failure and preserve the native retry hint. */
export const GatewayRateLimitError = adaptError(
  'GatewayRateLimitError',
  'rate_limit_exceeded',
  SdkRateLimitError,
  noDetails,
);
/** Construct a gateway response failure with the native response and validation details redacted. */
export const GatewayResponseError = adaptError(
  'GatewayResponseError',
  'response_error',
  SdkResponseError,
  ({ response, validationError }) => ({
    ...(validationError
      ? { validationError: Redacted.make(validationError) }
      : {}),
    response: Redacted.make(response),
  }),
);

/** Read policy IDs and excluded model or provider IDs after narrowing an access-policy failure. */
export type GatewayAccessPolicyDeniedError = Effect.Success<
  ReturnType<typeof GatewayAccessPolicyDeniedError>
>;
/** Identify the authentication failure variant in gateway error handling. */
export type GatewayAuthenticationError = Effect.Success<
  ReturnType<typeof GatewayAuthenticationError>
>;
/** Identify the dependency failure variant in gateway error handling. */
export type GatewayFailedDependencyError = Effect.Success<
  ReturnType<typeof GatewayFailedDependencyError>
>;
/** Read the rejecting rule ID after narrowing an authorization failure. */
export type GatewayForbiddenError = Effect.Success<
  ReturnType<typeof GatewayForbiddenError>
>;
/** Identify the internal server failure variant in gateway error handling. */
export type GatewayInternalServerError = Effect.Success<
  ReturnType<typeof GatewayInternalServerError>
>;
/** Identify the invalid request failure variant in gateway error handling. */
export type GatewayInvalidRequestError = Effect.Success<
  ReturnType<typeof GatewayInvalidRequestError>
>;
/** Read the requested model ID after narrowing a gateway model lookup failure. */
export type GatewayModelNotFoundError = Effect.Success<
  ReturnType<typeof GatewayModelNotFoundError>
>;
/** Identify the missing resource variant in gateway error handling. */
export type GatewayNotFoundError = Effect.Success<
  ReturnType<typeof GatewayNotFoundError>
>;
/** Identify the rate-limit variant before applying retry policy. */
export type GatewayRateLimitError = Effect.Success<
  ReturnType<typeof GatewayRateLimitError>
>;
/** Identify a response failure and retain its redacted diagnostics for internal inspection. */
export type GatewayResponseError = Effect.Success<
  ReturnType<typeof GatewayResponseError>
>;
