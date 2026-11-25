import * as sdk from '@ai-sdk/harness-cursor';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  CursorAuthenticationMode,
  JSONObject,
} from '@ai-sdk/harness-cursor';

export type CursorHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<sdk.CursorHarnessSettings, R, E>;

export const VERSION = sdk.VERSION;
export const createCursor = <R = never, E = never>(
  settings?: CursorHarnessSettings<R, E>,
) => makeWithCredentialForwarding(sdk.createCursor, settings);
export const cursor = runSync('Cursor.default', () => wrapHarness(sdk.cursor));
