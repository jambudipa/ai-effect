import * as sdk from '@ai-sdk/harness-codex';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  CodexAuthenticationMode,
  JSONObject,
} from '@ai-sdk/harness-codex';

export type CodexHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.CodexHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createCodex = <R = never, E = never>(
  settings?: CodexHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createCodex, settings);
export const codex = runSync('Codex.default', () => wrapHarness(sdk.codex));
