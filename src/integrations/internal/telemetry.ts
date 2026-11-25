import type { Telemetry as NativeTelemetry } from 'ai';
import { Effect } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
} from '../../internal/operation.js';
import { unwrapOutput, wrapOutput } from '../../internal/output.js';
import type { OutputSpecification } from '../../internal/output.js';
import { runValue } from './operation.js';

type Hooks = Exclude<
  keyof NativeTelemetry,
  'experimental_durable' | 'executeTool' | 'executeLanguageModelCall'
>;

const hooks: ReadonlyArray<Hooks> = [
  'onStart',
  'onStepStart',
  'onLanguageModelCallStart',
  'onLanguageModelCallEnd',
  'onToolExecutionStart',
  'onToolExecutionEnd',
  'onStepEnd',
  'onStepFinish',
  'onStepError',
  'onObjectStepStart',
  'onObjectStepEnd',
  'onEmbedStart',
  'onEmbedEnd',
  'onRerankStart',
  'onRerankEnd',
  'experimental_onEvaluateStart',
  'experimental_onEvaluationModelCallStart',
  'experimental_onEvaluationModelCallEnd',
  'experimental_onEvaluateEnd',
  'experimental_onDecideStart',
  'experimental_onDecisionModelCallStart',
  'experimental_onDecisionModelCallEnd',
  'experimental_onDecideEnd',
  'experimental_onExtractStart',
  'experimental_onExtractionModelCallStart',
  'experimental_onExtractionModelCallEnd',
  'experimental_onExtractEnd',
  'experimental_onStreamTranscriptionStart',
  'experimental_onStreamTranscriptionEnd',
  'onEnd',
  'onAbort',
  'onError',
];

type NativeOutput<A, P, I> = Parameters<typeof wrapOutput<A, P, I>>[0];
type WrappedOutput<T> =
  T extends NativeOutput<infer A, infer P, infer I>
    ? OutputSpecification<A, P, I>
    : T;
type WrappedIntegrations<T> =
  T extends ReadonlyArray<NativeTelemetry>
    ? { [K in keyof T]: EffectTelemetry }
    : T extends NativeTelemetry
      ? EffectTelemetry
      : T;

export type TelemetryEvent<T> = T extends object
  ? {
      [K in keyof T]: K extends 'output'
        ? WrappedOutput<T[K]>
        : K extends 'integrations'
          ? WrappedIntegrations<T[K]>
          : T[K];
    }
  : T;

type Hook<C> = C extends (...args: infer Args) => infer A
  ? (
      ...args: { [K in keyof Args]: TelemetryEvent<Args[K]> }
    ) => Effect.Effect<Awaited<A>, AiSdkError>
  : C;

type Durable = NonNullable<NativeTelemetry['experimental_durable']>;
type NativeToolOptions = Omit<
  Parameters<NonNullable<NativeTelemetry['executeTool']>>[0],
  'execute'
>;
type NativeModelOptions = Omit<
  Parameters<NonNullable<NativeTelemetry['executeLanguageModelCall']>>[0],
  'execute'
>;
type ToolOptions = TelemetryEvent<NativeToolOptions>;
type ModelOptions = TelemetryEvent<NativeModelOptions>;

export type EffectTelemetry = {
  readonly [K in Hooks]?: Hook<NonNullable<NativeTelemetry[K]>>;
} & {
  readonly experimental_durable?: {
    readonly captureContext: Hook<Durable['captureContext']>;
  };
  readonly executeTool?: <A, E, R>(
    options: ToolOptions & { execute: () => Effect.Effect<A, E, R> },
  ) => Effect.Effect<A, AiSdkError, R>;
  readonly executeLanguageModelCall?: <A, E, R>(
    options: ModelOptions & { execute: () => Effect.Effect<A, E, R> },
  ) => Effect.Effect<A, AiSdkError, R>;
};

const telemetry = new WeakMap<EffectTelemetry, NativeTelemetry>();

/** Adapt telemetry hooks while keeping the native integration private. */
const wrappedTelemetry = new WeakMap<object, EffectTelemetry>();
const nativeEvents = new WeakMap<object, object>();

export const rememberTelemetry = (
  native: NativeTelemetry,
  wrapper: EffectTelemetry,
) => {
  wrappedTelemetry.set(native, wrapper);
  return native;
};

export const wrapTelemetryEvent = <T>(event: T): TelemetryEvent<T> => {
  if (typeof event !== 'object' || !event) return event as TelemetryEvent<T>;

  const { output, integrations } = event as {
    readonly output?: unknown;
    readonly integrations?: unknown;
  };
  if (!output && !integrations) return event as TelemetryEvent<T>;

  const publicOutput =
    output && typeof output === 'object' && 'parseCompleteOutput' in output
      ? wrapOutput(output as NativeOutput<unknown, unknown, unknown>)
      : output;
  const wrapIntegration = (integration: NativeTelemetry) =>
    wrappedTelemetry.get(integration) ??
    wrapTelemetry('Telemetry.integration', integration);
  const publicEvent = {
    ...event,
    ...(output ? { output: publicOutput } : {}),
    ...(integrations
      ? {
          integrations: Array.isArray(integrations)
            ? integrations.map(wrapIntegration)
            : wrapIntegration(integrations as NativeTelemetry),
        }
      : {}),
  };
  nativeEvents.set(publicEvent, event);
  return publicEvent as TelemetryEvent<T>;
};

const unwrapTelemetryEvent = <T>(event: TelemetryEvent<T>): T => {
  if (typeof event !== 'object' || !event) return event as T;

  const original = nativeEvents.get(event);
  if (original) return original as T;

  const { output, integrations } = event as {
    readonly output?: unknown;
    readonly integrations?: unknown;
  };
  return {
    ...event,
    ...(output &&
    typeof output === 'object' &&
    'responseFormat' in output &&
    Effect.isEffect(output.responseFormat)
      ? {
          output: unwrapOutput(
            output as OutputSpecification<unknown, unknown, unknown>,
          ),
        }
      : {}),
    ...(integrations
      ? {
          integrations: Array.isArray(integrations)
            ? integrations.map((item) => unwrapTelemetry(item))
            : unwrapTelemetry(integrations as EffectTelemetry),
        }
      : {}),
  } as T;
};

export const wrapTelemetry = (
  name: string,
  native: NativeTelemetry,
): EffectTelemetry => {
  const adapted = Object.fromEntries(
    hooks.flatMap((key) => {
      const hook = native[key] as ((event: unknown) => unknown) | undefined;
      return hook
        ? [
            [
              key,
              (event: unknown) =>
                runValue(`${name}.${key}`, () =>
                  hook.call(native, unwrapTelemetryEvent(event)),
                ),
            ],
          ]
        : [];
    }),
  ) as Pick<EffectTelemetry, Hooks>;
  const durable = native.experimental_durable;
  const executeTool = native.executeTool?.bind(native);
  const executeLanguageModelCall =
    native.executeLanguageModelCall?.bind(native);
  const wrapper: EffectTelemetry = {
    ...adapted,
    ...(durable && {
      experimental_durable: {
        captureContext: (event) =>
          runValue(`${name}.captureContext`, () =>
            durable.captureContext(
              unwrapTelemetryEvent<
                Parameters<typeof durable.captureContext>[0]
              >(event),
            ),
          ),
      },
    }),
    ...(executeTool && {
      executeTool: <A, E, R>({
        execute,
        ...options
      }: ToolOptions & { execute: () => Effect.Effect<A, E, R> }) =>
        Effect.scoped(
          Effect.gen(function* () {
            const owner = yield* openOperation<R>();
            return yield* runRequest(
              `${name}.executeTool`,
              { abortSignal: owner.signal },
              (signal) =>
                executeTool<A>({
                  ...unwrapTelemetryEvent<NativeToolOptions>(options),
                  execute: () => owner.runCallback(execute(), signal),
                }),
            );
          }),
        ),
    }),
    ...(executeLanguageModelCall && {
      executeLanguageModelCall: <A, E, R>({
        execute,
        ...options
      }: ModelOptions & { execute: () => Effect.Effect<A, E, R> }) =>
        Effect.scoped(
          Effect.gen(function* () {
            const owner = yield* openOperation<R>();
            return yield* runRequest(
              `${name}.executeLanguageModelCall`,
              { abortSignal: owner.signal },
              (signal) =>
                executeLanguageModelCall<A>({
                  ...unwrapTelemetryEvent<NativeModelOptions>(options),
                  execute: () => owner.runCallback(execute(), signal),
                }),
            );
          }),
        ),
    }),
  };
  telemetry.set(wrapper, native);
  rememberTelemetry(native, wrapper);
  return wrapper;
};

export const unwrapTelemetry = (wrapper: EffectTelemetry) =>
  telemetry.get(wrapper);
