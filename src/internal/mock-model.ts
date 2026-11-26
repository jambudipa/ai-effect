import { Effect } from 'effect';
import { openOperation, runSync } from './operation.js';

/** Turn a native test callback into an Effect while preserving its invocation arguments. */
type OwnedOption<Value, Services> = Value extends (
  ...args: infer Arguments
) => infer Result
  ? (...args: Arguments) => Effect.Effect<Awaited<Result>, unknown, Services>
  : Value extends PromiseLike<infer Result>
    ? Effect.Effect<Result, unknown, Services>
    : Value;

/** Preserve fixture response values and allow handler-generated results to use test services. */
export type MockOptions<Native, Services> = {
  readonly [Key in keyof Native]: OwnedOption<Native[Key], Services>;
};

/** Bind only function-valued mock settings to the test operation's Effect context. */
function bindOptions<Native extends object, Services>(
  options: MockOptions<Native, Services>,
  owner: Effect.Success<ReturnType<typeof openOperation<Services>>>,
): Native {
  return Object.fromEntries(
    Object.entries(options).map(([name, option]) => {
      if (Effect.isEffect(option)) {
        return [
          name,
          owner.runCallback(
            option as Effect.Effect<unknown, unknown, Services>,
          ),
        ];
      }
      if (typeof option === 'function') {
        const callback = option as (
          ...args: unknown[]
        ) => Effect.Effect<unknown, unknown, Services>;
        return [
          name,
          (...args: unknown[]) =>
            owner.runCallback(Effect.suspend(() => callback(...args))),
        ];
      }
      return [name, option];
    }),
  ) as Native;
}

/** Construct a fixture in the scope that owns its configured callbacks. */
export function mockModel<
  Settings extends object,
  Native,
  Model extends object,
  Key extends keyof Native = never,
>(
  operation: string,
  NativeMock: new (options?: Settings) => Native,
  wrap: (native: Native) => Model,
  ...history: Key[]
) {
  return <Services = never>(options?: MockOptions<Settings, Services>) =>
    Effect.gen(function* () {
      const owner = yield* openOperation<Services>();
      return yield* runSync(operation, () => {
        const native = options
          ? new NativeMock(bindOptions(options, owner))
          : new NativeMock();
        const result = wrap(native);
        Object.defineProperty(result, 'model', { value: result });
        for (const key of history) {
          Object.defineProperty(result, key, {
            enumerable: true,
            get() {
              const values = native[key];
              return Array.isArray(values) ? values.slice() : values;
            },
          });
        }
        return result as Model & { readonly model: Model } & Readonly<
            Pick<Native, Key>
          >;
      });
    });
}
