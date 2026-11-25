import * as sdk from '@ai-sdk/code-mode';
import { Effect, Redacted } from 'effect';
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
} from '@ai-sdk/code-mode';

export const DIRECT_TOOL_CALL = sdk.DIRECT_TOOL_CALL;

export const CodeModeAbortedError = wrapError(
  'CodeMode.CodeModeAbortedError',
  sdk.CodeModeAbortedError,
);
export type CodeModeAbortedError = AiSdkError;

export const CodeModeBridgeLimitError = wrapError(
  'CodeMode.CodeModeBridgeLimitError',
  sdk.CodeModeBridgeLimitError,
);
export type CodeModeBridgeLimitError = AiSdkError;

export const CodeModeConcurrencyError = wrapError(
  'CodeMode.CodeModeConcurrencyError',
  sdk.CodeModeConcurrencyError,
);
export type CodeModeConcurrencyError = AiSdkError;

export const CodeModeCpuTimeoutError = wrapError(
  'CodeMode.CodeModeCpuTimeoutError',
  sdk.CodeModeCpuTimeoutError,
);
export type CodeModeCpuTimeoutError = AiSdkError;

export const CodeModeDetachedBridgeRequestError = wrapError(
  'CodeMode.CodeModeDetachedBridgeRequestError',
  sdk.CodeModeDetachedBridgeRequestError,
);
export type CodeModeDetachedBridgeRequestError = AiSdkError;

export const CodeModeError = wrapError(
  'CodeMode.CodeModeError',
  sdk.CodeModeError,
);
export type CodeModeError = AiSdkError;

export const CodeModeProtocolError = wrapError(
  'CodeMode.CodeModeProtocolError',
  sdk.CodeModeProtocolError,
);
export type CodeModeProtocolError = AiSdkError;

export const CodeModeSourceTooLargeError = wrapError(
  'CodeMode.CodeModeSourceTooLargeError',
  sdk.CodeModeSourceTooLargeError,
);
export type CodeModeSourceTooLargeError = AiSdkError;

export const CodeModeTimeoutError = wrapError(
  'CodeMode.CodeModeTimeoutError',
  sdk.CodeModeTimeoutError,
);
export type CodeModeTimeoutError = AiSdkError;

export const CodeModeToolApprovalDeniedError = wrapError(
  'CodeMode.CodeModeToolApprovalDeniedError',
  sdk.CodeModeToolApprovalDeniedError,
);
export type CodeModeToolApprovalDeniedError = AiSdkError;

export const CodeModeToolApprovalRequiredError = wrapError(
  'CodeMode.CodeModeToolApprovalRequiredError',
  sdk.CodeModeToolApprovalRequiredError,
);
export type CodeModeToolApprovalRequiredError = AiSdkError;

export const CodeModeToolError = wrapError(
  'CodeMode.CodeModeToolError',
  sdk.CodeModeToolError,
);
export type CodeModeToolError = AiSdkError;

export const experimental_getCodeModeApprovalResponse = (
  ...args: Parameters<typeof sdk.experimental_getCodeModeApprovalResponse>
) => sdk.experimental_getCodeModeApprovalResponse(...args);

export const experimental_getCodeModeInterrupt = (
  ...args: Parameters<typeof sdk.experimental_getCodeModeInterrupt>
) => sdk.experimental_getCodeModeInterrupt(...args);

export const experimental_isCodeModeApprovalInterrupt = (
  ...args: Parameters<typeof sdk.experimental_isCodeModeApprovalInterrupt>
) => sdk.experimental_isCodeModeApprovalInterrupt(...args);

export const experimental_isCodeModeInterrupt = (
  ...args: Parameters<typeof sdk.experimental_isCodeModeInterrupt>
) => sdk.experimental_isCodeModeInterrupt(...args);

export const experimental_toCodeModeApprovalMessages = (
  ...args: Parameters<typeof sdk.experimental_toCodeModeApprovalMessages>
) => sdk.experimental_toCodeModeApprovalMessages(...args);

export const experimental_unwrapCodeModeResult = (
  ...args: Parameters<typeof sdk.experimental_unwrapCodeModeResult>
) =>
  runSync('CodeMode.unwrap', () =>
    sdk.experimental_unwrapCodeModeResult(...args),
  );

export const experimental_requestCodeModeInterrupt = <
  P extends sdk.CodeModeInterruptPayload,
>(
  payload: P,
) =>
  runSync('CodeMode.requestInterrupt', () =>
    sdk.experimental_requestCodeModeInterrupt<P>(payload),
  );

export const experimental_setCodeModeContinuationSigningKey = (
  ...args: Parameters<typeof sdk.experimental_setCodeModeContinuationSigningKey>
) =>
  runSync('CodeMode.setSigningKey', () =>
    sdk.experimental_setCodeModeContinuationSigningKey(...args),
  );

export const experimental_setMaxWorkers = (
  ...args: Parameters<typeof sdk.experimental_setMaxWorkers>
) =>
  runSync('CodeMode.setMaxWorkers', () =>
    sdk.experimental_setMaxWorkers(...args),
  );

type NativeApproval = NonNullable<sdk.CodeModeOptions['approval']>;
type ApprovalHook<E, R> = (
  request: sdk.CodeModeApprovalRequest,
) => Effect.Effect<sdk.ApprovalDecision, E, R>;

export type CodeModeOptions<E = never, R = never> = Omit<
  sdk.CodeModeOptions,
  'approval'
> & {
  readonly approval?: Omit<NativeApproval, 'onApprovalRequired'> & {
    readonly onApprovalRequired?: ApprovalHook<E, R>;
  };
};

export type CodeModeToolOptions<E = never, R = never> = CodeModeOptions<E, R> &
  Pick<sdk.CodeModeToolOptions, 'toolDiscovery'>;

export type CodeModeToolSet = EffectTools;

export type RunCodeModeInput<
  T extends EffectTools = EffectTools,
  E = never,
  R = never,
> = Omit<sdk.RunCodeModeInput, 'options' | 'tools'> & {
  readonly tools: T;
  readonly options?: CodeModeOptions<E, R>;
};

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

const bindCodeTools = <T extends EffectTools>(
  tools: T,
  owner: Owner<ToolServices<T>>,
) =>
  bindTools(
    Object.fromEntries(
      Object.entries(tools).map(([name, definition]) => {
        if (!('execute' in definition)) return [name, definition];
        const execute = definition.execute;
        return [
          name,
          {
            ...definition,
            execute: (...args: never[]) =>
              execute(...args).pipe(
                Effect.mapError((error) =>
                  error instanceof AiSdkError &&
                  error.operation === 'CodeMode.requestInterrupt'
                    ? Redacted.value(error.cause)
                    : error,
                ),
              ),
          },
        ];
      }),
    ) as unknown as T,
    owner,
  );

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
          onApprovalRequired: (request: sdk.CodeModeApprovalRequest) =>
            owner.runCallback(onApprovalRequired(request)),
        }),
      },
    }),
  };
};

type LaunchOptions<T extends EffectTools, E, R> = Pick<
  RunCodeModeInput<T, E, R>,
  'options' | 'tools' | 'toolExecutionOptions'
>;

const launch = <T extends EffectTools, E, R, O extends LaunchOptions<T, E, R>>(
  name: string,
  options: O,
  invoke: (
    input: Omit<O, 'tools' | 'options' | 'toolExecutionOptions'> & {
      tools: sdk.CodeModeToolSet;
      options: sdk.CodeModeOptions;
      toolExecutionOptions: Partial<sdk.CodeModeToolExecutionOptions>;
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

type ApprovalInput<T extends EffectTools, E, R> = LaunchOptions<T, E, R> &
  Pick<
    Parameters<typeof sdk.experimental_continueCodeModeApproval>[0],
    'interrupt' | 'approvalResponse'
  >;

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

type InterruptInput<
  T extends EffectTools,
  P extends sdk.CodeModeInterruptPayload,
  A,
  E,
  R,
> = LaunchOptions<T, E, R> & {
  readonly interrupt: sdk.CodeModeInterrupt<P>;
  readonly resolution: A;
};

export const experimental_continueCodeModeInterrupt = <
  T extends EffectTools,
  P extends sdk.CodeModeInterruptPayload = sdk.CodeModeInterruptPayload,
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

export type CodeModeTool = Effect.Success<
  ReturnType<typeof experimental_createCodeModeTool>
>;

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
