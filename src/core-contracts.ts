import type * as sdk from 'ai';
import type { InferToolSetContext } from '@ai-sdk/provider-utils';
import type { Effect, Stream } from 'effect';
import type { ToolLoopAgent } from './core.js';
import type { createDownload } from './core-files.js';
import type { FlexibleSchema } from './core-schema.js';
import type { SandboxSession } from './integrations/internal/sandbox-base.js';
import type { TelemetryEvent } from './integrations/internal/telemetry.js';
import type {
  CoreCallback,
  CoreEvent,
  CoreOptions,
} from './internal/core-settings.js';
import type { OutputSpecification } from './internal/output.js';
import type { ProviderToolHandle } from './internal/provider-tool.js';
import type { TextStreamResult } from './internal/text-stream.js';
import type {
  BoundTools,
  EffectToolExecutionOptions,
  EffectToolOptions,
  EffectTools,
  InferToolInput,
  InferToolOutput,
} from './internal/tool.js';
import type {
  ProviderV2,
  ProviderV3,
  ProviderV4,
} from './protocols/provider.js';

type Context = Record<string, unknown>;
type Output = OutputSpecification<unknown, unknown, unknown, unknown>;
type Native<O extends Output> = [O] extends [never]
  ? sdk.OutputInterface<unknown, unknown, unknown>
  : O extends OutputSpecification<infer A, infer P, infer I, unknown>
    ? sdk.OutputInterface<A, P, I>
    : never;
type AgentFor<
  C,
  T extends EffectTools,
  R extends Context,
  O extends Output,
  S,
> =
  O extends OutputSpecification<infer A, infer P, infer I, unknown>
    ? ToolLoopAgent<C, T, R, A, P, I, S>
    : ToolLoopAgent<C, T, R, unknown, unknown, unknown, S>;

export type Agent<
  C = never,
  T extends EffectTools = {},
  R extends Context = Context,
  O extends Output = Output,
  S = never,
> = Pick<
  AgentFor<C, T, R, O, S>,
  'id' | 'version' | 'tools' | 'generate' | 'stream'
>;
export type AgentCallParameters<
  C,
  T extends EffectTools = {},
  R extends Context = Context,
  S = never,
> = CoreOptions<sdk.AgentCallParameters<C, BoundTools<T>, R>, S, T>;
export type AgentStreamParameters<
  C,
  T extends EffectTools,
  R extends Context = Context,
  S = never,
> = CoreOptions<sdk.AgentStreamParameters<C, BoundTools<T>, R>, S, T>;
export type ToolLoopAgentSettings<
  C = never,
  T extends EffectTools = {},
  R extends Context = Context,
  O extends Output = Output,
  S = never,
> = ConstructorParameters<
  typeof ToolLoopAgent<
    C,
    T,
    R,
    O extends OutputSpecification<infer A, unknown, unknown, unknown>
      ? A
      : never,
    O extends OutputSpecification<unknown, infer P, unknown, unknown>
      ? P
      : never,
    O extends OutputSpecification<unknown, unknown, infer I, unknown>
      ? I
      : never,
    S
  >
>[0];
export type { ToolLoopAgentSettings as Experimental_AgentSettings };

export type OutputInterface<
  A = unknown,
  P = A,
  I = never,
  R = never,
> = OutputSpecification<A, P, I, R>;
export type Provider = ProviderV2 | ProviderV3 | ProviderV4;
export type Experimental_DownloadFunction = Effect.Success<
  ReturnType<typeof createDownload>
>;
export type InferTelemetryEvent<Event> = TelemetryEvent<
  sdk.InferTelemetryEvent<Event>
>;
export type InferSchema<Value> =
  Value extends FlexibleSchema<infer A, unknown> ? A : never;
export type InferGenerateOutput<Value extends Output> =
  Value extends OutputSpecification<infer A, unknown, unknown, unknown>
    ? A
    : never;
export type InferStreamOutput<Value extends Output> =
  Value extends OutputSpecification<unknown, infer A, unknown, unknown>
    ? A
    : never;
export type { InferToolInput, InferToolOutput } from './internal/tool.js';
export type LogWarningsFunction<S = never> = CoreCallback<
  sdk.LogWarningsFunction,
  S
>;
export type { LogWarningsFunction as Experimental_LogWarningsFunction };
export type ErrorHandler<S = never> = CoreCallback<sdk.ErrorHandler, S>;
export type RepairTextFunction<S = never> = CoreCallback<
  sdk.RepairTextFunction,
  S
>;
export type ChunkDetector = (
  ...args: Parameters<sdk.ChunkDetector>
) => ReturnType<sdk.ChunkDetector>;

export type GenerateTextResult<
  T extends EffectTools,
  R extends Context,
  O extends Output,
> = sdk.GenerateTextResult<BoundTools<T>, R, Native<O>>;
export type StreamTextResult<
  T extends EffectTools,
  R extends Context,
  O extends Output,
> = TextStreamResult<BoundTools<T>, R, Native<O>>;
export type GenerateTextStartEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.GenerateTextStartEvent<BoundTools<T>, R, Native<O>>, T>;
export type GenerateTextStepStartEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.GenerateTextStepStartEvent<BoundTools<T>, R, Native<O>>, T>;
export type GenerateTextStepErrorEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.GenerateTextStepErrorEvent<BoundTools<T>, R, Native<O>>, T>;
export type {
  GenerateTextStartEvent as OnStartEvent,
  GenerateTextStepStartEvent as OnStepStartEvent,
};

export type GenerateTextAbortEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.GenerateTextAbortEvent<BoundTools<T>, R>, T>;
export type GenerateTextEndEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.GenerateTextEndEvent<BoundTools<T>, R>, T>;
export type GenerateTextStepEndEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.GenerateTextStepEndEvent<BoundTools<T>, R>, T>;
export type {
  GenerateTextEndEvent as OnFinishEvent,
  GenerateTextStepEndEvent as OnStepFinishEvent,
};
export type LanguageModelCallEndEvent<T extends EffectTools = EffectTools> =
  CoreEvent<sdk.LanguageModelCallEndEvent<BoundTools<T>>, T>;
export type LanguageModelStreamPart<T extends EffectTools = EffectTools> =
  sdk.LanguageModelStreamPart<BoundTools<T>>;
export type { LanguageModelStreamPart as Experimental_LanguageModelStreamPart };
export type RequestOptions<T extends EffectTools = EffectTools> = CoreOptions<
  sdk.RequestOptions<BoundTools<T>>,
  never,
  T
>;
export type StepResult<
  T extends EffectTools,
  R extends Context = Context,
> = sdk.StepResult<BoundTools<T>, R>;
export type StreamTextEndEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.StreamTextEndEvent<BoundTools<T>, R, Native<O>>, T>;
export type ContentPart<T extends EffectTools> = sdk.ContentPart<BoundTools<T>>;
export type TextStreamPart<T extends EffectTools> = sdk.TextStreamPart<
  BoundTools<T>
>;
export type ToolApprovalRequestOutput<T extends EffectTools> =
  sdk.ToolApprovalRequestOutput<BoundTools<T>>;
export type ToolApprovalResponseOutput<T extends EffectTools> =
  sdk.ToolApprovalResponseOutput<BoundTools<T>>;
export type ToolSet = EffectTools;

export type GenerateTextOnStartCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
  S = never,
> = CoreCallback<
  sdk.GenerateTextOnStartCallback<BoundTools<T>, R, Native<O>>,
  S,
  T
>;
export type GenerateTextOnAbortCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.GenerateTextOnAbortCallback<BoundTools<T>, R>, S, T>;
export type GenerateTextOnEndCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.GenerateTextOnEndCallback<BoundTools<T>, R>, S, T>;
export type GenerateTextOnStepEndCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.GenerateTextOnStepEndCallback<BoundTools<T>, R>, S, T>;
export type GenerateTextOnStepStartCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
  S = never,
> = CoreCallback<
  sdk.GenerateTextOnStepStartCallback<BoundTools<T>, R, Native<O>>,
  S,
  T
>;
export type GenerateTextOnStepErrorCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
  S = never,
> = CoreCallback<
  sdk.GenerateTextOnStepErrorCallback<BoundTools<T>, R, Native<O>>,
  S,
  T
>;
export type {
  GenerateTextOnEndCallback as GenerateTextOnFinishCallback,
  GenerateTextOnStepEndCallback as GenerateTextOnStepFinishCallback,
};

export type OnLanguageModelCallStartCallback<S = never> = CoreCallback<
  sdk.OnLanguageModelCallStartCallback,
  S
>;
export type OnLanguageModelCallEndCallback<
  T extends EffectTools = EffectTools,
  S = never,
> = CoreCallback<sdk.OnLanguageModelCallEndCallback<BoundTools<T>>, S, T>;
export type OnToolExecutionStartCallback<
  T extends EffectTools = EffectTools,
  S = never,
> = CoreCallback<sdk.OnToolExecutionStartCallback<BoundTools<T>>, S, T>;
export type OnToolExecutionEndCallback<
  T extends EffectTools = EffectTools,
  S = never,
> = CoreCallback<sdk.OnToolExecutionEndCallback<BoundTools<T>>, S, T>;
export type StreamObjectOnFinishCallback<Result, S = never> = CoreCallback<
  sdk.StreamObjectOnFinishCallback<Result>,
  S
>;
export type StreamTextOnChunkCallback<
  T extends EffectTools,
  S = never,
> = CoreCallback<sdk.StreamTextOnChunkCallback<BoundTools<T>>, S, T>;
export type StreamTextOnEndCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
  S = never,
> = CoreCallback<
  sdk.StreamTextOnEndCallback<BoundTools<T>, R, Native<O>>,
  S,
  T
>;
export type StreamTextOnErrorCallback<S = never> = CoreCallback<
  sdk.StreamTextOnErrorCallback,
  S
>;
export type StreamTextOnErrorRetryCallback<S = never> = CoreCallback<
  sdk.StreamTextOnErrorRetryCallback,
  S
>;

export type PrepareStepFunction<
  T extends EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.PrepareStepFunction<BoundTools<T>, R>, S, T>;
export type PrepareStepResult<
  T extends EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.PrepareStepResult<BoundTools<T>, R>, T>;
export type StopCondition<
  T extends EffectTools,
  R extends Context = Context,
  S = never,
> = (
  ...args: Parameters<sdk.StopCondition<BoundTools<T>, R>>
) => boolean | Effect.Effect<boolean, unknown, S>;
export type ToolApprovalConfiguration<
  T extends EffectTools,
  R,
  S = never,
> = CoreOptions<
  { toolApproval: sdk.ToolApprovalConfiguration<BoundTools<T>, R> },
  S,
  T
>['toolApproval'];
export type GenericToolApprovalFunction<
  T extends EffectTools,
  C extends InferToolSetContext<BoundTools<T>>,
  R,
  S = never,
> = CoreCallback<sdk.GenericToolApprovalFunction<BoundTools<T>, C, R>, S, T>;
export type SingleToolApprovalFunction<I, C, R, S = never> = CoreCallback<
  sdk.SingleToolApprovalFunction<I, C, R>,
  S
>;
export type ToolCallRepairFunction<
  T extends EffectTools,
  S = never,
> = CoreCallback<sdk.ToolCallRepairFunction<BoundTools<T>>, S, T>;
export type ToolInputRefinement<T extends EffectTools, S = never> = {
  [K in keyof sdk.ToolInputRefinement<BoundTools<T>>]: CoreCallback<
    sdk.ToolInputRefinement<BoundTools<T>>[K],
    S,
    T
  >;
};

export type ToolExecutionOptions<C> = EffectToolExecutionOptions<C>;
export type ToolExecuteFunction<I, A, C, E = never, S = never> = (
  input: I,
  options: ToolExecutionOptions<C>,
) => Effect.Effect<A, E, S> | Stream.Stream<A, E, S>;
export type Tool<I = unknown, A = unknown, C = unknown, E = never, S = never> =
  ProviderToolHandle<I, A, S> | EffectToolOptions<I, A, E, S, C>;
export type InferUITool<T> = {
  input: InferToolInput<T>;
  output: InferToolOutput<T>;
};

export type Experimental_SandboxSession = SandboxSession;
export type Experimental_SandboxProcess = Effect.Success<
  ReturnType<SandboxSession['spawn']>
>;
export type Experimental_ToolCallerTool<T extends object = Tool> = T & {
  readonly experimental_toolCaller: import('./protocols/provider-utils.js').Experimental_ToolCallerDefinition;
};
