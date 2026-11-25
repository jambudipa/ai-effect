import * as sdk from '@ai-sdk/sandbox-just-bash';
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

export type {
  JustBashNativeSandboxSession,
  JustBashNetworkSandboxSessionResumeOptions,
  JustBashSandboxSettings,
} from '@ai-sdk/sandbox-just-bash';

type WithoutTemplate<T> = T extends unknown ? Omit<T, 'template'> : never;

export type JustBashNetworkSandboxSessionCreateOptions<
  R = never,
  E = never,
> = WithoutTemplate<sdk.JustBashNetworkSandboxSessionCreateOptions> & {
  readonly template?: SandboxTemplate<R, E>;
};

/** Create the legacy sandbox provider. */
export const createJustBashSandbox = (settings?: sdk.JustBashSandboxSettings) =>
  runSync('JustBash.createSandbox', () =>
    wrapSandboxProvider(sdk.createJustBashSandbox(settings)),
  );

/** Construct the legacy provider with explicit settings. */
export const JustBashSandboxProvider = {
  make: (settings: sdk.JustBashSandboxSettings) =>
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
  options: sdk.JustBashNetworkSandboxSessionResumeOptions,
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
  native: sdk.JustBashNativeSandboxSession,
) =>
  runSync('JustBash.createSandboxSessionFromNativeSandbox', () =>
    wrapSandbox(sdk.createJustBashSandboxSessionFromNativeSandbox(native)),
  );

/** Wrap a host-owned network sandbox without stopping it on scope exit. */
export const createJustBashNetworkSandboxSessionFromNativeSandbox = (
  native: sdk.JustBashNativeSandboxSession,
) =>
  runSync('JustBash.createNetworkSandboxSessionFromNativeSandbox', () =>
    wrapNetworkSandbox(
      sdk.createJustBashNetworkSandboxSessionFromNativeSandbox(native),
    ),
  );
