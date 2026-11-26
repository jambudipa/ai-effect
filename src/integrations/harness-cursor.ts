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

/** Cursor adapter settings with optional credential forwarding in the Effect context. */
export type CursorHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.CursorHarnessSettings, R, E>;

/** Version reported by the native Cursor adapter. */
export const VERSION = nativeVersion;
/** Construct a Cursor harness in a scope that owns any credential forwarding callbacks. */
export const createCursor = <R = never, E = never>(
  settings?: CursorHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateCursor as unknown as typeof SDKContract.createCursor,
    settings,
  );
/** Resolve the SDK's default Cursor harness when the Effect runs. */
export const cursor = runSync('Cursor.default', () =>
  wrapHarness(nativeCursor as unknown as typeof SDKContract.cursor),
);
