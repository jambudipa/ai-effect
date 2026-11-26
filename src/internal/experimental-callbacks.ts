import { Effect } from 'effect';
import type { EffectTelemetry } from '../integrations/internal/telemetry.js';
import type { Telemetry as NativeTelemetry } from 'ai';
import {
  rememberTelemetry,
  unwrapTelemetry,
  wrapTelemetryEvent,
} from '../integrations/internal/telemetry.js';
import { openOperation, runRequest } from './operation.js';

/** List the experimental operation callbacks that require Effect binding at runtime. */
const callbackNames = [
  'onStart',
  'onEnd',
  'onError',
  'experimental_download',
  'download',
] as const;

/** Keep the type-level callback name union aligned with the runtime binding table. */
type CallbackName = (typeof callbackNames)[number];
/** Carry the scoped callback runtime shared by the model operation. */
export type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Preserve native callback parameters and resolve its awaited result in Effect. */
type AdaptCallback<F, R> = F extends (...args: infer Args) => infer A
  ? (...args: Args) => Effect.Effect<Awaited<A>, unknown, R>
  : F;

/** Keep a callback synchronous when the native SDK cannot await its result. */
type SyncCallback<F> = F extends (...args: infer Args) => infer A
  ? (...args: Args) => A
  : F;

/** Preserve the configured option shape while retaining synchronous callback fields. */
type AdaptSync<T> = T extends object
  ? { [K in keyof T]: SyncCallback<T[K]> }
  : T;

/** Replace the native telemetry integration slot with Effect-aware integrations. */
type AdaptTelemetry<T> = T extends object
  ? {
      [K in keyof T]: K extends 'integrations'
        ? EffectTelemetry | EffectTelemetry[]
        : T[K];
    }
  : T;

/** Adapt model selection, telemetry, and recognized callbacks while preserving other SDK options. */
export type ExperimentalOptions<Native, Model, R> = {
  [K in keyof Native]: K extends 'model'
    ? Model
    : K extends CallbackName
      ? AdaptCallback<Native[K], R>
      : K extends 'telemetry' | 'experimental_telemetry'
        ? AdaptTelemetry<Native[K]>
        : K extends '_internal' | 'poll'
          ? AdaptSync<Native[K]>
          : Native[K];
};

/** Use a callback's abort signal when the native SDK supplied one. */
const callbackSignal = (args: unknown[]) =>
  args.find(
    (arg): arg is { abortSignal: AbortSignal } =>
      typeof arg === 'object' &&
      !!arg &&
      'abortSignal' in arg &&
      arg.abortSignal instanceof AbortSignal,
  )?.abortSignal;

/** Bind registered or custom telemetry callbacks to the operation owner and adapt their event data. */
export const bindTelemetry = <R>(
  telemetry: EffectTelemetry,
  owner: Owner<R>,
) => {
  const native = unwrapTelemetry(telemetry);
  if (native) return native;

  const {
    executeTool,
    executeLanguageModelCall,
    experimental_durable,
    ...hooks
  } = telemetry;
  const bound = Object.fromEntries(
    Object.entries(hooks).map(([name, hook]) => [
      name,
      (event: never) =>
        owner.runCallback(
          Effect.suspend(() => hook(wrapTelemetryEvent(event))),
        ),
    ]),
  );
  return rememberTelemetry(
    {
      ...bound,
      ...(experimental_durable
        ? {
            experimental_durable: {
              captureContext: (
                event: Parameters<
                  typeof experimental_durable.captureContext
                >[0],
              ) =>
                owner.runCallback(
                  Effect.suspend(() =>
                    experimental_durable.captureContext(
                      wrapTelemetryEvent(event),
                    ),
                  ),
                ),
            },
          }
        : {}),
      ...(executeTool
        ? {
            executeTool: <A>(
              options: Omit<Parameters<typeof executeTool>[0], 'execute'> & {
                execute: () => PromiseLike<A>;
              },
            ) =>
              owner.runCallback(
                executeTool({
                  ...wrapTelemetryEvent(options),
                  execute: () =>
                    runRequest('telemetry.executeTool', {}, options.execute),
                }),
              ),
          }
        : {}),
      ...(executeLanguageModelCall
        ? {
            executeLanguageModelCall: <A>(
              options: Omit<
                Parameters<typeof executeLanguageModelCall>[0],
                'execute'
              > & { execute: () => PromiseLike<A> },
            ) =>
              owner.runCallback(
                executeLanguageModelCall({
                  ...wrapTelemetryEvent(options),
                  execute: () =>
                    runRequest(
                      'telemetry.executeLanguageModelCall',
                      {},
                      options.execute,
                    ),
                }),
              ),
          }
        : {}),
    } as NativeTelemetry,
    telemetry,
  );
};

/** Build native options with experimental callbacks and telemetry bound to the current owner. */
export const bindExperimentalOptions = <Native, Model, R>(
  options: ExperimentalOptions<Native, Model, R>,
  owner: Owner<R>,
): Native => {
  const result = Object.fromEntries(
    Object.entries(options).map(([key, value]) => {
      if (
        callbackNames.some((name) => name === key) &&
        typeof value === 'function'
      )
        return [
          key,
          (...args: unknown[]) =>
            owner.runCallback(
              Effect.suspend(() => value(...args)),
              callbackSignal(args),
            ),
        ];

      if (
        (key === 'telemetry' || key === 'experimental_telemetry') &&
        value &&
        typeof value === 'object' &&
        'integrations' in value
      ) {
        const { integrations, ...settings } = value;
        return [
          key,
          {
            ...settings,
            ...(integrations
              ? {
                  integrations: Array.isArray(integrations)
                    ? integrations.map((item) =>
                        bindTelemetry(item as EffectTelemetry, owner),
                      )
                    : bindTelemetry(integrations as EffectTelemetry, owner),
                }
              : {}),
          },
        ];
      }

      return [key, value];
    }),
  );
  return result as Native;
};
