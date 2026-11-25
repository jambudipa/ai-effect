import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import {
  NoVideoGeneratedError,
  TypeValidationError as CoreTypeValidationError,
} from '../src/core-errors.js';
import {
  GatewayAccessPolicyDeniedError,
  GatewayAuthenticationError,
  GatewayFailedDependencyError,
  GatewayForbiddenError,
  GatewayInternalServerError,
  GatewayInvalidRequestError,
  GatewayModelNotFoundError,
  GatewayNotFoundError,
  GatewayRateLimitError,
  GatewayResponseError,
} from '../src/providers/gateway.js';
import { TypeValidationError } from '../src/protocols/provider-errors.js';

it('preserves the deprecated no-video predicate on wrapped errors', () => {
  const none = new NoVideoGeneratedError({ responses: [] });
  expect(NoVideoGeneratedError.isNoVideoGeneratedError(none)).toBe(true);
  expect(NoVideoGeneratedError.isNoVideoGeneratedError({ responses: [] })).toBe(
    false,
  );
});

it.effect(
  'reuses a wrapped type validation error when its context matches',
  () =>
    Effect.gen(function* () {
      const value = { result: 42 };
      const context = { field: 'result', entityId: 'fixture' };
      const initial = new TypeValidationError({
        value,
        context,
        cause: 'invalid',
      });
      const same = yield* CoreTypeValidationError.wrap({
        value,
        context: { ...context },
        cause: initial,
      });
      expect(same).toBe(initial);

      const changed = yield* TypeValidationError.wrap({
        value,
        context: { field: 'other' },
        cause: initial,
      });
      expect(changed).not.toBe(initial);
      expect(TypeValidationError.isInstance(changed)).toBe(true);

      const failure = yield* Effect.flip(
        TypeValidationError.wrap({ value: 1n, cause: 'invalid' }),
      );
      expect(failure._tag).toBe('AiSdkError');
      expect(failure.operation).toBe('TypeValidationError.wrap');
    }),
);

it.effect('restores the shared Gateway marker on every concrete error', () =>
  Effect.gen(function* () {
    const missing = yield* GatewayNotFoundError();
    const gatewayErrors = [
      GatewayAccessPolicyDeniedError,
      GatewayAuthenticationError,
      GatewayFailedDependencyError,
      GatewayForbiddenError,
      GatewayInternalServerError,
      GatewayInvalidRequestError,
      GatewayModelNotFoundError,
      GatewayNotFoundError,
      GatewayRateLimitError,
      GatewayResponseError,
    ];

    for (const Constructor of gatewayErrors) {
      expect(Constructor.hasMarker(missing)).toBe(true);
      expect(Constructor.hasMarker({ type: missing.type })).toBe(false);
    }
    expect(GatewayNotFoundError.isInstance(missing)).toBe(true);
    expect(GatewayAuthenticationError.isInstance(missing)).toBe(false);
  }),
);
