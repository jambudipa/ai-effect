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

/** Carry application context through calls, steps, and telemetry without interpreting its keys. */
type Context = Record<string, unknown>;
/** Represent output parsing with complete, partial, item, and context types available for inference. */
type Output = OutputSpecification<unknown, unknown, unknown, unknown>;
/** Recover the native parser output types after Effect callbacks have been bound. */
type Native<O extends Output> = [O] extends [never]
  ? sdk.OutputInterface<unknown, unknown, unknown>
  : O extends OutputSpecification<infer A, infer P, infer I, unknown>
    ? sdk.OutputInterface<A, P, I>
    : never;
/** Instantiate an agent shape from its public output specification and service requirements. */
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

/** Type a reusable agent for consumers that need its identity, tools, and invocations. */
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
/** Accept a generation call with typed tool and callback options. */
export type AgentCallParameters<
  C,
  T extends EffectTools = {},
  R extends Context = Context,
  S = never,
> = CoreOptions<sdk.AgentCallParameters<C, BoundTools<T>, R>, S, T>;
/** Accept a streaming call with typed tools, runtime context, and callback services. */
export type AgentStreamParameters<
  C,
  T extends EffectTools,
  R extends Context = Context,
  S = never,
> = CoreOptions<sdk.AgentStreamParameters<C, BoundTools<T>, R>, S, T>;
/** Infer the reusable agent settings from the constructor's public adapter boundary. */
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

/** Describe output parsing for complete values, partial values, and stream items. */
export type OutputInterface<
  A = unknown,
  P = A,
  I = never,
  R = never,
> = OutputSpecification<A, P, I, R>;
/** Accept the native provider protocol versions that the adapters can bind. */
export type Provider = ProviderV2 | ProviderV3 | ProviderV4;
/** Download inputs through either overload of the adapted SDK downloader. */
export type Experimental_DownloadFunction = Effect.Success<
  ReturnType<typeof createDownload>
>;
/** Infer an event payload after restoring public Effect types on its adapted fields. */
export type InferTelemetryEvent<Event> = TelemetryEvent<
  sdk.InferTelemetryEvent<Event>
>;
/** Extract the validated value type shared by supported schema inputs. */
export type InferSchema<Value> =
  Value extends FlexibleSchema<infer A, unknown> ? A : never;
/** Infer the complete value that a generation result exposes after parsing. */
export type InferGenerateOutput<Value extends Output> =
  Value extends OutputSpecification<infer A, unknown, unknown, unknown>
    ? A
    : never;
/** Infer the partial value produced while streaming output is still incomplete. */
export type InferStreamOutput<Value extends Output> =
  Value extends OutputSpecification<unknown, infer A, unknown, unknown>
    ? A
    : never;
export type { InferToolInput, InferToolOutput } from './internal/tool.js';
/** Report SDK warnings through a callback that can depend on Effect services. */
export type LogWarningsFunction<S = never> = CoreCallback<
  sdk.LogWarningsFunction,
  S
>;
export type { LogWarningsFunction as Experimental_LogWarningsFunction };
/** Handle SDK errors through the operation's bound Effect context. */
export type ErrorHandler<S = never> = CoreCallback<sdk.ErrorHandler, S>;
/** Repair text before structured parsing retries, using the bound Effect context if needed. */
export type RepairTextFunction<S = never> = CoreCallback<
  sdk.RepairTextFunction,
  S
>;
/** Recognize a boundary in buffered text so smoothing can emit another chunk. */
export type ChunkDetector = (
  ...args: Parameters<sdk.ChunkDetector>
) => ReturnType<sdk.ChunkDetector>;

/** Keep the completed generation result with the caller's tool inputs and outputs. */
export type GenerateTextResult<
  T extends EffectTools,
  R extends Context,
  O extends Output,
> = sdk.GenerateTextResult<BoundTools<T>, R, Native<O>>;
/** Expose a native text stream as a scoped result with Effect accessors. */
export type StreamTextResult<
  T extends EffectTools,
  R extends Context,
  O extends Output,
> = TextStreamResult<BoundTools<T>, R, Native<O>>;
/** Observe the effective generation settings as the SDK starts a run. */
export type GenerateTextStartEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.GenerateTextStartEvent<BoundTools<T>, R, Native<O>>, T>;
/** Observe per-step settings and context before a model call starts. */
export type GenerateTextStepStartEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.GenerateTextStepStartEvent<BoundTools<T>, R, Native<O>>, T>;
/** Observe a step failure with the caller's adapted tool types. */
export type GenerateTextStepErrorEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.GenerateTextStepErrorEvent<BoundTools<T>, R, Native<O>>, T>;
export type {
  GenerateTextStartEvent as OnStartEvent,
  GenerateTextStepStartEvent as OnStepStartEvent,
};

/** Observe an interrupted generation and its completed steps. */
export type GenerateTextAbortEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.GenerateTextAbortEvent<BoundTools<T>, R>, T>;
/** Observe the final generation outcome with the application's tool and context types. */
export type GenerateTextEndEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.GenerateTextEndEvent<BoundTools<T>, R>, T>;
/** Observe one completed step for usage, result, and tool bookkeeping. */
export type GenerateTextStepEndEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.GenerateTextStepEndEvent<BoundTools<T>, R>, T>;
export type {
  GenerateTextEndEvent as OnFinishEvent,
  GenerateTextStepEndEvent as OnStepFinishEvent,
};
/** Observe a completed language model call with public tool bindings. */
export type LanguageModelCallEndEvent<T extends EffectTools = EffectTools> =
  CoreEvent<sdk.LanguageModelCallEndEvent<BoundTools<T>>, T>;
/** Type the model-call stream's events with the registered tool set. */
export type LanguageModelStreamPart<T extends EffectTools = EffectTools> =
  sdk.LanguageModelStreamPart<BoundTools<T>>;
export type { LanguageModelStreamPart as Experimental_LanguageModelStreamPart };
/** Preserve SDK request options and bind tool-related fields to the public tool set. */
export type RequestOptions<T extends EffectTools = EffectTools> = CoreOptions<
  sdk.RequestOptions<BoundTools<T>>,
  never,
  T
>;
/** Inspect the output, metadata, and tool activity for one model step. */
export type StepResult<
  T extends EffectTools,
  R extends Context = Context,
> = sdk.StepResult<BoundTools<T>, R>;
/** Observe the completed stream with its final output and steps. */
export type StreamTextEndEvent<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  O extends Output = Output,
> = CoreEvent<sdk.StreamTextEndEvent<BoundTools<T>, R, Native<O>>, T>;
/** Keep generated response parts typed by the tools attached to the operation. */
export type ContentPart<T extends EffectTools> = sdk.ContentPart<BoundTools<T>>;
/** Distinguish text, tool, and lifecycle parts in a text operation's full stream. */
export type TextStreamPart<T extends EffectTools> = sdk.TextStreamPart<
  BoundTools<T>
>;
/** Carry a tool request that needs a decision before execution can continue. */
export type ToolApprovalRequestOutput<T extends EffectTools> =
  sdk.ToolApprovalRequestOutput<BoundTools<T>>;
/** Carry an approval decision correlated with the originating tool call. */
export type ToolApprovalResponseOutput<T extends EffectTools> =
  sdk.ToolApprovalResponseOutput<BoundTools<T>>;
/** Register tools keyed by the names that the model may request. */
export type ToolSet = EffectTools;

/** Attach an Effect observer to the start of the full generation operation. */
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
/** Attach an Effect observer to interruption and the steps already completed. */
export type GenerateTextOnAbortCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.GenerateTextOnAbortCallback<BoundTools<T>, R>, S, T>;
/** Attach an Effect observer to the final generation event. */
export type GenerateTextOnEndCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.GenerateTextOnEndCallback<BoundTools<T>, R>, S, T>;
/** Process completed step information before the SDK continues its generation loop. */
export type GenerateTextOnStepEndCallback<
  T extends EffectTools = EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.GenerateTextOnStepEndCallback<BoundTools<T>, R>, S, T>;
/** Observe the effective per-step options before model generation begins. */
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
/** Observe a generation step error in the operation callback context. */
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

/** Observe the native call boundary before a language model request starts. */
export type OnLanguageModelCallStartCallback<S = never> = CoreCallback<
  sdk.OnLanguageModelCallStartCallback,
  S
>;
/** Observe the native call boundary after a model request ends. */
export type OnLanguageModelCallEndCallback<
  T extends EffectTools = EffectTools,
  S = never,
> = CoreCallback<sdk.OnLanguageModelCallEndCallback<BoundTools<T>>, S, T>;
/** Observe a tool call before its handler begins, with typed tool input. */
export type OnToolExecutionStartCallback<
  T extends EffectTools = EffectTools,
  S = never,
> = CoreCallback<sdk.OnToolExecutionStartCallback<BoundTools<T>>, S, T>;
/** Observe a tool handler's outcome in the same operation context as its start event. */
export type OnToolExecutionEndCallback<
  T extends EffectTools = EffectTools,
  S = never,
> = CoreCallback<sdk.OnToolExecutionEndCallback<BoundTools<T>>, S, T>;
/** Run an Effect hook for the terminal event of an object stream. */
export type StreamObjectOnFinishCallback<Result, S = never> = CoreCallback<
  sdk.StreamObjectOnFinishCallback<Result>,
  S
>;
/** Inspect incoming native chunks with the operation's registered tool types. */
export type StreamTextOnChunkCallback<
  T extends EffectTools,
  S = never,
> = CoreCallback<sdk.StreamTextOnChunkCallback<BoundTools<T>>, S, T>;
/** Handle completion of text streaming and its final adapted outputs. */
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
/** Observe a text stream failure without losing its SDK event payload. */
export type StreamTextOnErrorCallback<S = never> = CoreCallback<
  sdk.StreamTextOnErrorCallback,
  S
>;
/** Make a retry decision after a stream reports an error. */
export type StreamTextOnErrorRetryCallback<S = never> = CoreCallback<
  sdk.StreamTextOnErrorRetryCallback,
  S
>;

/** Compute per-step settings before the agent loop submits its next request. */
export type PrepareStepFunction<
  T extends EffectTools,
  R extends Context = Context,
  S = never,
> = CoreCallback<sdk.PrepareStepFunction<BoundTools<T>, R>, S, T>;
/** Apply a step-specific settings override while preserving public model and tool inputs. */
export type PrepareStepResult<
  T extends EffectTools,
  R extends Context = Context,
> = CoreEvent<sdk.PrepareStepResult<BoundTools<T>, R>, T>;
/** Return a stopping decision directly or compute it in the operation's Effect context. */
export type StopCondition<
  T extends EffectTools,
  R extends Context = Context,
  S = never,
> = (
  ...args: Parameters<sdk.StopCondition<BoundTools<T>, R>>
) => boolean | Effect.Effect<boolean, unknown, S>;
/** Describe which requested tool calls need approval before the SDK executes them. */
export type ToolApprovalConfiguration<
  T extends EffectTools,
  R,
  S = never,
> = CoreOptions<
  { toolApproval: sdk.ToolApprovalConfiguration<BoundTools<T>, R> },
  S,
  T
>['toolApproval'];
/** Make an approval decision from a call and the context inferred from its tool set. */
export type GenericToolApprovalFunction<
  T extends EffectTools,
  C extends InferToolSetContext<BoundTools<T>>,
  R,
  S = never,
> = CoreCallback<sdk.GenericToolApprovalFunction<BoundTools<T>, C, R>, S, T>;
/** Type an approval predicate for one tool's input and context. */
export type SingleToolApprovalFunction<I, C, R, S = never> = CoreCallback<
  sdk.SingleToolApprovalFunction<I, C, R>,
  S
>;
/** Rewrite an invalid SDK tool call before execution with the registered tool types. */
export type ToolCallRepairFunction<
  T extends EffectTools,
  S = never,
> = CoreCallback<sdk.ToolCallRepairFunction<BoundTools<T>>, S, T>;
/** Customize refinement for a named tool while retaining the tool's native callback input. */
export type ToolInputRefinement<T extends EffectTools, S = never> = {
  [K in keyof sdk.ToolInputRefinement<BoundTools<T>>]: CoreCallback<
    sdk.ToolInputRefinement<BoundTools<T>>[K],
    S,
    T
  >;
};

/** Carry invocation context, an abort signal, and the tool call identifier to an Effect handler. */
export type ToolExecutionOptions<C> = EffectToolExecutionOptions<C>;
/** Implement a tool with one Effect result or a stream of results in the operation context. */
export type ToolExecuteFunction<I, A, C, E = never, S = never> = (
  input: I,
  options: ToolExecutionOptions<C>,
) => Effect.Effect<A, E, S> | Stream.Stream<A, E, S>;
/** Accept either a provider-owned tool handle or a user-defined Effect tool definition. */
export type Tool<I = unknown, A = unknown, C = unknown, E = never, S = never> =
  ProviderToolHandle<I, A, S> | EffectToolOptions<I, A, E, S, C>;
/** Derive UI input and output types from the public tool declaration. */
export type InferUITool<T> = {
  input: InferToolInput<T>;
  output: InferToolOutput<T>;
};

/** Use an acquired sandbox session through Effect-managed operations. */
export type Experimental_SandboxSession = SandboxSession;
/** Type the process handle produced by spawning in an acquired sandbox session. */
export type Experimental_SandboxProcess = Effect.Success<
  ReturnType<SandboxSession['spawn']>
>;
/** Retain the sandbox tool caller's bindings and its preparation requirements. */
export type Experimental_ToolCallerTool<
  T extends object = Tool,
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> = import('./protocols/provider-utils.js').Experimental_ToolCallerTool<
  T,
  R,
  Bound,
  Prepare
>;
