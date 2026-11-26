import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { LegacyOpenTelemetry } from '../src/integrations/otel.js';

it.effect(
  'exposes the legacy telemetry hooks as required Effect operations',
  () =>
    Effect.gen(function* () {
      const telemetry = yield* LegacyOpenTelemetry.make();

      expect(telemetry.executeTool).toBeTypeOf('function');
      expect(telemetry.executeLanguageModelCall).toBeTypeOf('function');
      expect(telemetry.experimental_onEvaluateStart).toBeTypeOf('function');

      const report = telemetry.onError({
        callId: 'fixture',
        error: 'fixture error',
      });
      expect(Effect.isEffect(report)).toBe(true);
      yield* report;
    }),
);
