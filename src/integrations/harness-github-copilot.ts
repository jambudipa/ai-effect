import * as sdk from '@ai-sdk/harness-github-copilot';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  GitHubCopilotAuthenticationMode,
  JSONObject,
} from '@ai-sdk/harness-github-copilot';

export type GitHubCopilotHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.GitHubCopilotHarnessSettings, R, E>;
export type GitHubCopilotBuiltinTools = Effect.Success<
  typeof githubCopilot
>['builtinTools'];
import type { Effect } from 'effect';

export const VERSION = sdk.VERSION;
export const createGitHubCopilot = <R = never, E = never>(
  settings?: GitHubCopilotHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createGitHubCopilot, settings);
export const githubCopilot = runSync('GitHubCopilot.default', () =>
  wrapHarness(sdk.githubCopilot),
);
