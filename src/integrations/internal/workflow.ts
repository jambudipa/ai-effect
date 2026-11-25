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

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type Model = Extract<sdk.PrepareCallOptions['model'], string> | LanguageModelV4;
type NativeModel = sdk.PrepareCallOptions['model'];

const readModel = (model: NativeModel) =>
  Effect.suspend<Model, AiSdkError, never>(() => {
    if (typeof model === 'string') return Effect.succeed(model);
    return model.specificationVersion === 'v4'
      ? Effect.succeed(wrapLanguageModel(model))
      : Effect.fail(
          sdkError('WorkflowAgent.model', 'Unsupported language model version'),
        );
  });

const bindModel = (model: Model) =>
  Effect.suspend(() => {
    if (typeof model === 'string') return Effect.succeed<NativeModel>(model);
    const native = unwrapLanguageModel(model);
    return native
      ? Effect.succeed<NativeModel>(native)
      : Effect.fail(sdkError('WorkflowAgent.model', 'Invalid language model'));
  });

type NativeTelemetry = NonNullable<sdk.WorkflowAgentOptions['telemetry']>;
export type TelemetryOptions = Omit<NativeTelemetry, 'integrations'> & {
  readonly integrations?: ReadonlyArray<EffectTelemetry>;
};

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

type NativeDownload = sdk.DownloadFunction;
export type DownloadFunction<E = never, R = never> = (
  ...args: Parameters<NativeDownload>
) => Effect.Effect<Awaited<ReturnType<NativeDownload>>, E, R>;

type NativeRepair = NonNullable<sdk.WorkflowAgentOptions['repairToolCall']>;
type NativeRepairArgs = Parameters<NativeRepair>[0];
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

type NativeCall = sdk.PrepareCallOptions;
type NativeCallResult = sdk.PrepareCallResult;
type NativeStep = sdk.PrepareStepInfo;
type NativeStepResult = sdk.PrepareStepResult;

export type PrepareCallOptions = Omit<
  NativeCall,
  'model' | 'tools' | 'stopWhen' | 'experimental_download' | 'telemetry'
> & {
  readonly model: Model;
  readonly tools: ReturnType<typeof wrapTools>;
};

export type PrepareCallResult =
  Omit<PrepareCallOptions, 'tools'> extends infer T ? Partial<T> : never;

export type PrepareStepInfo = Omit<
  NativeStep,
  'model' | 'experimental_sandbox'
> & {
  readonly model: Model;
  readonly experimental_sandbox?: SandboxSession;
};

export type PrepareStepResult = Omit<
  NativeStepResult,
  'model' | 'experimental_sandbox'
> & {
  readonly model?: Model;
  readonly experimental_sandbox?: SandboxSession;
};

export type PrepareCallCallback<E = never, R = never> = (
  options: PrepareCallOptions,
) => Effect.Effect<PrepareCallResult, E, R>;

export type PrepareStepCallback<E = never, R = never> = (
  options: PrepareStepInfo,
) => Effect.Effect<PrepareStepResult, E, R>;

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

export type WorkflowExtras<E, R> = {
  readonly telemetry?: TelemetryOptions;
  readonly repairToolCall?: ToolCallRepairFunction<E, R>;
  readonly experimental_repairToolCall?: ToolCallRepairFunction<E, R>;
  readonly experimental_download?: DownloadFunction<E, R>;
  readonly prepareStep?: PrepareStepCallback<E, R>;
};

export type WorkflowConstructorExtras<E, R> = WorkflowExtras<E, R> & {
  readonly prepareCall?: PrepareCallCallback<E, R>;
};

type NativeExtras = Pick<
  sdk.WorkflowAgentOptions,
  | 'telemetry'
  | 'repairToolCall'
  | 'experimental_repairToolCall'
  | 'experimental_download'
  | 'prepareStep'
  | 'prepareCall'
>;

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
