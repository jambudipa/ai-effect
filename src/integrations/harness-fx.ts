import * as native from '@ai-sdk/harness-fx';
import { Effect } from 'effect';
import type { Scope } from 'effect/Scope';
import type * as SDKContract from './internal/harness-contracts/harness-fx.js';
import {
  type AiSdkError,
  openOperation,
  runSync,
} from '../internal/operation.js';
import type { WithEffectCallbacks } from './internal/callbacks.js';
import { wrapHarness } from './internal/harness.js';

/** Resolve Fx exports through the pinned adapter contract. */
const sdk = native as unknown as typeof SDKContract;

export type { FxAuthenticationMode } from './internal/harness-contracts/harness-fx.js';

/** Persist and read session entries using Effects in the harness's callback context. */
export type FxSessionStorage<E = never, R = never> = WithEffectCallbacks<
  SDKContract.FxSessionStorage,
  'append' | 'read',
  E,
  R
>;

/** Configure Fx with optional storage that can use captured Effect services. */
export type FxHarnessSettings<E = never, R = never> = Omit<
  SDKContract.FxHarnessSettings,
  'sessionStorage'
> & {
  readonly sessionStorage?: FxSessionStorage<E, R>;
};

/** Wrapped Fx harness with the keys of its native built-in tools preserved. */
type FxHarness = ReturnType<
  typeof wrapHarness<ReturnType<typeof sdk.createFx>['builtinTools']>
>;

/** Version reported by the pinned native Fx adapter. */
export const VERSION = sdk.VERSION;
/** Construct an Fx harness without allocating a callback scope when native storage suffices. */
export function createFx(
  settings?: FxHarnessSettings & { readonly sessionStorage?: never },
): Effect.Effect<FxHarness, AiSdkError>;
/** Construct an Fx harness with optional Effect session storage owned by the current scope. */
export function createFx<E = never, R = never>(
  settings?: FxHarnessSettings<E, R>,
): Effect.Effect<FxHarness, AiSdkError, Scope | R>;
export function createFx<E = never, R = never>(
  settings?: FxHarnessSettings<E, R>,
): Effect.Effect<FxHarness, AiSdkError, Scope | R> {
  const { sessionStorage, ...options } = settings ?? {};
  if (!sessionStorage) {
    return runSync('Fx.create', () => wrapHarness(sdk.createFx(options)));
  }
  // The diagnostic compares R from the overload with R from the implementation.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const storage: SDKContract.FxSessionStorage = {
      append: (input) =>
        owner.runCallback(Effect.suspend(() => sessionStorage.append(input))),
      read: (input) =>
        owner.runCallback(
          Effect.suspend(() => sessionStorage.read(input)),
          input.abortSignal,
        ),
    };
    return yield* runSync('Fx.create', () =>
      wrapHarness(sdk.createFx({ ...options, sessionStorage: storage })),
    );
  });
}
/** Resolve the SDK's default Fx harness when the Effect runs. */
export const fx = runSync('Fx.default', () => wrapHarness(sdk.fx));
