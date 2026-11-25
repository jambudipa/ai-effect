// Generated from @ai-sdk/code-mode@1.0.138 and run@2.1.13. Do not edit.
// SPDX-License-Identifier: Apache-2.0
// See code-mode-contract.LICENSE for the original license.
import type { Experimental_ToolCallerTool, ModelMessage, Tool } from 'ai';
declare const experimental_setMaxWorkers: (maxWorkers?: number) => void;
export declare const DIRECT_TOOL_CALL = 'AI_SDK_DIRECT_TOOL_CALL';
type CodeModeToolSet = Record<string, Tool<any, any>>;
interface CodeModeToolExecutionOptions {
  toolCallId: string;
  messages: ModelMessage[];
  abortSignal?: AbortSignal;
  experimental_context?: unknown;
  context?: unknown;
  codeModeInterrupt?: CodeModeInterruptExecutionContext;
}
type CodeModeTool = Tool<CodeModeToolInput, unknown> & {
  description: string;
};
interface CodeModeToolInput {
  js: string;
}
type ApprovalDecision =
  | 'approved'
  | 'denied'
  | {
      approved: boolean;
      reason?: string;
    };
interface CodeModeApprovalRequest {
  toolName: string;
  input: unknown;
  toolCallId: string;
}
interface CodeModeApprovalResponse {
  approvalId: string;
  approved: boolean;
  reason?: string;
}
interface CodeModeInterruptPayload {
  kind: string;
  [key: string]: unknown;
}
interface CodeModeInterruptResolution<TResolution = unknown> {
  interruptId: string;
  resolution: TResolution;
}
interface CodeModeInterruptExecutionContext<
  TPayload extends CodeModeInterruptPayload = CodeModeInterruptPayload,
  TResolution = unknown,
> {
  interruptId: string;
  payload: TPayload;
  resolution: TResolution;
}
interface CodeModeContinuationAuth {
  alg: 'HMAC-SHA256';
  nonce: string;
  issuedAtMs: number;
  expiresAtMs: number;
  signature: string;
}
interface CodeModeContinuation {
  version: 2;
  js: string;
  outerToolCallId: string;
  toolNames: string[];
  token: string;
  pendingInterruptions: CodeModePendingInterruption[];
  resolutions: CodeModePendingResolution[];
  auth: CodeModeContinuationAuth;
}
interface CodeModeInterrupt<
  TPayload extends CodeModeInterruptPayload = CodeModeInterruptPayload,
> {
  type: 'code-mode-interrupt';
  interruptId: string;
  toolName: string;
  toolCallId: string;
  outerToolCallId: string;
  input: unknown;
  payload: TPayload;
  continuation: CodeModeContinuation;
}
type CodeModeUnwrappedResult =
  | {
      status: 'completed';
      output: unknown;
    }
  | {
      status: 'interrupted';
      interrupt: CodeModeInterrupt;
    };
interface CodeModeApprovalInterruptPayload extends CodeModeInterruptPayload {
  kind: 'ai-sdk-code-mode/tool-approval';
}
type CodeModeApprovalInterrupt =
  CodeModeInterrupt<CodeModeApprovalInterruptPayload>;
interface CodeModeExecutionPolicy {
  timeoutMs?: number;
  cpuTimeoutMs?: number;
  memoryLimitBytes?: number;
  maxStackSizeBytes?: number;
  maxResultBytes?: number;
  maxConsoleOutputBytes?: number;
  maxSourceBytes?: number;
  maxToolInputBytes?: number;
  maxToolOutputBytes?: number;
  maxBridgeRequests?: number;
  maxInFlightBridgeRequests?: number;
}
interface CodeModeOptions {
  executionPolicy?: CodeModeExecutionPolicy;
  continuationSecurity?: CodeModeContinuationSecurityOptions;
  approval?: {
    mode?: 'callback' | 'interrupt';
    onApprovalRequired?: (
      request: CodeModeApprovalRequest,
    ) => Promise<ApprovalDecision> | ApprovalDecision;
  };
}
interface CodeModeToolOptions extends CodeModeOptions {
  toolDiscovery?: 'description' | 'conversation';
}
interface CodeModeContinuationSecurityOptions {
  signingKey?: string | Uint8Array;
  maxAgeMs?: number;
}
interface RunCodeModeInput {
  js: string;
  tools: CodeModeToolSet;
  toolExecutionOptions?: Partial<CodeModeToolExecutionOptions>;
  options?: CodeModeOptions;
  continuation?: CodeModeContinuation;
  interruptResolution?: CodeModeInterruptResolution;
}
declare function createCodeModeTool(
  tools: CodeModeToolSet,
  options?: CodeModeOptions,
): CodeModeTool;
declare function codeModeTool(
  options?: CodeModeToolOptions,
): Experimental_ToolCallerTool<CodeModeTool>;
declare function isCodeModeApprovalInterrupt(
  value: unknown,
  continuationSecurity?: CodeModeContinuationSecurityOptions,
): value is CodeModeApprovalInterrupt;
declare function continueCodeModeApproval({
  interrupt,
  approvalResponse,
  tools,
  options,
  toolExecutionOptions,
}: {
  interrupt: CodeModeApprovalInterrupt;
  approvalResponse: CodeModeApprovalResponse;
  tools: CodeModeToolSet;
  options?: CodeModeOptions;
  toolExecutionOptions?: Partial<CodeModeToolExecutionOptions>;
}): Promise<unknown>;
declare function toCodeModeApprovalMessages(
  interrupt: CodeModeApprovalInterrupt,
): ModelMessage[];
declare function getCodeModeApprovalResponse(
  messages: ModelMessage[],
  interrupt: CodeModeApprovalInterrupt,
): CodeModeApprovalResponse | undefined;
export declare class CodeModeError extends Error {
  code: string;
  readonly details?: unknown;
  constructor(message: string, code?: string, details?: unknown);
}
export declare class CodeModeTimeoutError extends CodeModeError {
  constructor(timeoutMs: number);
}
export declare class CodeModeCpuTimeoutError extends CodeModeError {
  constructor(cpuTimeoutMs: number);
}
export declare class CodeModeAbortedError extends CodeModeError {
  constructor();
}
export declare class CodeModeConcurrencyError extends CodeModeError {
  constructor(maxWorkers: number);
}
export declare class CodeModeSourceTooLargeError extends CodeModeError {
  constructor(bytes: number, maxBytes: number);
}
export declare class CodeModeBridgeLimitError extends CodeModeError {
  constructor(message: string, details?: unknown);
}
export declare class CodeModeDetachedBridgeRequestError extends CodeModeError {
  constructor(message: string, details?: unknown);
}
export declare class CodeModeProtocolError extends CodeModeError {
  constructor(message: string, details?: unknown);
}
export declare class CodeModeToolError extends CodeModeError {
  constructor(message: string, details?: unknown);
}
export declare class CodeModeToolApprovalRequiredError extends CodeModeToolError {
  constructor(toolName: string, input: unknown, toolCallId: string);
}
export declare class CodeModeToolApprovalDeniedError extends CodeModeToolError {
  constructor(
    toolName: string,
    input: unknown,
    toolCallId: string,
    reason?: string,
  );
}
declare function requestCodeModeInterrupt<
  TPayload extends CodeModeInterruptPayload,
>(payload: TPayload): never;
declare function isCodeModeInterrupt(
  value: unknown,
  continuationSecurity?: CodeModeContinuationSecurityOptions,
): value is CodeModeInterrupt;
declare function continueCodeModeInterrupt<
  TPayload extends CodeModeInterruptPayload = CodeModeInterruptPayload,
  TResolution = unknown,
>({
  interrupt,
  resolution,
  tools,
  options,
  toolExecutionOptions,
}: {
  interrupt: CodeModeInterrupt<TPayload>;
  resolution: TResolution;
  tools: CodeModeToolSet;
  options?: CodeModeOptions;
  toolExecutionOptions?: Partial<CodeModeToolExecutionOptions>;
}): Promise<unknown>;
declare function getCodeModeInterrupt(
  result: unknown,
  continuationSecurity?: CodeModeContinuationSecurityOptions,
): CodeModeInterrupt | undefined;
declare function unwrapCodeModeResult(
  result: unknown,
  continuationSecurity?: CodeModeContinuationSecurityOptions,
): CodeModeUnwrappedResult;
declare function runCodeMode(input: RunCodeModeInput): Promise<unknown>;
declare function setCodeModeContinuationSigningKey(
  key?: string | Uint8Array,
  options?: {
    maxAgeMs?: number;
  },
): void;
export {
  type ApprovalDecision,
  type CodeModeApprovalInterrupt,
  type CodeModeApprovalRequest,
  type CodeModeApprovalResponse,
  type CodeModeContinuation,
  type CodeModeContinuationSecurityOptions,
  type CodeModeExecutionPolicy,
  type CodeModeInterrupt,
  type CodeModeInterruptExecutionContext,
  type CodeModeInterruptPayload,
  type CodeModeInterruptResolution,
  type CodeModeOptions,
  type CodeModeTool,
  type CodeModeToolExecutionOptions,
  type CodeModeToolInput,
  type CodeModeToolOptions,
  type CodeModeToolSet,
  type CodeModeUnwrappedResult,
  type RunCodeModeInput,
  codeModeTool as experimental_codeModeTool,
  continueCodeModeApproval as experimental_continueCodeModeApproval,
  continueCodeModeInterrupt as experimental_continueCodeModeInterrupt,
  createCodeModeTool as experimental_createCodeModeTool,
  getCodeModeApprovalResponse as experimental_getCodeModeApprovalResponse,
  getCodeModeInterrupt as experimental_getCodeModeInterrupt,
  isCodeModeApprovalInterrupt as experimental_isCodeModeApprovalInterrupt,
  isCodeModeInterrupt as experimental_isCodeModeInterrupt,
  requestCodeModeInterrupt as experimental_requestCodeModeInterrupt,
  runCodeMode as experimental_runCodeMode,
  setCodeModeContinuationSigningKey as experimental_setCodeModeContinuationSigningKey,
  experimental_setMaxWorkers,
  toCodeModeApprovalMessages as experimental_toCodeModeApprovalMessages,
  unwrapCodeModeResult as experimental_unwrapCodeModeResult,
};
interface CodeModePendingInterruption {
  runInterruptionId: string;
  interruptId: string;
  toolName: string;
  toolCallId: string;
  input: unknown;
  payload: CodeModeInterruptPayload;
}
interface CodeModePendingResolution {
  runInterruptionId: string;
  value: unknown;
}
