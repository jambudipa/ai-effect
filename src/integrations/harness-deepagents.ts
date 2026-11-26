import * as native from '@ai-sdk/harness-deepagents';
import type * as SDKContract from './internal/harness-contracts/harness-deepagents.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

/** Bind the adapter against the pinned Deep Agents contract before wrapping tools. */
const sdk = native as unknown as typeof SDKContract;

export type {
  DeepAgentsAuthenticationMode,
  DeepAgentsThinkingConfig,
} from './internal/harness-contracts/harness-deepagents.js';

/** Deep Agents settings with optional credential forwarding in the Effect context. */
export type DeepAgentsHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.DeepAgentsHarnessSettings, R, E>;

/** Version reported by the native Deep Agents adapter. */
export const VERSION = sdk.VERSION;
/** Construct a Deep Agents harness in a scope that owns any credential forwarding callbacks. */
export const createDeepAgents = <R = never, E = never>(
  settings?: DeepAgentsHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createDeepAgents, settings);
/** Resolve the SDK's default Deep Agents harness when the Effect runs. */
export const deepAgents = runSync('DeepAgents.default', () =>
  wrapHarness(sdk.deepAgents),
);
