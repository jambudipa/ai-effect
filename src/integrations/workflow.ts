import * as sdk from '@ai-sdk/workflow';
import type { UIMessageChunk } from 'ai';
import { Effect, Stream } from 'effect';
import { runSync, sdkError } from '../internal/operation.js';

export { Output } from '../internal/output.js';
export { WorkflowChatTransport } from './workflow/client.js';
export type {
  ReconnectToStreamOptions,
  SendMessagesOptions,
  WorkflowChatTransportOptions,
} from './workflow/client.js';

export type {
  GenerationSettings,
  ProviderOptions,
  WorkflowAgentTimeoutConfiguration,
  WorkflowToolApprovalSecret,
} from '@ai-sdk/workflow';

/** Convert a native model-call event to the corresponding UI stream chunk when supported. */
export const toUIMessageChunk = (
  ...args: Parameters<typeof sdk.toUIMessageChunk>
) => runSync('Workflow.toUIMessageChunk', () => sdk.toUIMessageChunk(...args));

/** Construct the native transform that converts model-call events to UI message chunks. */
export const createModelCallToUIChunkTransform = (
  ...args: Parameters<typeof sdk.createModelCallToUIChunkTransform>
) =>
  runSync('Workflow.createModelCallToUIChunkTransform', () =>
    sdk.createModelCallToUIChunkTransform(...args),
  );

/** Normalize UI chunk order using the workflow protocol. */
export const normalizeUIMessageStreamParts = <E = never, R = never>(
  input: Stream.Stream<UIMessageChunk, E, R> | AsyncIterable<UIMessageChunk>,
) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const source =
        Stream.TypeId in input
          ? yield* Stream.toAsyncIterableEffect(input)
          : input;
      const operation = 'Workflow.normalizeUIMessageStreamParts';
      const chunks = yield* runSync(operation, () =>
        sdk.normalizeUIMessageStreamParts(source),
      );
      return Stream.fromAsyncIterable(chunks, (cause) =>
        sdkError(operation, cause),
      );
    }),
  );

import type { UIMessage, ToolSet } from 'ai';
import {
  type LanguageModelV4,
  unwrapLanguageModel,
  wrapLanguageModel,
} from '../internal/language-model.js';
import { wrapLegacyModel } from '../internal/legacy-model.js';
import {
  abortable,
  openOperation,
  runRequest,
  type AiSdkError,
} from '../internal/operation.js';
import {
  type OutputSpecification as EffectOutput,
  bindOutput,
} from '../internal/output.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import type {
  LanguageModelV2,
  LanguageModelV3,
} from '../protocols/provider.js';
import {
  type WithEffectCallbacks,
  bindCallbacks,
} from './internal/callbacks.js';
import type { SandboxSession } from './internal/sandbox.js';
import { unwrapSandbox } from './internal/sandbox.js';
import { wrapTools } from './internal/sdk-tool.js';
import {
  bindWorkflowExtras,
  type WorkflowConstructorExtras,
  type WorkflowExtras,
} from './internal/workflow.js';

export type {
  DownloadFunction,
  PrepareCallCallback,
  PrepareCallOptions,
  PrepareCallResult,
  PrepareStepCallback,
  PrepareStepInfo,
  PrepareStepResult,
  TelemetryOptions,
  ToolCallRepairFunction,
} from './internal/workflow.js';

/** Registered Effect v4 language model accepted by the Workflow agent constructor. */
export type CompatibleLanguageModel = LanguageModelV4;
/** Native workflow model-call stream event specialized to the bound tool set. */
export type ModelCallStreamPart<T extends EffectTools = EffectTools> =
  sdk.ModelCallStreamPart<BoundTools<T>>;
/** Workflow tool start event with types reflecting the selected Effect tools. */
export type WorkflowAgentToolExecutionStartEvent<
  T extends EffectTools = EffectTools,
> = sdk.WorkflowAgentToolExecutionStartEvent<BoundTools<T>>;
/** Workflow tool completion event with types reflecting the selected Effect tools. */
export type WorkflowAgentToolExecutionEndEvent<
  T extends EffectTools = EffectTools,
> = sdk.WorkflowAgentToolExecutionEndEvent<BoundTools<T>>;
/** Output parser with separate final and partial types and optional Effect service requirements. */
export type OutputSpecification<A, P = A, R = never> = EffectOutput<
  A,
  P,
  unknown,
  R
>;

/** Native lifecycle hooks that use the shared Effect binding without model conversion. */
const lifecycle = [
  'onStepEnd',
  'onStepFinish',
  'onEnd',
  'onFinish',
  'onAbort',
  'onError',
  'onToolExecutionStart',
  'onToolExecutionEnd',
] as const;

/** Keys of the SDK hooks adapted by the shared callback binder. */
type Lifecycle = (typeof lifecycle)[number];
/** Constructor options before binding the Effect tool and output types. */
type NativeSettings<A, P> = sdk.WorkflowAgentOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
/** Native complete-generation request specialized to the expected output types. */
type NativeGenerate<A, P> = sdk.WorkflowAgentGenerateOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
/** Native stream request specialized to the expected output types. */
type NativeStream<A, P> = sdk.WorkflowAgentStreamOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
/** Shared native request options for callback type inference. */
type NativeCall<A, P> = sdk.WorkflowAgentCallOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
/** SDK callback event for the start of the whole call, before wrapping the model. */
type NativeStart = Parameters<
  NonNullable<NativeSettings<never, never>['onStart']>
>[0];
/** SDK callback event for the start of one model step, before wrapping the model. */
type NativeStepStart = Parameters<
  NonNullable<NativeSettings<never, never>['onStepStart']>
>[0];
/** Model identity exposed to start callbacks, including the legacy versions the SDK may report. */
type StartModel = string | LanguageModelV2 | LanguageModelV3 | LanguageModelV4;

/** Preserve workflow model IDs and wrap v2, v3, or v4 native models for start callbacks. */
const wrapStartModel = (model: NativeStart['model']): StartModel => {
  if (typeof model === 'string') return model;
  switch (model.specificationVersion) {
    case 'v2':
      return wrapLegacyModel(model);
    case 'v3':
      return wrapLegacyModel(model);
    case 'v4':
      return wrapLanguageModel(model);
  }
};

/** Start callback input with a wrapped model and the native prompt and context values. */
type StartEvent = {
  readonly model: StartModel;
  readonly messages: NativeStart['messages'];
  readonly runtimeContext: NativeStart['runtimeContext'];
  readonly toolsContext: NativeStart['toolsContext'];
};
/** Step start callback input with step index and results accumulated in the current call. */
type StepStartEvent = StartEvent & {
  readonly stepNumber: number;
  readonly steps: NativeStepStart['steps'];
};
/** Start hooks, including experimental names, that receive a model handle adapted for Effect. */
type StartCallbacks<E, R> = {
  readonly onStart?: (event: StartEvent) => Effect.Effect<void, E, R>;
  readonly experimental_onStart?: (
    event: StartEvent,
  ) => Effect.Effect<void, E, R>;
  readonly onStepStart?: (event: StepStartEvent) => Effect.Effect<void, E, R>;
  readonly experimental_onStepStart?: (
    event: StepStartEvent,
  ) => Effect.Effect<void, E, R>;
};

/** Bind start hooks to the operation owner and adapt models before calling user code. */
const bindStartCallbacks = <E, R>(
  options: StartCallbacks<E, R>,
  owner: Effect.Success<ReturnType<typeof openOperation<R>>>,
) => {
  const bind =
    <Event extends NativeStart>(
      callback: (
        event: Omit<Event, 'model'> & { model: StartModel },
      ) => Effect.Effect<void, E, R>,
    ) =>
    ({ model, ...event }: Event) =>
      owner.runCallback(
        Effect.suspend(() =>
          callback({
            ...event,
            model: wrapStartModel(model),
          }),
        ),
      );
  const {
    onStart,
    experimental_onStart,
    onStepStart,
    experimental_onStepStart,
  } = options;
  return {
    ...(onStart && { onStart: bind<NativeStart>(onStart) }),
    ...(experimental_onStart && {
      experimental_onStart: bind<NativeStart>(experimental_onStart),
    }),
    ...(onStepStart && { onStepStart: bind<NativeStepStart>(onStepStart) }),
    ...(experimental_onStepStart && {
      experimental_onStepStart: bind<NativeStepStart>(experimental_onStepStart),
    }),
  };
};

/** Native constructor options preserved without adapting their value representation. */
type GeneralSettings =
  | 'id'
  | 'instructions'
  | 'system'
  | 'toolChoice'
  | 'toolCallConcurrency'
  | 'runtimeContext'
  | 'activeTools'
  | 'toolOrder'
  | 'timeout';

/** Construct a Workflow agent from a registered model or model ID with optional Effect hooks, tools, and sandbox. */
export type WorkflowAgentOptions<
  T extends EffectTools = {},
  A = never,
  P = A,
  E = never,
  R = never,
> = WithEffectCallbacks<
  Pick<
    NativeSettings<A, P>,
    Extract<keyof NativeSettings<A, P>, GeneralSettings | Lifecycle>
  >,
  Lifecycle,
  E,
  R
> &
  Partial<sdk.GenerationSettings> &
  StartCallbacks<E, R> &
  WorkflowConstructorExtras<E, R> & {
    readonly model:
      Extract<NativeSettings<A, P>['model'], string> | CompatibleLanguageModel;
    readonly tools?: T;
    readonly output?: OutputSpecification<A, P, R>;
    readonly experimental_sandbox?: SandboxSession;
  };

/** Native option keys whose Effect equivalents require more than generic callback binding. */
type Omitted =
  | 'repairToolCall'
  | 'experimental_repairToolCall'
  | 'experimental_refineToolInput'
  | 'experimental_download'
  | 'experimental_sandbox'
  | 'stopWhen'
  | 'toolApproval'
  | 'telemetry'
  | 'prepareStep'
  | keyof StartCallbacks<never, never>
  | 'output';

/** Preserve all native request variants and adapt their callbacks, output, sandbox, and telemetry settings. */
type OperationOptions<N, A, P, E, R> = N extends unknown
  ? Omit<WithEffectCallbacks<N, Lifecycle, E, R>, Omitted> &
      StartCallbacks<E, R> &
      WorkflowExtras<E, R> & {
        readonly output?: OutputSpecification<A, P, R>;
        readonly experimental_sandbox?: SandboxSession;
      }
  : never;

/** Shared call configuration used to type Workflow lifecycle callbacks. */
export type WorkflowAgentCallOptions<
  A = never,
  P = A,
  E = never,
  R = never,
> = OperationOptions<NativeCall<A, P>, A, P, E, R>;

/** Complete-generation request with optional Effect structured output and per-call hooks. */
export type WorkflowAgentGenerateOptions<
  A = string,
  P = A,
  E = never,
  R = never,
> = OperationOptions<NativeGenerate<A, P>, A, P, E, R>;

/** Stream request with optional Effect structured output and per-call hooks. */
export type WorkflowAgentStreamOptions<
  A = never,
  P = A,
  E = never,
  R = never,
> = OperationOptions<NativeStream<A, P>, A, P, E, R>;

/** Native completed generation result with the caller's parsed output type. */
export type WorkflowAgentGenerateResult<A = string> =
  sdk.WorkflowAgentGenerateResult<ToolSet, Record<string, unknown>, A>;
/** Workflow stream completion data with a tagged error when the SDK reports one in the result. */
export type WorkflowAgentStreamResult<A = never> = Omit<
  sdk.WorkflowAgentStreamResult<ToolSet, A>,
  'error'
> & {
  readonly error?: AiSdkError;
};

/** Native agent instance parameterized by complete and partial output for this wrapper. */
type NativeAgent<A, P> = sdk.WorkflowAgent<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;

/** Workflow-hosted agent that runs the native model with Effect tools and callback ownership. */
export class WorkflowAgent<A = never, P = A> {
  /** Validate model and sandbox identity before acquiring the constructor callback scope. */
  static make<
    T extends EffectTools = {},
    A = never,
    P = A,
    E = never,
    R = never,
  >(options: WorkflowAgentOptions<T, A, P, E, R>) {
    return Effect.gen(function* () {
      const {
        model,
        tools,
        output,
        experimental_sandbox,
        telemetry,
        repairToolCall,
        experimental_repairToolCall,
        experimental_download,
        prepareStep,
        prepareCall,
        onStart,
        experimental_onStart,
        onStepStart,
        experimental_onStepStart,
        ...rest
      } = options;
      const nativeModel =
        typeof model === 'string' ? model : unwrapLanguageModel(model);
      const nativeSandbox =
        experimental_sandbox && unwrapSandbox(experimental_sandbox);
      if (!nativeModel || (experimental_sandbox && !nativeSandbox)) {
        return yield* Effect.fail(
          sdkError('WorkflowAgent.make', 'Invalid model or sandbox session'),
        );
      }
      const owner = yield* openOperation<R | ToolServices<T>>();
      const extras = yield* bindWorkflowExtras<E, R>(options, owner);
      const config = bindCallbacks<
        Partial<NativeSettings<A, P>>,
        typeof lifecycle,
        E,
        R
      >(rest, lifecycle, owner);
      return yield* runSync('WorkflowAgent.make', () => {
        const nativeOutput = output && bindOutput(output, owner);
        return new WorkflowAgent<A, P>(
          new sdk.WorkflowAgent<ToolSet, Record<string, unknown>, A, P>({
            ...config,
            ...bindStartCallbacks(options, owner),
            ...extras,
            model: nativeModel,
            ...(tools && { tools: bindTools(tools, owner) }),
            ...(nativeOutput && { output: nativeOutput }),
            ...(nativeSandbox && { experimental_sandbox: nativeSandbox }),
          } as NativeSettings<A, P>),
        );
      });
    });
  }

  /** Keep the native Workflow agent behind the tagged request boundary. */
  private constructor(private readonly native: NativeAgent<A, P>) {}

  /** Identifier configured on the native Workflow agent. */
  get id() {
    return this.native.id;
  }
  /** Return wrapped tools with their native Workflow tool keys. */
  get tools() {
    return wrapTools('WorkflowAgent.tools', this.native.tools);
  }

  /** Run a complete Workflow call and retain its full structured-output type. */
  generate<
    Out = [A] extends [never] ? string : A,
    Part = P,
    E = never,
    R = never,
  >(options: WorkflowAgentGenerateOptions<Out, Part, E, R>) {
    return invokeWorkflow<
      NativeGenerate<Out, Part>,
      Out,
      Part,
      E,
      R,
      WorkflowAgentGenerateResult<Out>
    >('WorkflowAgent.generate', options, (input) =>
      this.native.generate<ToolSet, Out, Part>(input),
    );
  }

  /** Run a streaming Workflow call and map any embedded native failure to `AiSdkError`. */
  stream<Out = A, Part = P, E = never, R = never>(
    options: WorkflowAgentStreamOptions<Out, Part, E, R>,
  ) {
    return invokeWorkflow<
      NativeStream<Out, Part>,
      Out,
      Part,
      E,
      R,
      sdk.WorkflowAgentStreamResult<ToolSet, Out>
    >('WorkflowAgent.stream', options, (input) =>
      this.native.stream<ToolSet, Out, Part>(input),
    ).pipe(
      Effect.map((result): WorkflowAgentStreamResult<Out> => {
        const { error, ...data } = result;
        return 'error' in result
          ? { ...data, error: sdkError('WorkflowAgent.stream', error) }
          : data;
      }),
    );
  }
}

/** Native request contracts handled by the shared scoped invocation helper. */
type NativeOptions<A, P> = NativeGenerate<A, P> | NativeStream<A, P>;

/** Bind per-call callbacks, output, and cancellation before waiting for durable Workflow completion. */
const invokeWorkflow = <N extends NativeOptions<A, P>, A, P, E, R, Result>(
  name: string,
  options: OperationOptions<N, A, P, E, R>,
  invoke: (input: N) => Promise<Result>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const {
        output,
        experimental_sandbox,
        telemetry,
        repairToolCall,
        experimental_repairToolCall,
        experimental_download,
        prepareStep,
        onStart,
        experimental_onStart,
        onStepStart,
        experimental_onStepStart,
        ...rest
      } = options;
      const nativeSandbox =
        experimental_sandbox && unwrapSandbox(experimental_sandbox);
      if (experimental_sandbox && !nativeSandbox) {
        return yield* Effect.fail(sdkError(name, 'Invalid sandbox session'));
      }
      const owner = yield* openOperation<R>(options.abortSignal);
      const extras = yield* bindWorkflowExtras<E, R>(options, owner);
      const bound = bindCallbacks<NativeOptions<A, P>, typeof lifecycle, E, R>(
        rest as WithEffectCallbacks<NativeOptions<A, P>, Lifecycle, E, R>,
        lifecycle,
        owner,
      );
      const result = yield* abortable(
        name,
        owner.signal,
        runRequest(name, { abortSignal: owner.signal }, (abortSignal) => {
          const nativeOutput = output && bindOutput(output, owner);
          return invoke({
            ...bound,
            ...bindStartCallbacks(options, owner),
            ...extras,
            abortSignal,
            ...(nativeOutput && { output: nativeOutput }),
            ...(nativeSandbox && { experimental_sandbox: nativeSandbox }),
          } as N);
        }),
      );
      yield* owner.markComplete;
      return result;
    }),
  );

/** Recover the tool definitions exposed by a concrete Workflow agent instance. */
export type InferWorkflowAgentTools<A extends WorkflowAgent> = A['tools'];
/** Infer a workflow UI message using the tools available on the supplied agent type. */
export type InferWorkflowAgentUIMessage<
  A extends WorkflowAgent,
  Metadata = unknown,
> = UIMessage<Metadata>;

/** Effect handler for Workflow abort events with the caller's callback services. */
export type WorkflowAgentOnAbortCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onAbort']>;
/** Effect handler for the native Workflow operation's end event. */
export type WorkflowAgentOnEndCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onEnd']>;
/** Effect handler for errors reported by a native Workflow call. */
export type WorkflowAgentOnErrorCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onError']>;
/** Effect handler for the SDK's finish event, preserving the typed output. */
export type WorkflowAgentOnFinishCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onFinish']>;
/** Effect handler for call start with an adapted model identity. */
export type WorkflowAgentOnStartCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStart']>;
/** Effect handler for the end of a Workflow step. */
export type WorkflowAgentOnStepEndCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepEnd']>;
/** Effect handler for the native step-finish callback name. */
export type WorkflowAgentOnStepFinishCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepFinish']>;
/** Effect handler for step start with the adapted model and accumulated history. */
export type WorkflowAgentOnStepStartCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepStart']>;
/** Effect handler for completion of a Workflow tool invocation. */
export type WorkflowAgentOnToolExecutionEndCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onToolExecutionEnd']>;
/** Effect handler for start of a Workflow tool invocation. */
export type WorkflowAgentOnToolExecutionStartCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onToolExecutionStart']>;
