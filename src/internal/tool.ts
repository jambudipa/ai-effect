import {
  tool as sdkTool,
  type Tool,
  type ToolExecutionOptions,
  type ToolSet,
} from 'ai';
import {
  experimental_toolCaller as sdkToolCaller,
  type Experimental_ToolCallerTool as NativeToolCaller,
  type ProviderOptions,
  type ToolResultOutput as NativeToolResult,
} from '@ai-sdk/provider-utils';
import { Effect, type Stream } from 'effect';
import type {
  FlexibleSchema,
  LazySchema,
  Schema as WrappedSchema,
} from '../core-schema.js';
import {
  type SandboxSession,
  wrapSandbox,
} from '../integrations/internal/sandbox.js';
import { rememberTelemetryTools } from '../integrations/internal/telemetry.js';
import { bindLazySchema } from './lazy-schema.js';
import { type AiSdkError, type openOperation, sdkError } from './operation.js';
import {
  bindProviderTool,
  isProviderTool,
  type ProviderToolHandle,
} from './provider-tool.js';
import { streamTool } from './tool-stream.js';

/** Use the SDK's open record constraint for per-tool runtime context. */
type ContextData = Record<string, unknown>;
/** Give registered tool handlers access to the scoped Effect sandbox when the SDK supplies one. */
type SandboxOptions = { readonly experimental_sandbox?: SandboxSession };
/** Track native execution options before replacing the sandbox field. */
type NativeExecutionOptions<Context> = ToolExecutionOptions<Context>;
/** Preserve SDK invocation context and expose an Effect sandbox session at the callback boundary. */
export type EffectToolExecutionOptions<Context> = {
  [
    Name in keyof NativeExecutionOptions<Context> as Name extends 'experimental_sandbox'
      ? never
      : Name
  ]: NativeExecutionOptions<Context>[Name];
} & SandboxOptions;

/** Limit approval callbacks to invocation context, message history, and call identity. */
type ApprovalOptions<Context> = Pick<
  EffectToolExecutionOptions<Context>,
  'context' | 'messages' | 'toolCallId'
>;
/** Type a tool handler that returns one result or emits multiple results effectfully. */
type ToolExecution<Output, Failure, Services> =
  | Effect.Effect<Output, Failure, Services>
  | Stream.Stream<Output, Failure, Services>;
/** Describe public configurable fields for registered function and dynamic tools. */
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

/** Brand the compile-time tool metadata used to infer inputs, outputs, context, and services. */
export declare const toolTypes: unique symbol;
/** Propagate tool type information that is otherwise lost when binding to the native SDK. */
type ToolTypes<Input, Output, Context, Services> = {
  readonly [toolTypes]?: {
    readonly input: Input;
    readonly output: Output;
    readonly context: Context;
    readonly services: Services;
  };
};

/** Define a public Effect tool with schema, execution, and lifecycle callbacks. */
export type EffectToolOptions<
  Input,
  Output,
  Failure,
  Services,
  Context = ContextData,
> = ToolOptions<Input, Output, Failure, Services, Context> &
  ToolTypes<Input, Output, Context, Services>;

/** Accept structural tool declarations with a schema and optional Effect execution. */
type FunctionToolDefinition = {
  readonly inputSchema: FlexibleSchema<unknown, unknown>;
  readonly execute?: (
    ...args: never[]
  ) => ToolExecution<unknown, unknown, unknown>;
};

/** Infer the supplied callback result without assuming the declaration defines it. */
type Callback<Definition, Key> = Key extends keyof Definition
  ? NonNullable<Definition[Key]> extends (...args: never[]) => infer Result
    ? Result
    : never
  : never;
/** Read a supplied input, output, or context schema from its definition. */
type SchemaValue<Definition, Key> = Key extends keyof Definition
  ? NonNullable<Definition[Key]>
  : never;
/** Infer the services needed to decode schema input under the operation owner. */
type SchemaRequirements<Value> = Value extends { DecodingServices: infer R }
  ? R
  : Value extends WrappedSchema<unknown, infer R> | LazySchema<unknown, infer R>
    ? R
    : never;
/** Infer requirements from a scalar Effect or streaming tool lifecycle callback. */
type CallbackRequirements<Result> =
  Result extends ToolExecution<unknown, unknown, infer R> ? R : never;
/** Collect requirements from a tool's schema decoding and its individual callbacks. */
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
/** Infer emitted output from the declared Effect or Stream result. */
type ExecutionOutput<Result> =
  Result extends ToolExecution<infer Output, unknown, unknown> ? Output : never;
/** Prefer the explicit execution output type when a definition has a handler. */
type InferredOutput<Definition, Output> = Definition extends {
  readonly execute: (...args: never[]) => infer Result;
}
  ? ExecutionOutput<Result>
  : Output;
/** Retain the supplied execution function's exact result type on a callable tool. */
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

/** Expose a directly callable tool whose handler returns a single Effect result. */
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

/** Allow callers to supply input, output, and context types explicitly on a tool definition. */
type ExplicitTool<
  Input,
  Output,
  Context,
  Failure = unknown,
  Services = never,
> = EffectToolOptions<Input, Output, Failure, Services, Context>;

/** Require a callable handler when callers declare all execution types explicitly. */
type ExplicitExecutableTool<Input, Output, Context, Failure, Services> =
  ExplicitTool<Input, Output, Context, Failure, Services> & {
    readonly execute: NonNullable<
      ExplicitTool<Input, Output, Context, Failure, Services>['execute']
    >;
  };

/** Define a tool whose callbacks use the context of each invocation. */
export function tool<
  const Definition extends FunctionToolDefinition,
  Input,
  Output = never,
  Context = ContextData,
>(
  options: Definition & ToolOptions<Input, Output, unknown, unknown, Context>,
): CallableTool<Definition, Input, Context> &
  ToolTypes<
    Input,
    InferredOutput<Definition, Output>,
    Context,
    FunctionRequirements<Definition>
  >;
/** Preserve direct calls to a scalar Effect execution handler. */
export function tool<Input, Output, Failure, Services>(
  options: ScalarTool<Input, Output, Failure, Services>,
): ScalarTool<Input, Output, Failure, Services>;
/** Preserve the output and context types for a tool with explicit execution settings. */
export function tool<
  Input,
  Output,
  Context extends ContextData,
  Failure = unknown,
  Services = never,
>(
  options: ExplicitExecutableTool<Input, Output, Context, Failure, Services>,
): ExplicitExecutableTool<Input, Output, Context, Failure, Services>;
/** Keep explicit input, output, and context types when execution is optional. */
export function tool<
  Input,
  Output,
  Context extends ContextData,
  Failure = unknown,
  Services = never,
>(
  options: ExplicitTool<Input, Output, Context, Failure, Services>,
): ExplicitTool<Input, Output, Context, Failure, Services>;
/** Declare a tool that validates input and context without a typed result. */
export function tool<Input, Context extends ContextData>(
  options: ExplicitTool<Input, never, Context>,
): ExplicitTool<Input, never, Context>;
/** Declare a tool that supplies typed output and context without a typed input. */
export function tool<Output, Context extends ContextData>(
  options: ExplicitTool<never, Output, Context>,
): ExplicitTool<never, Output, Context>;
/** Declare the tool context alone when the tool has neither a typed input nor output. */
export function tool<Context extends ContextData>(
  options: ExplicitTool<never, never, Context>,
): ExplicitTool<never, never, Context>;
/** Return the registered provider tool handle with its precise type intact. */
export function tool<
  const Definition extends ProviderToolHandle<unknown, unknown, unknown>,
>(options: Definition): Definition;
export function tool(options: EffectTools[string]): EffectTools[string] {
  return options;
}

/** Infer services from either a registered provider handle or a user-defined tool's callbacks. */
type DefinitionRequirements<Definition> =
  Definition extends ProviderToolHandle<unknown, unknown, infer Services>
    ? Services
    : Definition extends ToolTypes<unknown, unknown, unknown, infer Services>
      ? Services
      : FunctionRequirements<Definition>;

/** Include services for sandbox caller preparation and for the tools it can invoke. */
type CallerRequirements<Definition> = Definition extends {
  readonly experimental_toolCaller: ToolCaller<
    infer R,
    infer Bound,
    infer Prepare
  >;
}
  ? | R
    | Prepare
    | (EffectTools[string] extends Bound
        ? never
        : DefinitionRequirements<Bound>)
  : never;

/** Combine directly required services with the requirements of an attached tool caller. */
export type ToolRequirements<Definition> = Definition extends unknown
  ? DefinitionRequirements<Definition> | CallerRequirements<Definition>
  : never;

/** Map names to public function tool definitions and registered provider handles. */
export type EffectTools = Readonly<
  Record<
    string,
    (FunctionToolDefinition | ProviderToolHandle<unknown, unknown, unknown>) & {
      readonly providerOptions?: ProviderOptions | undefined;
    }
  >
>;

/** Describe how a tool prepares a caller and binds the tools it may invoke. */
export type ToolCaller<
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> =
  | {
      readonly type: 'local';
      readonly bind: (
        tools: EffectTools,
      ) => Effect.Effect<Bound, AiSdkError, R>;
      readonly prepareModelMessage?: (
        tools: EffectTools,
      ) => Effect.Effect<string | undefined, AiSdkError, Prepare>;
    }
  | {
      readonly type: 'provider';
      readonly prepareProviderOptions: (
        options: ProviderOptions | undefined,
      ) => Effect.Effect<ProviderOptions, AiSdkError, R>;
    };

/** Associate a tool definition with a caller without losing its own public option types. */
export type ToolWithCaller<
  T extends object,
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> = T & {
  readonly experimental_toolCaller: ToolCaller<R, Bound, Prepare>;
};

/** Track the unannotated tool and its latest caller so rebinding can preserve native identity. */
const toolCallers = new WeakMap<
  EffectTools[string],
  {
    readonly original: EffectTools[string];
    readonly caller: ToolCaller<unknown>;
  }
>();

/** Return a copied tool with a non-enumerable caller annotation and its original binding identity. */
export const annotateToolCaller = <
  T extends EffectTools[string],
  R,
  Bound extends EffectTools[string],
  Prepare,
>(
  tool: T,
  caller: ToolCaller<R, Bound, Prepare>,
): ToolWithCaller<T, R, Bound, Prepare> => {
  const annotated = Object.defineProperty(
    { ...tool },
    'experimental_toolCaller',
    { value: caller },
  ) as ToolWithCaller<T, R, Bound, Prepare>;
  toolCallers.set(annotated, {
    original: toolCallers.get(tool)?.original ?? tool,
    caller,
  });
  return annotated;
};

/** Infer input from a registered provider tool or the user-defined schema and metadata. */
export type InferToolInput<Definition> =
  Definition extends ProviderToolHandle<infer Input, unknown, unknown>
    ? Input
    : Definition extends ToolTypes<infer Input, unknown, unknown, unknown>
      ? Input
      : Definition extends {
            readonly inputSchema: FlexibleSchema<infer Input, unknown>;
          }
        ? Input
        : never;

/** Infer output from the registered tool metadata or the user-defined execution contract. */
export type InferToolOutput<Definition> =
  Definition extends ProviderToolHandle<unknown, infer Output, unknown>
    ? Output
    : Definition extends ToolTypes<unknown, infer Output, unknown, unknown>
      ? Output
      : ExecutionOutput<Callback<Definition, 'execute'>>;

/** Read the context type carried by a tool's compile-time metadata. */
type DeclaredContext<Definition> =
  Definition extends ToolTypes<unknown, unknown, infer Context, unknown>
    ? Context
    : unknown;

/** Treat unspecified or empty context as unrequired when preparing tool inputs. */
export type InferToolContext<Definition> =
  unknown extends DeclaredContext<Definition>
    ? never
    : keyof NonNullable<DeclaredContext<Definition>> extends never
      ? never
      : string extends keyof NonNullable<DeclaredContext<Definition>>
        ? never
        : DeclaredContext<Definition>;

/** Require context only for tool entries whose declared context needs fields. */
type RequiredToolContext<Tools extends EffectTools> = {
  [
    Name in keyof Tools as InferToolContext<Tools[Name]> extends never
      ? never
      : undefined extends InferToolContext<Tools[Name]>
        ? never
        : Name
  ]: InferToolContext<Tools[Name]>;
};

/** Keep context optional for tool entries with unspecified or empty context. */
type OptionalToolContext<Tools extends EffectTools> = {
  [
    Name in keyof Tools as InferToolContext<Tools[Name]> extends never
      ? never
      : undefined extends InferToolContext<Tools[Name]>
        ? Name
        : never
  ]?: InferToolContext<Tools[Name]>;
};

/** Assemble the context record keyed by tool name with the appropriate optional fields. */
export type InferToolSetContext<Tools extends EffectTools> = {
  [
    Name in keyof (RequiredToolContext<Tools> & OptionalToolContext<Tools>)
  ]: (RequiredToolContext<Tools> & OptionalToolContext<Tools>)[Name];
};

/** Collect the services required by every tool the SDK can execute in an operation. */
export type ToolServices<Tools extends EffectTools> = ToolRequirements<
  Tools[keyof Tools]
>;

// ToolSet accepts several SDK tool variants. Keep the compatible variants
// without intersecting their typed arguments with the untyped index signature.
/** Retain inferred values compatible with the native SDK tool definition. */
type CompatibleSdkTool<Native> = Native extends ToolSet[string]
  ? Native
  : never;

/** Translate a public tool definition to native input, output, and context types. */
type NativeTool<Definition> = Definition extends EffectTools[string]
  ? CompatibleSdkTool<
      Tool<
        InferToolInput<Definition>,
        InferToolOutput<Definition>,
        DeclaredContext<Definition>
      > &
        (Definition extends ToolWithCaller<object, unknown>
          ? Pick<NativeToolCaller, 'experimental_toolCaller'>
          : unknown)
    >
  : never;

/** Preserve registered tool names while mapping each value to its native definition. */
export type BoundTools<Tools extends EffectTools> = {
  [Name in keyof Tools]: NativeTool<Tools[Name]>;
};

/** Store deferred native bindings separately from public handles and release them with the handle. */
const deferredTools = new WeakMap<object, (owner: Owner<never>) => Tool>();

/** Register a native factory for a tool whose binding must wait for an operation owner. */
export function rememberFunctionTool<
  Handle extends object,
  Services,
  Native extends Tool,
>(handle: Handle, bind: (owner: Owner<Services>) => Native): Handle {
  deferredTools.set(handle, bind as unknown as (owner: Owner<never>) => Tool);
  return handle;
}

/** Provide the lifetime and services shared by native tool callbacks during one operation. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Convert the SDK sandbox field to a public session before invoking a user callback. */
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

/** Adapt schemas and tool callbacks using the operation owner while retaining the supplied tool settings. */
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

/** Resolve registered descriptors, function definitions, and caller annotations into the SDK tool set. */
export const bindTools = <Tools extends EffectTools>(
  tools: Tools,
  owner: Owner<NoInfer<ToolServices<Tools>>>,
): BoundTools<Tools> => {
  const preparedTools = new WeakMap<EffectTools[string], ToolSet[string]>();
  const publicTools = (
    subset: ToolSet,
  ): Effect.Effect<EffectTools, AiSdkError> =>
    Effect.forEach(Object.entries(subset), ([name, selected]) => {
      if (!Object.hasOwn(tools, name) || !tools[name]) {
        return Effect.fail(sdkError('toolCaller', `Unknown tool "${name}".`));
      }
      const definition = tools[name];
      if (definition.providerOptions === selected.providerOptions) {
        preparedTools.set(definition, selected);
        return Effect.succeed([name, definition] as const);
      }
      // A provider caller can change options before a local caller reads them.
      const withOptions = {
        ...definition,
        providerOptions: selected.providerOptions,
      };
      const caller = Object.getOwnPropertyDescriptor(
        definition,
        'experimental_toolCaller',
      );
      if (caller) {
        Object.defineProperty(withOptions, 'experimental_toolCaller', caller);
      }
      preparedTools.set(withOptions, selected);
      return Effect.succeed([name, withOptions] as const);
    }).pipe(Effect.map(Object.fromEntries));

  const bindDefinition = (
    name: string,
    definition: EffectTools[string],
  ): ToolSet[string] => {
    const attachment = toolCallers.get(definition);
    const original = attachment?.original ?? definition;
    const bind = deferredTools.get(original);
    const native =
      preparedTools.get(original) ??
      (bind
        ? bind(owner)
        : isProviderTool(original)
          ? bindProviderTool(
              original as ProviderToolHandle<
                unknown,
                unknown,
                ToolServices<Tools>
              >,
              owner,
            )
          : bindFunctionTool(
              name,
              original as EffectToolOptions<
                unknown,
                unknown,
                unknown,
                ToolServices<Tools>
              >,
              owner,
            ));
    if (!attachment) return native;
    const callerTool = native as Tool;
    const caller = attachment.caller as ToolCaller<ToolServices<Tools>>;
    if (caller.type === 'provider') {
      return sdkToolCaller(callerTool, {
        type: 'provider',
        prepareProviderOptions: (options) =>
          owner.runSyncCallback(
            Effect.suspend(() => caller.prepareProviderOptions(options)),
          ),
      });
    }
    const { bind: bindLocal, prepareModelMessage } = caller;
    return sdkToolCaller(callerTool, {
      type: 'local',
      bind: (subset) => {
        const definition = owner.runSyncCallback(
          Effect.flatMap(publicTools(subset), bindLocal),
        );
        return bindDefinition(name, definition) as Tool;
      },
      ...(prepareModelMessage && {
        prepareModelMessage: (subset) =>
          owner.runSyncCallback(
            Effect.flatMap(publicTools(subset), prepareModelMessage),
          ),
      }),
    });
  };
  const native = Object.fromEntries(
    Object.entries(tools).map(([name, definition]) => [
      name,
      bindDefinition(name, definition),
    ]),
  );
  rememberTelemetryTools(native, tools);
  return native as unknown as BoundTools<Tools>;
};
