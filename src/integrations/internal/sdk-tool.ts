import type {
  InferToolInput,
  InferToolOutput,
  Tool,
  ToolExecutionOptions,
  ToolSet,
} from '@ai-sdk/provider-utils';
import { Effect, Stream } from 'effect';
import { runSync, sdkError } from '../../internal/operation.js';
import { runResult, runValue } from './operation.js';
import { wrapSchema } from './schema.js';
import { type SandboxSession, unwrapSandbox } from './sandbox-base.js';

/** Use a registered Effect sandbox in place of the SDK sandbox argument during tool execution. */
type ExecutionOptions<C> = Omit<
  ToolExecutionOptions<C>,
  'experimental_sandbox'
> & {
  experimental_sandbox?: SandboxSession;
};

/** Unwrap an optional sandbox only at the native callback boundary and forward the remaining options. */
const toNativeOptions = <C>(
  options: ExecutionOptions<C>,
): ToolExecutionOptions<C> => {
  const { experimental_sandbox, ...rest } = options;
  const native = experimental_sandbox && unwrapSandbox(experimental_sandbox);
  return { ...rest, ...(native && { experimental_sandbox: native }) };
};

/** Separate iterable tool output from a single result so cancellation and errors can follow the stream. */
const isAsyncIterable = <A>(
  value: A | AsyncIterable<A>,
): value is AsyncIterable<A> =>
  typeof value === 'object' && !!value && Symbol.asyncIterator in value;

/** Preserve SDK tool metadata while converting schema validation, hooks, and execution to Effect operations. */
export const wrapTool = <Input, Output, C>(
  operation: string,
  source: Tool<Input, Output, C>,
) => {
  const {
    inputSchema,
    outputSchema,
    contextSchema,
    description,
    needsApproval,
    execute,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    toModelOutput,
    ...metadata
  } = source;
  const readDescription =
    typeof description === 'function'
      ? (
          options: Pick<
            ExecutionOptions<C>,
            'context' | 'experimental_sandbox'
          >,
        ) =>
          runSync(operation, () => {
            const { context, experimental_sandbox } = options;
            const native =
              experimental_sandbox && unwrapSandbox(experimental_sandbox);
            return description({
              context,
              ...(native && { experimental_sandbox: native }),
            });
          })
      : description;
  const checkApproval =
    typeof needsApproval === 'function'
      ? (...args: Parameters<typeof needsApproval>) =>
          runValue(operation, () => needsApproval(...args))
      : needsApproval;
  return {
    ...metadata,
    inputSchema: wrapSchema(operation, inputSchema),
    ...(outputSchema && { outputSchema: wrapSchema(operation, outputSchema) }),
    ...(contextSchema && {
      contextSchema: wrapSchema(operation, contextSchema),
    }),
    ...(readDescription && { description: readDescription }),
    ...((checkApproval || checkApproval === false) && {
      needsApproval: checkApproval,
    }),
    ...(onInputStart && {
      onInputStart: (options: ExecutionOptions<C>) =>
        runValue(operation, () => onInputStart(toNativeOptions(options))),
    }),
    ...(onInputDelta && {
      onInputDelta: (
        options: ExecutionOptions<C> & { inputTextDelta: string },
      ) =>
        runValue(operation, () =>
          onInputDelta({
            ...toNativeOptions(options),
            inputTextDelta: options.inputTextDelta,
          }),
        ),
    }),
    ...(onInputAvailable && {
      onInputAvailable: (
        options: ExecutionOptions<C> &
          Pick<Parameters<typeof onInputAvailable>[0], 'input'>,
      ) =>
        runValue(operation, () =>
          onInputAvailable({
            ...toNativeOptions(options),
            input: options.input,
          }),
        ),
    }),
    ...(toModelOutput && {
      toModelOutput: (options: Parameters<typeof toModelOutput>[0]) =>
        runValue(operation, () => toModelOutput(options)),
    }),
    ...(execute && {
      execute: (input: Input, options: ExecutionOptions<C>) =>
        runResult(
          operation,
          (signal) =>
            execute(input, {
              ...toNativeOptions(options),
              abortSignal: signal,
            }),
          options,
        ).pipe(
          Effect.map((output) =>
            isAsyncIterable(output)
              ? Stream.fromAsyncIterable(output, (error) =>
                  sdkError(operation, error),
                )
              : output,
          ),
        ),
    }),
  };
};

/** Let tool-set records retain their concrete provider-specific object types. */
type ToolShape = object;
/** Preserve tool keys, input and output inference, and SDK tool identification metadata. */
export type WrappedTools<T extends Record<string, ToolShape>> = {
  readonly [K in keyof T]: ReturnType<
    typeof wrapTool<
      InferToolInput<Extract<T[K], Tool>>,
      InferToolOutput<Extract<T[K], Tool>>,
      unknown
    >
  > &
    Pick<
      T[K],
      Extract<keyof T[K], 'commonName' | 'nativeName' | 'toolUseKind' | '_meta'>
    >;
};

/** Keep the original SDK tool set for integrations that must pass it back into a native request. */
const toolSets = new WeakMap<object, ToolSet>();

/** Create Effect tools with operation names qualified by the keys in their native tool set. */
export const wrapTools = <T extends Record<string, ToolShape>>(
  operation: string,
  tools: T,
) => {
  const adapted = Object.fromEntries(
    Object.entries(tools).map(([name, tool]) => [
      name,
      wrapTool(
        `${operation}.${name}`,
        tool as unknown as Tool<unknown, unknown, unknown>,
      ),
    ]),
  ) as unknown as WrappedTools<T>;
  toolSets.set(adapted, tools as unknown as ToolSet);
  return adapted;
};

/** Recover the exact native set for a registered Effect tool-set handle. */
export const unwrapTools = (tools: object) => toolSets.get(tools);
