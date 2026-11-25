import * as native from '@ai-sdk/harness-fx';
import type * as SDKContract from './internal/harness-contracts/harness-fx.js';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

const sdk = native as unknown as typeof SDKContract;

export type {
  FxAuthenticationMode,
  FxSessionStorage,
} from './internal/harness-contracts/harness-fx.js';

export type { FxHarnessSettings } from './internal/harness-contracts/harness-fx.js';

export const VERSION = sdk.VERSION;
export const createFx = (settings?: SDKContract.FxHarnessSettings) =>
  runSync('Fx.create', () => wrapHarness(sdk.createFx(settings)));
export const fx = runSync('Fx.default', () => wrapHarness(sdk.fx));
