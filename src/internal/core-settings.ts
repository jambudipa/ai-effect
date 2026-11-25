import type * as sdk from 'ai';
import { Effect, HashSet, type Schema as EffectSchema } from 'effect';
import type { FlexibleSchema, Schema } from '../core-schema.js';
import type { LanguageModel } from '../core.js';
import {
  bindTransform,
  type TransformServices,
  type TransformValue,
} from './core-transform.js';
import {
  unwrapSandbox,
  wrapSandbox,
  type SandboxSession,
} from '../integrations/internal/sandbox-base.js';
import {
  wrapTelemetryEvent,
  type EffectTelemetry,
} from '../integrations/internal/telemetry.js';
import { bindTelemetry, type Owner } from './experimental-callbacks.js';
import { unwrapLanguageModel, wrapLanguageModel } from './language-model.js';
import { bindLazySchema } from './lazy-schema.js';
import { unwrapLegacyModel, wrapLegacyModel } from './legacy-model.js';
import type { OutputSpecification } from './output.js';
import { runRequest, type AiSdkError } from './operation.js';
import { unwrapSteering, type Steering } from './steering.js';
import type { EffectTools } from './tool.js';

type PublicOutput<Output> =
  Output extends sdk.OutputInterface<infer A, infer P, infer I>
    ? OutputSpecification<A, P, I>
    : Output;
type PublicModel<Value> =
  Value extends Exclude<sdk.LanguageModel, string> ? LanguageModel : Value;
type PublicTools<Value, Tools> = Value extends sdk.ToolSet ? Tools : Value;
type PublicInputSchema<Value> = Value extends (
  ...args: infer Args
) => infer Result
  ? (...args: Args) => Effect.Effect<Awaited<Result>, AiSdkError>
  : Value;

export type CoreEvent<
  Event,
  Tools extends object = object,
> = Event extends readonly unknown[]
  ? Event
  : Event extends object
    ? {
        [K in keyof Event]: K extends 'model'
          ? PublicModel<Event[K]>
          : K extends 'output'
            ? PublicOutput<Event[K]>
            : K extends 'experimental_sandbox'
              ? SandboxSession | undefined
              : K extends 'tools'
                ? PublicTools<Event[K], Tools>
                : K extends 'inputSchema'
                  ? PublicInputSchema<Event[K]>
                  : Event[K];
      }
    : Event;

export type CoreCallback<
  Value,
  R,
  Tools extends object = object,
> = Value extends (...args: infer Args) => infer Result
  ? (
      ...args: { [K in keyof Args]: CoreEvent<Args[K], Tools> }
    ) => Effect.Effect<CoreEvent<Awaited<Result>, Tools>, unknown, R>
  : Value extends readonly (infer Item)[]
    ? readonly CoreCallback<Item, R, Tools>[]
    : Value;

type CallbackMap<Value, R, Tools extends object> = Value extends (
  ...args: never[]
) => unknown
  ? CoreCallback<Value, R, Tools>
  : Value extends object
    ? { [K in keyof Value]: CoreCallback<Value[K], R, Tools> }
    : Value;

type Telemetry<Value> = Value extends object
  ? {
      [K in keyof Value]: K extends 'integrations'
        ? EffectTelemetry | readonly EffectTelemetry[]
        : Value[K];
    }
  : Value;

type PrepareCall<Value, R, Tools extends object> = Value extends (
  ...args: infer Args
) => infer Result
  ? (
      ...args: {
        [K in keyof Args]: CoreEvent<CoreOptions<Args[K], R, Tools>, Tools>;
      }
    ) => Effect.Effect<
      CoreEvent<CoreOptions<Awaited<Result>, R, Tools>, Tools>,
      unknown,
      R
    >
  : Value;

type StopCallback<Value, R> = Value extends (...args: infer Args) => unknown
  ? (...args: Args) => boolean | Effect.Effect<boolean, unknown, R>
  : Value extends readonly (infer Item)[]
    ? readonly StopCallback<Item, R>[]
    : Value;

type SyncSettings<Value> = Value extends object
  ? {
      [K in keyof Value]: Value[K] extends (...args: infer Args) => infer A
        ? (...args: Args) => A
        : Value[K];
    }
  : Value;

type DirectCallback =
  | `on${string}`
  | `experimental_on${string}`
  | 'stopWhen'
  | 'prepareStep'
  | 'prepareCall'
  | 'repairToolCall'
  | 'experimental_repairToolCall'
  | 'experimental_repairText'
  | 'download'
  | 'experimental_download';

type CallbackMapName =
  'toolApproval' | 'experimental_refineToolInput' | 'refineToolInput';

type ServicesInCallback<Value> = Value extends (
  ...args: never[]
) => infer Result
  ? Result extends Effect.Effect<unknown, unknown, infer R>
    ? R
    : never
  : Value extends readonly (infer Item)[]
    ? ServicesInCallback<Item>
    : never;

export type CoreServices<Options> = {
  [Key in keyof Options]: Key extends DirectCallback
    ? ServicesInCallback<Options[Key]>
    : Key extends CallbackMapName
      ? | ServicesInCallback<Options[Key]>
        | (Options[Key] extends object
            ? ServicesInCallback<Options[Key][keyof Options[Key]]>
            : never)
      : Key extends 'experimental_transform'
        ? TransformServices<Options[Key]>
        : Key extends 'output'
          ? OutputServices<Options[Key]>
          : Key extends 'callOptionsSchema'
            ? SchemaServices<Options[Key]>
            : never;
}[keyof Options];

type OutputServices<Value> =
  Value extends OutputSpecification<unknown, unknown, unknown, infer R>
    ? R
    : never;

type SchemaServices<Value> = Value extends
  | Schema<unknown, infer R>
  | EffectSchema.ConstraintDecoder<unknown, infer R>
  | Effect.Effect<Schema<unknown, unknown>, unknown, infer R>
  ? R
  : never;

export type CoreOptions<
  Options,
  R,
  Tools extends object = object,
> = Options extends object
  ? {
      [K in keyof Options]: K extends 'stopWhen'
        ? StopCallback<Options[K], R>
        : K extends 'prepareCall'
          ? PrepareCall<Options[K], R, Tools>
          : K extends DirectCallback
            ? CoreCallback<Options[K], R, Tools>
            : K extends
                  | 'toolApproval'
                  | 'experimental_refineToolInput'
                  | 'refineToolInput'
              ? CallbackMap<Options[K], R, Tools>
              : K extends 'telemetry' | 'experimental_telemetry'
                ? Telemetry<Options[K]>
                : K extends 'experimental_sandbox'
                  ? SandboxSession
                  : K extends 'experimental_steering'
                    ? Steering
                    : K extends 'experimental_transform'
                      ? | TransformValue<Tools, R>
                        | readonly TransformValue<Tools, R>[]
                      : K extends '_internal'
                        ? SyncSettings<Options[K]>
                        : Options[K];
    }
  : Options;

export function modelForSdk(model: LanguageModel) {
  if (typeof model === 'string') return model;
  const native =
    model.specificationVersion === 'v4'
      ? unwrapLanguageModel(model)
      : unwrapLegacyModel<
          Exclude<sdk.LanguageModel, string | { specificationVersion: 'v4' }>
        >(model);
  return native;
}

function publicEvent(event: unknown, tools: object | undefined) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return event;
  const exposed = wrapTelemetryEvent(event);
  const { model, experimental_sandbox, inputSchema, ...data } = exposed as {
    readonly model?: sdk.LanguageModel;
    readonly tools?: object;
    readonly experimental_sandbox?: Parameters<typeof wrapSandbox>[0];
    readonly inputSchema?: unknown;
  };
  const handle =
    model && typeof model !== 'string' && 'doGenerate' in model
      ? model.specificationVersion === 'v4'
        ? wrapLanguageModel(model)
        : wrapLegacyModel(model)
      : model;
  if (!model && !experimental_sandbox && !inputSchema && !('tools' in data))
    return exposed;
  return {
    ...data,
    ...(typeof inputSchema === 'function'
      ? {
          inputSchema: (...args: unknown[]) =>
            runRequest('ToolCallRepair.inputSchema', {}, () =>
              inputSchema(...args),
            ),
        }
      : 'inputSchema' in exposed
        ? { inputSchema }
        : {}),
    ...(model !== undefined ? { model: handle } : {}),
    ...(experimental_sandbox
      ? { experimental_sandbox: wrapSandbox(experimental_sandbox) }
      : {}),
    ...('tools' in data && data.tools && !Array.isArray(data.tools)
      ? { tools }
      : {}),
  };
}

function signal(args: readonly unknown[]) {
  return args.find(
    (value): value is { abortSignal: AbortSignal } =>
      typeof value === 'object' &&
      !!value &&
      'abortSignal' in value &&
      value.abortSignal instanceof AbortSignal,
  )?.abortSignal;
}

type EffectCallback<R> = (
  ...args: unknown[]
) => Effect.Effect<unknown, unknown, R>;

const directNames = HashSet.fromIterable<string>([
  'stopWhen',
  'prepareStep',
  'prepareCall',
  'repairToolCall',
  'experimental_repairToolCall',
  'experimental_repairText',
  'download',
  'experimental_download',
]);

export function bindCoreOptions<Native = Record<string, unknown>, R = never>(
  options: object,
  owner: Owner<R>,
  tools?: object,
  bindPrepared?: (value: Record<string, unknown>) => Record<string, unknown>,
): Native {
  const configured = options as Readonly<Record<string, unknown>>;
  const prepareInput = (event: unknown) => {
    if (!event || typeof event !== 'object') return event;
    return Object.fromEntries(
      Object.entries(event).map(([key, value]) => {
        const owned =
          HashSet.has(directNames, key) ||
          /^on[A-Z]|^experimental_on[A-Z]/u.test(key) ||
          key === 'toolApproval' ||
          key === 'experimental_refineToolInput' ||
          key === 'telemetry' ||
          key === 'experimental_telemetry';
        return [
          key,
          owned && Object.hasOwn(configured, key) ? configured[key] : value,
        ];
      }),
    );
  };
  const bind = (value: unknown, prepare?: 'step' | 'call'): unknown => {
    if (Array.isArray(value))
      return value.map((entry: unknown) => bind(entry, prepare));
    if (typeof value !== 'function') return value;
    const callback = value as
      EffectCallback<R> | ((...args: unknown[]) => boolean);
    return (...args: unknown[]) =>
      owner.runCallback(
        Effect.suspend(() => {
          const events = args.map((arg) => publicEvent(arg, tools));
          const result = callback(
            ...(prepare === 'call' ? events.map(prepareInput) : events),
          );
          return Effect.isEffect(result) ? result : Effect.succeed(result);
        }).pipe(
          Effect.map((result) => {
            if (!prepare || !result || typeof result !== 'object')
              return result;
            const value = result as Record<string, unknown>;
            if (bindPrepared) return bindPrepared(value);
            return value.model
              ? { ...value, model: modelForSdk(value.model as LanguageModel) }
              : value;
          }),
        ),
        signal(args),
      );
  };

  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => {
      if (value === undefined) return [key, value];
      if (key === 'callOptionsSchema') {
        return [
          key,
          bindLazySchema(
            value as FlexibleSchema<unknown, R>,
            owner,
            'ToolLoopAgent.callOptionsSchema',
          ),
        ];
      }
      if (key === 'experimental_sandbox')
        return [key, unwrapSandbox(value as SandboxSession)];
      if (key === 'experimental_steering')
        return [key, unwrapSteering(value as Steering)];
      if (key === 'experimental_transform') {
        const unwrap = (transform: TransformValue<EffectTools, R>) =>
          bindTransform(transform, owner, tools as EffectTools | undefined);
        return [
          key,
          Array.isArray(value)
            ? value.map(unwrap)
            : unwrap(value as TransformValue<EffectTools, R>),
        ];
      }
      if (key === 'telemetry' || key === 'experimental_telemetry') {
        const { integrations, ...settings } = value as {
          integrations?: EffectTelemetry | EffectTelemetry[];
        };
        return [
          key,
          {
            ...settings,
            ...(integrations
              ? {
                  integrations: Array.isArray(integrations)
                    ? integrations.map((telemetry) =>
                        bindTelemetry(telemetry, owner),
                      )
                    : bindTelemetry(integrations, owner),
                }
              : {}),
          },
        ];
      }
      if (
        key === 'toolApproval' ||
        key === 'experimental_refineToolInput' ||
        key === 'refineToolInput'
      ) {
        return [
          key,
          typeof value === 'object' && value
            ? Object.fromEntries(
                Object.entries(value).map(([name, entry]) => [
                  name,
                  bind(entry),
                ]),
              )
            : bind(value),
        ];
      }
      if (
        HashSet.has(directNames, key) ||
        /^on[A-Z]|^experimental_on[A-Z]/u.test(key)
      ) {
        return [
          key,
          bind(
            value,
            key === 'prepareStep'
              ? 'step'
              : key === 'prepareCall'
                ? 'call'
                : void 0,
          ),
        ];
      }
      return [key, value];
    }),
  ) as Native;
}
