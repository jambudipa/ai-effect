import type { Telemetry as NativeTelemetry } from 'ai';
import { Effect } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
} from '../../internal/operation.js';
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

type Hook<C> = C extends (...args: infer Args) => infer A
  ? (...args: Args) => Effect.Effect<Awaited<A>, AiSdkError>
  : C;

type Durable = NonNullable<NativeTelemetry['experimental_durable']>;
type ToolOptions = Omit<
  Parameters<NonNullable<NativeTelemetry['executeTool']>>[0],
  'execute'
>;
type ModelOptions = Omit<
  Parameters<NonNullable<NativeTelemetry['executeLanguageModelCall']>>[0],
  'execute'
>;

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
export const wrapTelemetry = (name: string, native: NativeTelemetry) => {
  const adapted = Object.fromEntries(
    hooks.flatMap((key) => {
      const hook = native[key] as ((event: unknown) => unknown) | undefined;
      return hook
        ? [
            [
              key,
              (event: unknown) =>
                runValue(`${name}.${key}`, () => hook.call(native, event)),
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
            durable.captureContext(event),
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
                  ...options,
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
                  ...options,
                  execute: () => owner.runCallback(execute(), signal),
                }),
            );
          }),
        ),
    }),
  };
  telemetry.set(wrapper, native);
  return wrapper;
};

export const unwrapTelemetry = (wrapper: EffectTelemetry) =>
  telemetry.get(wrapper);
