import {
  VERSION as nativeVersion,
  claudeCode as nativeClaudeCode,
  createClaudeCode as nativeCreateClaudeCode,
} from '@ai-sdk/harness-claude-code';
import { Effect } from 'effect';
import type * as SDKContract from './internal/harness-contracts/harness-claude-code.js';
import { openOperation, runSync } from '../internal/operation.js';
import {
  type WithCredentialForwarding,
  wrapHarness,
} from './internal/harness.js';

export type {
  ClaudeCodeAuthenticationMode,
  ClaudeCodeThinkingConfig,
  JSONObject,
} from './internal/harness-contracts/harness-claude-code.js';

/** Configure the Claude Code adapter with scoped credential forwarding and channel observations. */
export type ClaudeCodeHarnessSettings<
  R = never,
  E = never,
> = WithCredentialForwarding<
  Omit<SDKContract.ClaudeCodeHarnessSettings, 'onDebug'>,
  R,
  E
> & {
  /** Observe a channel event in the harness scope. */
  readonly onDebug?: (
    ...args: Parameters<
      NonNullable<SDKContract.ClaudeCodeHarnessSettings['onDebug']>
    >
  ) => Effect.Effect<void, E, R>;
};

/** Version reported by the native Claude Code adapter. */
export const VERSION = nativeVersion;
/** Construct a Claude Code harness, keeping optional debug and credential callbacks in the current scope. */
export const createClaudeCode = <R = never, E = never>(
  settings?: ClaudeCodeHarnessSettings<R, E>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const { credentialForwarding, onDebug, ...rest } = settings ?? {};
    const create =
      nativeCreateClaudeCode as unknown as typeof SDKContract.createClaudeCode;
    return yield* runSync('ClaudeCode.create', () =>
      wrapHarness(
        create({
          ...rest,
          ...(credentialForwarding && {
            credentialForwarding: (input) =>
              owner.runCallback(
                Effect.suspend(() => credentialForwarding(input)),
              ),
          }),
          ...(onDebug && {
            onDebug: (event) => {
              void owner
                .runCallback(Effect.suspend(() => onDebug(event)))
                .catch(() => {});
            },
          }),
        }),
      ),
    );
  });
/** Resolve the SDK's default Claude Code harness when the Effect runs. */
export const claudeCode = runSync('ClaudeCode.default', () =>
  wrapHarness(nativeClaudeCode as unknown as typeof SDKContract.claudeCode),
);
