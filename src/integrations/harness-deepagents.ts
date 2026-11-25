import * as native from '@ai-sdk/harness-deepagents';
import type * as SDKContract from './internal/harness-contracts/harness-deepagents.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

const sdk = native as unknown as typeof SDKContract;

export type {
  DeepAgentsAuthenticationMode,
  DeepAgentsThinkingConfig,
} from './internal/harness-contracts/harness-deepagents.js';

export type DeepAgentsHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.DeepAgentsHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createDeepAgents = <R = never, E = never>(
  settings?: DeepAgentsHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createDeepAgents, settings);
export const deepAgents = runSync('DeepAgents.default', () =>
  wrapHarness(sdk.deepAgents),
);
