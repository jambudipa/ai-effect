import * as sdk from '@ai-sdk/sandbox-vercel';
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
  VercelNativeSandboxSession,
  VercelNetworkSandboxSessionResumeOptions,
  VercelSandboxSettings,
} from '@ai-sdk/sandbox-vercel';

type WithoutTemplate<T> = T extends unknown ? Omit<T, 'template'> : never;

export type VercelNetworkSandboxSessionCreateOptions<
  R = never,
  E = never,
> = WithoutTemplate<sdk.VercelNetworkSandboxSessionCreateOptions> & {
  readonly template?: SandboxTemplate<R, E>;
};

/** Create the legacy sandbox provider. */
export const createVercelSandbox = (settings?: sdk.VercelSandboxSettings) =>
  runSync('Vercel.createSandbox', () =>
    wrapSandboxProvider(sdk.createVercelSandbox(settings)),
  );

/** Construct the legacy provider with explicit settings. */
export const VercelSandboxProvider = {
  make: (settings: sdk.VercelSandboxSettings) =>
    runSync('VercelSandboxProvider.make', () =>
      wrapSandboxProvider(new sdk.VercelSandboxProvider(settings)),
    ),
};
export type VercelSandboxProvider = Effect.Success<
  ReturnType<typeof VercelSandboxProvider.make>
>;

/** Open a new sandbox in the caller's scope. */
export const createVercelNetworkSandboxSession = <R = never, E = never>(
  options?: VercelNetworkSandboxSessionCreateOptions<R, E>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>(options?.abortSignal);
    const session = yield* scopedResource(
      'Vercel.createNetworkSandboxSession',
      { abortSignal: owner.signal },
      (abortSignal) => {
        const { template, ...rest } = options ?? {};
        return sdk.createVercelNetworkSandboxSession({
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
export const resumeVercelNetworkSandboxSession = (
  options: sdk.VercelNetworkSandboxSessionResumeOptions,
) =>
  Effect.map(
    scopedResource(
      'Vercel.resumeNetworkSandboxSession',
      options,
      (abortSignal) =>
        sdk.resumeVercelNetworkSandboxSession({ ...options, abortSignal }),
      (session) => session.stop(),
    ),
    wrapNetworkSandbox,
  );

/** Wrap a host-owned sandbox without taking ownership of its lifecycle. */
export const createVercelSandboxSessionFromNativeSandbox = (
  native: sdk.VercelNativeSandboxSession,
) =>
  runSync('Vercel.createSandboxSessionFromNativeSandbox', () =>
    wrapSandbox(sdk.createVercelSandboxSessionFromNativeSandbox(native)),
  );

/** Wrap a host-owned network sandbox without stopping it on scope exit. */
export const createVercelNetworkSandboxSessionFromNativeSandbox = (
  native: sdk.VercelNativeSandboxSession,
) =>
  runSync('Vercel.createNetworkSandboxSessionFromNativeSandbox', () =>
    wrapNetworkSandbox(
      sdk.createVercelNetworkSandboxSessionFromNativeSandbox(native),
    ),
  );
