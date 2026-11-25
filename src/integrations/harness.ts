import * as native from '@ai-sdk/harness';
import type * as SDKContract from './internal/harness-contracts/harness.js';
import type { InferToolInput } from '@ai-sdk/provider-utils';
import type { Schema } from 'effect';
import { runSync, type AiSdkError } from '../internal/operation.js';
import { toSdkSchema } from '../internal/schema.js';
import { wrapError } from './internal/error.js';
import { wrapSchema } from './internal/schema.js';
import { wrapTool, wrapTools } from './internal/sdk-tool.js';

const sdk = native as unknown as typeof SDKContract;

export type {
  Experimental_HarnessV1BridgeUserMessageResponse,
  HarnessV1AssistantMessage,
  HarnessV1Authentication,
  HarnessV1AuthenticationEnvironment,
  HarnessV1Bootstrap,
  HarnessV1BootstrapCommand,
  HarnessV1BootstrapFile,
  HarnessV1BridgeDebugEvent,
  HarnessV1BridgeOutboundMessage,
  HarnessV1BridgeReady,
  HarnessV1BridgeSandboxLog,
  HarnessV1BridgeToolWire,
  HarnessV1BuiltinToolFiltering,
  HarnessV1BuiltinToolName,
  HarnessV1BuiltinToolUseKind,
  HarnessV1CallWarning,
  HarnessV1ContinueTurnState,
  HarnessV1CustomPart,
  HarnessV1DebugConfig,
  HarnessV1DebugLevel,
  HarnessV1Diagnostic,
  HarnessV1FilePart,
  HarnessV1JSONArray,
  HarnessV1JSONObject,
  HarnessV1JSONSchema,
  HarnessV1JSONValue,
  HarnessV1LifecycleState,
  HarnessV1Message,
  HarnessV1MessagePart,
  HarnessV1Metadata,
  HarnessV1NetworkPolicy,
  HarnessV1PendingToolApproval,
  HarnessV1PendingToolResult,
  HarnessV1PermissionMode,
  HarnessV1PortEndpoint,
  HarnessV1Prompt,
  HarnessV1QuestionsToolInput,
  HarnessV1QuestionsToolOutput,
  HarnessV1ReadHistoryResult,
  HarnessV1ReasoningFilePart,
  HarnessV1ReasoningPart,
  HarnessV1ResponseFormat,
  HarnessV1ResumeSessionState,
  HarnessV1Skill,
  HarnessV1StreamPart,
  HarnessV1TextPart,
  HarnessV1ToolApprovalResponsePart,
  HarnessV1ToolCallPart,
  HarnessV1ToolMessage,
  HarnessV1ToolResultOutput,
  HarnessV1ToolResultPart,
  HarnessV1ToolSpec,
  HarnessV1TurnSettings,
  HarnessV1UserMessage,
} from './internal/harness-contracts/harness.js';

export type {
  HarnessV1,
  HarnessV1ContinueTurnOptions,
  HarnessV1CredentialForwarding,
  HarnessV1Observability,
  HarnessV1PromptControl,
  HarnessV1PromptTurnOptions,
  HarnessV1Session,
  HarnessV1StartOptions,
} from './internal/harness.js';

export type {
  NetworkSandboxSession as HarnessV1NetworkSandboxSession,
  SandboxTemplate as HarnessV1SandboxTemplate,
} from './internal/sandbox.js';

export const HARNESS_V1_BUILTIN_TOOL_NAMES: readonly SDKContract.HarnessV1BuiltinToolName[] =
  [...sdk.HARNESS_V1_BUILTIN_TOOL_NAMES];
export const HARNESS_V1_BUILTIN_TOOLS = wrapTools(
  'Harness.builtinTools',
  sdk.HARNESS_V1_BUILTIN_TOOLS,
);

export type HarnessV1BuiltinTool<
  Input = unknown,
  Output = unknown,
> = ReturnType<typeof wrapTool<Input, Output, unknown>> &
  Pick<
    SDKContract.HarnessV1BuiltinTool<Input, Output>,
    'nativeName' | 'commonName' | 'toolUseKind'
  >;

export type HarnessV1QuestionsTool =
  (typeof HARNESS_V1_BUILTIN_TOOLS)['askUserQuestions'];

type StandardInput<N extends SDKContract.HarnessV1BuiltinToolName> =
  InferToolInput<(typeof sdk.HARNESS_V1_BUILTIN_TOOLS)[N]>;
type CommonToolResult<N extends SDKContract.HarnessV1BuiltinToolName, A> =
  StandardInput<N> extends A
    ? HarnessV1BuiltinTool<A>
    : [
        'ERROR: adapter input schema must be a superset of the standard schema',
        { expected: StandardInput<N>; got: A },
      ];

/** Define a tool which implements the standard input for a named harness tool. */
export const commonTool = <N extends SDKContract.HarnessV1BuiltinToolName, A>(
  name: N,
  options: {
    readonly nativeName: string;
    readonly toolUseKind?: SDKContract.HarnessV1BuiltinToolUseKind;
    readonly description?: string;
    readonly inputSchema: Schema.ConstraintDecoder<A>;
  },
) =>
  runSync('Harness.commonTool', () => {
    const native = sdk.commonTool(name, {
      ...options,
      inputSchema: toSdkSchema(options.inputSchema),
    });
    return wrapTool(
      'Harness.commonTool',
      native as SDKContract.HarnessV1BuiltinTool<A>,
    ) as CommonToolResult<N, A>;
  });

export const HarnessCapabilityUnsupportedError = wrapError(
  'Harness.HarnessCapabilityUnsupportedError',
  sdk.HarnessCapabilityUnsupportedError,
);
export type HarnessCapabilityUnsupportedError = AiSdkError;

export const HarnessError = wrapError('Harness.HarnessError', sdk.HarnessError);
export type HarnessError = AiSdkError;

export const HarnessHistoryUnavailableError = wrapError(
  'Harness.HarnessHistoryUnavailableError',
  sdk.HarnessHistoryUnavailableError,
);
export type HarnessHistoryUnavailableError = AiSdkError;

export const HarnessSandboxAuthenticationError = wrapError(
  'Harness.HarnessSandboxAuthenticationError',
  sdk.HarnessSandboxAuthenticationError,
);
export type HarnessSandboxAuthenticationError = AiSdkError;

export const experimental_harnessV1BridgeUserMessageInboundSchema = wrapSchema(
  'Harness.experimental_harnessV1BridgeUserMessageInboundSchema',
  sdk.experimental_harnessV1BridgeUserMessageInboundSchema,
);

export const experimental_harnessV1BridgeUserMessageResponseSchema = wrapSchema(
  'Harness.experimental_harnessV1BridgeUserMessageResponseSchema',
  sdk.experimental_harnessV1BridgeUserMessageResponseSchema,
);

export const getHarnessV1BuiltinToolFilteringDenialReason = (
  ...args: Parameters<typeof sdk.getHarnessV1BuiltinToolFilteringDenialReason>
) => sdk.getHarnessV1BuiltinToolFilteringDenialReason(...args);

export const harnessSessionDataDirectoryPath = (
  ...args: Parameters<typeof sdk.harnessSessionDataDirectoryPath>
) => sdk.harnessSessionDataDirectoryPath(...args);

export const harnessStateDirectoryPath = (
  ...args: Parameters<typeof sdk.harnessStateDirectoryPath>
) => sdk.harnessStateDirectoryPath(...args);

export const harnessV1BridgeAbortInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeAbortInboundSchema',
  sdk.harnessV1BridgeAbortInboundSchema,
);

export const harnessV1BridgeBuiltinToolFilteringSchema = wrapSchema(
  'Harness.harnessV1BridgeBuiltinToolFilteringSchema',
  sdk.harnessV1BridgeBuiltinToolFilteringSchema,
);

export const harnessV1BridgeDebugEventSchema = wrapSchema(
  'Harness.harnessV1BridgeDebugEventSchema',
  sdk.harnessV1BridgeDebugEventSchema,
);

export const harnessV1BridgeDestroyInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeDestroyInboundSchema',
  sdk.harnessV1BridgeDestroyInboundSchema,
);

export const harnessV1BridgeHelloSchema = wrapSchema(
  'Harness.harnessV1BridgeHelloSchema',
  sdk.harnessV1BridgeHelloSchema,
);

export const harnessV1BridgeInboundCommandSchemas = [
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[0],
  ),
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[1],
  ),
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[2],
  ),
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[3],
  ),
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[4],
  ),
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[5],
  ),
  wrapSchema(
    'Harness.harnessV1BridgeInboundCommandSchemas',
    sdk.harnessV1BridgeInboundCommandSchemas[6],
  ),
] as const;

export const harnessV1BridgeOutboundMessageSchema = wrapSchema(
  'Harness.harnessV1BridgeOutboundMessageSchema',
  sdk.harnessV1BridgeOutboundMessageSchema,
);

export const harnessV1BridgePermissionModeSchema = wrapSchema(
  'Harness.harnessV1BridgePermissionModeSchema',
  sdk.harnessV1BridgePermissionModeSchema,
);

export const harnessV1BridgeReadySchema = wrapSchema(
  'Harness.harnessV1BridgeReadySchema',
  sdk.harnessV1BridgeReadySchema,
);

export const harnessV1BridgeResponseFormatSchema = wrapSchema(
  'Harness.harnessV1BridgeResponseFormatSchema',
  sdk.harnessV1BridgeResponseFormatSchema,
);

export const harnessV1BridgeResumeInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeResumeInboundSchema',
  sdk.harnessV1BridgeResumeInboundSchema,
);

export const harnessV1BridgeSandboxLogSchema = wrapSchema(
  'Harness.harnessV1BridgeSandboxLogSchema',
  sdk.harnessV1BridgeSandboxLogSchema,
);

export const harnessV1BridgeStartBaseSchema = wrapSchema(
  'Harness.harnessV1BridgeStartBaseSchema',
  sdk.harnessV1BridgeStartBaseSchema,
);

export const harnessV1BridgeStopInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeStopInboundSchema',
  sdk.harnessV1BridgeStopInboundSchema,
);

export const harnessV1BridgeStopSchema = wrapSchema(
  'Harness.harnessV1BridgeStopSchema',
  sdk.harnessV1BridgeStopSchema,
);

export const harnessV1BridgeThreadSchema = wrapSchema(
  'Harness.harnessV1BridgeThreadSchema',
  sdk.harnessV1BridgeThreadSchema,
);

export const harnessV1BridgeToolApprovalResponseInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeToolApprovalResponseInboundSchema',
  sdk.harnessV1BridgeToolApprovalResponseInboundSchema,
);

export const harnessV1BridgeToolResultInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeToolResultInboundSchema',
  sdk.harnessV1BridgeToolResultInboundSchema,
);

export const harnessV1BridgeToolWireSchema = wrapSchema(
  'Harness.harnessV1BridgeToolWireSchema',
  sdk.harnessV1BridgeToolWireSchema,
);

export const harnessV1BridgeUserMessageInboundSchema = wrapSchema(
  'Harness.harnessV1BridgeUserMessageInboundSchema',
  sdk.harnessV1BridgeUserMessageInboundSchema,
);

export const harnessV1DebugConfigSchema = wrapSchema(
  'Harness.harnessV1DebugConfigSchema',
  sdk.harnessV1DebugConfigSchema,
);

export const harnessV1DebugLevelSchema = wrapSchema(
  'Harness.harnessV1DebugLevelSchema',
  sdk.harnessV1DebugLevelSchema,
);

export const harnessV1DiagnosticFromBridgeFrame = (
  ...args: Parameters<typeof sdk.harnessV1DiagnosticFromBridgeFrame>
) => sdk.harnessV1DiagnosticFromBridgeFrame(...args);

export const harnessV1ErrorPartSchema = wrapSchema(
  'Harness.harnessV1ErrorPartSchema',
  sdk.harnessV1ErrorPartSchema,
);

export const harnessV1FileChangePartSchema = wrapSchema(
  'Harness.harnessV1FileChangePartSchema',
  sdk.harnessV1FileChangePartSchema,
);

export const harnessV1FinishPartSchema = wrapSchema(
  'Harness.harnessV1FinishPartSchema',
  sdk.harnessV1FinishPartSchema,
);

export const harnessV1FinishStepPartSchema = wrapSchema(
  'Harness.harnessV1FinishStepPartSchema',
  sdk.harnessV1FinishStepPartSchema,
);

export const harnessV1QuestionsToolInputSchema = wrapSchema(
  'Harness.harnessV1QuestionsToolInputSchema',
  sdk.harnessV1QuestionsToolInputSchema,
);

export const harnessV1QuestionsToolOutputSchema = wrapSchema(
  'Harness.harnessV1QuestionsToolOutputSchema',
  sdk.harnessV1QuestionsToolOutputSchema,
);

export const harnessV1RawPartSchema = wrapSchema(
  'Harness.harnessV1RawPartSchema',
  sdk.harnessV1RawPartSchema,
);

export const harnessV1ReasoningDeltaPartSchema = wrapSchema(
  'Harness.harnessV1ReasoningDeltaPartSchema',
  sdk.harnessV1ReasoningDeltaPartSchema,
);

export const harnessV1ReasoningEndPartSchema = wrapSchema(
  'Harness.harnessV1ReasoningEndPartSchema',
  sdk.harnessV1ReasoningEndPartSchema,
);

export const harnessV1ReasoningStartPartSchema = wrapSchema(
  'Harness.harnessV1ReasoningStartPartSchema',
  sdk.harnessV1ReasoningStartPartSchema,
);

export const harnessV1StreamPartSchema = wrapSchema(
  'Harness.harnessV1StreamPartSchema',
  sdk.harnessV1StreamPartSchema,
);

export const harnessV1StreamStartPartSchema = wrapSchema(
  'Harness.harnessV1StreamStartPartSchema',
  sdk.harnessV1StreamStartPartSchema,
);

export const harnessV1TextDeltaPartSchema = wrapSchema(
  'Harness.harnessV1TextDeltaPartSchema',
  sdk.harnessV1TextDeltaPartSchema,
);

export const harnessV1TextEndPartSchema = wrapSchema(
  'Harness.harnessV1TextEndPartSchema',
  sdk.harnessV1TextEndPartSchema,
);

export const harnessV1TextStartPartSchema = wrapSchema(
  'Harness.harnessV1TextStartPartSchema',
  sdk.harnessV1TextStartPartSchema,
);

export const harnessV1ToolApprovalRequestPartSchema = wrapSchema(
  'Harness.harnessV1ToolApprovalRequestPartSchema',
  sdk.harnessV1ToolApprovalRequestPartSchema,
);

export const harnessV1ToolCallPartSchema = wrapSchema(
  'Harness.harnessV1ToolCallPartSchema',
  sdk.harnessV1ToolCallPartSchema,
);

export const harnessV1ToolResultPartSchema = wrapSchema(
  'Harness.harnessV1ToolResultPartSchema',
  sdk.harnessV1ToolResultPartSchema,
);

export const isHarnessV1BuiltinToolIncluded = (
  ...args: Parameters<typeof sdk.isHarnessV1BuiltinToolIncluded>
) => sdk.isHarnessV1BuiltinToolIncluded(...args);

export type {
  HarnessV1MintBridgeTokenCallback,
  HarnessV1RequestTransformation,
  HarnessV1RequestTransformationSources,
  HarnessV1SandboxSessionResumeOptions,
} from './internal/harness-contracts/harness.js';

export type HarnessV1SandboxProvider = ReturnType<
  typeof import('./internal/sandbox.js').wrapSandboxProvider
>;

export type HarnessV1SandboxSessionCreateOptions<
  T extends object,
  R = never,
  E = never,
> = T & {
  readonly sandboxId?: string;
  readonly template?: import('./internal/sandbox.js').SandboxTemplate<R, E>;
  readonly abortSignal?: AbortSignal;
};
