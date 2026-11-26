import * as native from '@ai-sdk/sandbox-vercel';
import type * as SDKContract from './internal/harness-contracts/sandbox-vercel.js';
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

/** Bind native Vercel sandbox exports to the pinned adapter contract. */
const sdk = native as unknown as typeof SDKContract;

export type {
  VercelNativeSandboxSession,
  VercelNetworkSandboxSessionResumeOptions,
  VercelSandboxSettings,
} from './internal/harness-contracts/sandbox-vercel.js';

/** Remove the template field from each native settings variant before adapting it. */
type WithoutTemplate<T> = T extends unknown ? Omit<T, 'template'> : never;
/** Shared provider wrapper before requiring native session resumption support. */
type SandboxProvider = ReturnType<typeof wrapSandboxProvider>;
/** Vercel provider wrapper whose existing sessions can be resumed within a scope. */
type ResumableSandboxProvider = SandboxProvider &
  Required<Pick<SandboxProvider, 'resumeSession'>>;

/** Creation settings with an optional Effect bootstrap template for a native Vercel session. */
export type VercelNetworkSandboxSessionCreateOptions<
  R = never,
  E = never,
> = WithoutTemplate<SDKContract.VercelNetworkSandboxSessionCreateOptions> & {
  readonly template?: SandboxTemplate<R, E>;
};

/** Create the legacy sandbox provider. */
export const createVercelSandbox = (
  settings?: SDKContract.VercelSandboxSettings,
) =>
  runSync('Vercel.createSandbox', () =>
    wrapSandboxProvider(sdk.createVercelSandbox(settings)),
  );

/** Construct the legacy provider with explicit settings. */
export const VercelSandboxProvider = {
  make: (settings: SDKContract.VercelSandboxSettings) =>
    runSync(
      'VercelSandboxProvider.make',
      () =>
        // The pinned Vercel class always supplies the resume method.
        wrapSandboxProvider(
          new sdk.VercelSandboxProvider(settings),
        ) as ResumableSandboxProvider,
    ),
};
/** Wrapped Vercel provider returned by the lazy factory, including session resumption. */
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
  options: SDKContract.VercelNetworkSandboxSessionResumeOptions,
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
  native: SDKContract.VercelNativeSandboxSession,
) =>
  runSync('Vercel.createSandboxSessionFromNativeSandbox', () =>
    wrapSandbox(sdk.createVercelSandboxSessionFromNativeSandbox(native)),
  );

/** Wrap a host-owned network sandbox without stopping it on scope exit. */
export const createVercelNetworkSandboxSessionFromNativeSandbox = (
  native: SDKContract.VercelNativeSandboxSession,
) =>
  runSync('Vercel.createNetworkSandboxSessionFromNativeSandbox', () =>
    wrapNetworkSandbox(
      sdk.createVercelNetworkSandboxSessionFromNativeSandbox(native),
    ),
  );
