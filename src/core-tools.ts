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

type StepWithTools = {
  readonly toolCalls?: ReadonlyArray<{ readonly toolName: string }>;
};
type Steps = { readonly steps: ReadonlyArray<StepWithTools> };

export const isStepCount =
  (stepCount: number) =>
  ({ steps }: Steps) =>
    steps.length === stepCount;
export const stepCountIs = isStepCount;
export const isLoopFinished = () => () => false;

export const hasToolCall =
  <Tools extends EffectTools>(...names: Array<keyof Tools | (string & {})>) =>
  ({ steps }: Steps) =>
    steps.at(-1)?.toolCalls?.some(({ toolName }) => names.includes(toolName)) ??
    false;

export type ActiveTools<Tools extends EffectTools> =
  ReadonlyArray<Extract<keyof Tools, string>> | undefined;

export type ActiveToolSubset<
  Tools extends EffectTools | undefined,
  Active extends ActiveTools<NonNullable<Tools>>,
> = Tools extends undefined
  ? undefined
  : [Active] extends [NonNullable<ActiveTools<NonNullable<Tools>>>]
    ? Pick<NonNullable<Tools>, Active[number]>
    : Tools;

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

export const dynamicTool = <Failure, Services>(
  options: EffectToolOptions<unknown, unknown, Failure, Services>,
): EffectToolOptions<unknown, unknown, Failure, Services> & {
  readonly type: 'dynamic';
} => ({ ...options, type: 'dynamic' });

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

export const detectToolDrift = (
  current: Record<string, string>,
  baseline: Record<string, string>,
) => runSync('detectToolDrift', () => sdk.detectToolDrift(current, baseline));

const searchInput = Schema.Struct({ query: Schema.String }).annotate({
  identifier: 'ToolSearchInput',
});
const searchOutput = Schema.Struct({
  tools: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      description: Schema.optional(Schema.String),
    }),
  ),
}).annotate({ identifier: 'ToolSearchOutput' });

type NativeSearch = NonNullable<
  NonNullable<Parameters<typeof sdk.toolSearch>[0]>['search']
>;
export type ToolSearchFunction<R = never> = (
  ...args: Parameters<NativeSearch>
) => Effect.Effect<Awaited<ReturnType<NativeSearch>>, unknown, R>;

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
