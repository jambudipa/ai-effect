import type {
  InferToolInput,
  InferToolOutput,
  ProviderDefinedTool,
  ProviderExecutedTool,
  Tool,
} from '@ai-sdk/provider-utils';
import { Effect, type Stream } from 'effect';
import { wrapSandbox } from '../integrations/internal/sandbox.js';
import type { SandboxSession } from '../integrations/internal/sandbox.js';
import { runSync, sdkError } from './operation.js';
import type { openOperation } from './operation.js';
import { streamTool } from './tool-stream.js';

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
type ProviderExecution<Output, R> =
  Effect.Effect<Output, unknown, R> | Stream.Stream<Output, unknown, R>;

type CallbackResult<Name, Result, R> = Name extends 'execute'
  ? ProviderExecution<EmittedOutput<Awaited<Result>>, R>
  : Effect.Effect<Awaited<Result>, unknown, R>;

type AdaptCallback<Value, R, Name> = Value extends (
  ...args: infer Args
) => infer Result
  ? (
      ...args: { [K in keyof Args]: AdaptSandboxArgument<Args[K]> }
    ) => CallbackResult<Name, Result, R>
  : Value;

type AdaptOptions<Options, R> = {
  [Name in keyof Options]: Name extends CallbackName
    ? AdaptCallback<Options[Name], R, Name>
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

const bindCallback =
  <R>(
    name: string,
    callback: (...args: unknown[]) => unknown,
    owner: Owner<R>,
    operation: string,
  ) =>
  (...args: unknown[]) => {
    const abortSignal = args.find(
      (arg): arg is { abortSignal: AbortSignal } =>
        typeof arg === 'object' &&
        !!arg &&
        'abortSignal' in arg &&
        arg.abortSignal instanceof AbortSignal,
    )?.abortSignal;
    const invoke = () => callback(...args.map(wrapSandboxArgument));
    if (name !== 'execute') {
      return owner.runCallback(
        Effect.suspend(() => invoke() as Effect.Effect<unknown, unknown, R>),
        abortSignal,
      );
    }
    if (
      owner.scope.state._tag === 'Closed' ||
      owner.signal.aborted ||
      abortSignal?.aborted
    ) {
      return owner.runCallback(
        Effect.fail(sdkError(operation, 'Tool invocation is closed.')),
        abortSignal,
      );
    }
    const result = invoke() as ProviderExecution<unknown, R>;
    // The SDK detects streaming before awaiting the executor result.
    return Effect.isEffect(result)
      ? owner.runCallback(result, abortSignal)
      : streamTool(result, owner, operation, abortSignal);
  };

const bindArguments = <Args extends unknown[], R>(
  args: AdaptArguments<Args, R>,
  owner: Owner<R>,
  operation: string,
): Args =>
  args.map((options) =>
    typeof options === 'object' && options
      ? Object.fromEntries(
          Object.entries(options).map(([key, value]) => [
            key,
            callbackNames.includes(key) && typeof value === 'function'
              ? bindCallback(
                  key,
                  value as (...args: unknown[]) => unknown,
                  owner,
                  `${operation}.${key}`,
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

type ResultValue<Result> =
  Result extends Stream.Stream<infer A, unknown, unknown>
    ? A
    : Effect.Success<Result>;
type ResultServices<Result> =
  Result extends Stream.Stream<unknown, unknown, infer R>
    ? R
    : Effect.Services<Result>;

type ExecutionOutput<Args extends unknown[]> = ResultValue<
  CallbackEffect<Field<Args[number], 'execute'>>
>;
type ToolRequirements<Args extends unknown[]> = ResultServices<
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

type RetainedCallback<Native, Provided, Name> = Native extends (
  ...args: infer Args
) => infer Result
  ? (
      ...args: AdaptSandboxArguments<Args>
    ) => [CallbackEffect<Provided>] extends [never]
      ? CallbackResult<Name, Result, never>
      : CallbackEffect<Provided>
  : Native extends boolean
    ? Native
    : never;

type DescriptorCallbacks<Args extends unknown[], Provided extends unknown[]> = {
  readonly [
    Name in CallbackName as [
      RetainedCallback<
        Field<Args[number], Name>,
        Field<Provided[number], Name>,
        Name
      >,
    ] extends [never]
      ? never
      : Name
  ]?: RetainedCallback<
    Field<Args[number], Name>,
    Field<Provided[number], Name>,
    Name
  >;
};

type AdaptedDescriptor<
  Args extends unknown[],
  Tool extends NativeProviderTool,
  Provided extends unknown[],
> = ProviderToolHandle<
  InferToolInput<Tool>,
  ToolOutput<Tool, Provided>,
  ToolRequirements<Provided>
> &
  DescriptorCallbacks<Args, Provided>;

const retainedCallbacks = (
  preview: NativeProviderTool,
  args: readonly unknown[],
) => {
  const descriptor = preview as unknown as Readonly<Record<string, unknown>>;
  return Object.fromEntries(
    args.flatMap((options) =>
      options && typeof options === 'object'
        ? Object.entries(options).filter(
            ([name, value]) =>
              callbackNames.includes(name) &&
              (typeof value === 'function' ||
                (name === 'needsApproval' && typeof value === 'boolean')) &&
              // Preserve configured callbacks that the SDK copied unchanged.
              descriptor[name] === value,
          )
        : [],
    ),
  );
};

export type AdaptedTool<
  Args extends unknown[],
  Tool extends NativeProviderTool,
> = <Provided extends AdaptArguments<Args, unknown>>(
  ...args: Provided
) => Effect.Effect<
  AdaptedDescriptor<Args, Tool, Provided>,
  import('./operation.js').AiSdkError
>;
export const adaptProviderTool =
  <Args extends unknown[], Result extends NativeProviderTool>(
    operation: string,
    factory: (...args: Args) => Result,
  ): AdaptedTool<Args, Result> =>
  <Provided extends AdaptArguments<Args, unknown>>(...args: Provided) =>
    runSync(operation, (): AdaptedDescriptor<Args, Result, Provided> => {
      // Bind callbacks to the owner only when the SDK runs the tool.
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
        ...retainedCallbacks(preview, args),
      };
      providerTools.set(handle, (owner) =>
        factory(
          ...bindArguments<Args, ToolRequirements<Provided>>(
            args as AdaptArguments<Args, ToolRequirements<Provided>>,
            owner as Owner<ToolRequirements<Provided>>,
            operation,
          ),
        ),
      );
      return handle as AdaptedDescriptor<Args, Result, Provided>;
    });

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
