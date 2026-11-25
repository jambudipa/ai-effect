import * as native from '@ai-sdk/harness-cline';
import type * as SDKContract from './internal/harness-contracts/harness-cline.js';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

const sdk = native as unknown as typeof SDKContract;

export type { ClineAuthenticationMode } from './internal/harness-contracts/harness-cline.js';

export type { ClineHarnessSettings } from './internal/harness-contracts/harness-cline.js';

export const VERSION = sdk.VERSION;
export const createCline = (settings?: SDKContract.ClineHarnessSettings) =>
  runSync('Cline.create', () => wrapHarness(sdk.createCline(settings)));
export const cline = runSync('Cline.default', () => wrapHarness(sdk.cline));
