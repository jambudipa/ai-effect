import * as sdk from '@ai-sdk/harness-deepagents';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  DeepAgentsAuthenticationMode,
  DeepAgentsThinkingConfig,
} from '@ai-sdk/harness-deepagents';

export type DeepAgentsHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.DeepAgentsHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createDeepAgents = <R = never, E = never>(
  settings?: DeepAgentsHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createDeepAgents, settings);
export const deepAgents = runSync('DeepAgents.default', () =>
  wrapHarness(sdk.deepAgents),
);
