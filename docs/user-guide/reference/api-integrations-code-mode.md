---
title: "Integration API — code-mode"
doc-type: reference
sources: [src/integrations/code-mode.ts, package.json]
---

# code-mode

> **TL;DR:** The `@jambudipa/ai-effect/code-mode` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/code-mode`

## `ApprovalDecision`

```text
type ApprovalDecision = 'approved' | 'denied' | {
    approved: boolean;
    reason?: string;
};
```

## `CodeModeAbortedError`

Construct or recognize the tagged error that represents an aborted Code Mode run.
Tagged failure channel used when a Code Mode run is aborted.

```text
export declare const CodeModeAbortedError: {
    make: () => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeAbortedError = AiSdkError;
```

## `CodeModeApprovalInterrupt`

```text
type CodeModeApprovalInterrupt = CodeModeInterrupt<CodeModeApprovalInterruptPayload>;
```

## `CodeModeApprovalRequest`

```text
interface CodeModeApprovalRequest {
    toolName: string;
    input: unknown;
    toolCallId: string;
}
```

## `CodeModeApprovalResponse`

```text
interface CodeModeApprovalResponse {
    approvalId: string;
    approved: boolean;
    reason?: string;
}
```

## `CodeModeBridgeLimitError`

Construct or recognize a failure from the native bridge request limit.
Tagged failure channel used when a run reaches the Code Mode bridge limit.

```text
export declare const CodeModeBridgeLimitError: {
    make: (message: string, details?: unknown) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeBridgeLimitError = AiSdkError;
```

## `CodeModeConcurrencyError`

Construct or recognize a native Code Mode concurrency failure.
Tagged failure channel used when the Code Mode scheduler rejects concurrent work.

```text
export declare const CodeModeConcurrencyError: {
    make: (maxWorkers: number) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeConcurrencyError = AiSdkError;
```

## `CodeModeContinuation`

```text
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
```

## `CodeModeContinuationSecurityOptions`

```text
interface CodeModeContinuationSecurityOptions {
    signingKey?: string | Uint8Array;
    maxAgeMs?: number;
}
```

## `CodeModeCpuTimeoutError`

Construct or recognize a failure from the native CPU budget.
Tagged failure channel for CPU timeout, separate from elapsed-time limits.

```text
export declare const CodeModeCpuTimeoutError: {
    make: (cpuTimeoutMs: number) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeCpuTimeoutError = AiSdkError;
```

## `CodeModeDetachedBridgeRequestError`

Construct or recognize a failure from a bridge request outside an active native run.
Tagged failure channel used for a detached native bridge request.

```text
export declare const CodeModeDetachedBridgeRequestError: {
    make: (message: string, details?: unknown) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeDetachedBridgeRequestError = AiSdkError;
```

## `CodeModeError`

Construct or recognize the base native Code Mode error.
Common tagged SDK failure type for Code Mode operations.

```text
export declare const CodeModeError: {
    make: (message: string, code?: string | undefined, details?: unknown) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeError = AiSdkError;
```

## `CodeModeExecutionPolicy`

```text
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
```

## `CodeModeInterrupt`

```text
interface CodeModeInterrupt<TPayload extends CodeModeInterruptPayload = CodeModeInterruptPayload> {
    type: 'code-mode-interrupt';
    interruptId: string;
    toolName: string;
    toolCallId: string;
    outerToolCallId: string;
    input: unknown;
    payload: TPayload;
    continuation: CodeModeContinuation;
}
```

## `CodeModeInterruptExecutionContext`

```text
interface CodeModeInterruptExecutionContext<TPayload extends CodeModeInterruptPayload = CodeModeInterruptPayload, TResolution = unknown> {
    interruptId: string;
    payload: TPayload;
    resolution: TResolution;
}
```

## `CodeModeInterruptPayload`

```text
interface CodeModeInterruptPayload {
    kind: string;
    [key: string]: unknown;
}
```

## `CodeModeInterruptResolution`

```text
interface CodeModeInterruptResolution<TResolution = unknown> {
    interruptId: string;
    resolution: TResolution;
}
```

## `CodeModeOptions`

Preserve native execution options while allowing an Effect callback for approvals.

```text
export type CodeModeOptions<E = never, R = never> = Omit<SDKContract.CodeModeOptions, 'approval'> & {
    readonly approval?: Omit<NativeApproval, 'onApprovalRequired'> & {
        readonly onApprovalRequired?: ApprovalHook<E, R>;
    };
};
```

## `CodeModeProtocolError`

Construct or recognize a failure in the native Code Mode protocol.
Tagged failure channel used for native protocol errors.

```text
export declare const CodeModeProtocolError: {
    make: (message: string, details?: unknown) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeProtocolError = AiSdkError;
```

## `CodeModeSourceTooLargeError`

Construct or recognize a failure from the native source size bound.
Tagged failure channel for source that exceeds the Code Mode size limit.

```text
export declare const CodeModeSourceTooLargeError: {
    make: (bytes: number, maxBytes: number) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeSourceTooLargeError = AiSdkError;
```

## `CodeModeTimeoutError`

Construct or recognize a failure from the elapsed-time limit of a run.
Tagged failure channel for the native runtime timeout.

```text
export declare const CodeModeTimeoutError: {
    make: (timeoutMs: number) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeTimeoutError = AiSdkError;
```

## `CodeModeTool`

Effect tool handle returned by the factory for a caller-defined tool set.

```text
export type CodeModeTool = Effect.Success<ReturnType<typeof experimental_createCodeModeTool>>;
```

## `CodeModeToolApprovalDeniedError`

Construct or recognize a failed host tool call whose approval was denied.
Tagged failure channel for denied approval of a Code Mode tool call.

```text
export declare const CodeModeToolApprovalDeniedError: {
    make: (toolName: string, input: unknown, toolCallId: string, reason?: string | undefined) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeToolApprovalDeniedError = AiSdkError;
```

## `CodeModeToolApprovalRequiredError`

Construct or recognize a host tool call that requires approval before execution.
Tagged failure channel for a tool call awaiting an explicit decision.

```text
export declare const CodeModeToolApprovalRequiredError: {
    make: (toolName: string, input: unknown, toolCallId: string) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeToolApprovalRequiredError = AiSdkError;
```

## `CodeModeToolError`

Construct or recognize a failure originating from execution of a Code Mode tool.
Tagged failure channel for host tool execution in Code Mode.

```text
export declare const CodeModeToolError: {
    make: (message: string, details?: unknown) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type CodeModeToolError = AiSdkError;
```

## `CodeModeToolExecutionOptions`

```text
interface CodeModeToolExecutionOptions {
    toolCallId: string;
    messages: ModelMessage[];
    abortSignal?: AbortSignal;
    experimental_context?: unknown;
    context?: unknown;
    codeModeInterrupt?: CodeModeInterruptExecutionContext;
}
```

## `CodeModeToolInput`

```text
interface CodeModeToolInput {
    js: string;
}
```

## `CodeModeToolOptions`

Add native tool discovery settings to the options for a Code Mode tool.

```text
export type CodeModeToolOptions<E = never, R = never> = CodeModeOptions<E, R> & Pick<SDKContract.CodeModeToolOptions, 'toolDiscovery'>;
```

## `CodeModeToolSet`

Tool definitions allowed to execute in the host Effect context during a Code Mode run.

```text
export type CodeModeToolSet = EffectTools;
```

## `CodeModeUnwrappedResult`

```text
type CodeModeUnwrappedResult = {
    status: 'completed';
    output: unknown;
} | {
    status: 'interrupted';
    interrupt: CodeModeInterrupt;
};
```

## `DIRECT_TOOL_CALL`

Native sentinel for a direct host tool call in the Code Mode protocol.

```text
export declare const DIRECT_TOOL_CALL = "AI_SDK_DIRECT_TOOL_CALL";
```

## `experimental_codeModeTool`

Expose the SDK's configurable Code Mode tool and preserve its local caller support when available.

The full public type is defined by the [source declaration](../../../src/integrations/code-mode.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const experimental_codeModeTool: <E = never, R = never>(options?: CodeModeToolOptions<E, R>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/code-mode').experimental_codeModeTool<E, R>>;
```

## `experimental_continueCodeModeApproval`

Continue a run paused for host tool approval with the decision from the caller.

```text
export declare const experimental_continueCodeModeApproval: <T extends EffectTools, E = never, R = never>(input: ApprovalInput<T, E, R>) => Effect.Effect<unknown, AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<import("../internal/tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope>>;
```

## `experimental_continueCodeModeInterrupt`

Resume native execution after the application resolves the supplied interrupt.

```text
export declare const experimental_continueCodeModeInterrupt: <T extends EffectTools, P extends SDKContract.CodeModeInterruptPayload = SDKContract.CodeModeInterruptPayload, A = unknown, E = never, R = never>(input: InterruptInput<T, P, A, E, R>) => Effect.Effect<unknown, AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<import("../internal/tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope>>;
```

## `experimental_createCodeModeTool`

Build a Code Mode tool backed by the supplied Effect tools and their owning scope.

The full public type is defined by the [source declaration](../../../src/integrations/code-mode.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const experimental_createCodeModeTool: <T extends EffectTools, E = never, R = never>(tools: T, options?: CodeModeOptions<E, R>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/code-mode').experimental_createCodeModeTool<T, E, R>>;
```

## `experimental_getCodeModeApprovalResponse`

Extract the SDK's approval response from the supported native input representation.

```text
export declare const experimental_getCodeModeApprovalResponse: (...args: Parameters<typeof sdk.experimental_getCodeModeApprovalResponse>) => SDKContract.CodeModeApprovalResponse | undefined;
```

## `experimental_getCodeModeInterrupt`

Read the interrupt carried by a native Code Mode result when one is available.

```text
export declare const experimental_getCodeModeInterrupt: (...args: Parameters<typeof sdk.experimental_getCodeModeInterrupt>) => SDKContract.CodeModeInterrupt<SDKContract.CodeModeInterruptPayload> | undefined;
```

## `experimental_isCodeModeApprovalInterrupt`

Check whether the interrupt must be resumed through the approval path.

```text
export declare const experimental_isCodeModeApprovalInterrupt: (...args: Parameters<typeof sdk.experimental_isCodeModeApprovalInterrupt>) => boolean;
```

## `experimental_isCodeModeInterrupt`

Narrow a value to a native Code Mode interruption recognized by the SDK.

```text
export declare const experimental_isCodeModeInterrupt: (...args: Parameters<typeof sdk.experimental_isCodeModeInterrupt>) => boolean;
```

## `experimental_requestCodeModeInterrupt`

Ask the SDK to signal an interrupt carrying an application-defined continuation payload.

```text
export declare const experimental_requestCodeModeInterrupt: <P extends SDKContract.CodeModeInterruptPayload>(payload: P) => Effect.Effect<never, AiSdkError, never>;
```

## `experimental_runCodeMode`

Run one code-mode program with bounded SDK policy and Effect tools.

```text
export declare const experimental_runCodeMode: <T extends EffectTools, E = never, R = never>(input: RunCodeModeInput<T, E, R>) => Effect.Effect<unknown, AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<import("../internal/tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope>>;
```

## `experimental_setCodeModeContinuationSigningKey`

Set the native key used to sign Code Mode continuation state.

```text
export declare const experimental_setCodeModeContinuationSigningKey: (...args: Parameters<typeof sdk.experimental_setCodeModeContinuationSigningKey>) => Effect.Effect<void, AiSdkError, never>;
```

## `experimental_setMaxWorkers`

Configure the worker bound for the native Code Mode scheduler.

```text
export declare const experimental_setMaxWorkers: (...args: Parameters<typeof sdk.experimental_setMaxWorkers>) => Effect.Effect<void, AiSdkError, never>;
```

## `experimental_toCodeModeApprovalMessages`

Convert native approval state to model-facing tool approval messages.

```text
export declare const experimental_toCodeModeApprovalMessages: (...args: Parameters<typeof sdk.experimental_toCodeModeApprovalMessages>) => import("ai").ModelMessage[];
```

## `experimental_unwrapCodeModeResult`

Unwrap a native run result through the tagged boundary when the Effect executes.

```text
export declare const experimental_unwrapCodeModeResult: (...args: Parameters<typeof sdk.experimental_unwrapCodeModeResult>) => Effect.Effect<SDKContract.CodeModeUnwrappedResult, AiSdkError, never>;
```

## `RunCodeModeInput`

Program execution input with a typed Effect tool set and optional approval policy.

```text
export type RunCodeModeInput<T extends EffectTools = EffectTools, E = never, R = never> = Omit<SDKContract.RunCodeModeInput, 'options' | 'tools'> & {
    readonly tools: T;
    readonly options?: CodeModeOptions<E, R>;
};
```
