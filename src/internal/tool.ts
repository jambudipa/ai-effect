import {
  tool as sdkTool,
  type Tool,
  type ToolExecutionOptions,
  type ToolSet,
} from 'ai';
import { Effect, Schema } from 'effect';
import type { openOperation } from './operation.js';
import {
  bindProviderTool,
  isProviderTool,
  type ProviderToolHandle,
} from './provider-tool.js';
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

type FunctionToolDefinition = {
  readonly inputSchema: Schema.ConstraintDecoder<unknown, unknown>;
  readonly execute: (
    ...args: never[]
  ) => Effect.Effect<unknown, unknown, unknown>;
};

type ToolRequirements<Definition> =
  Definition extends ProviderToolHandle<unknown, unknown, infer Services>
    ? Services
    : Definition extends FunctionToolDefinition
      ? | Effect.Services<ReturnType<Definition['execute']>>
        | Definition['inputSchema']['DecodingServices']
      : never;

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
    : Definition extends FunctionToolDefinition
      ? CompatibleSdkTool<
          Tool<
            Definition['inputSchema']['Type'],
            Effect.Success<ReturnType<Definition['execute']>>,
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
