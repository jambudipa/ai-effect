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

/** GitHub Copilot adapter settings with optional credential forwarding in the Effect context. */
export type GitHubCopilotHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.GitHubCopilotHarnessSettings, R, E>;
/** Built-in tool handles and keys inferred from the default GitHub Copilot adapter. */
export type GitHubCopilotBuiltinTools = Effect.Success<
  typeof githubCopilot
>['builtinTools'];
import type { Effect } from 'effect';

/** Version reported by the native GitHub Copilot adapter. */
export const VERSION = nativeVersion;
/** Construct a GitHub Copilot harness in a scope that owns any credential forwarding callbacks. */
export const createGitHubCopilot = <R = never, E = never>(
  settings?: GitHubCopilotHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateGitHubCopilot as unknown as typeof SDKContract.createGitHubCopilot,
    settings,
  );
/** Resolve the SDK's default GitHub Copilot harness when the Effect runs. */
export const githubCopilot = runSync('GitHubCopilot.default', () =>
  wrapHarness(
    nativeGitHubCopilot as unknown as typeof SDKContract.githubCopilot,
  ),
);
