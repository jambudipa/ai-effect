import * as sdk from '@ai-sdk/harness-claude-code';
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
} from '@ai-sdk/harness-claude-code';

export type ClaudeCodeHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.ClaudeCodeHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createClaudeCode = <R = never, E = never>(
  settings?: ClaudeCodeHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createClaudeCode, settings);
export const claudeCode = runSync('ClaudeCode.default', () =>
  wrapHarness(sdk.claudeCode),
);
