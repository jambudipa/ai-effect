import {
  VERSION as nativeVersion,
  grokBuild as nativeGrokBuild,
  createGrokBuild as nativeCreateGrokBuild,
} from '@ai-sdk/harness-grok-build';
import type * as SDKContract from './internal/harness-contracts/harness-grok-build.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  GrokBuildAuthenticationMode,
  JSONObject,
} from './internal/harness-contracts/harness-grok-build.js';

/** Grok Build adapter settings with optional credential forwarding in the Effect context. */
export type GrokBuildHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.GrokBuildHarnessSettings, R, E>;

/** Version reported by the native Grok Build adapter. */
export const VERSION = nativeVersion;
/** Construct a Grok Build harness in a scope that owns any credential forwarding callbacks. */
export const createGrokBuild = <R = never, E = never>(
  settings?: GrokBuildHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateGrokBuild as unknown as typeof SDKContract.createGrokBuild,
    settings,
  );
/** Resolve the SDK's default Grok Build harness when the Effect runs. */
export const grokBuild = runSync('GrokBuild.default', () =>
  wrapHarness(nativeGrokBuild as unknown as typeof SDKContract.grokBuild),
);
