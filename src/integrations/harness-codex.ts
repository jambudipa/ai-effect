import {
  VERSION as nativeVersion,
  codex as nativeCodex,
  createCodex as nativeCreateCodex,
} from '@ai-sdk/harness-codex';
import type * as SDKContract from './internal/harness-contracts/harness-codex.js';
import { runSync } from '../internal/operation.js';
import {
  makeWithCredentialForwarding,
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  CodexAuthenticationMode,
  JSONObject,
} from './internal/harness-contracts/harness-codex.js';

/** Codex adapter settings with optional credential forwarding in the Effect context. */
export type CodexHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<SDKContract.CodexHarnessSettings, R, E>;

/** Version reported by the native Codex adapter. */
export const VERSION = nativeVersion;
/** Construct a Codex harness in a scope that owns any credential forwarding callbacks. */
export const createCodex = <R = never, E = never>(
  settings?: CodexHarnessSettings<R, E>,
) =>
  makeWithCredentialForwarding(
    nativeCreateCodex as unknown as typeof SDKContract.createCodex,
    settings,
  );
/** Resolve the SDK's default Codex harness when the Effect runs. */
export const codex = runSync('Codex.default', () =>
  wrapHarness(nativeCodex as unknown as typeof SDKContract.codex),
);
