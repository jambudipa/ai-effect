import * as sdk from '@ai-sdk/harness-grok-build';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  GrokBuildAuthenticationMode,
  JSONObject,
} from '@ai-sdk/harness-grok-build';

export type GrokBuildHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.GrokBuildHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createGrokBuild = <R = never, E = never>(
  settings?: GrokBuildHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createGrokBuild, settings);
export const grokBuild = runSync('GrokBuild.default', () =>
  wrapHarness(sdk.grokBuild),
);
