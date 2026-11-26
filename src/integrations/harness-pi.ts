import * as native from '@ai-sdk/harness-pi';
import type {
  ExtensionAPI,
  ExtensionFactory,
} from '@earendil-works/pi-coding-agent';
import { Effect } from 'effect';
import type { Scope } from 'effect/Scope';
import type * as SDKContract from './internal/harness-contracts/harness-pi.js';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';
import type { WithEffectCallbacks } from './internal/callbacks.js';
import { wrapHarness } from './internal/harness.js';
import { type SandboxSession, wrapSandbox } from './internal/sandbox.js';

/** Bind the native Pi adapter to its pinned extension and storage contracts. */
const sdk = native as unknown as typeof SDKContract;

export type {
  PiAuthenticationMode,
  PiCredentialStore,
  PiFileToolPathPolicy,
  PiMcpExposure,
  PiMcpServerConfig,
  PiResources,
  PiSandboxSkill,
} from './internal/harness-contracts/harness-pi.js';

/** Append, read, or optionally batch session entries through Effect callbacks. */
export type PiSessionStorage<E = never, R = never> = WithEffectCallbacks<
  SDKContract.PiSessionStorage,
  'append' | 'appendMany' | 'read',
  E,
  R
>;

/** Context passed to an Effect extension factory during setup of a Pi session. */
export interface PiHarnessExtensionSession {
  /** Use the wrapped sandbox when an extension needs session file or process operations. */
  readonly sandboxSession: SandboxSession;
  /** Working directory reported by the SDK for this Pi extension session. */
  readonly sessionWorkDir: SDKContract.PiHarnessExtensionSession['sessionWorkDir'];
  /** Read the native session instructions lazily while retaining the SDK's tagged failure. */
  readonly instructions: Effect.Effect<string | undefined, AiSdkError>;
}

/** Register an extension with the native Pi API and a wrapped session in the owning Effect scope. */
export type PiHarnessExtensionFactory<E = never, R = never> = (
  pi: ExtensionAPI,
  session: PiHarnessExtensionSession,
) => Effect.Effect<void, E, R>;

/** Configure Pi with optional Effect storage and native or Effect extension factories. */
export type PiHarnessSettings<E = never, R = never> = Omit<
  SDKContract.PiHarnessSettings,
  'sessionStorage' | 'extensionFactories'
> & {
  readonly sessionStorage?: PiSessionStorage<E, R>;
  readonly extensionFactories?: ReadonlyArray<
    PiHarnessExtensionFactory<E, R> | ExtensionFactory
  >;
};

/** Wrapped Pi harness with the keys of its native built-in tools preserved. */
type PiHarness = ReturnType<
  typeof wrapHarness<ReturnType<typeof sdk.createPi>['builtinTools']>
>;

/** Version reported by the pinned native Pi adapter. */
export const VERSION = sdk.VERSION;
/** Construct Pi without a callback scope when no storage or extension factory is supplied. */
export function createPi(
  settings?: PiHarnessSettings & {
    readonly sessionStorage?: never;
    readonly extensionFactories?: never;
  },
): Effect.Effect<PiHarness, AiSdkError>;
/** Construct Pi with a scope that owns the supplied storage and extension callbacks. */
export function createPi<E = never, R = never>(
  settings?: PiHarnessSettings<E, R>,
): Effect.Effect<PiHarness, AiSdkError, Scope | R>;
export function createPi<E = never, R = never>(
  settings?: PiHarnessSettings<E, R>,
): Effect.Effect<PiHarness, AiSdkError, Scope | R> {
  const { sessionStorage, extensionFactories, ...rest } = settings ?? {};
  if (!sessionStorage && !extensionFactories) {
    return runSync('Pi.create', () =>
      wrapHarness(sdk.createPi(settings && rest)),
    );
  }
  // The diagnostic compares R from the overload with R from the implementation.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const appendMany = sessionStorage?.appendMany?.bind(sessionStorage);
    const storage: SDKContract.PiSessionStorage | undefined =
      sessionStorage && {
        append: (input) =>
          owner.runCallback(
            Effect.suspend(() => sessionStorage.append(input)),
            input.abortSignal,
          ),
        ...(appendMany && {
          appendMany: (input) =>
            owner.runCallback(
              Effect.suspend(() => appendMany(input)),
              input.abortSignal,
            ),
        }),
        read: (input) =>
          owner.runCallback(
            Effect.suspend(() => sessionStorage.read(input)),
            input.abortSignal,
          ),
      };
    const factories =
      extensionFactories?.map<SDKContract.PiHarnessExtensionFactory>(
        (factory) => (api, session) =>
          owner.runCallback(
            Effect.suspend<void, AiSdkError | E, R>(() => {
              const result = factory(api, {
                sandboxSession: wrapSandbox(session.sandboxSession),
                sessionWorkDir: session.sessionWorkDir,
                instructions: runSync('Pi.extension.instructions', () =>
                  session.instructions(),
                ),
              });
              if (Effect.isEffect(result)) return result;
              return result
                ? runRequest('Pi.extension', {}, () => result)
                : Effect.void;
            }),
          ),
      );
    return yield* runSync('Pi.create', () =>
      wrapHarness(
        sdk.createPi({
          ...rest,
          ...(storage && { sessionStorage: storage }),
          ...(factories && { extensionFactories: factories }),
        }),
      ),
    );
  });
}
/** Resolve the SDK's default Pi harness when the Effect runs. */
export const pi = runSync('Pi.default', () => wrapHarness(sdk.pi));
