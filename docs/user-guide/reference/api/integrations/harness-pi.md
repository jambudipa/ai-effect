---
title: "Integration API — harness-pi"
doc-type: reference
sources: [src/integrations/harness-pi.ts, package.json]
---

# harness-pi

> **TL;DR:** The `@jambudipa/ai-effect/harness-pi` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-pi`

## `createPi`

Construct Pi without a callback scope when no storage or extension factory is supplied.
Construct Pi with a scope that owns the supplied storage and extension callbacks.

```text
export declare function createPi(settings?: PiHarnessSettings & {
    readonly sessionStorage?: never;
    readonly extensionFactories?: never;
}): Effect.Effect<PiHarness, AiSdkError>;

export declare function createPi<E = never, R = never>(settings?: PiHarnessSettings<E, R>): Effect.Effect<PiHarness, AiSdkError, Scope | R>;
```

## `pi`

Resolve the SDK's default Pi harness when the Effect runs.

```text
export declare const pi: Effect.Effect<{
    doStart: (options: import("./internal/harness.js").HarnessV1StartOptions) => Effect.Effect<{
        doDetach: Effect.Effect<import("./harness.js").HarnessV1ResumeSessionState, AiSdkError, never>;
        doStop: Effect.Effect<import("./harness.js").HarnessV1ResumeSessionState, AiSdkError, never>;
        doDestroy: Effect.Effect<void, AiSdkError, never>;
        doReadHistory?: (options: Parameters<(options: {
            readonly since?: string;
        }) => PromiseLike<import("./harness.js").HarnessV1ReadHistoryResult>>[0]) => Effect.Effect<import("./harness.js").HarnessV1ReadHistoryResult, AiSdkError, never>;
        sessionId: string;
        isResume: boolean;
        doPromptTurn: <E, R>(options: Omit<import("./internal/harness-contracts/harness.js").HarnessV1PromptTurnOptions, "emit"> & {
            readonly emit: (event: import("./harness.js").HarnessV1StreamPart) => Effect.Effect<void, E, R>;
        }) => Effect.Effect<{
            done: Effect.Effect<void, AiSdkError | E, never>;
            submitUserMessage?: (text: string) => Effect.Effect<void, AiSdkError, never>;
            submitToolApproval?: (input: Parameters<(input: {
                approvalId: string;
                approved: boolean;
                reason?: string;
            }) => PromiseLike<void>>[0]) => Effect.Effect<void, AiSdkError, never>;
            submitToolResult: (input: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1PromptControl["submitToolResult"]>[0]) => Effect.Effect<void, AiSdkError, never>;
        }, AiSdkError, Scope | R>;
        doContinueTurn: <E, R>(options: Omit<import("./internal/harness-contracts/harness.js").HarnessV1ContinueTurnOptions, "emit"> & {
            readonly emit: (event: import("./harness.js").HarnessV1StreamPart) => Effect.Effect<void, E, R>;
        }) => Effect.Effect<{
            done: Effect.Effect<void, AiSdkError | E, never>;
            submitUserMessage?: (text: string) => Effect.Effect<void, AiSdkError, never>;
            submitToolApproval?: (input: Parameters<(input: {
                approvalId: string;
                approved: boolean;
                reason?: string;
            }) => PromiseLike<void>>[0]) => Effect.Effect<void, AiSdkError, never>;
            submitToolResult: (input: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1PromptControl["submitToolResult"]>[0]) => Effect.Effect<void, AiSdkError, never>;
        }, AiSdkError, Scope | R>;
        doSuspendTurn: Effect.Effect<import("./harness.js").HarnessV1ContinueTurnState, AiSdkError, never>;
        doCompact: (instructions?: string) => Effect.Effect<void, AiSdkError, never>;
    }, AiSdkError, Scope>;
    getBootstrap?: (options?: {
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("./harness.js").HarnessV1Bootstrap, AiSdkError, never>;
    lifecycleStateSchema?: {
        jsonSchema: Effect.Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
        validate: (input: unknown) => Effect.Effect<unknown, AiSdkError, never>;
    };
    supportsBuiltinToolFiltering?: boolean;
    supportsBuiltinToolApprovals?: boolean;
    specificationVersion: "harness-v1";
    harnessId: string;
    builtinTools: import("./internal/sdk-tool.js").WrappedTools<{
        readonly read: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            file_path: string;
            offset?: number | undefined;
            limit?: number | undefined;
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
            timeout?: number | undefined;
        }, unknown>;
        readonly grep: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            pattern: string;
            path?: string | undefined;
            glob?: string | undefined;
            ignoreCase?: boolean | undefined;
            literal?: boolean | undefined;
            context?: number | undefined;
            limit?: number | undefined;
        }, unknown>;
        readonly glob: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool<{
            pattern: string;
            path?: string | undefined;
            limit?: number | undefined;
        }, unknown>;
        readonly ls: import("./internal/harness-contracts/harness.js").HarnessV1BuiltinTool;
    }>;
}, AiSdkError, never>;
```

## `PiAuthenticationMode`

```text
type PiAuthenticationMode = HarnessV1Authentication<
  'openai' | 'anthropic' | 'custom'
>;
```

## `PiCredentialStore`

```text
type PiCredentialStore = NonNullable<CreateModelRuntimeOptions['credentials']>;
```

## `PiFileToolPathPolicy`

```text
interface PiFileToolPathPolicy {
  readonly readableRoots?: ReadonlyArray<string>;
  readonly writableRoots?: ReadonlyArray<string>;
  readonly deniedRoots?: ReadonlyArray<string>;
}
```

## `PiHarnessExtensionFactory`

Register an extension with the native Pi API and a wrapped session in the owning Effect scope.

```text
export type PiHarnessExtensionFactory<E = never, R = never> = (pi: ExtensionAPI, session: PiHarnessExtensionSession) => Effect.Effect<void, E, R>;
```

## `PiHarnessExtensionSession`

Context passed to an Effect extension factory during setup of a Pi session.

```text
export interface PiHarnessExtensionSession {
    /** Use the wrapped sandbox when an extension needs session file or process operations. */
    readonly sandboxSession: SandboxSession;
    /** Working directory reported by the SDK for this Pi extension session. */
    readonly sessionWorkDir: SDKContract.PiHarnessExtensionSession['sessionWorkDir'];
    /** Read the native session instructions lazily while retaining the SDK's tagged failure. */
    readonly instructions: Effect.Effect<string | undefined, AiSdkError>;
}
```

## `PiHarnessSettings`

Configure Pi with optional Effect storage and native or Effect extension factories.

```text
export type PiHarnessSettings<E = never, R = never> = Omit<SDKContract.PiHarnessSettings, 'sessionStorage' | 'extensionFactories'> & {
    readonly sessionStorage?: PiSessionStorage<E, R>;
    readonly extensionFactories?: ReadonlyArray<PiHarnessExtensionFactory<E, R> | ExtensionFactory>;
};
```

## `PiMcpExposure`

```text
type PiMcpExposure = Exclude<McpExposure, 'codemode'>;
```

## `PiMcpServerConfig`

```text
type PiMcpServerConfig = McpServerConfig extends infer Config
  ? Config extends McpServerConfig
    ? Omit<Config, 'exposure' | 'toolExposure'> & {
        readonly exposure?: PiMcpExposure;
        readonly toolExposure?: Readonly<Record<string, PiMcpExposure>>;
      }
    : never
  : never;
```

## `PiResources`

```text
interface PiResources {
  readonly skills?: ReadonlyArray<PiSandboxSkill>;
}
```

## `PiSandboxSkill`

```text
interface PiSandboxSkill {
  readonly name: string;
  readonly description: string;
  readonly filePath: string;
}
```

## `PiSessionStorage`

Append, read, or optionally batch session entries through Effect callbacks.

```text
export type PiSessionStorage<E = never, R = never> = WithEffectCallbacks<SDKContract.PiSessionStorage, 'append' | 'appendMany' | 'read', E, R>;
```

## `VERSION`

Version reported by the pinned native Pi adapter.

```text
export declare const VERSION: string;
```
