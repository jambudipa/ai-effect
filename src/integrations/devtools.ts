import * as sdk from '@ai-sdk/devtools';
import { runSync } from '../internal/operation.js';
import { wrapMiddleware } from './internal/middleware.js';
import { wrapTelemetry } from './internal/telemetry.js';

export type { DevToolsTelemetryOptions } from '@ai-sdk/devtools';

/** Create an Effect middleware that records model requests to DevTools. */
export const devToolsMiddleware = () =>
  runSync('DevTools.middleware', () =>
    wrapMiddleware('DevTools.middleware.apply', sdk.devToolsMiddleware()),
  );

/** Create a DevTools integration with Effect lifecycle hooks. */
export const DevToolsTelemetry = (options?: sdk.DevToolsTelemetryOptions) =>
  runSync('DevTools.Telemetry', () =>
    wrapTelemetry('DevTools.Telemetry', sdk.DevToolsTelemetry(options)),
  );
