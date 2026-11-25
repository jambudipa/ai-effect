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
  ModelCallStreamPart,
  ProviderOptions,
  WorkflowAgentTimeoutConfiguration,
  WorkflowAgentToolExecutionEndEvent,
  WorkflowAgentToolExecutionStartEvent,
  WorkflowToolApprovalSecret,
} from '@ai-sdk/workflow';

export const toUIMessageChunk = (
  ...args: Parameters<typeof sdk.toUIMessageChunk>
) => runSync('Workflow.toUIMessageChunk', () => sdk.toUIMessageChunk(...args));

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
} from '../internal/language-model.js';
import { openOperation, runRequest } from '../internal/operation.js';
import {
  type OutputSpecification as EffectOutput,
  unwrapOutput,
} from '../internal/output.js';
import {
  bindTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
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

export type CompatibleLanguageModel = LanguageModelV4;
export type OutputSpecification<A, P = A> = EffectOutput<A, P>;

const lifecycle = [
  'onStart',
  'experimental_onStart',
  'onStepStart',
  'experimental_onStepStart',
  'onStepEnd',
  'onStepFinish',
  'onEnd',
  'onFinish',
  'onAbort',
  'onError',
  'onToolExecutionStart',
  'onToolExecutionEnd',
] as const;

type Lifecycle = (typeof lifecycle)[number];
type NativeSettings<A, P> = sdk.WorkflowAgentOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
type NativeGenerate<A, P> = sdk.WorkflowAgentGenerateOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
type NativeStream<A, P> = sdk.WorkflowAgentStreamOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;
type NativeCall<A, P> = sdk.WorkflowAgentCallOptions<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;

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
  WorkflowConstructorExtras<E, R> & {
    readonly model:
      Extract<NativeSettings<A, P>['model'], string> | CompatibleLanguageModel;
    readonly tools?: T;
    readonly output?: OutputSpecification<A, P>;
    readonly experimental_sandbox?: SandboxSession;
  };

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
  | 'output';

type OperationOptions<N, A, P, E, R> = N extends unknown
  ? Omit<WithEffectCallbacks<N, Lifecycle, E, R>, Omitted> &
      WorkflowExtras<E, R> & {
        readonly output?: OutputSpecification<A, P>;
        readonly experimental_sandbox?: SandboxSession;
      }
  : never;

export type WorkflowAgentCallOptions<
  A = never,
  P = A,
  E = never,
  R = never,
> = OperationOptions<NativeCall<A, P>, A, P, E, R>;

export type WorkflowAgentGenerateOptions<
  A = string,
  P = A,
  E = never,
  R = never,
> = OperationOptions<NativeGenerate<A, P>, A, P, E, R>;

export type WorkflowAgentStreamOptions<
  A = never,
  P = A,
  E = never,
  R = never,
> = OperationOptions<NativeStream<A, P>, A, P, E, R>;

export type WorkflowAgentGenerateResult<A = string> =
  sdk.WorkflowAgentGenerateResult<ToolSet, Record<string, unknown>, A>;
export type WorkflowAgentStreamResult<A = never> =
  sdk.WorkflowAgentStreamResult<ToolSet, A>;

type NativeAgent<A, P> = sdk.WorkflowAgent<
  ToolSet,
  Record<string, unknown>,
  A,
  P
>;

export class WorkflowAgent<A = never, P = A> {
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
      return yield* runSync(
        'WorkflowAgent.make',
        () =>
          new WorkflowAgent<A, P>(
            new sdk.WorkflowAgent<ToolSet, Record<string, unknown>, A, P>({
              ...config,
              ...extras,
              model: nativeModel,
              ...(tools && { tools: bindTools(tools, owner) }),
              ...(output && { output: unwrapOutput(output) }),
              ...(nativeSandbox && { experimental_sandbox: nativeSandbox }),
            } as NativeSettings<A, P>),
          ),
      );
    });
  }

  private constructor(private readonly native: NativeAgent<A, P>) {}

  get id() {
    return this.native.id;
  }
  get tools() {
    return wrapTools('WorkflowAgent.tools', this.native.tools);
  }

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

  stream<Out = A, Part = P, E = never, R = never>(
    options: WorkflowAgentStreamOptions<Out, Part, E, R>,
  ) {
    return invokeWorkflow<
      NativeStream<Out, Part>,
      Out,
      Part,
      E,
      R,
      WorkflowAgentStreamResult<Out>
    >('WorkflowAgent.stream', options, (input) =>
      this.native.stream<ToolSet, Out, Part>(input),
    );
  }
}

type NativeOptions<A, P> = NativeGenerate<A, P> | NativeStream<A, P>;

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
      return yield* runRequest(
        name,
        { abortSignal: owner.signal },
        (abortSignal) =>
          invoke({
            ...bound,
            ...extras,
            abortSignal,
            ...(output && { output: unwrapOutput(output) }),
            ...(nativeSandbox && { experimental_sandbox: nativeSandbox }),
          } as N),
      );
    }),
  );

export type InferWorkflowAgentTools<A extends WorkflowAgent> = A['tools'];
export type InferWorkflowAgentUIMessage<
  A extends WorkflowAgent,
  Metadata = unknown,
> = UIMessage<Metadata>;

export type WorkflowAgentOnAbortCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onAbort']>;
export type WorkflowAgentOnEndCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onEnd']>;
export type WorkflowAgentOnErrorCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onError']>;
export type WorkflowAgentOnFinishCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onFinish']>;
export type WorkflowAgentOnStartCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStart']>;
export type WorkflowAgentOnStepEndCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepEnd']>;
export type WorkflowAgentOnStepFinishCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepFinish']>;
export type WorkflowAgentOnStepStartCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepStart']>;
export type WorkflowAgentOnToolExecutionEndCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onToolExecutionEnd']>;
export type WorkflowAgentOnToolExecutionStartCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onToolExecutionStart']>;
