import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { OpenTelemetry } from '../src/integrations/otel.js';

it.effect('exposes the modern telemetry hooks and durable descriptor', () =>
  Effect.gen(function* () {
    const telemetry = yield* OpenTelemetry.make();

    expect(telemetry.onLanguageModelCallStart).toBeTypeOf('function');
    expect(telemetry.experimental_onExtractionModelCallEnd).toBeTypeOf(
      'function',
    );
    expect(telemetry.experimental_durable.captureContext).toBeTypeOf(
      'function',
    );

    const report = telemetry.onError({
      callId: 'fixture',
      error: 'fixture error',
    });
    expect(Effect.isEffect(report)).toBe(true);
    yield* report;
  }),
);
