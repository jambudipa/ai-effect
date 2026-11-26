import { registerTelemetry as sdkRegisterTelemetry } from 'ai';
import type { TelemetryOptions as NativeOptions } from 'ai';
import { Effect } from 'effect';
import type { EffectTelemetry } from './integrations/internal/telemetry.js';
import { bindTelemetry } from './internal/experimental-callbacks.js';
import { openOperation, runSync } from './internal/operation.js';

/** Describe Effect callbacks that receive SDK generation and tool events. */
export type Telemetry = EffectTelemetry;
/** Preserve native telemetry settings while allowing one or several Effect integrations. */
export type TelemetryOptions<
  Runtime extends Record<string, unknown> = Record<string, unknown>,
> = Omit<NativeOptions<Runtime>, 'integrations'> & {
  readonly integrations?: Telemetry | readonly Telemetry[];
};

/** Register telemetry hooks for the lifetime of the caller's Scope. */
export function registerTelemetry(...integrations: readonly Telemetry[]) {
  return Effect.gen(function* () {
    const owner = yield* openOperation();
    const entries = integrations.map((integration) =>
      bindTelemetry(integration, owner),
    );
    yield* Effect.acquireRelease(
      runSync('registerTelemetry', () => sdkRegisterTelemetry(...entries)),
      () =>
        Effect.sync(() => {
          const registry = (
            globalThis as typeof globalThis & {
              AI_SDK_TELEMETRY_INTEGRATIONS?: unknown[];
            }
          ).AI_SDK_TELEMETRY_INTEGRATIONS;
          if (!registry) return;
          for (const entry of entries) {
            const index = registry.lastIndexOf(entry);
            if (index >= 0) registry.splice(index, 1);
          }
        }),
    );
  });
}
