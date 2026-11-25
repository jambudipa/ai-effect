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

export type GrokBuildHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.GrokBuildHarnessSettings, R, E>;

export const VERSION = nativeVersion;
export const createGrokBuild = <R = never, E = never>(
  settings?: GrokBuildHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateGrokBuild as unknown as typeof SDKContract.createGrokBuild,
    settings,
  );
export const grokBuild = runSync('GrokBuild.default', () =>
  wrapHarness(nativeGrokBuild as unknown as typeof SDKContract.grokBuild),
);
