import {
  VERSION as nativeVersion,
  claudeCode as nativeClaudeCode,
  createClaudeCode as nativeCreateClaudeCode,
} from '@ai-sdk/harness-claude-code';
import type * as SDKContract from './internal/harness-contracts/harness-claude-code.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  ClaudeCodeAuthenticationMode,
  ClaudeCodeThinkingConfig,
  JSONObject,
} from './internal/harness-contracts/harness-claude-code.js';

export type ClaudeCodeHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.ClaudeCodeHarnessSettings, R, E>;

export const VERSION = nativeVersion;
export const createClaudeCode = <R = never, E = never>(
  settings?: ClaudeCodeHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateClaudeCode as unknown as typeof SDKContract.createClaudeCode,
    settings,
  );
export const claudeCode = runSync('ClaudeCode.default', () =>
  wrapHarness(nativeClaudeCode as unknown as typeof SDKContract.claudeCode),
);
