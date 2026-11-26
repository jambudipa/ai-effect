import * as sdk from 'ai';
import { Effect, Schema } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from './internal/operation.js';
import {
  bindTools,
  rememberFunctionTool,
  type EffectToolOptions,
  type EffectTools,
  type ToolServices,
} from './internal/tool.js';

/** Keep the tool names needed by stop conditions without exposing full step results. */
type StepWithTools = {
  readonly toolCalls?: ReadonlyArray<{ readonly toolName: string }>;
};
/** Accept the step history passed to SDK stop predicates. */
type Steps = { readonly steps: ReadonlyArray<StepWithTools> };

/** Stop when the number of completed steps equals the specified count. */
export const isStepCount =
  (stepCount: number) =>
  ({ steps }: Steps) =>
    steps.length === stepCount;
/** Retain the SDK-compatible alias for the exact step-count predicate. */
export const stepCountIs = isStepCount;
/** Leave normal completion to the SDK loop by supplying no additional stopping condition. */
export const isLoopFinished = () => () => false;

/** Stop when the last completed step requested any of the supplied tool names. */
export const hasToolCall =
  <Tools extends EffectTools>(...names: Array<keyof Tools | (string & {})>) =>
  ({ steps }: Steps) =>
    steps.at(-1)?.toolCalls?.some(({ toolName }) => names.includes(toolName)) ??
    false;

/** Restrict a request to named tools, or leave the full tool set active when unspecified. */
export type ActiveTools<Tools extends EffectTools> =
  ReadonlyArray<Extract<keyof Tools, string>> | undefined;

/** Infer the active subset while preserving an omitted restriction or tool set. */
export type ActiveToolSubset<
  Tools extends EffectTools | undefined,
  Active extends ActiveTools<NonNullable<Tools>>,
> = Tools extends undefined
  ? undefined
  : [Active] extends [NonNullable<ActiveTools<NonNullable<Tools>>>]
    ? Pick<NonNullable<Tools>, Active[number]>
    : Tools;

/** Remove inactive tool definitions without cloning the original set when no restriction applies. */
export function filterActiveTools<
  Tools extends EffectTools | undefined,
  Active extends ActiveTools<NonNullable<Tools>>,
>({
  tools,
  activeTools,
}: {
  readonly tools: Tools;
  readonly activeTools: Active;
}): ActiveToolSubset<Tools, Active> {
  if (!tools || !activeTools) return tools as ActiveToolSubset<Tools, Active>;
  const names: readonly string[] = activeTools;
  const selected = Object.fromEntries(
    Object.entries(tools).filter(([name]) => names.includes(name)),
  );
  return selected as ActiveToolSubset<Tools, Active>;
}

export { filterActiveTools as experimental_filterActiveTools };

/** Build a tool whose input and output are unknown until it is resolved at runtime. */
export const dynamicTool = <Failure, Services>(
  options: EffectToolOptions<unknown, unknown, Failure, Services>,
): EffectToolOptions<unknown, unknown, Failure, Services> & {
  readonly type: 'dynamic';
} => ({ ...options, type: 'dynamic' });

/** Bind tools in a scope before computing SDK fingerprints for compatibility comparisons. */
export const fingerprintTools = <Tools extends EffectTools>(tools: Tools) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<ToolServices<Tools>>();
      return yield* runRequest(
        'fingerprintTools',
        { abortSignal: owner.signal },
        () => sdk.fingerprintTools(bindTools(tools, owner)),
      );
    }),
  );

/** Compare current fingerprints with a baseline to detect tool-definition drift. */
export const detectToolDrift = (
  current: Record<string, string>,
  baseline: Record<string, string>,
) => runSync('detectToolDrift', () => sdk.detectToolDrift(current, baseline));

/** Require a text query when the model asks to discover available tools. */
const searchInput = Schema.Struct({ query: Schema.String }).annotate({
  identifier: 'ToolSearchInput',
});
/** Describe the names and optional descriptions returned by tool lookup. */
const searchOutput = Schema.Struct({
  tools: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      description: Schema.optional(Schema.String),
    }),
  ),
}).annotate({ identifier: 'ToolSearchOutput' });

/** Keep search callback arguments and results aligned with the installed SDK. */
type NativeSearch = NonNullable<
  NonNullable<Parameters<typeof sdk.toolSearch>[0]>['search']
>;
/** Search for eligible tools through Effect in the operation's service context. */
export type ToolSearchFunction<R = never> = (
  ...args: Parameters<NativeSearch>
) => Effect.Effect<Awaited<ReturnType<NativeSearch>>, unknown, R>;

/** Construct a search tool with optional result limits and an Effect lookup callback. */
export const toolSearch = <R = never>(options?: {
  readonly search?: ToolSearchFunction<R>;
  readonly maxResults?: number;
}) =>
  runSync('toolSearch', () => {
    const maxResults = options?.maxResults;
    const search = options?.search;
    const preview = sdk.toolSearch(
      maxResults === void 0 ? void 0 : { maxResults },
    );
    const handle = {
      type: 'function' as const,
      ...(typeof preview.description === 'string'
        ? { description: preview.description }
        : {}),
      inputSchema: searchInput,
      outputSchema: searchOutput,
      execute: (
        _input: typeof searchInput.Type,
      ): Effect.Effect<typeof searchOutput.Type, unknown, R> =>
        Effect.fail(
          sdkError(
            'toolSearch',
            new sdk.InvalidArgumentError({
              parameter: 'tool',
              value: 'toolSearch',
              message: 'Call toolSearch from a generation.',
            }),
          ),
        ),
    };
    return rememberFunctionTool(
      handle,
      (owner: Effect.Success<ReturnType<typeof openOperation<R>>>) =>
        sdk.toolSearch({
          ...(maxResults === void 0 ? {} : { maxResults }),
          ...(search
            ? {
                search: (...args) =>
                  owner.runCallback(Effect.suspend(() => search(...args))),
              }
            : {}),
        }),
    );
  });
