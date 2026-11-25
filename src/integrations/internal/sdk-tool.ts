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
import { type SandboxSession, unwrapSandbox } from './sandbox.js';

type ExecutionOptions<C> = Omit<
  ToolExecutionOptions<C>,
  'experimental_sandbox'
> & {
  experimental_sandbox?: SandboxSession;
};

const toNativeOptions = <C>(
  options: ExecutionOptions<C>,
): ToolExecutionOptions<C> => {
  const { experimental_sandbox, ...rest } = options;
  const native = experimental_sandbox && unwrapSandbox(experimental_sandbox);
  return { ...rest, ...(native && { experimental_sandbox: native }) };
};

const isAsyncIterable = <A>(
  value: A | AsyncIterable<A>,
): value is AsyncIterable<A> =>
  typeof value === 'object' && !!value && Symbol.asyncIterator in value;

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

type ToolShape = object;
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

const toolSets = new WeakMap<object, ToolSet>();

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

export const unwrapTools = (tools: object) => toolSets.get(tools);
