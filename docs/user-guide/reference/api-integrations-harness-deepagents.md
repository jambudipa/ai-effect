---
title: "Integration API — harness-deepagents"
doc-type: reference
sources: [src/integrations/harness-deepagents.ts, package.json]
---

# harness-deepagents

> **TL;DR:** The `@jambudipa/ai-effect/harness-deepagents` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-deepagents`

## `createDeepAgents`

Construct a Deep Agents harness in a scope that owns any credential forwarding callbacks.

```text
export declare const createDeepAgents: <R = never, E = never>(settings?: DeepAgentsHarnessSettings<R, E>) => import("effect/Effect").Effect<{
    doStart: (options: import("./internal/harness.js").HarnessV1StartOptions) => import("effect/Effect").Effect<{
        doDetach: import("effect/Effect").Effect<import("./harness.js").HarnessV1ResumeSessionState, import("../internal/operation.js").AiSdkError, never>;
        doStop: import("effect/Effect").Effect<import("./harness.js").HarnessV1ResumeSessionState, import("../internal/operation.js").AiSdkError, never>;
        doDestroy: import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
        doReadHistory?: (options: Parameters<(options: {
            readonly since?: string;
        }) => PromiseLike<import("./harness.js").HarnessV1ReadHistoryResult>>[0]) => import("effect/Effect").Effect<import("./harness.js").HarnessV1ReadHistoryResult, import("../internal/operation.js").AiSdkError, never>;
        sessionId: string;
        isResume: boolean;
        doPromptTurn: <E_1, R_1>(options: Omit<import("./internal/harness-contracts/harness.js").HarnessV1PromptTurnOptions, "emit"> & {
            readonly emit: (event: import("./harness.js").HarnessV1StreamPart) => import("effect/Effect").Effect<void, E_1, R_1>;
        }) => import("effect/Effect").Effect<{
            done: import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError | E_1, never>;
            submitUserMessage?: (text: string) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolApproval?: (input: Parameters<(input: {
                approvalId: string;
                approved: boolean;
                reason?: string;
            }) => PromiseLike<void>>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolResult: (input: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1PromptControl["submitToolResult"]>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R_1>;
        doContinueTurn: <E_1, R_1>(options: Omit<import("./internal/harness-contracts/harness.js").HarnessV1ContinueTurnOptions, "emit"> & {
            readonly emit: (event: import("./harness.js").HarnessV1StreamPart) => import("effect/Effect").Effect<void, E_1, R_1>;
        }) => import("effect/Effect").Effect<{
            done: import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError | E_1, never>;
            submitUserMessage?: (text: string) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolApproval?: (input: Parameters<(input: {
                approvalId: string;
                approved: boolean;
                reason?: string;
            }) => PromiseLike<void>>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolResult: (input: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1PromptControl["submitToolResult"]>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R_1>;
        doSuspendTurn: import("effect/Effect").Effect<import("./harness.js").HarnessV1ContinueTurnState, import("../internal/operation.js").AiSdkError, never>;
        doCompact: (instructions?: string) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    getBootstrap?: (options?: {
        abortSignal?: AbortSignal;
    }) => import("effect/Effect").Effect<import("./harness.js").HarnessV1Bootstrap, import("../internal/operation.js").AiSdkError, never>;
    lifecycleStateSchema?: {
        jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, import("../internal/operation.js").AiSdkError, never>;
        validate: (input: unknown) => import("effect/Effect").Effect<unknown, import("../internal/operation.js").AiSdkError, never>;
    };
    supportsBuiltinToolFiltering?: boolean;
    supportsBuiltinToolApprovals?: boolean;
    specificationVersion: "harness-v1";
    harnessId: string;
    builtinTools: import("./internal/sdk-tool.js").WrappedTools<{
        readonly read: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
        }, unknown>;
        readonly write: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
            content: string;
        }, unknown>;
        readonly edit: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
            old_string: string;
            new_string: string;
        }, unknown>;
        readonly bash: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            command: string;
        }, unknown>;
        readonly grep: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            pattern: string;
        }, unknown>;
        readonly glob: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            pattern: string;
        }, unknown>;
        readonly delete: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
        }, any>;
        readonly ls: import("ai").Tool<{
            path?: string | undefined;
        }, any, any>;
        readonly task: import("ai").Tool<{
            description?: string | undefined;
            subagent_type?: string | undefined;
        }, any, any>;
        readonly write_todos: import("ai").Tool<{
            todos?: unknown[] | undefined;
        }, any, any>;
    }>;
}, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R>;
```

## `deepAgents`

Resolve the SDK's default Deep Agents harness when the Effect runs.

```text
export declare const deepAgents: import("effect/Effect").Effect<{
    doStart: (options: import("./internal/harness.js").HarnessV1StartOptions) => import("effect/Effect").Effect<{
        doDetach: import("effect/Effect").Effect<import("./harness.js").HarnessV1ResumeSessionState, import("../internal/operation.js").AiSdkError, never>;
        doStop: import("effect/Effect").Effect<import("./harness.js").HarnessV1ResumeSessionState, import("../internal/operation.js").AiSdkError, never>;
        doDestroy: import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
        doReadHistory?: (options: Parameters<(options: {
            readonly since?: string;
        }) => PromiseLike<import("./harness.js").HarnessV1ReadHistoryResult>>[0]) => import("effect/Effect").Effect<import("./harness.js").HarnessV1ReadHistoryResult, import("../internal/operation.js").AiSdkError, never>;
        sessionId: string;
        isResume: boolean;
        doPromptTurn: <E, R>(options: Omit<import("./internal/harness-contracts/harness.js").HarnessV1PromptTurnOptions, "emit"> & {
            readonly emit: (event: import("./harness.js").HarnessV1StreamPart) => import("effect/Effect").Effect<void, E, R>;
        }) => import("effect/Effect").Effect<{
            done: import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError | E, never>;
            submitUserMessage?: (text: string) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolApproval?: (input: Parameters<(input: {
                approvalId: string;
                approved: boolean;
                reason?: string;
            }) => PromiseLike<void>>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolResult: (input: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1PromptControl["submitToolResult"]>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R>;
        doContinueTurn: <E, R>(options: Omit<import("./internal/harness-contracts/harness.js").HarnessV1ContinueTurnOptions, "emit"> & {
            readonly emit: (event: import("./harness.js").HarnessV1StreamPart) => import("effect/Effect").Effect<void, E, R>;
        }) => import("effect/Effect").Effect<{
            done: import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError | E, never>;
            submitUserMessage?: (text: string) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolApproval?: (input: Parameters<(input: {
                approvalId: string;
                approved: boolean;
                reason?: string;
            }) => PromiseLike<void>>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
            submitToolResult: (input: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1PromptControl["submitToolResult"]>[0]) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R>;
        doSuspendTurn: import("effect/Effect").Effect<import("./harness.js").HarnessV1ContinueTurnState, import("../internal/operation.js").AiSdkError, never>;
        doCompact: (instructions?: string) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    getBootstrap?: (options?: {
        abortSignal?: AbortSignal;
    }) => import("effect/Effect").Effect<import("./harness.js").HarnessV1Bootstrap, import("../internal/operation.js").AiSdkError, never>;
    lifecycleStateSchema?: {
        jsonSchema: import("effect/Effect").Effect<import("json-schema").JSONSchema7, import("../internal/operation.js").AiSdkError, never>;
        validate: (input: unknown) => import("effect/Effect").Effect<unknown, import("../internal/operation.js").AiSdkError, never>;
    };
    supportsBuiltinToolFiltering?: boolean;
    supportsBuiltinToolApprovals?: boolean;
    specificationVersion: "harness-v1";
    harnessId: string;
    builtinTools: import("./internal/sdk-tool.js").WrappedTools<{
        readonly read: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
        }, unknown>;
        readonly write: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
            content: string;
        }, unknown>;
        readonly edit: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
            old_string: string;
            new_string: string;
        }, unknown>;
        readonly bash: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            command: string;
        }, unknown>;
        readonly grep: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            pattern: string;
        }, unknown>;
        readonly glob: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            pattern: string;
        }, unknown>;
        readonly delete: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
        }, any>;
        readonly ls: import("ai").Tool<{
            path?: string | undefined;
        }, any, any>;
        readonly task: import("ai").Tool<{
            description?: string | undefined;
            subagent_type?: string | undefined;
        }, any, any>;
        readonly write_todos: import("ai").Tool<{
            todos?: unknown[] | undefined;
        }, any, any>;
    }>;
}, import("../internal/operation.js").AiSdkError, never>;
```

## `DeepAgentsAuthenticationMode`

```text
type DeepAgentsAuthenticationMode = HarnessV1Authentication<'anthropic'>;
```

## `DeepAgentsHarnessSettings`

Deep Agents settings with optional credential forwarding in the Effect context.

```text
export type DeepAgentsHarnessSettings<R = never, E = never> = WithCredentialForwarding<SDKContract.DeepAgentsHarnessSettings, R, E>;
```

## `DeepAgentsThinkingConfig`

```text
type DeepAgentsThinkingConfig =
  | {
      readonly type: 'adaptive';
      readonly display?: 'summarized' | 'omitted';
    }
  | {
      readonly type: 'enabled';
      readonly budget_tokens: number;
      readonly display?: 'summarized' | 'omitted';
    }
  | {
      readonly type: 'disabled';
    };
```

## `VERSION`

Version reported by the native Deep Agents adapter.

```text
export declare const VERSION: string;
```

