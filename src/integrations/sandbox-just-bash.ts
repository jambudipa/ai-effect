import * as native from '@ai-sdk/sandbox-just-bash';
import type * as SDKContract from './internal/harness-contracts/sandbox-just-bash.js';
import { Effect } from 'effect';
import { openOperation, runSync } from '../internal/operation.js';
import {
  bindTemplate,
  scopedResource,
  type SandboxTemplate,
  wrapNetworkSandbox,
  wrapSandbox,
  wrapSandboxProvider,
} from './internal/sandbox.js';

const sdk = native as unknown as typeof SDKContract;

export type {
  JustBashNativeSandboxSession,
  JustBashNetworkSandboxSessionResumeOptions,
  JustBashSandboxSettings,
} from './internal/harness-contracts/sandbox-just-bash.js';

type WithoutTemplate<T> = T extends unknown ? Omit<T, 'template'> : never;

export type JustBashNetworkSandboxSessionCreateOptions<
  R = never,
  E = never,
> = WithoutTemplate<SDKContract.JustBashNetworkSandboxSessionCreateOptions> & {
  readonly template?: SandboxTemplate<R, E>;
};

/** Create the legacy sandbox provider. */
export const createJustBashSandbox = (
  settings?: SDKContract.JustBashSandboxSettings,
) =>
  runSync('JustBash.createSandbox', () =>
    wrapSandboxProvider(sdk.createJustBashSandbox(settings)),
  );

/** Construct the legacy provider with explicit settings. */
export const JustBashSandboxProvider = {
  make: (settings: SDKContract.JustBashSandboxSettings) =>
    runSync('JustBashSandboxProvider.make', () =>
      wrapSandboxProvider(new sdk.JustBashSandboxProvider(settings)),
    ),
};
export type JustBashSandboxProvider = Effect.Success<
  ReturnType<typeof JustBashSandboxProvider.make>
>;

/** Open a new sandbox in the caller's scope. */
export const createJustBashNetworkSandboxSession = <R = never, E = never>(
  options?: JustBashNetworkSandboxSessionCreateOptions<R, E>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>(options?.abortSignal);
    const session = yield* scopedResource(
      'JustBash.createNetworkSandboxSession',
      { abortSignal: owner.signal },
      (abortSignal) => {
        const { template, ...rest } = options ?? {};
        return sdk.createJustBashNetworkSandboxSession({
          ...rest,
          abortSignal,
          ...(template && { template: bindTemplate(template, owner) }),
        });
      },
      (session) => session.destroy(),
    );
    return wrapNetworkSandbox(session);
  });

/** Reattach to an existing sandbox in the caller's scope. */
export const resumeJustBashNetworkSandboxSession = (
  options: SDKContract.JustBashNetworkSandboxSessionResumeOptions,
) =>
  Effect.map(
    scopedResource(
      'JustBash.resumeNetworkSandboxSession',
      options,
      (abortSignal) =>
        sdk.resumeJustBashNetworkSandboxSession({ ...options, abortSignal }),
      (session) => session.stop(),
    ),
    wrapNetworkSandbox,
  );

/** Wrap a host-owned sandbox without taking ownership of its lifecycle. */
export const createJustBashSandboxSessionFromNativeSandbox = (
  native: SDKContract.JustBashNativeSandboxSession,
) =>
  runSync('JustBash.createSandboxSessionFromNativeSandbox', () =>
    wrapSandbox(sdk.createJustBashSandboxSessionFromNativeSandbox(native)),
  );

/** Wrap a host-owned network sandbox without stopping it on scope exit. */
export const createJustBashNetworkSandboxSessionFromNativeSandbox = (
  native: SDKContract.JustBashNativeSandboxSession,
) =>
  runSync('JustBash.createNetworkSandboxSessionFromNativeSandbox', () =>
    wrapNetworkSandbox(
      sdk.createJustBashNetworkSandboxSessionFromNativeSandbox(native),
    ),
  );
