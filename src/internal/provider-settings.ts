import { Effect } from 'effect';
import type { Scope } from 'effect';
import { openOperation, runSync } from './operation.js';
import type { AiSdkError } from './operation.js';
import type { ProviderHostOption } from './provider-host-configuration.js';

export type ProviderSettingValue<T> = T extends () => infer A
  ? Awaited<A>
  : Awaited<T>;

export type ProviderSetting<T, E, R> = T | Effect.Effect<T, E, R>;

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

type PlainSetting<T> = T extends (() => unknown) | PromiseLike<unknown>
  ? never
  : T;

export type StaticProviderSettings<Native, Keys extends keyof Native> = {
  [Key in keyof Native]: Key extends Keys
    ? PlainSetting<Required<Native>[Key]>
    : ProviderHostOption<Key, Native[Key]>;
};

export type EffectProviderSettings<Native, Keys extends keyof Native, E, R> = {
  [Key in keyof Native]: Key extends Keys
    ? | PlainSetting<Required<Native>[Key]>
      | Effect.Effect<ProviderSettingValue<Required<Native>[Key]>, E, R>
    : ProviderHostOption<Key, Native[Key]>;
};

export interface ProviderFactory<Native, Keys extends keyof Native, Provider> {
  (
    options?: StaticProviderSettings<Native, Keys>,
  ): Effect.Effect<Provider, AiSdkError>;
  <E, R>(
    options: EffectProviderSettings<Native, Keys, E, R>,
  ): Effect.Effect<Provider, AiSdkError, R | Scope.Scope>;
}

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
