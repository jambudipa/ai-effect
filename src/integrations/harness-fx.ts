import * as sdk from '@ai-sdk/harness-fx';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

export type {
  FxAuthenticationMode,
  FxSessionStorage,
} from '@ai-sdk/harness-fx';

export type { FxHarnessSettings } from '@ai-sdk/harness-fx';

export const VERSION = sdk.VERSION;
export const createFx = (settings?: sdk.FxHarnessSettings) =>
  runSync('Fx.create', () => wrapHarness(sdk.createFx(settings)));
export const fx = runSync('Fx.default', () => wrapHarness(sdk.fx));
