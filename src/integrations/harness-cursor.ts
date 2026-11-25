import {
  VERSION as nativeVersion,
  cursor as nativeCursor,
  createCursor as nativeCreateCursor,
} from '@ai-sdk/harness-cursor';
import type * as SDKContract from './internal/harness-contracts/harness-cursor.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  CursorAuthenticationMode,
  JSONObject,
} from './internal/harness-contracts/harness-cursor.js';

export type CursorHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.CursorHarnessSettings, R, E>;

export const VERSION = nativeVersion;
export const createCursor = <R = never, E = never>(
  settings?: CursorHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateCursor as unknown as typeof SDKContract.createCursor,
    settings,
  );
export const cursor = runSync('Cursor.default', () =>
  wrapHarness(nativeCursor as unknown as typeof SDKContract.cursor),
);
