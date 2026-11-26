import type { Telemetry as NativeTelemetry } from 'ai';
import { Effect } from 'effect';
import type { ToolSet as NativeTools } from '@ai-sdk/provider-utils';
import type { EffectTools } from '../../internal/tool.js';
import {
  AiSdkError,
  openOperation,
  runRequest,
  sdkError,
} from '../../internal/operation.js';
import { unwrapOutput, wrapOutput } from '../../internal/output.js';
import type { OutputSpecification } from '../../internal/output.js';
import { runValue } from './operation.js';

/** Lifecycle observations share a callback shape. Durable context and execution wrappers have separate contracts. */
type Hooks = Exclude<
  keyof NativeTelemetry,
  'experimental_durable' | 'executeTool' | 'executeLanguageModelCall'
>;

/** Enumerate lifecycle hooks that can use the shared event adapter. */
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

/** Keep the native output specification aligned with the wrapper's accepted input type. */
type NativeOutput<A, P, I> = Parameters<typeof wrapOutput<A, P, I>>[0];
/** Substitute the Effect output specification while retaining schema-derived result types. */
type WrappedOutput<T> =
  T extends NativeOutput<infer A, infer P, infer I>
    ? OutputSpecification<A, P, I>
    : T;
/** Preserve whether the event carried one integration or a collection of integrations. */
type WrappedIntegrations<T> =
  T extends ReadonlyArray<NativeTelemetry>
    ? { [K in keyof T]: EffectTelemetry }
    : T extends NativeTelemetry
      ? EffectTelemetry
      : T;

/** Replace SDK handles and errors where they cross the Effect telemetry boundary. */
export type TelemetryEvent<T> = T extends object
  ? {
      [K in keyof T]: K extends 'output'
        ? WrappedOutput<T[K]>
        : K extends 'integrations'
          ? WrappedIntegrations<T[K]>
          : K extends 'tools'
            ? WrappedTools<T[K]>
            : K extends 'error'
              ? AiSdkError | undefined
              : T[K];
    }
  : T;

/** Keep event tool keys when a native tool set can be mapped to Effect handles. */
type WrappedTools<T> = T extends NativeTools
  ? Pick<EffectTools, Extract<keyof T, string>>
  : T;

/** Recover the original Effect tools for a native event with an unchanged tool set. */
const nativeToolSets = new WeakMap<object, EffectTools>();
/** Recover individual tools if the SDK assembled a new tool set from existing definitions. */
const nativeToolHandles = new WeakMap<object, EffectTools[string]>();

/** Retain tool identities at both set and member level before the SDK emits telemetry. */
export function rememberTelemetryTools(
  native: object,
  tools: EffectTools,
): void {
  nativeToolSets.set(native, tools);
  for (const [name, value] of Object.entries(native)) {
    const tool = tools[name];
    if (tool && value && typeof value === 'object')
      nativeToolHandles.set(value, tool);
  }
}

/** Recover recognizable tool handles without rewriting unrelated payload objects. */
function wrapTelemetryTools(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const tools = nativeToolSets.get(value);
  if (tools) return tools;
  const definitions = Object.entries(value);
  if (
    !definitions.every(
      ([, item]) => item && typeof item === 'object' && 'inputSchema' in item,
    )
  )
    return value;
  const entries = definitions.flatMap(([name, native]) => {
    const tool =
      native && typeof native === 'object'
        ? nativeToolHandles.get(native)
        : void 0;
    return tool ? [[name, tool]] : [];
  });
  return Object.fromEntries(entries);
}

/** Translate native hook arguments and preserve each hook's awaited success type. */
type Hook<C> = C extends (...args: infer Args) => infer A
  ? (
      ...args: { [K in keyof Args]: TelemetryEvent<Args[K]> }
    ) => Effect.Effect<Awaited<A>, AiSdkError>
  : C;

/** Native durable hook contract for capturing telemetry context during durable work. */
type Durable = NonNullable<NativeTelemetry['experimental_durable']>;
/** Native tool-execution metadata after extracting the callback that invokes the tool. */
type NativeToolOptions = Omit<
  Parameters<NonNullable<NativeTelemetry['executeTool']>>[0],
  'execute'
>;
/** Native model-execution metadata after extracting the callback that invokes the model. */
type NativeModelOptions = Omit<
  Parameters<NonNullable<NativeTelemetry['executeLanguageModelCall']>>[0],
  'execute'
>;
/** Effect-safe event fields supplied to a telemetry wrapper for tool execution. */
type ToolOptions = TelemetryEvent<NativeToolOptions>;
/** Effect-safe event fields supplied to a telemetry wrapper for model execution. */
type ModelOptions = TelemetryEvent<NativeModelOptions>;

/** Optional lifecycle, durable-context, and execution hooks exposed as Effect operations. */
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

/** Map Effect telemetry wrappers to the original SDK integrations accepted by native calls. */
const telemetry = new WeakMap<EffectTelemetry, NativeTelemetry>();

/** Adapt telemetry hooks while keeping the native integration private. */
const wrappedTelemetry = new WeakMap<object, EffectTelemetry>();
/** Preserve original event identity for round trips through native telemetry hooks. */
const nativeEvents = new WeakMap<object, object>();

/** Associate an SDK integration with its wrapper and return the original integration. */
export const rememberTelemetry = (
  native: NativeTelemetry,
  wrapper: EffectTelemetry,
) => {
  wrappedTelemetry.set(native, wrapper);
  return native;
};

/** Wrap supported handles and redact native errors. Keep plain events unchanged when no adaptation is necessary. */
export const wrapTelemetryEvent = <T>(
  event: T,
  operation = 'Telemetry.callback',
): TelemetryEvent<T> => {
  if (typeof event !== 'object' || !event) return event as TelemetryEvent<T>;

  const { chunk, error, output, integrations, tools } = event as {
    readonly chunk?: unknown;
    readonly error?: unknown;
    readonly output?: unknown;
    readonly integrations?: unknown;
    readonly tools?: unknown;
  };
  const hasChunkError = chunk && typeof chunk === 'object' && 'error' in chunk;
  if (
    !output &&
    !integrations &&
    !tools &&
    error === undefined &&
    !hasChunkError
  )
    return event as TelemetryEvent<T>;

  const redact = (cause: unknown) =>
    cause instanceof AiSdkError ? cause : sdkError(operation, cause);
  const publicOutput =
    output &&
    typeof output === 'object' &&
    'parseCompleteOutput' in output &&
    typeof output.parseCompleteOutput === 'function'
      ? wrapOutput(output as NativeOutput<unknown, unknown, unknown>)
      : output;
  const wrapIntegration = (integration: NativeTelemetry) =>
    wrappedTelemetry.get(integration) ??
    wrapTelemetry('Telemetry.integration', integration);
  const publicEvent = {
    ...event,
    ...(error === undefined ? {} : { error: redact(error) }),
    ...(hasChunkError
      ? { chunk: { ...chunk, error: redact(chunk.error) } }
      : {}),
    ...(tools ? { tools: wrapTelemetryTools(tools) } : {}),
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

/** Return the original SDK event when available. Otherwise restore native handles for known event fields. */
export const unwrapTelemetryEvent = <T>(event: TelemetryEvent<T>): T => {
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

/** Defer native telemetry hooks and keep execution callbacks bound to a local Effect scope. */
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

/** Resolve a telemetry wrapper registered by this adapter before sending it to the SDK. */
export const unwrapTelemetry = (wrapper: EffectTelemetry) =>
  telemetry.get(wrapper);
