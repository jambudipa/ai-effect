import {
  tool as sdkTool,
  type Tool,
  type ToolExecutionOptions,
  type ToolSet,
} from 'ai';
import { Effect, Schema } from 'effect';
import type { openOperation } from './operation.js';
import { toSdkSchema } from './schema.js';

export type EffectToolOptions<Input, Output, Failure, Services> = {
  readonly description?: string;
  readonly title?: string;
  readonly inputSchema: Schema.ConstraintDecoder<Input, Services>;
  readonly execute: (
    input: Input,
    options: Omit<ToolExecutionOptions<unknown>, 'experimental_sandbox'>,
  ) => Effect.Effect<Output, Failure, Services>;
};

/** Define a tool whose callback uses the context of each invocation. */
export const tool = <Input, Output, Failure, Services>(
  options: EffectToolOptions<Input, Output, Failure, Services>,
): EffectToolOptions<Input, Output, Failure, Services> => options;

export type EffectTools = Readonly<
  Record<
    string,
    {
      readonly inputSchema: Schema.ConstraintDecoder<unknown, unknown>;
      readonly execute: (
        ...args: never[]
      ) => Effect.Effect<unknown, unknown, unknown>;
    }
  >
>;

export type ToolServices<Tools extends EffectTools> =
  | Effect.Services<ReturnType<Tools[keyof Tools]['execute']>>
  | Tools[keyof Tools]['inputSchema']['DecodingServices'];

// ToolSet accepts several SDK tool variants. Keep the compatible variants
// without intersecting their typed arguments with the untyped index signature.
type CompatibleSdkTool<Native> = Native extends ToolSet[string]
  ? Native
  : never;

export type BoundTools<Tools extends EffectTools> = {
  [Name in keyof Tools]: CompatibleSdkTool<
    Tool<
      Tools[Name]['inputSchema']['Type'],
      Effect.Success<ReturnType<Tools[Name]['execute']>>,
      unknown
    >
  >;
};

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

export const bindTools = <Tools extends EffectTools>(
  tools: Tools,
  owner: Owner<ToolServices<Tools>>,
): BoundTools<Tools> =>
  Object.fromEntries(
    Object.entries(tools).map(([name, definition]) => {
      const { inputSchema, execute, ...options } =
        definition as EffectToolOptions<
          unknown,
          unknown,
          unknown,
          ToolServices<Tools>
        >;
      return [
        name,
        sdkTool<unknown, unknown, Record<string, unknown>>({
          ...options,
          inputSchema: toSdkSchema(inputSchema, owner),
          execute: (input, options) =>
            owner.runCallback(
              Effect.suspend(() => execute(input, options)),
              options.abortSignal,
            ),
        }),
      ];
    }),
  ) as unknown as BoundTools<Tools>;
