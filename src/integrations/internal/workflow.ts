import type * as sdk from '@ai-sdk/workflow';
import { Effect } from 'effect';
import {
  unwrapLanguageModel,
  wrapLanguageModel,
  type LanguageModelV4,
} from '../../internal/language-model.js';
import {
  type AiSdkError,
  type openOperation,
  runRequest,
  sdkError,
} from '../../internal/operation.js';
import { type SandboxSession, unwrapSandbox, wrapSandbox } from './sandbox.js';
import { wrapTools } from './sdk-tool.js';
import { type EffectTelemetry, unwrapTelemetry } from './telemetry.js';

/** Own the services and interruption signal used to run native Workflow callbacks. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Accept either a Workflow model ID or a registered Effect v4 language model. */
type Model = Extract<sdk.PrepareCallOptions['model'], string> | LanguageModelV4;
/** Native model selection passed into the SDK's preparation callback. */
type NativeModel = sdk.PrepareCallOptions['model'];

/** Preserve model IDs and wrap native v4 models. Other model versions fail before the callback runs. */
const readModel = (model: NativeModel) =>
  Effect.suspend<Model, AiSdkError, never>(() => {
    if (typeof model === 'string') return Effect.succeed(model);
    return model.specificationVersion === 'v4'
      ? Effect.succeed(wrapLanguageModel(model))
      : Effect.fail(
          sdkError('WorkflowAgent.model', 'Unsupported language model version'),
        );
  });

/** Restore the native model selected by the Effect callback, or fail for an unregistered handle. */
const bindModel = (model: Model) =>
  Effect.suspend(() => {
    if (typeof model === 'string') return Effect.succeed<NativeModel>(model);
    const native = unwrapLanguageModel(model);
    return native
      ? Effect.succeed<NativeModel>(native)
      : Effect.fail(sdkError('WorkflowAgent.model', 'Invalid language model'));
  });

/** Active telemetry settings from the SDK constructor contract. */
type NativeTelemetry = NonNullable<sdk.WorkflowAgentOptions['telemetry']>;
/** Preserve telemetry settings while exposing Effect integrations in the integration list. */
export type TelemetryOptions = Omit<NativeTelemetry, 'integrations'> & {
  readonly integrations?: ReadonlyArray<EffectTelemetry>;
};

/** Restore each native telemetry integration and reject unregistered handles before constructing options. */
const bindTelemetry = (options: TelemetryOptions) =>
  Effect.gen(function* () {
    const { integrations, ...rest } = options;
    const native =
      integrations &&
      (yield* Effect.forEach(integrations, (integration) => {
        const unwrapped = unwrapTelemetry(integration);
        return unwrapped
          ? Effect.succeed(unwrapped)
          : Effect.fail(
              sdkError('WorkflowAgent.telemetry', 'Invalid integration'),
            );
      }));
    return { ...rest, ...(native && { integrations: native }) };
  });

/** Preserve the SDK download hook's argument order and successful result shape. */
type NativeDownload = sdk.DownloadFunction;
/** Run a Workflow asset download with the services captured for the owning operation. */
export type DownloadFunction<E = never, R = never> = (
  ...args: Parameters<NativeDownload>
) => Effect.Effect<Awaited<ReturnType<NativeDownload>>, E, R>;

/** Required native repair callback contract reused by both supported option names. */
type NativeRepair = NonNullable<sdk.WorkflowAgentOptions['repairToolCall']>;
/** Native tool-call failure context that must be adapted before invoking an Effect callback. */
type NativeRepairArgs = Parameters<NativeRepair>[0];
/** Inspect the failing call with wrapped tools, a scoped schema operation, and a tagged error. */
export type ToolCallRepairFunction<E = never, R = never> = (
  options: Omit<NativeRepairArgs, 'tools' | 'inputSchema' | 'error'> & {
    readonly tools: ReturnType<typeof wrapTools>;
    readonly inputSchema: (
      ...args: Parameters<NativeRepairArgs['inputSchema']>
    ) => Effect.Effect<
      Awaited<ReturnType<NativeRepairArgs['inputSchema']>>,
      AiSdkError
    >;
    readonly error: AiSdkError;
  },
) => Effect.Effect<Awaited<ReturnType<NativeRepair>>, E, R>;

/** Adapt repair arguments and run the callback with the native request's cancellation signal. */
const bindRepair =
  <E, R>(
    callback: ToolCallRepairFunction<E, R>,
    owner: Owner<R>,
  ): NativeRepair =>
  ({ tools, inputSchema, error, ...input }) =>
    owner.runCallback(
      callback({
        ...input,
        tools: wrapTools('WorkflowAgent.repairTools', tools),
        inputSchema: (...args) =>
          runRequest('WorkflowAgent.inputSchema', input, () =>
            inputSchema(...args),
          ),
        error: sdkError('WorkflowAgent.repairToolCall', error),
      }),
      input.abortSignal,
    );

/** Native prepare-call input contract before converting the model and tool handles. */
type NativeCall = sdk.PrepareCallOptions;
/** Native overrides accepted after call preparation finishes. */
type NativeCallResult = sdk.PrepareCallResult;
/** SDK step context before wrapping its model and optional sandbox. */
type NativeStep = sdk.PrepareStepInfo;
/** Native step overrides after restoring any replacement model or sandbox. */
type NativeStepResult = sdk.PrepareStepResult;

/** Call preparation input with registered Effect tools and the current model selection. */
export type PrepareCallOptions = Omit<
  NativeCall,
  'model' | 'tools' | 'stopWhen' | 'experimental_download' | 'telemetry'
> & {
  readonly model: Model;
  readonly tools: ReturnType<typeof wrapTools>;
};

/** Supply only call setting overrides. The tool set remains owned by the Workflow agent. */
export type PrepareCallResult =
  Omit<PrepareCallOptions, 'tools'> extends infer T ? Partial<T> : never;

/** Current step context with the model selection and any active wrapped sandbox. */
export type PrepareStepInfo = Omit<
  NativeStep,
  'model' | 'experimental_sandbox'
> & {
  readonly model: Model;
  readonly experimental_sandbox?: SandboxSession;
};

/** Optional per-step overrides, including a registered replacement model or sandbox. */
export type PrepareStepResult = Omit<
  NativeStepResult,
  'model' | 'experimental_sandbox'
> & {
  readonly model?: Model;
  readonly experimental_sandbox?: SandboxSession;
};

/** Prepare overrides for one call using the operation's Effect context. */
export type PrepareCallCallback<E = never, R = never> = (
  options: PrepareCallOptions,
) => Effect.Effect<PrepareCallResult, E, R>;

/** Prepare overrides for the next step with its current model and optional sandbox. */
export type PrepareStepCallback<E = never, R = never> = (
  options: PrepareStepInfo,
) => Effect.Effect<PrepareStepResult, E, R>;

/** Wrap callback input and restore a replacement model before returning overrides to the SDK. */
const bindPrepareCall =
  <E, R>(
    callback: PrepareCallCallback<E, R>,
    owner: Owner<R>,
  ): sdk.PrepareCallCallback =>
  ({
    model,
    tools,
    stopWhen: _stopWhen,
    telemetry: _telemetry,
    experimental_download: _download,
    ...rest
  }) =>
    owner.runCallback(
      Effect.gen(function* () {
        const result = yield* callback({
          ...rest,
          model: yield* readModel(model),
          tools: wrapTools('WorkflowAgent.prepareCall.tools', tools),
        });
        const { model: nextModel, ...next } = result;
        const native = nextModel && (yield* bindModel(nextModel));
        return {
          ...next,
          ...(native && { model: native }),
        } satisfies NativeCallResult;
      }),
    );

/** Translate model and sandbox handles both ways and reject unknown replacement sessions. */
const bindPrepareStep =
  <E, R>(
    callback: PrepareStepCallback<E, R>,
    owner: Owner<R>,
  ): sdk.PrepareStepCallback =>
  ({ model, experimental_sandbox, ...rest }) =>
    owner.runCallback(
      Effect.gen(function* () {
        const result = yield* callback({
          ...rest,
          model: yield* readModel(model),
          ...(experimental_sandbox && {
            experimental_sandbox: wrapSandbox(experimental_sandbox),
          }),
        });
        const {
          model: nextModel,
          experimental_sandbox: sandbox,
          ...next
        } = result;
        const native = nextModel && (yield* bindModel(nextModel));
        const nativeSandbox = sandbox && unwrapSandbox(sandbox);
        if (sandbox && !nativeSandbox) {
          return yield* Effect.fail(
            sdkError('WorkflowAgent.prepareStep', 'Invalid sandbox session'),
          );
        }
        return {
          ...next,
          ...(native && { model: native }),
          ...(nativeSandbox && { experimental_sandbox: nativeSandbox }),
        } satisfies NativeStepResult;
      }),
    );

/** Shared Workflow telemetry, repair, download, and step preparation options. */
export type WorkflowExtras<E, R> = {
  readonly telemetry?: TelemetryOptions;
  readonly repairToolCall?: ToolCallRepairFunction<E, R>;
  readonly experimental_repairToolCall?: ToolCallRepairFunction<E, R>;
  readonly experimental_download?: DownloadFunction<E, R>;
  readonly prepareStep?: PrepareStepCallback<E, R>;
};

/** Add constructor-level call preparation to the Workflow options that also apply per operation. */
export type WorkflowConstructorExtras<E, R> = WorkflowExtras<E, R> & {
  readonly prepareCall?: PrepareCallCallback<E, R>;
};

/** Native-only settings produced after Effect callbacks and integration handles have been adapted. */
type NativeExtras = Pick<
  sdk.WorkflowAgentOptions,
  | 'telemetry'
  | 'repairToolCall'
  | 'experimental_repairToolCall'
  | 'experimental_download'
  | 'prepareStep'
  | 'prepareCall'
>;

/** Bind optional Workflow callbacks to their shared Effect owner and preserve absent options. */
export const bindWorkflowExtras = <E, R>(
  options: WorkflowConstructorExtras<E, R>,
  owner: Owner<R>,
): Effect.Effect<NativeExtras, AiSdkError> =>
  Effect.gen(function* () {
    const {
      telemetry,
      repairToolCall,
      experimental_repairToolCall,
      experimental_download,
      prepareStep,
      prepareCall,
    } = options;
    const nativeTelemetry = telemetry && (yield* bindTelemetry(telemetry));
    return {
      ...(nativeTelemetry && { telemetry: nativeTelemetry }),
      ...(repairToolCall && {
        repairToolCall: bindRepair(repairToolCall, owner),
      }),
      ...(experimental_repairToolCall && {
        experimental_repairToolCall: bindRepair(
          experimental_repairToolCall,
          owner,
        ),
      }),
      ...(experimental_download && {
        experimental_download: (...args: Parameters<NativeDownload>) =>
          owner.runCallback(experimental_download(...args)),
      }),
      ...(prepareStep && { prepareStep: bindPrepareStep(prepareStep, owner) }),
      ...(prepareCall && { prepareCall: bindPrepareCall(prepareCall, owner) }),
    };
  });
