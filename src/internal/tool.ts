import {
  tool as sdkTool,
  type Tool,
  type ToolExecutionOptions,
  type ToolSet,
} from 'ai';
import type { ToolResultOutput as NativeToolResult } from '@ai-sdk/provider-utils';
import { Effect, Scope, Stream } from 'effect';
import type {
  FlexibleSchema,
  LazySchema,
  Schema as WrappedSchema,
} from '../core-schema.js';
import {
  type SandboxSession,
  wrapSandbox,
} from '../integrations/internal/sandbox.js';
import { bindLazySchema } from './lazy-schema.js';
import { type openOperation, runRequest, sdkError } from './operation.js';
import {
  bindProviderTool,
  isProviderTool,
  type ProviderToolHandle,
} from './provider-tool.js';

type ContextData = Record<string, unknown>;
type SandboxOptions = { readonly experimental_sandbox?: SandboxSession };
type NativeExecutionOptions<Context> = ToolExecutionOptions<Context>;
export type EffectToolExecutionOptions<Context> = {
  [
    Name in keyof NativeExecutionOptions<Context> as Name extends 'experimental_sandbox'
      ? never
      : Name
  ]: NativeExecutionOptions<Context>[Name];
} & SandboxOptions;

type ApprovalOptions<Context> = Pick<
  EffectToolExecutionOptions<Context>,
  'context' | 'messages' | 'toolCallId'
>;
type ToolExecution<Output, Failure, Services> =
  | Effect.Effect<Output, Failure, Services>
  | Stream.Stream<Output, Failure, Services>;
type ToolOptions<Input, Output, Failure, Services, Context> = {
  readonly type?: 'function' | 'dynamic';
  readonly description?:
    | string
    | ((options: { context: NoInfer<Context> } & SandboxOptions) => string);
  readonly title?: string;
  readonly deferLoading?: boolean;
  readonly providerOptions?: Tool['providerOptions'];
  readonly metadata?: Tool['metadata'];
  readonly strict?: boolean;
  readonly inputExamples?: Array<{ input: NoInfer<Input> }>;
  readonly inputSchema: FlexibleSchema<Input, Services>;
  readonly outputSchema?: FlexibleSchema<Output, Services>;
  readonly contextSchema?: FlexibleSchema<Context, Services>;
  readonly execute?: (
    input: NoInfer<Input>,
    options: EffectToolExecutionOptions<NoInfer<Context>>,
  ) => ToolExecution<Output, Failure, Services>;
  readonly needsApproval?:
    | boolean
    | ((
        input: NoInfer<Input>,
        options: ApprovalOptions<NoInfer<Context>>,
      ) => Effect.Effect<boolean, Failure, Services>);
  readonly onInputStart?: (
    options: EffectToolExecutionOptions<NoInfer<Context>>,
  ) => Effect.Effect<void, Failure, Services>;
  readonly onInputDelta?: (
    options: EffectToolExecutionOptions<NoInfer<Context>> & {
      inputTextDelta: string;
    },
  ) => Effect.Effect<void, Failure, Services>;
  readonly onInputAvailable?: (
    options: EffectToolExecutionOptions<NoInfer<Context>> & {
      input: NoInfer<Input>;
    },
  ) => Effect.Effect<void, Failure, Services>;
  readonly toModelOutput?: (options: {
    toolCallId: string;
    input: NoInfer<Input>;
    output: NoInfer<Output>;
  }) => Effect.Effect<NativeToolResult, Failure, Services>;
};

export declare const toolTypes: unique symbol;
type ToolTypes<Input, Output, Context, Services> = {
  readonly [toolTypes]?: {
    readonly input: Input;
    readonly output: Output;
    readonly context: Context;
    readonly services: Services;
  };
};

export type EffectToolOptions<
  Input,
  Output,
  Failure,
  Services,
  Context = ContextData,
> = ToolOptions<Input, Output, Failure, Services, Context> &
  ToolTypes<Input, Output, Context, Services>;

type FunctionToolDefinition = {
  readonly inputSchema: FlexibleSchema<unknown, unknown>;
  readonly execute?: (
    ...args: never[]
  ) => ToolExecution<unknown, unknown, unknown>;
};

type Callback<Definition, Key> = Key extends keyof Definition
  ? NonNullable<Definition[Key]> extends (...args: never[]) => infer Result
    ? Result
    : never
  : never;
type SchemaValue<Definition, Key> = Key extends keyof Definition
  ? NonNullable<Definition[Key]>
  : never;
type SchemaRequirements<Value> = Value extends { DecodingServices: infer R }
  ? R
  : Value extends WrappedSchema<unknown, infer R> | LazySchema<unknown, infer R>
    ? R
    : never;
type CallbackRequirements<Result> =
  Result extends ToolExecution<unknown, unknown, infer R> ? R : never;
type FunctionRequirements<Definition> =
  | SchemaRequirements<
      SchemaValue<Definition, 'inputSchema' | 'outputSchema' | 'contextSchema'>
    >
  | CallbackRequirements<
      Callback<
        Definition,
        | 'execute'
        | 'needsApproval'
        | 'onInputStart'
        | 'onInputDelta'
        | 'onInputAvailable'
        | 'toModelOutput'
      >
    >;
type ExecutionOutput<Result> =
  Result extends ToolExecution<infer Output, unknown, unknown> ? Output : never;
type InferredOutput<Definition, Output> = Definition extends {
  readonly execute: (...args: never[]) => infer Result;
}
  ? ExecutionOutput<Result>
  : Output;
type CallableTool<Definition, Input, Context> = Definition extends {
  readonly execute: (...args: never[]) => infer Result;
}
  ? Omit<Definition, 'execute'> & {
      readonly execute: (
        input: Input,
        options: EffectToolExecutionOptions<Context>,
      ) => Result;
    }
  : Definition;

type ScalarTool<Input, Output, Failure, Services> = EffectToolOptions<
  Input,
  Output,
  Failure,
  Services
> & {
  readonly execute: (
    input: Input,
    options: EffectToolExecutionOptions<ContextData>,
  ) => Effect.Effect<Output, Failure, Services>;
};

/** Define a tool whose callbacks use the context of each invocation. */
export function tool<
  Input,
  Output = never,
  Context = ContextData,
  const Definition extends FunctionToolDefinition = FunctionToolDefinition,
>(
  options: Definition & ToolOptions<Input, Output, unknown, unknown, Context>,
): CallableTool<Definition, Input, Context> &
  ToolTypes<
    Input,
    InferredOutput<Definition, Output>,
    Context,
    FunctionRequirements<Definition>
  >;
export function tool<Input, Output, Failure, Services>(
  options: ScalarTool<Input, Output, Failure, Services>,
): ScalarTool<Input, Output, Failure, Services>;
export function tool(options: FunctionToolDefinition): FunctionToolDefinition {
  return options;
}

export type ToolRequirements<Definition> =
  Definition extends ProviderToolHandle<unknown, unknown, infer Services>
    ? Services
    : Definition extends ToolTypes<unknown, unknown, unknown, infer Services>
      ? Services
      : FunctionRequirements<Definition>;

export type EffectTools = Readonly<
  Record<
    string,
    FunctionToolDefinition | ProviderToolHandle<unknown, unknown, unknown>
  >
>;

export type ToolServices<Tools extends EffectTools> = ToolRequirements<
  Tools[keyof Tools]
>;

// ToolSet accepts several SDK tool variants. Keep the compatible variants
// without intersecting their typed arguments with the untyped index signature.
type CompatibleSdkTool<Native> = Native extends ToolSet[string]
  ? Native
  : never;

type NativeTool<Definition> =
  Definition extends ProviderToolHandle<infer Input, infer Output, unknown>
    ? CompatibleSdkTool<Tool<Input, Output, unknown>>
    : Definition extends ToolTypes<
          infer Input,
          infer Output,
          infer Context,
          unknown
        >
      ? CompatibleSdkTool<Tool<Input, Output, Context>>
      : Definition extends {
            readonly inputSchema: FlexibleSchema<infer Input, unknown>;
          }
        ? CompatibleSdkTool<
            Tool<
              Input,
              ExecutionOutput<Callback<Definition, 'execute'>>,
              unknown
            >
          >
        : never;

export type BoundTools<Tools extends EffectTools> = {
  [Name in keyof Tools]: NativeTool<Tools[Name]>;
};

const deferredTools = new WeakMap<object, (owner: Owner<never>) => Tool>();

export function rememberFunctionTool<
  Handle extends object,
  Services,
  Native extends Tool,
>(handle: Handle, bind: (owner: Owner<Services>) => Native): Handle {
  deferredTools.set(handle, bind as unknown as (owner: Owner<never>) => Tool);
  return handle;
}

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

const sandboxOptions = <
  Options extends Pick<NativeExecutionOptions<unknown>, 'experimental_sandbox'>,
>({
  experimental_sandbox: sandbox,
  ...options
}: Options) => ({
  ...options,
  ...(sandbox
    ? {
        experimental_sandbox: wrapSandbox(
          sandbox as Parameters<typeof wrapSandbox>[0],
        ),
      }
    : {}),
});

type StreamIterator<A> = AsyncIterator<A> &
  Required<Pick<AsyncIterator<A>, 'return'>>;

const streamTool = <A, E, R>(
  stream: Stream.Stream<A, E, R>,
  owner: Owner<R>,
  operation: string,
  abortSignal?: AbortSignal,
): AsyncIterable<A> => ({
  [Symbol.asyncIterator]() {
    const close = (source: StreamIterator<A>) =>
      runRequest(operation, {}, () => source.return());
    const start = owner.runCallback(
      Effect.gen(function* () {
        const iterable = yield* Stream.toAsyncIterableEffect(stream);
        const source = iterable[Symbol.asyncIterator]() as StreamIterator<A>;
        yield* Scope.addFinalizer(owner.scope, Effect.ignore(close(source)));
        return source;
      }),
      abortSignal,
    );
    const iterator = runRequest(operation, {}, () => start);
    const release = iterator.pipe(Effect.flatMap(close));
    return {
      next: () =>
        owner.runCallback(
          iterator.pipe(
            Effect.flatMap((source) =>
              Effect.tryPromise({
                try: () => source.next(),
                catch: (cause) => cause,
              }),
            ),
            Effect.onInterrupt(() => Effect.ignore(release)),
          ),
          abortSignal,
        ),
      return: () => Effect.runPromise(release),
    };
  },
});

const bindFunctionTool = <R>(
  name: string,
  definition: ToolOptions<unknown, unknown, unknown, R, ContextData>,
  owner: Owner<R>,
) => {
  const {
    inputSchema,
    outputSchema,
    contextSchema,
    description,
    execute,
    needsApproval,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    toModelOutput,
    ...properties
  } = definition;
  const operation = `tool.${name}`;
  const bind =
    <Args extends unknown[], A>(
      callback: (...args: Args) => Effect.Effect<A, unknown, R>,
    ) =>
    (abortSignal: AbortSignal | undefined, ...args: Args) =>
      owner.runCallback(
        Effect.suspend(() => callback(...args)),
        abortSignal,
      );

  return sdkTool({
    ...properties,
    inputSchema: bindLazySchema(inputSchema, owner, `${operation}.inputSchema`),
    ...(outputSchema
      ? {
          outputSchema: bindLazySchema(
            outputSchema,
            owner,
            `${operation}.outputSchema`,
          ),
        }
      : {}),
    ...(contextSchema
      ? {
          contextSchema: bindLazySchema(
            contextSchema,
            owner,
            `${operation}.contextSchema`,
          ),
        }
      : {}),
    ...(typeof description === 'function'
      ? {
          description: (
            options: Pick<
              NativeExecutionOptions<ContextData>,
              'context' | 'experimental_sandbox'
            >,
          ) => description(sandboxOptions(options)),
        }
      : { description }),
    ...(execute
      ? {
          execute: (
            input: unknown,
            options: NativeExecutionOptions<ContextData>,
          ) => {
            const abortSignal = options.abortSignal;
            if (
              owner.scope.state._tag === 'Closed' ||
              owner.signal.aborted ||
              abortSignal?.aborted
            ) {
              return owner.runCallback(
                Effect.fail(
                  sdkError(
                    `${operation}.execute`,
                    'Tool invocation is closed.',
                  ),
                ),
                abortSignal,
              );
            }
            const result = execute(input, sandboxOptions(options));
            return Effect.isEffect(result)
              ? owner.runCallback(result, abortSignal)
              : streamTool(result, owner, `${operation}.execute`, abortSignal);
          },
        }
      : {}),
    ...(typeof needsApproval === 'function'
      ? {
          needsApproval: (
            input: unknown,
            options: ApprovalOptions<ContextData>,
          ) => bind(needsApproval)(owner.signal, input, options),
        }
      : { needsApproval }),
    ...(onInputStart
      ? {
          onInputStart: (options: NativeExecutionOptions<ContextData>) =>
            bind(onInputStart)(options.abortSignal, sandboxOptions(options)),
        }
      : {}),
    ...(onInputDelta
      ? {
          onInputDelta: (
            options: NativeExecutionOptions<ContextData> & {
              inputTextDelta: string;
            },
          ) => bind(onInputDelta)(options.abortSignal, sandboxOptions(options)),
        }
      : {}),
    ...(onInputAvailable
      ? {
          onInputAvailable: (
            options: NativeExecutionOptions<ContextData> & { input: unknown },
          ) =>
            bind(onInputAvailable)(
              options.abortSignal,
              sandboxOptions(options),
            ),
        }
      : {}),
    ...(toModelOutput
      ? {
          toModelOutput: (options: Parameters<typeof toModelOutput>[0]) =>
            bind(toModelOutput)(owner.signal, options),
        }
      : {}),
  } as Tool<unknown, unknown, ContextData>);
};

export const bindTools = <Tools extends EffectTools>(
  tools: Tools,
  owner: Owner<ToolServices<Tools>>,
): BoundTools<Tools> =>
  Object.fromEntries(
    Object.entries(tools).map(([name, definition]) => {
      const bound = deferredTools.get(definition);
      if (bound) return [name, bound(owner)];
      if (isProviderTool(definition)) {
        return [
          name,
          bindProviderTool(
            definition as ProviderToolHandle<
              unknown,
              unknown,
              ToolServices<Tools>
            >,
            owner,
          ),
        ];
      }
      return [
        name,
        bindFunctionTool(
          name,
          definition as EffectToolOptions<
            unknown,
            unknown,
            unknown,
            ToolServices<Tools>
          >,
          owner,
        ),
      ];
    }),
  ) as unknown as BoundTools<Tools>;
