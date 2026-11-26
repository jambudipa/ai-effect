import { Effect } from 'effect';
import type { Scope } from 'effect';
import { openOperation, runSync } from './operation.js';
import type { AiSdkError } from './operation.js';
import type { ProviderHostOption } from './provider-host-configuration.js';

/** Infer the setting value after evaluating its native resolver and settling any promise. */
export type ProviderSettingValue<T> = T extends () => infer A
  ? Awaited<A>
  : Awaited<T>;

/** Accept a resolved setting or an Effect that resolves it in the provider scope. */
export type ProviderSetting<T, E, R> = T | Effect.Effect<T, E, R>;

/** Bind configured Effect settings to the provider owner's callbacks and defer their evaluation. */
export const createWithProviderSettings = <Native extends object, R, Provider>(
  operation: string,
  options: object | undefined,
  resolverKeys: ReadonlyArray<string>,
  create: (options?: Native) => Provider,
): Effect.Effect<Provider, AiSdkError, R | Scope.Scope> =>
  Effect.suspend(() => {
    if (!options) return runSync(operation, () => create());

    const entries = Object.entries(options);
    const hasResolver = entries.some(
      ([key, value]) => resolverKeys.includes(key) && Effect.isEffect(value),
    );
    if (!hasResolver)
      return runSync(operation, () => create(options as Native));

    return Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const resolved = Object.fromEntries(
        entries.map(([key, value]) => [
          key,
          resolverKeys.includes(key) && Effect.isEffect(value)
            ? () =>
                owner.runCallback(value as Effect.Effect<unknown, unknown, R>)
            : value,
        ]),
      );
      return yield* runSync(operation, () =>
        create({ ...options, ...resolved } as Native),
      );
    });
  });

/** Exclude native promise and resolver shapes from the static settings overload. */
type PlainSetting<T> = T extends (() => unknown) | PromiseLike<unknown>
  ? never
  : T;

/** Require direct values for selected settings when no callback scope is needed. */
export type StaticProviderSettings<Native, Keys extends keyof Native> = {
  [Key in keyof Native]: Key extends Keys
    ? PlainSetting<Required<Native>[Key]>
    : ProviderHostOption<Key, Native[Key]>;
};

/** Accept Effects only on selected native settings that support deferred resolution. */
export type EffectProviderSettings<Native, Keys extends keyof Native, E, R> = {
  [Key in keyof Native]: Key extends Keys
    ? | PlainSetting<Required<Native>[Key]>
      | Effect.Effect<ProviderSettingValue<Required<Native>[Key]>, E, R>
    : ProviderHostOption<Key, Native[Key]>;
};

/** Keep static provider construction scope-free and expose requirements for effectful settings. */
export interface ProviderFactory<Native, Keys extends keyof Native, Provider> {
  (
    options?: StaticProviderSettings<Native, Keys>,
  ): Effect.Effect<Provider, AiSdkError>;
  <E, R>(
    options: EffectProviderSettings<Native, Keys, E, R>,
  ): Effect.Effect<Provider, AiSdkError, R | Scope.Scope>;
}

/** Build a public provider factory that binds resolvers before invoking the native constructor. */
export const adaptProviderFactory = <
  Native extends object,
  Keys extends Extract<keyof Native, string>,
  Provider,
>(
  operation: string,
  keys: ReadonlyArray<Keys>,
  create: (options?: Native) => Provider,
): ProviderFactory<Native, Keys, Provider> =>
  ((options?: object) =>
    createWithProviderSettings(
      operation,
      options,
      keys,
      create,
    )) as ProviderFactory<Native, Keys, Provider>;
