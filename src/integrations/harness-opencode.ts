import * as sdk from '@ai-sdk/harness-opencode';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  JSONObject,
  OpenCodeAuthenticationMode,
} from '@ai-sdk/harness-opencode';

export type OpenCodeHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.OpenCodeHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createOpenCode = <R = never, E = never>(
  settings?: OpenCodeHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createOpenCode, settings);
export const openCode = runSync('OpenCode.default', () =>
  wrapHarness(sdk.openCode),
);
