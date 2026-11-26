import * as native from '@ai-sdk/code-mode';
import type * as SDKContract from './internal/code-mode-contract.js';
import { Effect, Redacted, Stream } from 'effect';
import {
  AiSdkError,
  openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';
import {
  bindTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import { wrapError } from './internal/error.js';
import { wrapTool } from './internal/sdk-tool.js';

/** Treat native Code Mode exports as the pinned contract used by this integration. */
const sdk = native as unknown as typeof SDKContract;

export type {
  ApprovalDecision,
  CodeModeApprovalInterrupt,
  CodeModeApprovalRequest,
  CodeModeApprovalResponse,
  CodeModeContinuation,
  CodeModeContinuationSecurityOptions,
  CodeModeExecutionPolicy,
  CodeModeInterrupt,
  CodeModeInterruptExecutionContext,
  CodeModeInterruptPayload,
  CodeModeInterruptResolution,
  CodeModeToolExecutionOptions,
  CodeModeToolInput,
  CodeModeUnwrappedResult,
} from './internal/code-mode-contract.js';

/** Native sentinel for a direct host tool call in the Code Mode protocol. */
export const DIRECT_TOOL_CALL = sdk.DIRECT_TOOL_CALL;

/** Construct or recognize the tagged error that represents an aborted Code Mode run. */
export const CodeModeAbortedError = wrapError(
  'CodeMode.CodeModeAbortedError',
  sdk.CodeModeAbortedError,
);
/** Tagged failure channel used when a Code Mode run is aborted. */
export type CodeModeAbortedError = AiSdkError;

/** Construct or recognize a failure from the native bridge request limit. */
export const CodeModeBridgeLimitError = wrapError(
  'CodeMode.CodeModeBridgeLimitError',
  sdk.CodeModeBridgeLimitError,
);
/** Tagged failure channel used when a run reaches the Code Mode bridge limit. */
export type CodeModeBridgeLimitError = AiSdkError;

/** Construct or recognize a native Code Mode concurrency failure. */
export const CodeModeConcurrencyError = wrapError(
  'CodeMode.CodeModeConcurrencyError',
  sdk.CodeModeConcurrencyError,
);
/** Tagged failure channel used when the Code Mode scheduler rejects concurrent work. */
export type CodeModeConcurrencyError = AiSdkError;

/** Construct or recognize a failure from the native CPU budget. */
export const CodeModeCpuTimeoutError = wrapError(
  'CodeMode.CodeModeCpuTimeoutError',
  sdk.CodeModeCpuTimeoutError,
);
/** Tagged failure channel for CPU timeout, separate from elapsed-time limits. */
export type CodeModeCpuTimeoutError = AiSdkError;

/** Construct or recognize a failure from a bridge request outside an active native run. */
export const CodeModeDetachedBridgeRequestError = wrapError(
  'CodeMode.CodeModeDetachedBridgeRequestError',
  sdk.CodeModeDetachedBridgeRequestError,
);
/** Tagged failure channel used for a detached native bridge request. */
export type CodeModeDetachedBridgeRequestError = AiSdkError;

/** Construct or recognize the base native Code Mode error. */
export const CodeModeError = wrapError(
  'CodeMode.CodeModeError',
  sdk.CodeModeError,
);
/** Common tagged SDK failure type for Code Mode operations. */
export type CodeModeError = AiSdkError;

/** Construct or recognize a failure in the native Code Mode protocol. */
export const CodeModeProtocolError = wrapError(
  'CodeMode.CodeModeProtocolError',
  sdk.CodeModeProtocolError,
);
/** Tagged failure channel used for native protocol errors. */
export type CodeModeProtocolError = AiSdkError;

/** Construct or recognize a failure from the native source size bound. */
export const CodeModeSourceTooLargeError = wrapError(
  'CodeMode.CodeModeSourceTooLargeError',
  sdk.CodeModeSourceTooLargeError,
);
/** Tagged failure channel for source that exceeds the Code Mode size limit. */
export type CodeModeSourceTooLargeError = AiSdkError;

/** Construct or recognize a failure from the elapsed-time limit of a run. */
export const CodeModeTimeoutError = wrapError(
  'CodeMode.CodeModeTimeoutError',
  sdk.CodeModeTimeoutError,
);
/** Tagged failure channel for the native runtime timeout. */
export type CodeModeTimeoutError = AiSdkError;

/** Construct or recognize a failed host tool call whose approval was denied. */
export const CodeModeToolApprovalDeniedError = wrapError(
  'CodeMode.CodeModeToolApprovalDeniedError',
  sdk.CodeModeToolApprovalDeniedError,
);
/** Tagged failure channel for denied approval of a Code Mode tool call. */
export type CodeModeToolApprovalDeniedError = AiSdkError;

/** Construct or recognize a host tool call that requires approval before execution. */
export const CodeModeToolApprovalRequiredError = wrapError(
  'CodeMode.CodeModeToolApprovalRequiredError',
  sdk.CodeModeToolApprovalRequiredError,
);
/** Tagged failure channel for a tool call awaiting an explicit decision. */
export type CodeModeToolApprovalRequiredError = AiSdkError;

/** Construct or recognize a failure originating from execution of a Code Mode tool. */
export const CodeModeToolError = wrapError(
  'CodeMode.CodeModeToolError',
  sdk.CodeModeToolError,
);
/** Tagged failure channel for host tool execution in Code Mode. */
export type CodeModeToolError = AiSdkError;

/** Extract the SDK's approval response from the supported native input representation. */
export const experimental_getCodeModeApprovalResponse = (
  ...args: Parameters<typeof sdk.experimental_getCodeModeApprovalResponse>
) => sdk.experimental_getCodeModeApprovalResponse(...args);

/** Read the interrupt carried by a native Code Mode result when one is available. */
export const experimental_getCodeModeInterrupt = (
  ...args: Parameters<typeof sdk.experimental_getCodeModeInterrupt>
) => sdk.experimental_getCodeModeInterrupt(...args);

/** Check whether the interrupt must be resumed through the approval path. */
export const experimental_isCodeModeApprovalInterrupt = (
  ...args: Parameters<typeof sdk.experimental_isCodeModeApprovalInterrupt>
) => sdk.experimental_isCodeModeApprovalInterrupt(...args);

/** Narrow a value to a native Code Mode interruption recognized by the SDK. */
export const experimental_isCodeModeInterrupt = (
  ...args: Parameters<typeof sdk.experimental_isCodeModeInterrupt>
) => sdk.experimental_isCodeModeInterrupt(...args);

/** Convert native approval state to model-facing tool approval messages. */
export const experimental_toCodeModeApprovalMessages = (
  ...args: Parameters<typeof sdk.experimental_toCodeModeApprovalMessages>
) => sdk.experimental_toCodeModeApprovalMessages(...args);

/** Unwrap a native run result through the tagged boundary when the Effect executes. */
export const experimental_unwrapCodeModeResult = (
  ...args: Parameters<typeof sdk.experimental_unwrapCodeModeResult>
) =>
  runSync('CodeMode.unwrap', () =>
    sdk.experimental_unwrapCodeModeResult(...args),
  );

/** Ask the SDK to signal an interrupt carrying an application-defined continuation payload. */
export const experimental_requestCodeModeInterrupt = <
  P extends SDKContract.CodeModeInterruptPayload,
>(
  payload: P,
) =>
  runSync('CodeMode.requestInterrupt', () =>
    sdk.experimental_requestCodeModeInterrupt<P>(payload),
  );

/** Set the native key used to sign Code Mode continuation state. */
export const experimental_setCodeModeContinuationSigningKey = (
  ...args: Parameters<typeof sdk.experimental_setCodeModeContinuationSigningKey>
) =>
  runSync('CodeMode.setSigningKey', () =>
    sdk.experimental_setCodeModeContinuationSigningKey(...args),
  );

/** Configure the worker bound for the native Code Mode scheduler. */
export const experimental_setMaxWorkers = (
  ...args: Parameters<typeof sdk.experimental_setMaxWorkers>
) =>
  runSync('CodeMode.setMaxWorkers', () =>
    sdk.experimental_setMaxWorkers(...args),
  );

/** SDK approval settings after removing the optional settings wrapper. */
type NativeApproval = NonNullable<SDKContract.CodeModeOptions['approval']>;
/** Decide how to handle a pending host tool approval within the caller's Effect context. */
type ApprovalHook<E, R> = (
  request: SDKContract.CodeModeApprovalRequest,
) => Effect.Effect<SDKContract.ApprovalDecision, E, R>;

/** Preserve native execution options while allowing an Effect callback for approvals. */
export type CodeModeOptions<E = never, R = never> = Omit<
  SDKContract.CodeModeOptions,
  'approval'
> & {
  readonly approval?: Omit<NativeApproval, 'onApprovalRequired'> & {
    readonly onApprovalRequired?: ApprovalHook<E, R>;
  };
};

/** Add native tool discovery settings to the options for a Code Mode tool. */
export type CodeModeToolOptions<E = never, R = never> = CodeModeOptions<E, R> &
  Pick<SDKContract.CodeModeToolOptions, 'toolDiscovery'>;

/** Tool definitions allowed to execute in the host Effect context during a Code Mode run. */
export type CodeModeToolSet = EffectTools;

/** Program execution input with a typed Effect tool set and optional approval policy. */
export type RunCodeModeInput<
  T extends EffectTools = EffectTools,
  E = never,
  R = never,
> = Omit<SDKContract.RunCodeModeInput, 'options' | 'tools'> & {
  readonly tools: T;
  readonly options?: CodeModeOptions<E, R>;
};

/** Operation context that owns tool execution and approval callbacks for one native run. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Bind host tools and restore native resumable interrupts before they cross the SDK boundary. */
const bindCodeTools = <T extends EffectTools>(
  tools: T,
  owner: Owner<ToolServices<T>>,
) =>
  bindTools(
    Object.fromEntries(
      Object.entries(tools).map(([name, definition]) => {
        if (
          !('execute' in definition) ||
          typeof definition.execute !== 'function'
        )
          return [name, definition];
        const execute = definition.execute;
        const unwrapInterrupt = (error: unknown) =>
          error instanceof AiSdkError &&
          error.operation === 'CodeMode.requestInterrupt'
            ? Redacted.value(error.cause)
            : error;
        return [
          name,
          {
            ...definition,
            execute: (...args: never[]) => {
              const result = execute(...args);
              return Effect.isEffect(result)
                ? Effect.mapError(result, unwrapInterrupt)
                : Stream.mapError(result, unwrapInterrupt);
            },
          },
        ];
      }),
    ) as unknown as T,
    owner,
  );

/** Preserve native approval strategy settings and run the optional Effect approval callback in scope. */
const bindOptions = <E, R>(
  options: CodeModeOptions<E, R> | undefined,
  owner: Owner<R>,
) => {
  const { approval, ...rest } = options ?? {};
  const { onApprovalRequired, ...strategy } = approval ?? {};
  return {
    ...rest,
    ...(approval && {
      approval: {
        ...strategy,
        ...(onApprovalRequired && {
          onApprovalRequired: (request: SDKContract.CodeModeApprovalRequest) =>
            owner.runCallback(onApprovalRequired(request)),
        }),
      },
    }),
  };
};

/** Input fields required when either starting or continuing a run with Effect tools. */
type LaunchOptions<T extends EffectTools, E, R> = Pick<
  RunCodeModeInput<T, E, R>,
  'options' | 'tools' | 'toolExecutionOptions'
>;

/** Run a native operation in a local scope with one cancellation signal for the SDK and bound tools. */
const launch = <T extends EffectTools, E, R, O extends LaunchOptions<T, E, R>>(
  name: string,
  options: O,
  invoke: (
    input: Omit<O, 'tools' | 'options' | 'toolExecutionOptions'> & {
      tools: SDKContract.CodeModeToolSet;
      options: SDKContract.CodeModeOptions;
      toolExecutionOptions: Partial<SDKContract.CodeModeToolExecutionOptions>;
    },
  ) => Promise<unknown>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const { tools, options: config, toolExecutionOptions, ...rest } = options;
      const owner = yield* openOperation<R | ToolServices<T>>(
        toolExecutionOptions?.abortSignal,
      );
      return yield* runRequest(
        name,
        { abortSignal: owner.signal },
        (abortSignal) =>
          invoke({
            ...rest,
            tools: bindCodeTools(tools, owner),
            options: bindOptions(config, owner),
            toolExecutionOptions: { ...toolExecutionOptions, abortSignal },
          }),
      );
    }),
  );

/** Run one code-mode program with bounded SDK policy and Effect tools. */
export const experimental_runCodeMode = <
  T extends EffectTools,
  E = never,
  R = never,
>(
  input: RunCodeModeInput<T, E, R>,
) =>
  launch<T, E, R, typeof input>(
    'CodeMode.run',
    input,
    sdk.experimental_runCodeMode,
  );

/** Resume a pending approval using the original interrupt and the supplied approval response. */
type ApprovalInput<T extends EffectTools, E, R> = LaunchOptions<T, E, R> &
  Pick<
    Parameters<typeof sdk.experimental_continueCodeModeApproval>[0],
    'interrupt' | 'approvalResponse'
  >;

/** Continue a run paused for host tool approval with the decision from the caller. */
export const experimental_continueCodeModeApproval = <
  T extends EffectTools,
  E = never,
  R = never,
>(
  input: ApprovalInput<T, E, R>,
) =>
  launch<T, E, R, typeof input>(
    'CodeMode.continueApproval',
    input,
    sdk.experimental_continueCodeModeApproval,
  );

/** Carry a typed non-approval interruption and the application resolution for its continuation. */
type InterruptInput<
  T extends EffectTools,
  P extends SDKContract.CodeModeInterruptPayload,
  A,
  E,
  R,
> = LaunchOptions<T, E, R> & {
  readonly interrupt: SDKContract.CodeModeInterrupt<P>;
  readonly resolution: A;
};

/** Resume native execution after the application resolves the supplied interrupt. */
export const experimental_continueCodeModeInterrupt = <
  T extends EffectTools,
  P extends SDKContract.CodeModeInterruptPayload =
    SDKContract.CodeModeInterruptPayload,
  A = unknown,
  E = never,
  R = never,
>(
  input: InterruptInput<T, P, A, E, R>,
) =>
  launch<T, E, R, typeof input>(
    'CodeMode.continueInterrupt',
    input,
    sdk.experimental_continueCodeModeInterrupt<P, A>,
  );

/** Build a Code Mode tool backed by the supplied Effect tools and their owning scope. */
export const experimental_createCodeModeTool = <
  T extends EffectTools,
  E = never,
  R = never,
>(
  tools: T,
  options?: CodeModeOptions<E, R>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R | ToolServices<T>>();
    return yield* runSync('CodeMode.createTool', () =>
      wrapTool(
        'CodeMode.tool',
        sdk.experimental_createCodeModeTool(
          bindCodeTools(tools, owner),
          bindOptions(options, owner),
        ),
      ),
    );
  });

/** Effect tool handle returned by the factory for a caller-defined tool set. */
export type CodeModeTool = Effect.Success<
  ReturnType<typeof experimental_createCodeModeTool>
>;

/** Expose the SDK's configurable Code Mode tool and preserve its local caller support when available. */
export const experimental_codeModeTool = <E = never, R = never>(
  options?: CodeModeToolOptions<E, R>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    return yield* runSync('CodeMode.toolCaller', () => {
      const { experimental_toolCaller, ...tool } =
        sdk.experimental_codeModeTool({
          ...bindOptions(options, owner),
          ...(options?.toolDiscovery && {
            toolDiscovery: options.toolDiscovery,
          }),
        });
      const caller = experimental_toolCaller;
      const adapted = wrapTool('CodeMode.toolCaller', tool);
      if (caller.type !== 'local') return adapted;
      return {
        ...adapted,
        experimental_toolCaller: {
          type: caller.type,
          bind: <T extends EffectTools>(tools: T) =>
            Effect.gen(function* () {
              const toolOwner = yield* openOperation<ToolServices<T>>();
              return yield* runSync('CodeMode.toolCaller.bind', () =>
                wrapTool(
                  'CodeMode.toolCaller',
                  caller.bind(bindCodeTools(tools, toolOwner)),
                ),
              );
            }),
          prepareModelMessage: <T extends EffectTools>(tools: T) =>
            Effect.gen(function* () {
              const toolOwner = yield* openOperation<ToolServices<T>>();
              return yield* runSync(
                'CodeMode.toolCaller.prepareModelMessage',
                () =>
                  caller.prepareModelMessage?.(bindCodeTools(tools, toolOwner)),
              );
            }),
        },
      };
    });
  });
