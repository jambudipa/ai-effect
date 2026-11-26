---
title: "Integration API — harness"
doc-type: reference
sources: [src/integrations/harness.ts, package.json]
---

# harness

> **TL;DR:** The `@jambudipa/ai-effect/harness` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness`

## `commonTool`

Define a tool which implements the standard input for a named harness tool.

```text
export declare const commonTool: <N extends SDKContract.HarnessV1BuiltinToolName, A>(name: N, options: {
    readonly nativeName: string;
    readonly toolUseKind?: SDKContract.HarnessV1BuiltinToolUseKind;
    readonly description?: string;
    readonly inputSchema: Schema.ConstraintDecoder<A>;
}) => import("effect/Effect").Effect<CommonToolResult<N, A>, AiSdkError, never>;
```

## `experimental_harnessV1BridgeUserMessageInboundSchema`

Validate a user message submitted to an active turn through the experimental inbound protocol.

```text
export declare const experimental_harnessV1BridgeUserMessageInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "user-message";
        text: string;
        messageId: string;
    }, AiSdkError, never>;
};
```

## `Experimental_HarnessV1BridgeUserMessageResponse`

```text
type Experimental_HarnessV1BridgeUserMessageResponse = z.infer<
  typeof experimental_harnessV1BridgeUserMessageResponseSchema
>;
```

## `experimental_harnessV1BridgeUserMessageResponseSchema`

Validate the bridge acknowledgment or rejection for an experimental user message.

```text
export declare const experimental_harnessV1BridgeUserMessageResponseSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "user-message-response";
        messageId: string;
        accepted: boolean;
        error?: {
            message: string;
        } | undefined;
    }, AiSdkError, never>;
};
```

## `getHarnessV1BuiltinToolFilteringDenialReason`

Ask the SDK which configured tool-filtering rule denied a built-in tool.

```text
export declare const getHarnessV1BuiltinToolFilteringDenialReason: (...args: Parameters<typeof sdk.getHarnessV1BuiltinToolFilteringDenialReason>) => string;
```

## `HARNESS_V1_BUILTIN_TOOL_NAMES`

Standard tool names copied from the SDK so callers cannot change the native list.

```text
export declare const HARNESS_V1_BUILTIN_TOOL_NAMES: readonly SDKContract.HarnessV1BuiltinToolName[];
```

## `HARNESS_V1_BUILTIN_TOOLS`

Built-in tool definitions with Effect schemas, callbacks, and execution.

```text
export declare const HARNESS_V1_BUILTIN_TOOLS: import("./internal/sdk-tool.js").WrappedTools<{
    readonly read: import("@ai-sdk/provider-utils").Tool<{
        file_path: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly write: import("@ai-sdk/provider-utils").Tool<{
        file_path: string;
        content: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly edit: import("@ai-sdk/provider-utils").Tool<{
        file_path: string;
        old_string: string;
        new_string: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly bash: import("@ai-sdk/provider-utils").Tool<{
        command: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly grep: import("@ai-sdk/provider-utils").Tool<{
        pattern: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly glob: import("@ai-sdk/provider-utils").Tool<{
        pattern: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly webSearch: import("@ai-sdk/provider-utils").Tool<{
        query: string;
    }, unknown, import("@ai-sdk/provider-utils").Context>;
    readonly askUserQuestions: import("@ai-sdk/provider-utils").FunctionTool<{
        allowPartialAnswers: boolean;
        questions: {
            id: string;
            question: string;
            header?: string | undefined;
            options?: {
                id: string;
                label: string;
                description?: string | undefined;
                preview?: string | undefined;
            }[] | undefined;
            allowMultiple?: boolean | undefined;
            allowFreeForm?: boolean | {
                secret: boolean;
            } | undefined;
        }[];
    }, {
        action: "answered";
        answers: Record<string, {
            optionIds: string[];
            freeform?: string | undefined;
        }>;
    } | {
        action: "partially-answered";
        answers: Record<string, {
            optionIds: string[];
            freeform?: string | undefined;
        }>;
    } | {
        action: "declined";
    } | {
        action: "cancelled";
    }>;
}>;
```

## `HarnessCapabilityUnsupportedError`

Construct or recognize a tagged failure for an unsupported harness capability.
Error channel used for unsupported native harness capabilities.

```text
export declare const HarnessCapabilityUnsupportedError: {
    make: (args_0: {
        message: string;
        harnessId?: string;
        cause?: unknown;
    }) => import("effect/Effect").Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type HarnessCapabilityUnsupportedError = AiSdkError;
```

## `HarnessError`

Construct or recognize a tagged error originating from the native harness error class.
Tagged error type used when a native harness operation fails.

```text
export declare const HarnessError: {
    make: (args_0: {
        message: string;
        cause?: unknown;
    }) => import("effect/Effect").Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type HarnessError = AiSdkError;
```

## `HarnessHistoryUnavailableError`

Construct or recognize a tagged error for a session without accessible history.
Tagged error channel used when native session history is unavailable.

```text
export declare const HarnessHistoryUnavailableError: {
    make: (args_0: {
        message: string;
        harnessId?: string;
        cause?: unknown;
    }) => import("effect/Effect").Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type HarnessHistoryUnavailableError = AiSdkError;
```

## `HarnessSandboxAuthenticationError`

Construct or recognize a tagged error originating from sandbox authentication.
Tagged error channel used for native sandbox authentication failure.

```text
export declare const HarnessSandboxAuthenticationError: {
    make: (args_0: {
        message: string;
        sandboxProviderId: string;
        cause?: unknown;
    }) => import("effect/Effect").Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type HarnessSandboxAuthenticationError = AiSdkError;
```

## `harnessSessionDataDirectoryPath`

Compute the native path for data associated with one harness session.

```text
export declare const harnessSessionDataDirectoryPath: (...args: Parameters<typeof sdk.harnessSessionDataDirectoryPath>) => string;
```

## `harnessStateDirectoryPath`

Compute the native harness state directory path from its SDK arguments.

```text
export declare const harnessStateDirectoryPath: (...args: Parameters<typeof sdk.harnessStateDirectoryPath>) => string;
```

## `HarnessV1`

Effect harness handle with provider capabilities and the adapter's built-in tool keys.

```text
export type HarnessV1<T extends Record<string, object> = ToolSet> = ReturnType<typeof wrapHarness<T>>;
```

## `HarnessV1AssistantMessage`

```text
type HarnessV1AssistantMessage = {
  readonly role: 'assistant';
  readonly content: Array<
    | HarnessV1TextPart
    | HarnessV1FilePart
    | HarnessV1CustomPart
    | HarnessV1ReasoningPart
    | HarnessV1ReasoningFilePart
    | HarnessV1ToolCallPart
    | HarnessV1ToolResultPart
  >;
  readonly at?: string;
  readonly harnessMetadata?: HarnessV1Metadata;
};
```

## `HarnessV1Authentication`

```text
type HarnessV1Authentication<ADAPTER_CHOICES extends string = 'direct'> = [
  ADAPTER_CHOICES,
] extends [never]
  ? never
  : string extends ADAPTER_CHOICES
    ? never
    : | 'auto'
      | 'ai-gateway'
      | ADAPTER_CHOICES
      | HarnessV1AuthenticationEnvironment;
```

## `HarnessV1AuthenticationEnvironment`

```text
type HarnessV1AuthenticationEnvironment = Readonly<Record<string, string>>;
```

## `HarnessV1Bootstrap`

```text
interface HarnessV1Bootstrap {
  readonly harnessId: string;
  readonly bootstrapDir: string;
  readonly files: ReadonlyArray<HarnessV1BootstrapFile>;
  readonly commands: ReadonlyArray<HarnessV1BootstrapCommand>;
}
```

## `HarnessV1BootstrapCommand`

```text
interface HarnessV1BootstrapCommand {
  readonly command: string;
}
```

## `HarnessV1BootstrapFile`

```text
interface HarnessV1BootstrapFile {
  readonly path: string;
  readonly content: string;
}
```

## `harnessV1BridgeAbortInboundSchema`

Validate a host instruction to abort the active bridge turn.

```text
export declare const harnessV1BridgeAbortInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "abort";
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeBuiltinToolFilteringSchema`

Validate the rules for selecting which native built-in tools are available.

```text
export declare const harnessV1BridgeBuiltinToolFilteringSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        mode: "allow";
        toolNames: string[];
    } | {
        mode: "deny";
        toolNames: string[];
    }, AiSdkError, never>;
};
```

## `HarnessV1BridgeDebugEvent`

```text
type HarnessV1BridgeDebugEvent = z.infer<
  typeof harnessV1BridgeDebugEventSchema
>;
```

## `harnessV1BridgeDebugEventSchema`

Validate a diagnostic frame emitted by the bridge for debugging.

```text
export declare const harnessV1BridgeDebugEventSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "debug-event";
        level: "error" | "debug" | "warn" | "info" | "trace";
        subsystem: string;
        message: string;
        attrs?: Record<string, unknown> | undefined;
        error?: {
            message: string;
            name?: string | undefined;
            stack?: string | undefined;
        } | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeDestroyInboundSchema`

Validate a host instruction to destroy the bridge session.

```text
export declare const harnessV1BridgeDestroyInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "destroy";
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeHelloSchema`

Validate the initial hello frame for a bridge connection.

```text
export declare const harnessV1BridgeHelloSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "bridge-hello";
        state?: string | undefined;
        lastSeq?: number | undefined;
        capabilities?: {
            idempotentStart?: boolean | null | undefined;
            experimental_userMessageResponses?: boolean | undefined;
        } | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeInboundCommandSchemas`

Preserve the native order of command schemas for validating host-to-bridge input.

```text
export declare const harnessV1BridgeInboundCommandSchemas: readonly [{
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-result";
        toolCallId: string;
        output: unknown;
        isError?: boolean | undefined;
        toolResult?: unknown;
    }, AiSdkError, never>;
}, {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-approval-response";
        approvalId: string;
        approved: boolean;
        reason?: string | undefined;
    }, AiSdkError, never>;
}, {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "user-message";
        text: string;
        messageId?: string | undefined;
    }, AiSdkError, never>;
}, {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "abort";
    }, AiSdkError, never>;
}, {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "destroy";
    }, AiSdkError, never>;
}, {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "resume";
        lastSeenEventId: number;
    }, AiSdkError, never>;
}, {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "stop";
    }, AiSdkError, never>;
}];
```

## `HarnessV1BridgeOutboundMessage`

```text
type HarnessV1BridgeOutboundMessage = z.infer<
  typeof harnessV1BridgeOutboundMessageSchema
>;
```

## `harnessV1BridgeOutboundMessageSchema`

Validate messages emitted from the bridge before a client consumes them.

```text
export declare const harnessV1BridgeOutboundMessageSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "stream-start";
        warnings?: readonly SDKContract.HarnessV1CallWarning[] | undefined;
        modelId?: string | undefined;
    } | {
        type: "text-start";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "text-delta";
        id: string;
        delta: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "text-end";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "reasoning-start";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "reasoning-delta";
        id: string;
        delta: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "reasoning-end";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "tool-input-start";
        id: string;
        toolName: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        providerExecuted?: boolean | undefined;
        dynamic?: boolean | undefined;
        title?: string | undefined;
    } | {
        type: "tool-input-delta";
        id: string;
        delta: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "tool-input-end";
        id: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "tool-call";
        toolCallId: string;
        toolName: string;
        input: string;
        providerExecuted?: boolean | undefined;
        dynamic?: boolean | undefined;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        nativeName?: string | undefined;
    } | {
        type: "tool-approval-request";
        approvalId: string;
        toolCallId: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "tool-result";
        toolCallId: string;
        toolName: string;
        result: NonNullable<import("@ai-sdk/provider").JSONValue>;
        isError?: boolean | undefined;
        preliminary?: boolean | undefined;
        dynamic?: boolean | undefined;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "finish-step";
        finishReason: import("@ai-sdk/provider").LanguageModelV4FinishReason;
        usage: import("@ai-sdk/provider").LanguageModelV4Usage;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "finish";
        finishReason: import("@ai-sdk/provider").LanguageModelV4FinishReason;
        totalUsage: import("@ai-sdk/provider").LanguageModelV4Usage;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "file-change";
        event: "create" | "modify" | "delete";
        path: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "compaction";
        trigger: "manual" | "auto";
        summary: string;
        tokensBefore?: number | undefined;
        tokensAfter?: number | undefined;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "error";
        error: unknown;
    } | {
        type: "raw";
        rawValue: unknown;
    } | {
        type: "bridge-hello";
        state?: string | undefined;
        lastSeq?: number | undefined;
        capabilities?: {
            idempotentStart?: boolean | null | undefined;
            experimental_userMessageResponses?: boolean | undefined;
        } | undefined;
    } | {
        type: "user-message-response";
        messageId: string;
        accepted: boolean;
        error?: {
            message: string;
        } | undefined;
    } | {
        type: "bridge-stop";
        data: unknown;
    } | {
        type: "bridge-thread";
        threadId: string;
    } | {
        type: "sandbox-log";
        source: string;
        stream: "stdout" | "stderr";
        line: string;
    } | {
        type: "debug-event";
        level: "error" | "debug" | "warn" | "info" | "trace";
        subsystem: string;
        message: string;
        attrs?: Record<string, unknown> | undefined;
        error?: {
            message: string;
            name?: string | undefined;
            stack?: string | undefined;
        } | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgePermissionModeSchema`

Validate the permission mode sent in bridge configuration.

```text
export declare const harnessV1BridgePermissionModeSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<"allow-reads" | "allow-edits" | "allow-all", AiSdkError, never>;
};
```

## `HarnessV1BridgeReady`

```text
type HarnessV1BridgeReady = z.infer<typeof harnessV1BridgeReadySchema>;
```

## `harnessV1BridgeReadySchema`

Validate the frame that reports bridge readiness.

```text
export declare const harnessV1BridgeReadySchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "bridge-ready";
        port: number;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeResponseFormatSchema`

Validate a requested response format before a bridge starts the model call.

```text
export declare const harnessV1BridgeResponseFormatSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<SDKContract.HarnessV1ResponseFormat, AiSdkError, never>;
};
```

## `harnessV1BridgeResumeInboundSchema`

Validate a host instruction to resume a previously suspended turn.

```text
export declare const harnessV1BridgeResumeInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "resume";
        lastSeenEventId: number;
    }, AiSdkError, never>;
};
```

## `HarnessV1BridgeSandboxLog`

```text
type HarnessV1BridgeSandboxLog = z.infer<
  typeof harnessV1BridgeSandboxLogSchema
>;
```

## `harnessV1BridgeSandboxLogSchema`

Validate sandbox log frames produced by the bridge process.

```text
export declare const harnessV1BridgeSandboxLogSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "sandbox-log";
        source: string;
        stream: "stdout" | "stderr";
        line: string;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeStartBaseSchema`

Validate fields common to all host instructions that start a turn.

```text
export declare const harnessV1BridgeStartBaseSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "start";
        prompt: string;
        startId?: string | undefined;
        tools?: {
            name: string;
            description?: string | undefined;
            inputSchema?: unknown;
        }[] | undefined;
        model?: string | undefined;
        debug?: {
            enabled?: boolean | undefined;
            level?: "error" | "debug" | "warn" | "info" | "trace" | undefined;
            subsystems?: string[] | undefined;
        } | undefined;
        permissionMode?: "allow-reads" | "allow-edits" | "allow-all" | undefined;
        builtinToolFiltering?: {
            mode: "allow";
            toolNames: string[];
        } | {
            mode: "deny";
            toolNames: string[];
        } | undefined;
        responseFormat?: SDKContract.HarnessV1ResponseFormat | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeStopInboundSchema`

Validate a host instruction to stop the active bridge operation.

```text
export declare const harnessV1BridgeStopInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "stop";
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeStopSchema`

Validate the native stop frame independently of its inbound command wrapper.

```text
export declare const harnessV1BridgeStopSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "bridge-stop";
        data: unknown;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeThreadSchema`

Validate the native thread description used in bridge communication.

```text
export declare const harnessV1BridgeThreadSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "bridge-thread";
        threadId: string;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeToolApprovalResponseInboundSchema`

Validate a host response to a pending tool approval request.

```text
export declare const harnessV1BridgeToolApprovalResponseInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-approval-response";
        approvalId: string;
        approved: boolean;
        reason?: string | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeToolResultInboundSchema`

Validate a host tool result before returning it to the bridge turn.

```text
export declare const harnessV1BridgeToolResultInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-result";
        toolCallId: string;
        output: unknown;
        isError?: boolean | undefined;
        toolResult?: unknown;
    }, AiSdkError, never>;
};
```

## `HarnessV1BridgeToolWire`

```text
type HarnessV1BridgeToolWire = z.infer<typeof harnessV1BridgeToolWireSchema>;
```

## `harnessV1BridgeToolWireSchema`

Validate the wire representation of a tool offered to the bridge.

```text
export declare const harnessV1BridgeToolWireSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        name: string;
        description?: string | undefined;
        inputSchema?: unknown;
    }, AiSdkError, never>;
};
```

## `harnessV1BridgeUserMessageInboundSchema`

Validate the stable schema export for inbound user message frames.

```text
export declare const harnessV1BridgeUserMessageInboundSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "user-message";
        text: string;
        messageId?: string | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1BuiltinTool`

Preserve the native and common tool names plus the tool-use classification on the wrapped tool.

```text
export type HarnessV1BuiltinTool<Input = unknown, Output = unknown> = ReturnType<typeof wrapTool<Input, Output, unknown>> & Pick<SDKContract.HarnessV1BuiltinTool<Input, Output>, 'nativeName' | 'commonName' | 'toolUseKind'>;
```

## `HarnessV1BuiltinToolFiltering`

```text
type HarnessV1BuiltinToolFiltering =
  | {
      mode: 'allow';
      toolNames: string[];
    }
  | {
      mode: 'deny';
      toolNames: string[];
    };
```

## `HarnessV1BuiltinToolName`

```text
type HarnessV1BuiltinToolName = keyof typeof HARNESS_V1_BUILTIN_TOOLS;
```

## `HarnessV1BuiltinToolUseKind`

```text
type HarnessV1BuiltinToolUseKind = 'readonly' | 'edit' | 'bash';
```

## `HarnessV1CallWarning`

```text
type HarnessV1CallWarning =
  | {
      type: 'unsupported-setting';
      setting: string;
      details?: string;
    }
  | {
      type: 'unsupported-tool';
      tool: string;
      details?: string;
    }
  | {
      type: 'other';
      message: string;
    };
```

## `HarnessV1ContinueTurnOptions`

Continue a suspended turn with a new sequential Effect event consumer.

```text
export type HarnessV1ContinueTurnOptions<E = never, R = never> = Omit<NativeContinueTurnOptions, 'emit'> & EffectEmit<E, R>;
```

## `HarnessV1ContinueTurnState`

```text
type HarnessV1ContinueTurnState = HarnessV1LifecycleStateBase & {
  readonly type: 'continue-turn';
  readonly pendingToolApprovals?: readonly HarnessV1PendingToolApproval[];
  readonly pendingToolResults?: readonly HarnessV1PendingToolResult[];
  readonly turnSettings?: HarnessV1TurnSettings;
};
```

## `HarnessV1CredentialForwarding`

Resolve forwarded credentials within the caller's Effect callback context.

```text
export type HarnessV1CredentialForwarding<R = never, E = never> = (options: Parameters<NativeCredentialForwarding>[0]) => Effect.Effect<string, E, R>;
```

## `HarnessV1CustomPart`

```text
type HarnessV1CustomPart = Omit<LanguageModelV4CustomPart, 'providerOptions'>;
```

## `HarnessV1DebugConfig`

```text
type HarnessV1DebugConfig = z.infer<typeof harnessV1DebugConfigSchema>;
```

## `harnessV1DebugConfigSchema`

Validate harness diagnostics settings at the adapter boundary.

```text
export declare const harnessV1DebugConfigSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        enabled?: boolean | undefined;
        level?: "error" | "debug" | "warn" | "info" | "trace" | undefined;
        subsystems?: string[] | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1DebugLevel`

```text
type HarnessV1DebugLevel = z.infer<typeof harnessV1DebugLevelSchema>;
```

## `harnessV1DebugLevelSchema`

Validate a supported level for harness diagnostic output.

```text
export declare const harnessV1DebugLevelSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<"error" | "debug" | "warn" | "info" | "trace", AiSdkError, never>;
};
```

## `HarnessV1Diagnostic`

```text
type HarnessV1Diagnostic = {
  readonly level: HarnessV1DebugLevel;
  readonly message: string;
  readonly subsystem: string;
  readonly kind: 'log' | 'event';
  readonly source?: string;
  readonly stream?: 'stdout' | 'stderr';
  readonly attrs?: Record<string, unknown>;
  readonly error?: {
    name?: string;
    message: string;
    stack?: string;
  };
  readonly sessionId?: string;
  readonly timestamp: number;
};
```

## `harnessV1DiagnosticFromBridgeFrame`

Convert a native bridge frame into the SDK's harness diagnostic representation.

```text
export declare const harnessV1DiagnosticFromBridgeFrame: (...args: Parameters<typeof sdk.harnessV1DiagnosticFromBridgeFrame>) => SDKContract.HarnessV1Diagnostic;
```

## `harnessV1ErrorPartSchema`

Validate a failure part in an active harness stream.

```text
export declare const harnessV1ErrorPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "error";
        error: unknown;
    }, AiSdkError, never>;
};
```

## `harnessV1FileChangePartSchema`

Validate a harness stream update that reports file changes.

```text
export declare const harnessV1FileChangePartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "file-change";
        event: "create" | "modify" | "delete";
        path: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1FilePart`

```text
type HarnessV1FilePart = Omit<LanguageModelV4FilePart, 'providerOptions'>;
```

## `harnessV1FinishPartSchema`

Validate the terminal finish part of a harness stream.

```text
export declare const harnessV1FinishPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "finish";
        finishReason: import("@ai-sdk/provider").LanguageModelV4FinishReason;
        totalUsage: import("@ai-sdk/provider").LanguageModelV4Usage;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1FinishStepPartSchema`

Validate the part that reports completion of one step within a turn.

```text
export declare const harnessV1FinishStepPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "finish-step";
        finishReason: import("@ai-sdk/provider").LanguageModelV4FinishReason;
        usage: import("@ai-sdk/provider").LanguageModelV4Usage;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1JSONArray`

```text
interface HarnessV1JSONArray extends Array<HarnessV1JSONValue> {}
```

## `HarnessV1JSONObject`

```text
interface HarnessV1JSONObject {
  [key: string]: HarnessV1JSONValue | undefined;
}
```

## `HarnessV1JSONSchema`

```text
type HarnessV1JSONSchema = HarnessV1JSONObject;
```

## `HarnessV1JSONValue`

```text
type HarnessV1JSONValue =
  null | boolean | number | string | HarnessV1JSONArray | HarnessV1JSONObject;
```

## `HarnessV1LifecycleState`

```text
type HarnessV1LifecycleState =
  HarnessV1ResumeSessionState | HarnessV1ContinueTurnState;
```

## `HarnessV1Message`

```text
type HarnessV1Message =
  HarnessV1UserMessage | HarnessV1AssistantMessage | HarnessV1ToolMessage;
```

## `HarnessV1MessagePart`

```text
type HarnessV1MessagePart =
  | HarnessV1TextPart
  | HarnessV1FilePart
  | HarnessV1CustomPart
  | HarnessV1ReasoningPart
  | HarnessV1ReasoningFilePart
  | HarnessV1ToolCallPart
  | HarnessV1ToolResultPart
  | HarnessV1ToolApprovalResponsePart;
```

## `HarnessV1Metadata`

```text
type HarnessV1Metadata = Record<string, Record<string, JSONValue>>;
```

## `HarnessV1MintBridgeTokenCallback`

Callback shape retained for SDK settings that formerly supplied bridge tokens.

```text
export type HarnessV1MintBridgeTokenCallback = (sandboxId: string) => string;
```

## `HarnessV1NetworkPolicy`

```text
type HarnessV1NetworkPolicy =
  | {
      mode: 'allow-all';
    }
  | {
      mode: 'deny-all';
    }
  | {
      mode: 'custom';
      allowedHosts: ReadonlyArray<string>;
      allowedCIDRs?: ReadonlyArray<string>;
      deniedCIDRs?: ReadonlyArray<string>;
    }
  | {
      mode: 'custom';
      allowedHosts?: ReadonlyArray<string>;
      allowedCIDRs: ReadonlyArray<string>;
      deniedCIDRs?: ReadonlyArray<string>;
    };
```

## `HarnessV1NetworkSandboxSession`

Effect session handle including network endpoints and explicit stop and destroy operations.

This entry exports `NetworkSandboxSession` as `HarnessV1NetworkSandboxSession`.

```text
export type NetworkSandboxSession = ReturnType<typeof wrapNetworkSandbox>;
```

## `HarnessV1Observability`

Harness diagnostics configuration with a synchronous reporting hook.

```text
export type HarnessV1Observability = Omit<NativeObservability, 'report'> & {
    readonly report?: (event: HarnessV1Diagnostic) => void;
};
```

## `HarnessV1PendingToolApproval`

```text
type HarnessV1PendingToolApproval = {
  readonly approvalId: string;
  readonly toolCallId: string;
  readonly toolName: string;
  readonly input: string;
  readonly kind: 'builtin' | 'custom';
  readonly providerExecuted?: boolean;
  readonly nativeName?: string;
};
```

## `HarnessV1PendingToolResult`

```text
type HarnessV1PendingToolResult = {
  readonly toolCallId: string;
  readonly toolName: string;
  readonly input: string;
  readonly providerOptions?: ProviderOptions;
  readonly completedResult?: {
    readonly output: unknown;
    readonly isError?: boolean;
    readonly toolResult?: ToolResultPart;
  };
};
```

## `HarnessV1PermissionMode`

```text
type HarnessV1PermissionMode = 'allow-reads' | 'allow-edits' | 'allow-all';
```

## `HarnessV1PortEndpoint`

```text
type HarnessV1PortEndpoint = {
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
};
```

## `HarnessV1Prompt`

```text
type HarnessV1Prompt = string | UserModelMessage;
```

## `HarnessV1PromptControl`

Complete a turn only after the SDK finishes and the event consumer drains its queue.

```text
export type HarnessV1PromptControl<E = never> = Effect.Success<ReturnType<ReturnType<typeof bindTurn<NativePromptOptions>>>> & {
    readonly done: Effect.Effect<void, AiSdkError | E>;
};
```

## `HarnessV1PromptTurnOptions`

Begin a prompt turn with a sequential Effect event consumer.

```text
export type HarnessV1PromptTurnOptions<E = never, R = never> = Omit<NativePromptOptions, 'emit'> & EffectEmit<E, R>;
```

## `HarnessV1QuestionsTool`

Standard question tool definition from the built-in registry.

```text
export type HarnessV1QuestionsTool = (typeof HARNESS_V1_BUILTIN_TOOLS)['askUserQuestions'];
```

## `HarnessV1QuestionsToolInput`

```text
type HarnessV1QuestionsToolInput = z.infer<
  typeof harnessV1QuestionsToolInputSchema
>;
```

## `harnessV1QuestionsToolInputSchema`

Validate the question tool's native input before use.

```text
export declare const harnessV1QuestionsToolInputSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        allowPartialAnswers: boolean;
        questions: {
            id: string;
            question: string;
            header?: string | undefined;
            options?: {
                id: string;
                label: string;
                description?: string | undefined;
                preview?: string | undefined;
            }[] | undefined;
            allowMultiple?: boolean | undefined;
            allowFreeForm?: boolean | {
                secret: boolean;
            } | undefined;
        }[];
    }, AiSdkError, never>;
};
```

## `HarnessV1QuestionsToolOutput`

```text
type HarnessV1QuestionsToolOutput = z.infer<
  typeof harnessV1QuestionsToolOutputSchema
>;
```

## `harnessV1QuestionsToolOutputSchema`

Validate the native response format for answers to the question tool.

```text
export declare const harnessV1QuestionsToolOutputSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        action: "answered";
        answers: Record<string, {
            optionIds: string[];
            freeform?: string | undefined;
        }>;
    } | {
        action: "partially-answered";
        answers: Record<string, {
            optionIds: string[];
            freeform?: string | undefined;
        }>;
    } | {
        action: "declined";
    } | {
        action: "cancelled";
    }, AiSdkError, never>;
};
```

## `harnessV1RawPartSchema`

Validate a stream part that preserves provider-specific raw data.

```text
export declare const harnessV1RawPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "raw";
        rawValue: unknown;
    }, AiSdkError, never>;
};
```

## `HarnessV1ReadHistoryResult`

```text
type HarnessV1ReadHistoryResult = {
  readonly messages: ReadonlyArray<HarnessV1Message>;
  readonly cursor: string;
};
```

## `harnessV1ReasoningDeltaPartSchema`

Validate the incremental update for an active reasoning segment.

```text
export declare const harnessV1ReasoningDeltaPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "reasoning-delta";
        id: string;
        delta: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1ReasoningEndPartSchema`

Validate the closing boundary of a reasoning segment in the stream.

```text
export declare const harnessV1ReasoningEndPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "reasoning-end";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1ReasoningFilePart`

```text
type HarnessV1ReasoningFilePart = Omit<
  LanguageModelV4ReasoningFilePart,
  'providerOptions'
>;
```

## `HarnessV1ReasoningPart`

```text
type HarnessV1ReasoningPart = Omit<
  LanguageModelV4ReasoningPart,
  'providerOptions'
>;
```

## `harnessV1ReasoningStartPartSchema`

Validate the opening boundary of a reasoning segment in the stream.

```text
export declare const harnessV1ReasoningStartPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "reasoning-start";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1RequestTransformation`

```text
type HarnessV1RequestTransformation = {
  readonly match: {
    readonly host: string;
    readonly path?: HarnessV1RequestTransformationPathMatcher;
    readonly method?: ReadonlyArray<string>;
    readonly queryString?: ReadonlyArray<HarnessV1RequestTransformationKeyValueMatcher>;
    readonly headers?: ReadonlyArray<HarnessV1RequestTransformationKeyValueMatcher>;
  };
  readonly transform: {
    readonly headers: Readonly<Record<string, string>>;
  };
};
```

## `HarnessV1RequestTransformationSources`

```text
type HarnessV1RequestTransformationSources<AuthenticationMode> = {
  env: Record<string, string>;
  sandboxEnv: Record<string, string>;
  auth: AuthenticationMode;
};
```

## `HarnessV1ResponseFormat`

```text
type HarnessV1ResponseFormat =
  | {
      readonly type: 'text';
    }
  | {
      readonly type: 'json';
      readonly schema?: HarnessV1JSONSchema;
      readonly name?: string;
      readonly description?: string;
    };
```

## `HarnessV1ResumeSessionState`

```text
type HarnessV1ResumeSessionState = HarnessV1LifecycleStateBase & {
  readonly type: 'resume-session';
  readonly continueFrom?: HarnessV1ContinueTurnState;
};
```

## `HarnessV1SandboxProvider`

Effect sandbox provider with native identity and scoped session acquisition.

```text
export type HarnessV1SandboxProvider = ReturnType<typeof import('./internal/sandbox.js').wrapSandboxProvider>;
```

## `HarnessV1SandboxSessionCreateOptions`

Extend provider-specific settings with an optional session ID, prepared template, and cancellation signal.

```text
export type HarnessV1SandboxSessionCreateOptions<T extends object, R = never, E = never> = T & {
    readonly sandboxId?: string;
    readonly template?: import('./internal/sandbox.js').SandboxTemplate<R, E>;
    readonly abortSignal?: AbortSignal;
};
```

## `HarnessV1SandboxSessionResumeOptions`

```text
type HarnessV1SandboxSessionResumeOptions<TProviderOptions extends object> =
  TProviderOptions & {
    readonly sandboxId: string;
    readonly abortSignal?: AbortSignal;
  };
```

## `HarnessV1SandboxTemplate`

Named preparation routine for initializing a sandbox through Effect operations.

This entry exports `SandboxTemplate` as `HarnessV1SandboxTemplate`.

```text
export type SandboxTemplate<R = never, E = never> = {
    readonly identity: string;
    readonly prepare: (options: WithAbort & {
        session: SandboxSession;
    }) => Effect.Effect<void, E, R>;
};
```

## `HarnessV1Session`

Scoped session handle. A successful detach, stop, or destroy closes the session.

```text
export type HarnessV1Session = ReturnType<typeof wrapSession>;
```

## `HarnessV1Skill`

```text
type HarnessV1Skill = {
  readonly name: string;
  readonly description: string;
  readonly content: string;
  readonly files?: ReadonlyArray<HarnessV1SkillFile>;
};
```

## `HarnessV1StartOptions`

Supply a registered sandbox session for native harness startup or resumption.

```text
export type HarnessV1StartOptions = Omit<NativeStartOptions, 'sandboxSession' | 'observability'> & {
    readonly sandboxSession: SandboxSession;
    readonly observability?: HarnessV1Observability;
};
```

## `HarnessV1StreamPart`

```text
type HarnessV1StreamPart =
  | {
      type: 'stream-start';
      warnings?: ReadonlyArray<HarnessV1CallWarning>;
      modelId?: string;
    }
  | {
      type: 'text-start';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'text-delta';
      id: string;
      delta: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'text-end';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'reasoning-start';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'reasoning-delta';
      id: string;
      delta: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'reasoning-end';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | Extract<
      LanguageModelV4StreamPart,
      {
        type: 'tool-input-start';
      }
    >
  | Extract<
      LanguageModelV4StreamPart,
      {
        type: 'tool-input-delta';
      }
    >
  | Extract<
      LanguageModelV4StreamPart,
      {
        type: 'tool-input-end';
      }
    >
  | (LanguageModelV4ToolCall & {
      nativeName?: string;
    })
  | LanguageModelV4ToolApprovalRequest
  | LanguageModelV4ToolResult
  | {
      type: 'finish-step';
      finishReason: LanguageModelV4FinishReason;
      usage: LanguageModelV4Usage;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'finish';
      finishReason: LanguageModelV4FinishReason;
      totalUsage: LanguageModelV4Usage;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'file-change';
      event: 'create' | 'modify' | 'delete';
      path: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'compaction';
      trigger: 'manual' | 'auto';
      summary: string;
      tokensBefore?: number;
      tokensAfter?: number;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'error';
      error: unknown;
    }
  | {
      type: 'raw';
      rawValue: unknown;
    };
```

## `harnessV1StreamPartSchema`

Validate a harness stream part against the full native event union.

```text
export declare const harnessV1StreamPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "stream-start";
        warnings?: readonly SDKContract.HarnessV1CallWarning[] | undefined;
        modelId?: string | undefined;
    } | {
        type: "text-start";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "text-delta";
        id: string;
        delta: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "text-end";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "reasoning-start";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "reasoning-delta";
        id: string;
        delta: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "reasoning-end";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "tool-input-start";
        id: string;
        toolName: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        providerExecuted?: boolean | undefined;
        dynamic?: boolean | undefined;
        title?: string | undefined;
    } | {
        type: "tool-input-delta";
        id: string;
        delta: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "tool-input-end";
        id: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "tool-call";
        toolCallId: string;
        toolName: string;
        input: string;
        providerExecuted?: boolean | undefined;
        dynamic?: boolean | undefined;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        nativeName?: string | undefined;
    } | {
        type: "tool-approval-request";
        approvalId: string;
        toolCallId: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "tool-result";
        toolCallId: string;
        toolName: string;
        result: NonNullable<import("@ai-sdk/provider").JSONValue>;
        isError?: boolean | undefined;
        preliminary?: boolean | undefined;
        dynamic?: boolean | undefined;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    } | {
        type: "finish-step";
        finishReason: import("@ai-sdk/provider").LanguageModelV4FinishReason;
        usage: import("@ai-sdk/provider").LanguageModelV4Usage;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "finish";
        finishReason: import("@ai-sdk/provider").LanguageModelV4FinishReason;
        totalUsage: import("@ai-sdk/provider").LanguageModelV4Usage;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "file-change";
        event: "create" | "modify" | "delete";
        path: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "compaction";
        trigger: "manual" | "auto";
        summary: string;
        tokensBefore?: number | undefined;
        tokensAfter?: number | undefined;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    } | {
        type: "error";
        error: unknown;
    } | {
        type: "raw";
        rawValue: unknown;
    }, AiSdkError, never>;
};
```

## `harnessV1StreamStartPartSchema`

Validate the initial marker for a harness stream.

```text
export declare const harnessV1StreamStartPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "stream-start";
        warnings?: readonly SDKContract.HarnessV1CallWarning[] | undefined;
        modelId?: string | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1TextDeltaPartSchema`

Validate the incremental update for an active text segment.

```text
export declare const harnessV1TextDeltaPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "text-delta";
        id: string;
        delta: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1TextEndPartSchema`

Validate the closing boundary of a text segment in the stream.

```text
export declare const harnessV1TextEndPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "text-end";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1TextPart`

```text
type HarnessV1TextPart = Omit<LanguageModelV4TextPart, 'providerOptions'>;
```

## `harnessV1TextStartPartSchema`

Validate the opening boundary of a text segment in the stream.

```text
export declare const harnessV1TextStartPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "text-start";
        id: string;
        harnessMetadata?: SDKContract.HarnessV1Metadata | undefined;
    }, AiSdkError, never>;
};
```

## `harnessV1ToolApprovalRequestPartSchema`

Validate the stream part asking the host to approve a pending tool call.

```text
export declare const harnessV1ToolApprovalRequestPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-approval-request";
        approvalId: string;
        toolCallId: string;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1ToolApprovalResponsePart`

```text
type HarnessV1ToolApprovalResponsePart = Omit<
  LanguageModelV4ToolApprovalResponsePart,
  'providerOptions'
>;
```

## `HarnessV1ToolCallPart`

```text
type HarnessV1ToolCallPart = Omit<
  LanguageModelV4ToolCallPart,
  'providerOptions'
> & {
  nativeName?: string;
};
```

## `harnessV1ToolCallPartSchema`

Validate a tool invocation in the harness stream.

```text
export declare const harnessV1ToolCallPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-call";
        toolCallId: string;
        toolName: string;
        input: string;
        providerExecuted?: boolean | undefined;
        dynamic?: boolean | undefined;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        nativeName?: string | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1ToolMessage`

```text
type HarnessV1ToolMessage = {
  readonly role: 'tool';
  readonly content: Array<
    HarnessV1ToolResultPart | HarnessV1ToolApprovalResponsePart
  >;
  readonly at?: string;
  readonly harnessMetadata?: HarnessV1Metadata;
};
```

## `HarnessV1ToolResultOutput`

```text
type HarnessV1ToolResultOutput =
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'text';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'json';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'execution-denied';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'error-text';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'error-json';
        }
      >,
      'providerOptions'
    >
  | {
      type: 'content';
      value: Array<
        | Omit<
            Extract<
              LanguageModelV4ToolResultContentPart,
              {
                type: 'text';
              }
            >,
            'providerOptions'
          >
        | Omit<
            Extract<
              LanguageModelV4ToolResultContentPart,
              {
                type: 'file';
              }
            >,
            'providerOptions'
          >
        | Omit<
            Extract<
              LanguageModelV4ToolResultContentPart,
              {
                type: 'custom';
              }
            >,
            'providerOptions'
          >
      >;
    };
```

## `HarnessV1ToolResultPart`

```text
type HarnessV1ToolResultPart = Omit<
  LanguageModelV4ToolResultPart,
  'output' | 'providerOptions'
> & {
  output: HarnessV1ToolResultOutput;
};
```

## `harnessV1ToolResultPartSchema`

Validate an execution result for a tool invocation in the harness stream.

```text
export declare const harnessV1ToolResultPartSchema: {
    jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => import("effect/Effect").Effect<{
        type: "tool-result";
        toolCallId: string;
        toolName: string;
        result: NonNullable<import("@ai-sdk/provider").JSONValue>;
        isError?: boolean | undefined;
        preliminary?: boolean | undefined;
        dynamic?: boolean | undefined;
        providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
    }, AiSdkError, never>;
};
```

## `HarnessV1ToolSpec`

```text
type HarnessV1ToolSpec = {
  readonly name: string;
  readonly description?: string;
  readonly inputSchema?: JSONSchema7;
};
```

## `HarnessV1TurnSettings`

```text
type HarnessV1TurnSettings = {
  readonly model?: string;
  readonly skills: ReadonlyArray<HarnessV1Skill>;
  readonly instructions?: string;
  readonly tools: ReadonlyArray<HarnessV1ToolSpec>;
};
```

## `HarnessV1UserMessage`

```text
type HarnessV1UserMessage = {
  readonly role: 'user';
  readonly content: Array<HarnessV1TextPart | HarnessV1FilePart>;
  readonly at?: string;
  readonly harnessMetadata?: HarnessV1Metadata;
};
```

## `isHarnessV1BuiltinToolIncluded`

Check whether the native tool selection permits the supplied built-in tool.

```text
export declare const isHarnessV1BuiltinToolIncluded: (...args: Parameters<typeof sdk.isHarnessV1BuiltinToolIncluded>) => boolean;
```
