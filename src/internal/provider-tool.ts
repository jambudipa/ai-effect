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

type AdaptSandboxArgument<Arg> = {
  [Key in keyof Arg]: Key extends 'experimental_sandbox'
    ? SandboxSession
    : Arg[Key];
};

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

type Field<Options, Key> = Options extends object
  ? Key extends keyof Options
    ? Options[Key]
    : never
  : never;

type CallbackEffect<C> = C extends (...args: never[]) => infer A ? A : never;

type EmittedOutput<A> = A extends AsyncIterable<infer Output> ? Output : A;

type ExecutionOutput<Args extends unknown[]> = EmittedOutput<
  Effect.Success<CallbackEffect<Field<Args[number], 'execute'>>>
>;

type ToolRequirements<Args extends unknown[]> = Effect.Services<
  CallbackEffect<Field<Args[number], CallbackName>>
>;

type ToolOutput<
  Definition extends NativeProviderTool,
  Args extends unknown[],
> = Definition extends { readonly isProviderExecuted: false }
  ? unknown extends InferToolOutput<Definition>
    ? [ExecutionOutput<Args>] extends [never]
      ? InferToolOutput<Definition>
      : ExecutionOutput<Args>
    : InferToolOutput<Definition>
  : InferToolOutput<Definition>;

type AdaptedTool<Args extends unknown[], Tool extends NativeProviderTool> = <
  Provided extends AdaptArguments<Args, unknown>,
>(
  ...args: Provided
) => Effect.Effect<
  ProviderToolHandle<
    InferToolInput<Tool>,
    ToolOutput<Tool, Provided>,
    ToolRequirements<Provided>
  >,
  import('./operation.js').AiSdkError
>;
export const adaptProviderTool =
  <Args extends unknown[], Result extends NativeProviderTool>(
    operation: string,
    factory: (...args: Args) => Result,
  ) =>
  <Provided extends AdaptArguments<Args, unknown>>(...args: Provided) =>
    runSync(
      operation,
      (): ProviderToolHandle<
        InferToolInput<Result>,
        ToolOutput<Result, Provided>,
        ToolRequirements<Provided>
      > => {
        // Factories read options while building their descriptors. They do not
        // execute user callbacks. Bind those callbacks to the owner for each run.
        const preview = factory(...(args as unknown as Args));
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
          factory(
            ...bindArguments<Args, ToolRequirements<Provided>>(
              args as AdaptArguments<Args, ToolRequirements<Provided>>,
              owner as Owner<ToolRequirements<Provided>>,
            ),
          ),
        );
        return handle;
      },
    );

type BashToolName = 'bash_20241022' | 'bash_20250124';
type BashInput = { command: string; restart?: boolean };
type DefaultBashOutput = Pick<
  Effect.Success<ReturnType<SandboxSession['run']>>,
  'exitCode' | 'stdout' | 'stderr'
>;
type BashCallbacks<Output, R> = AdaptOptions<
  Pick<Tool<BashInput, Output, {}>, Exclude<CallbackName, 'execute'>>,
  R
>;
type AdaptSandboxArguments<Args extends unknown[]> = {
  [Key in keyof Args]: AdaptSandboxArgument<Args[Key]>;
};
type BashExecution<R, Output> = (
  ...args: AdaptSandboxArguments<BashExecutionArgs>
) => Effect.Effect<Output | AsyncIterable<Output>, unknown, R>;
type BashExecutionArgs = Parameters<
  NonNullable<Tool<BashInput, unknown, {}>['execute']>
>;

interface AdaptedBashTool {
  <R = never>(
    options?: BashCallbacks<DefaultBashOutput, R> & { execute?: undefined },
  ): Effect.Effect<
    ProviderToolHandle<BashInput, DefaultBashOutput, R>,
    import('./operation.js').AiSdkError
  >;
  <Output = never, R = never>(
    options: BashCallbacks<Output, R> & { execute: null },
  ): Effect.Effect<
    ProviderToolHandle<BashInput, Output, R>,
    import('./operation.js').AiSdkError
  >;
  <Output, R = never>(
    options: BashCallbacks<Output, R> & { execute: BashExecution<R, Output> },
  ): Effect.Effect<
    ProviderToolHandle<BashInput, Output, R>,
    import('./operation.js').AiSdkError
  >;
}

export type AdaptedTools<Tools> = {
  [Name in keyof Tools]: Name extends BashToolName
    ? AdaptedBashTool
    : Tools[Name] extends (...args: infer Args) => infer Tool
      ? Tool extends NativeProviderTool
        ? AdaptedTool<Args, Tool>
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
