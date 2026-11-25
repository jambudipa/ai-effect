import {
  VERSION as nativeVersion,
  githubCopilot as nativeGitHubCopilot,
  createGitHubCopilot as nativeCreateGitHubCopilot,
} from '@ai-sdk/harness-github-copilot';
import type * as SDKContract from './internal/harness-contracts/harness-github-copilot.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  GitHubCopilotAuthenticationMode,
  JSONObject,
} from './internal/harness-contracts/harness-github-copilot.js';

export type GitHubCopilotHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.GitHubCopilotHarnessSettings, R, E>;
export type GitHubCopilotBuiltinTools = Effect.Success<
  typeof githubCopilot
>['builtinTools'];
import type { Effect } from 'effect';

export const VERSION = nativeVersion;
export const createGitHubCopilot = <R = never, E = never>(
  settings?: GitHubCopilotHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateGitHubCopilot as unknown as typeof SDKContract.createGitHubCopilot,
    settings,
  );
export const githubCopilot = runSync('GitHubCopilot.default', () =>
  wrapHarness(
    nativeGitHubCopilot as unknown as typeof SDKContract.githubCopilot,
  ),
);
