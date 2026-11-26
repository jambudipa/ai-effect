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

/** OpenCode adapter settings with optional credential forwarding in the Effect context. */
export type OpenCodeHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.OpenCodeHarnessSettings, R, E>;

/** Version reported by the native OpenCode adapter. */
export const VERSION = nativeVersion;
/** Construct an OpenCode harness in a scope that owns any credential forwarding callbacks. */
export const createOpenCode = <R = never, E = never>(
  settings?: OpenCodeHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateOpenCode as unknown as typeof SDKContract.createOpenCode,
    settings,
  );
/** Resolve the SDK's default OpenCode harness when the Effect runs. */
export const openCode = runSync('OpenCode.default', () =>
  wrapHarness(nativeOpenCode as unknown as typeof SDKContract.openCode),
);
