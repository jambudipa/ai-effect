import {
  VERSION as nativeVersion,
  openCode as nativeOpenCode,
  createOpenCode as nativeCreateOpenCode,
} from '@ai-sdk/harness-opencode';
import type * as SDKContract from './internal/harness-contracts/harness-opencode.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  JSONObject,
  OpenCodeAuthenticationMode,
} from './internal/harness-contracts/harness-opencode.js';

export type OpenCodeHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.OpenCodeHarnessSettings, R, E>;

export const VERSION = nativeVersion;
export const createOpenCode = <R = never, E = never>(
  settings?: OpenCodeHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateOpenCode as unknown as typeof SDKContract.createOpenCode,
    settings,
  );
export const openCode = runSync('OpenCode.default', () =>
  wrapHarness(nativeOpenCode as unknown as typeof SDKContract.openCode),
);
