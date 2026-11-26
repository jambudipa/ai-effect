import type {
  InferToolInput,
  InferToolOutput,
  ProviderDefinedTool,
  ProviderExecutedTool,
  Tool,
} from '@ai-sdk/provider-utils';
import { Effect, type Stream } from 'effect';
import { fromNativeSchema, type Schema } from '../core-schema.js';
import {
  unwrapSandbox,
  wrapSandbox,
} from '../integrations/internal/sandbox.js';
import type { SandboxSession } from '../integrations/internal/sandbox.js';
import { runRequest, runSync, sdkError } from './operation.js';
import type { openOperation } from './operation.js';
import { streamTool } from './tool-stream.js';

/** Accept descriptors for provider-defined tools whether the provider executes them or delegates execution. */
type NativeProviderTool = ProviderDefinedTool | ProviderExecutedTool;
/** Bind provider tool callbacks to the scope and services of the SDK operation. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Identify descriptor members whose callbacks need the Effect bridge. */
type CallbackName =
  | 'execute'
  | 'needsApproval'
  | 'onInputStart'
  | 'onInputDelta'
  | 'onInputAvailable'
  | 'toModelOutput';

/** Brand provider tool handles at compile time without adding runtime state. */
declare const providerToolType: unique symbol;

/** Expose provider tool metadata, schema, and effectful callbacks without exposing its native descriptor. */
export interface ProviderToolHandle<
  Input,
  Output,
  Services,
  SchemaOutput = unknown,
> {
  /** Distinguish a registered provider tool from a user-defined function tool. */
  readonly type: 'provider';
  /** Identify the native tool with its provider-qualified name. */
  readonly id: `${string}.${string}`;
  /** Keep the provider-specific configuration that the SDK sends with the descriptor. */
  readonly args: Readonly<Record<string, unknown>>;
  /** Indicate that the provider executes the tool rather than requesting a local result. */
  readonly isProviderExecuted: boolean;
  /** Indicate whether the provider accepts a result after the initial generation step. */
  readonly supportsDeferredResults?: boolean;
  /** Expose the display label when the native descriptor supplies one. */
  readonly title?: string;
  /** Allow the SDK to defer loading the tool definition until it is selected. */
  readonly deferLoading?: boolean;
  /** Validate arguments against the native tool's adapted schema. */
  readonly inputSchema: Schema<Input>;
  /** Validate tool results when the native descriptor supplies a result schema. */
  readonly outputSchema?: Schema<SchemaOutput>;
  /** Retain inferred input, output, and service types across native registration. */
  readonly [providerToolType]?: {
    readonly input: Input;
    readonly output: Output;
    readonly services: Services;
  };
}

/** Replace the SDK sandbox argument with the Effect session available to callbacks. */
type AdaptSandboxArgument<Arg> = {
  [Key in keyof Arg]: Key extends 'experimental_sandbox'
    ? SandboxSession
    : Arg[Key];
};

/** Wrap a native sandbox session only when the callback received one. */
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
/** Allow either one Effect result or an Effect stream of results from a provider tool callback. */
type ProviderExecution<Output, R> =
  Effect.Effect<Output, unknown, R> | Stream.Stream<Output, unknown, R>;

/** Preserve execution element types while keeping other callback completions effectful. */
type CallbackResult<Name, Result, R> = Name extends 'execute'
  ? ProviderExecution<EmittedOutput<Awaited<Result>>, R>
  : Effect.Effect<Awaited<Result>, unknown, R>;

/** Adapt each relevant argument and make the callback run under its bound Effect context. */
type AdaptCallback<Value, R, Name> = Value extends (
  ...args: infer Args
) => infer Result
  ? (
      ...args: { [K in keyof Args]: AdaptSandboxArgument<Args[K]> }
    ) => CallbackResult<Name, Result, R>
  : Value;

/** Transform only native callback settings and leave provider-specific data options as supplied. */
type AdaptOptions<Options, R> = {
  [Name in keyof Options]: Name extends CallbackName
    ? AdaptCallback<Options[Name], R, Name>
    : Options[Name];
};

/** Apply the options adapter to each argument in the native factory's positional tuple. */
export type AdaptArguments<Args extends unknown[], R> = {
  [Index in keyof Args]: AdaptOptions<Args[Index], R>;
};

/** Keep the runtime callback selection aligned with the callback names in the type adapter. */
const callbackNames: ReadonlyArray<string> = [
  'execute',
  'needsApproval',
  'onInputStart',
  'onInputDelta',
  'onInputAvailable',
  'toModelOutput',
];

/** Associate public handles with native factory bindings without retaining unused handles. */
const providerTools = new WeakMap<
  object,
  (owner: Owner<never>) => NativeProviderTool
>();

/** Recognize only descriptors previously registered by the provider tool adapter. */
export const isProviderTool = (
  value: unknown,
): value is ProviderToolHandle<unknown, unknown, unknown> =>
  typeof value === 'object' && !!value && providerTools.has(value);

/** Resolve a tool's native descriptor under the current owner and validation contract. */
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

/** Run native-facing callbacks in Effect and expose streamed execution as a scoped native iterable. */
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

/** Bind supported callback fields without modifying the caller's factory argument objects. */
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

/** Read a defined option field only when it exists on the corresponding native argument. */
type Field<Options, Key> = Options extends object
  ? Key extends keyof Options
    ? Options[Key]
    : never
  : never;

/** Obtain the execution or callback result type from the supplied function contract. */
type CallbackEffect<C> = C extends (...args: never[]) => infer A ? A : never;

/** Extract an emitted item type when the native result can emit multiple values. */
type EmittedOutput<A> = A extends AsyncIterable<infer Output> ? Output : A;

/** Infer the success value of either an Effect or streaming tool execution result. */
type ResultValue<Result> =
  Result extends Stream.Stream<infer A, unknown, unknown>
    ? A
    : Effect.Success<Result>;
/** Infer the Effect environment required by a scalar or streaming result. */
type ResultServices<Result> =
  Result extends Stream.Stream<unknown, unknown, infer R>
    ? R
    : Effect.Services<Result>;

/** Read the result item type from the caller's supplied execution handler. */
type ExecutionOutput<Args extends unknown[]> = ResultValue<
  CallbackEffect<Field<Args[number], 'execute'>>
>;
/** Combine the services required by all supplied provider tool callbacks. */
type ToolRequirements<Args extends unknown[]> = ResultServices<
  CallbackEffect<Field<Args[number], CallbackName>>
>;

/** Use provider output typing for provider-executed tools and infer local execution output where supplied. */
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

/** Preserve the caller's callback return type while adapting native arguments to Effect values. */
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

/** Expose callbacks only where the caller's factory options provided matching handlers. */
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

/** Describe the public handle with adapted schema, callback, and service types. */
export type AdaptedDescriptor<
  Args extends unknown[],
  Tool extends NativeProviderTool,
  Provided extends unknown[],
> = ProviderToolHandle<
  InferToolInput<Tool>,
  ToolOutput<Tool, Provided>,
  ToolRequirements<Provided>,
  InferToolOutput<Tool>
> &
  DescriptorCallbacks<Args, Provided>;

/** Copy the supplied callback functions to the public handle for direct invocation. */
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

/** Keep the native factory's arguments and infer the dependencies of each supplied callback. */
export type AdaptedTool<
  Args extends unknown[],
  Tool extends NativeProviderTool,
> = <Provided extends AdaptArguments<Args, unknown>>(
  ...args: Provided
) => Effect.Effect<
  AdaptedDescriptor<Args, Tool, Provided>,
  import('./operation.js').AiSdkError
>;
/** Construct a descriptor lazily and defer callback binding until the model operation uses the tool. */
export const adaptProviderTool =
  <Args extends unknown[], Result extends NativeProviderTool>(
    operation: string,
    factory: (...args: Args) => Result,
    exposesBashDefault = false,
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
        title,
        deferLoading,
        inputSchema,
        outputSchema,
      } = preview;
      const handle = {
        type,
        id,
        args: toolArgs,
        isProviderExecuted,
        inputSchema: fromNativeSchema(inputSchema),
        ...(outputSchema
          ? { outputSchema: fromNativeSchema(outputSchema) }
          : {}),
        ...(typeof title === 'string' ? { title } : {}),
        ...(typeof deferLoading === 'boolean' ? { deferLoading } : {}),
        ...(typeof supportsDeferredResults === 'boolean'
          ? { supportsDeferredResults }
          : {}),
        ...retainedCallbacks(preview, args),
        ...(exposesBashDefault
          ? bashDefaults(operation, preview, args[0])
          : {}),
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

/** Identify the pinned Bash tools that support a native default execution adapter. */
type BashToolName = 'bash_20241022' | 'bash_20250124';
/** Carry the command and optional session reset understood by the native Bash descriptor. */
type BashInput = { command: string; restart?: boolean };
/** Expose the exit status and separately captured output streams of the native default. */
type DefaultBashOutput = Pick<
  Effect.Success<ReturnType<SandboxSession['run']>>,
  'exitCode' | 'stdout' | 'stderr'
>;
/** Adapt the Bash lifecycle and approval callbacks without changing its public execution input. */
type BashCallbacks<Output, R> = AdaptOptions<
  Pick<
    Tool<BashInput, Output, {}>,
    'needsApproval' | 'onInputStart' | 'onInputDelta' | 'onInputAvailable'
  >,
  R
> & {
  readonly toModelOutput?: (options: {
    toolCallId: string;
    input: BashInput;
    output: NoInfer<Output>;
  }) => Effect.Effect<BashModelOutput, unknown, R>;
};
/** Preserve the native model-facing result shape for Bash output conversion. */
type BashModelOutput = Awaited<
  ReturnType<NonNullable<Tool<BashInput, unknown, {}>['toModelOutput']>>
>;
/** Replace native sandbox handles in the callback's argument tuple. */
type AdaptSandboxArguments<Args extends unknown[]> = {
  [Key in keyof Args]: AdaptSandboxArgument<Args[Key]>;
};
/** Derive Bash invocation arguments from the native tool protocol. */
type BashExecutionArgs = Parameters<
  NonNullable<Tool<BashInput, unknown, {}>['execute']>
>;

/** Give a custom Bash handler the Effect sandbox session when one was supplied. */
type BashExecution<Result> = (
  ...args: AdaptSandboxArguments<BashExecutionArgs>
) => Result;
/** Represent the native default execution with its mapped SDK failure channel. */
type BashDefaultExecution = BashExecution<
  Effect.Effect<DefaultBashOutput, import('./operation.js').AiSdkError>
>;

/** Expose the cancellable native default only when the caller supplied no execution callback. */
const bashDefaults = (
  operation: string,
  preview: NativeProviderTool,
  options: unknown,
): { readonly execute?: BashDefaultExecution } => {
  const selected =
    options && typeof options === 'object' && 'execute' in options
      ? options.execute
      : void 0;
  const native = preview.execute;
  if (selected !== void 0 || !native) return {};
  return {
    execute: (input, { experimental_sandbox, ...options }) =>
      runRequest(`${operation}.execute`, options, (abortSignal) => {
        const sandbox =
          experimental_sandbox && unwrapSandbox(experimental_sandbox);
        // Both pinned native Bash defaults return a promise.
        return native(input, {
          ...options,
          abortSignal,
          ...(sandbox ? { experimental_sandbox: sandbox } : {}),
        }) as PromiseLike<DefaultBashOutput>;
      }),
  };
};

/** Combine Bash descriptor metadata with the caller's effectful callbacks. */
type BashHandle<Output, R> = ProviderToolHandle<BashInput, Output, R> &
  BashCallbacks<Output, R>;

/** Infer Bash tool output and service requirements for custom or default execution. */
interface AdaptedBashTool {
  <Output, E, ExecutionServices, R = never>(
    options: {
      execute: BashExecution<Stream.Stream<Output, E, ExecutionServices>>;
    } & BashCallbacks<Output, R>,
  ): Effect.Effect<
    BashHandle<Output, ExecutionServices | R> & {
      readonly execute: BashExecution<
        Stream.Stream<Output, E, ExecutionServices>
      >;
    },
    import('./operation.js').AiSdkError
  >;
  <Output, E, ExecutionServices, R = never>(
    options: {
      execute: BashExecution<Effect.Effect<Output, E, ExecutionServices>>;
    } & BashCallbacks<Output, R>,
  ): Effect.Effect<
    BashHandle<Output, ExecutionServices | R> & {
      readonly execute: BashExecution<
        Effect.Effect<Output, E, ExecutionServices>
      >;
    },
    import('./operation.js').AiSdkError
  >;
  <R = never>(
    options?: BashCallbacks<DefaultBashOutput, R> & { execute?: undefined },
  ): Effect.Effect<
    BashHandle<DefaultBashOutput, R> & {
      readonly execute: BashDefaultExecution;
    },
    import('./operation.js').AiSdkError
  >;
  <Output = never, R = never>(
    options: BashCallbacks<Output, R> & { execute: null },
  ): Effect.Effect<
    BashHandle<Output, R> & { readonly execute?: never },
    import('./operation.js').AiSdkError
  >;
}

/** Apply the special Bash adapter only to supported versions and adapt other factory descriptors uniformly. */
export type AdaptedTools<Tools> = {
  [Name in keyof Tools]: Name extends BashToolName
    ? AdaptedBashTool
    : Tools[Name] extends (...args: infer Args) => infer Tool
      ? Tool extends NativeProviderTool
        ? AdaptedTool<Args, Tool>
        : never
      : never;
};

/** Accept native provider tool factories indexed by the names exported by a provider. */
type ToolFactories = Readonly<
  Record<string, (...args: never[]) => NativeProviderTool>
>;

/** Wrap each factory and preserve the provider export names used to select tools. */
export const wrapProviderTools = <Tools extends ToolFactories>(
  name: string,
  tools: Tools,
): AdaptedTools<Tools> =>
  Object.fromEntries(
    Object.entries(tools).map(([key, factory]) => [
      key,
      adaptProviderTool(
        `${name}.${key}`,
        factory,
        key === 'bash_20241022' || key === 'bash_20250124',
      ),
    ]),
  ) as AdaptedTools<Tools>;
