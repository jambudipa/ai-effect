import type {
  InferToolInput,
  InferToolOutput,
  ProviderDefinedTool,
  ProviderExecutedTool,
  Tool,
} from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { wrapSandbox } from '../integrations/internal/sandbox.js';
import type { SandboxSession } from '../integrations/internal/sandbox.js';
import { runSync, sdkError } from './operation.js';
import type { openOperation } from './operation.js';

type NativeProviderTool = ProviderDefinedTool | ProviderExecutedTool;
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type CallbackName =
  | 'execute'
  | 'needsApproval'
  | 'onInputStart'
  | 'onInputDelta'
  | 'onInputAvailable'
  | 'toModelOutput';

declare const providerToolType: unique symbol;

export interface ProviderToolHandle<Input, Output, Services> {
  readonly type: 'provider';
  readonly id: `${string}.${string}`;
  readonly args: Readonly<Record<string, unknown>>;
  readonly isProviderExecuted: boolean;
  readonly supportsDeferredResults?: boolean;
  readonly [providerToolType]?: {
    readonly input: Input;
    readonly output: Output;
    readonly services: Services;
  };
}

type AdaptSandboxArgument<Arg> = 'experimental_sandbox' extends keyof Arg
  ? Omit<Arg, 'experimental_sandbox'> & {
      experimental_sandbox?: SandboxSession;
    }
  : Arg;

const wrapSandboxArgument = (value: unknown): unknown => {
  if (
    !value ||
    typeof value !== 'object' ||
    !('experimental_sandbox' in value) ||
    !value.experimental_sandbox
  )
    return value;
  return {
    ...value,
    experimental_sandbox: wrapSandbox(
      value.experimental_sandbox as Parameters<typeof wrapSandbox>[0],
    ),
  };
};
type AdaptCallback<Value, R> = Value extends (
  ...args: infer Args
) => infer Result
  ? (
      ...args: { [K in keyof Args]: AdaptSandboxArgument<Args[K]> }
    ) => Effect.Effect<Awaited<Result>, unknown, R>
  : Value;

type AdaptOptions<Options, R> = {
  [Name in keyof Options]: Name extends CallbackName
    ? AdaptCallback<Options[Name], R>
    : Options[Name];
};

type AdaptArguments<Args extends unknown[], R> = {
  [Index in keyof Args]: AdaptOptions<Args[Index], R>;
};

const callbackNames: ReadonlyArray<string> = [
  'execute',
  'needsApproval',
  'onInputStart',
  'onInputDelta',
  'onInputAvailable',
  'toModelOutput',
];

const providerTools = new WeakMap<
  object,
  (owner: Owner<never>) => NativeProviderTool
>();

export const isProviderTool = (
  value: unknown,
): value is ProviderToolHandle<unknown, unknown, unknown> =>
  typeof value === 'object' && !!value && providerTools.has(value);

export const bindProviderTool = <I, A, R>(
  handle: ProviderToolHandle<I, A, R>,
  owner: Owner<R>,
): Tool<I, A> => {
  const bind = providerTools.get(handle);
  if (!bind) {
    // Only handles made by this module can carry a tool factory and its arguments.
    throw sdkError(
      'bindProviderTool',
      'The value is not a provider tool from this package.',
    );
  }
  return bind(owner) as Tool<I, A>;
};

const bindArguments = <Args extends unknown[], R>(
  args: AdaptArguments<Args, R>,
  owner: Owner<R>,
): Args =>
  args.map((options) =>
    typeof options === 'object' && options
      ? Object.fromEntries(
          Object.entries(options).map(([key, value]) => [
            key,
            callbackNames.includes(key) && typeof value === 'function'
              ? (...callbackArgs: unknown[]) =>
                  owner.runCallback(
                    Effect.suspend(() =>
                      value(...callbackArgs.map(wrapSandboxArgument)),
                    ),
                    callbackArgs.find(
                      (arg): arg is { abortSignal: AbortSignal } =>
                        typeof arg === 'object' &&
                        !!arg &&
                        'abortSignal' in arg &&
                        arg.abortSignal instanceof AbortSignal,
                    )?.abortSignal,
                  )
              : value,
          ]),
        )
      : options,
  ) as Args;

export const adaptProviderTool =
  <Args extends unknown[], Result extends NativeProviderTool>(
    operation: string,
    factory: (...args: Args) => Result,
  ) =>
  <R>(...args: AdaptArguments<Args, R>) =>
    runSync(
      operation,
      (): ProviderToolHandle<
        InferToolInput<Result>,
        InferToolOutput<Result>,
        R
      > => {
        // Factories read options while building their descriptors. They do not
        // execute user callbacks. Bind those callbacks to the owner for each run.
        const preview = factory(...(args as Args));
        const {
          type,
          id,
          args: toolArgs,
          isProviderExecuted,
          supportsDeferredResults,
        } = preview;
        const handle = {
          type,
          id,
          args: toolArgs,
          isProviderExecuted,
          ...(typeof supportsDeferredResults === 'boolean'
            ? { supportsDeferredResults }
            : {}),
        };
        providerTools.set(handle, (owner) =>
          factory(...bindArguments<Args, R>(args, owner as Owner<R>)),
        );
        return handle;
      },
    );

export type AdaptedTools<Tools> = {
  [Name in keyof Tools]: Tools[Name] extends (...args: infer Args) => infer Tool
    ? Tool extends NativeProviderTool
      ? <R>(
          ...args: AdaptArguments<Args, R>
        ) => Effect.Effect<
          ProviderToolHandle<InferToolInput<Tool>, InferToolOutput<Tool>, R>,
          import('./operation.js').AiSdkError
        >
      : never
    : never;
};

type ToolFactories = Readonly<
  Record<string, (...args: never[]) => NativeProviderTool>
>;

export const wrapProviderTools = <Tools extends ToolFactories>(
  name: string,
  tools: Tools,
): AdaptedTools<Tools> =>
  Object.fromEntries(
    Object.entries(tools).map(([key, factory]) => [
      key,
      adaptProviderTool(`${name}.${key}`, factory),
    ]),
  ) as AdaptedTools<Tools>;
