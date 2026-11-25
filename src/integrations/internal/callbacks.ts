import type { Effect } from 'effect';
import type { openOperation } from '../../internal/operation.js';

type NativeCallback = (...args: never[]) => unknown;
type Callback<T, E, R> = T extends (...args: infer Args) => infer A
  ? (...args: Args) => Effect.Effect<Awaited<A>, E, R>
  : T;

export type WithEffectCallbacks<T, Keys extends PropertyKey, E, R> = Omit<
  T,
  Keys
> & {
  [K in keyof T as K extends Keys ? K : never]: Callback<T[K], E, R>;
};

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Bind each callback to the current operation owner. */
export const bindCallbacks = <
  T extends object,
  const Keys extends ReadonlyArray<keyof T>,
  E,
  R,
>(
  options: WithEffectCallbacks<T, Keys[number], E, R>,
  keys: Keys,
  owner: Owner<R>,
): T => {
  const native = { ...options };
  const fields = native as Record<PropertyKey, unknown>;
  for (const key of keys) {
    const callback = fields[key];
    if (typeof callback === 'function') {
      const run = callback as Callback<NativeCallback, E, R>;
      fields[key] = (...args: never[]) => owner.runCallback(run(...args));
    }
  }
  return native as T;
};
