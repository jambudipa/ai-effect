import * as native from '@ai-sdk/harness-cline';
import type * as SDKContract from './internal/harness-contracts/harness-cline.js';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

/** Resolve Cline exports through the pinned adapter contract. */
const sdk = native as unknown as typeof SDKContract;

export type { ClineAuthenticationMode } from './internal/harness-contracts/harness-cline.js';

export type { ClineHarnessSettings } from './internal/harness-contracts/harness-cline.js';

/** Version reported by the pinned native Cline adapter. */
export const VERSION = sdk.VERSION;
/** Create a Cline harness lazily with the native adapter settings. */
export const createCline = (settings?: SDKContract.ClineHarnessSettings) =>
  runSync('Cline.create', () => wrapHarness(sdk.createCline(settings)));
/** Resolve the SDK's default Cline harness when the Effect runs. */
export const cline = runSync('Cline.default', () => wrapHarness(sdk.cline));
