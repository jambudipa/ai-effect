import * as sdk from '@ai-sdk/harness-cline';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

export type { ClineAuthenticationMode } from '@ai-sdk/harness-cline';

export type { ClineHarnessSettings } from '@ai-sdk/harness-cline';

export const VERSION = sdk.VERSION;
export const createCline = (settings?: sdk.ClineHarnessSettings) =>
  runSync('Cline.create', () => wrapHarness(sdk.createCline(settings)));
export const cline = runSync('Cline.default', () => wrapHarness(sdk.cline));
