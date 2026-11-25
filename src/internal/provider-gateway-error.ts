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

export class GatewayError extends Data.TaggedError('GatewayError')<{
  readonly name: string;
  readonly type: string;
  readonly statusCode: number;
  readonly generationId?: string;
  readonly isRetryable: boolean;
  readonly cause?: Redacted.Redacted<unknown>;
}> {
  static isInstance(error: unknown): error is GatewayError {
    return error instanceof GatewayError;
  }

  static hasMarker(error: unknown): error is GatewayError {
    return GatewayError.isInstance(error);
  }
}

type SpecificError<Kind extends string, Details> = GatewayError & {
  readonly type: Kind;
} & Details;

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
    },
  );

const noDetails = () => ({});

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
export const GatewayFailedDependencyError = adaptError(
  'GatewayFailedDependencyError',
  'failed_dependency',
  SdkFailedDependencyError,
  noDetails,
);
export const GatewayForbiddenError = adaptError(
  'GatewayForbiddenError',
  'forbidden',
  SdkForbiddenError,
  ({ ruleId }) => ({ ruleId }),
);
export const GatewayInternalServerError = adaptError(
  'GatewayInternalServerError',
  'internal_server_error',
  SdkInternalServerError,
  noDetails,
);
export const GatewayInvalidRequestError = adaptError(
  'GatewayInvalidRequestError',
  'invalid_request_error',
  SdkInvalidRequestError,
  noDetails,
);
export const GatewayModelNotFoundError = adaptError(
  'GatewayModelNotFoundError',
  'model_not_found',
  SdkModelNotFoundError,
  ({ modelId }) => ({ modelId }),
);
export const GatewayNotFoundError = adaptError(
  'GatewayNotFoundError',
  'not_found',
  SdkNotFoundError,
  noDetails,
);
export const GatewayRateLimitError = adaptError(
  'GatewayRateLimitError',
  'rate_limit_exceeded',
  SdkRateLimitError,
  noDetails,
);
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

export type GatewayAccessPolicyDeniedError = Effect.Success<
  ReturnType<typeof GatewayAccessPolicyDeniedError>
>;
export type GatewayAuthenticationError = Effect.Success<
  ReturnType<typeof GatewayAuthenticationError>
>;
export type GatewayFailedDependencyError = Effect.Success<
  ReturnType<typeof GatewayFailedDependencyError>
>;
export type GatewayForbiddenError = Effect.Success<
  ReturnType<typeof GatewayForbiddenError>
>;
export type GatewayInternalServerError = Effect.Success<
  ReturnType<typeof GatewayInternalServerError>
>;
export type GatewayInvalidRequestError = Effect.Success<
  ReturnType<typeof GatewayInvalidRequestError>
>;
export type GatewayModelNotFoundError = Effect.Success<
  ReturnType<typeof GatewayModelNotFoundError>
>;
export type GatewayNotFoundError = Effect.Success<
  ReturnType<typeof GatewayNotFoundError>
>;
export type GatewayRateLimitError = Effect.Success<
  ReturnType<typeof GatewayRateLimitError>
>;
export type GatewayResponseError = Effect.Success<
  ReturnType<typeof GatewayResponseError>
>;
