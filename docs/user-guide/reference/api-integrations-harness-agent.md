---
title: "Integration API — harness/agent"
doc-type: reference
sources: [src/integrations/harness/agent.ts, package.json]
---

# harness/agent

> **TL;DR:** The `@jambudipa/ai-effect/harness/agent` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness/agent`

## `collectHarnessAgentToolApprovalContinuations`

Derive pending approval continuation data from the SDK's message representation.

```text
export declare const collectHarnessAgentToolApprovalContinuations: (...args: Parameters<typeof sdk.collectHarnessAgentToolApprovalContinuations>) => Effect.Effect<readonly import("ai").ToolApprovalResponse[], AiSdkError, never>;
```

## `collectHarnessAgentToolResultContinuations`

Derive pending tool-result continuation data from the SDK's message representation.

```text
export declare const collectHarnessAgentToolResultContinuations: (...args: Parameters<typeof sdk.collectHarnessAgentToolResultContinuations>) => Effect.Effect<readonly import("ai").ToolResultPart[], AiSdkError, never>;
```

## `createFileReporter`

Create a native file reporter with Effect telemetry and diagnostic ingestion operations.

```text
export declare const createFileReporter: (...args: Parameters<typeof sdk.createFileReporter>) => Effect.Effect<FileReporter, AiSdkError>;
```

## `createHarnessSandboxTemplate`

Ask the SDK for one combined template and wrap it when the configured harnesses provide one.

```text
export declare const createHarnessSandboxTemplate: <E = never, R = never>(options: TemplateOptions<E, R>) => Effect.Effect<SandboxTemplate<never, AiSdkError> | undefined, AiSdkError, Scope | R>;
```

## `createTraceTreeReporter`

Render traces with the SDK and run an optional custom write Effect in the reporter's scope.

```text
export declare const createTraceTreeReporter: <E = never, R = never>(options?: TraceTreeReporterOptions<E, R>) => Effect.Effect<EffectTelemetry, AiSdkError, Scope | R>;
```

## `FileReporter`

File-backed telemetry integration that can also receive harness diagnostic events.

```text
export type FileReporter = EffectTelemetry & HarnessDiagnosticConsumer;
```

## `FileReporterOptions`

A harness observability reporter that writes a unified, non-lossy
`events.jsonl` containing **both** the telemetry span lifecycle (turn / step
/ tool) **and** the forwarded bridge diagnostics (console lines + structured
events). It is a single object registered in `telemetry.integrations`: the
framework drives its `Telemetry` methods for spans and calls
`ingestDiagnostic` for diagnostics.

No external collector or OTel setup required — this is the AI-SDK-idiomatic
replacement for the original SDK's host-side artifact files.

```text
interface FileReporterOptions {
  /** Directory for `events.jsonl` (created if absent). */
  dir: string;
  /**
   * Buffer a turn's records in memory and write them only if the turn produced
   * an error (an `error`-level diagnostic, a failed tool, or an error finish).
   * Default false (write everything).
   */
  failOnly?: boolean;
  /** File name within `dir`. Default `events.jsonl`. */
  fileName?: string;
}
```

## `getHarnessErrorMessage`

Obtain the SDK's diagnostic message for a harness failure through the tagged boundary.

```text
export declare const getHarnessErrorMessage: (...args: Parameters<typeof sdk.getHarnessErrorMessage>) => Effect.Effect<string, AiSdkError, never>;
```

## `HarnessAgent`

A harness agent whose native sessions and streaming results stay private.

```text
/** A harness agent whose native sessions and streaming results stay private. */
export declare class HarnessAgent<A = unknown, P = A, I = unknown> {
    private constructor();
    /** Create the agent lazily and retain the scope required by constructor callbacks and tools. */
    static make<T extends EffectTools = {}, E = never, R = never, A = unknown, P = A, I = unknown>(settings: HarnessAgentSettings<T, E, R, A, P, I>): Effect.Effect<HarnessAgent<A, P, I>, AiSdkError, Scope | R | import("../../internal/tool.js").ToolRequirements<T[keyof T]>>;
    /** Version discriminator reported by the SDK harness agent. */
    get version(): "agent-v1";
    /** Optional identifier configured for this agent instance. */
    get id(): string | undefined;
    /** ID of the selected harness adapter, independent of the agent ID. */
    get harnessId(): string;
    /** Indicates whether the agent exposes a structured output specification. */
    get hasOutput(): boolean;
    /** Adapt native built-in and configured tools for Effect callers by native tool key. */
    get tools(): import("../internal/sdk-tool.js").WrappedTools<sdk.HarnessAllTools<NativeHarness, ToolSet>>;
    /** Read the SDK's optional sandbox template and wrap its preparation operation. */
    getSandboxTemplate(): Effect.Effect<SandboxTemplate<never, AiSdkError> | undefined, AiSdkError, never>;
    /** Acquire a session and destroy it at scope exit unless explicit closure already succeeded. */
    createSession(options?: SessionOptions): Effect.Effect<HarnessAgentSession, AiSdkError, Scope>;
    /** Run a complete turn with a registered session and expose structured output as an Effect. */
    generate(options: GenerateOptions): Effect.Effect<{
        content: import("ai").ContentPart<sdk.HarnessAllTools<NativeHarness, ToolSet>>[];
        text: string;
        reasoning: (import("ai").ReasoningOutput | import("ai").ReasoningFileOutput)[];
        reasoningText: string | undefined;
        files: import("ai").GeneratedFile[];
        sources: import("@ai-sdk/provider").LanguageModelV4Source[];
        toolCalls: import("ai").TypedToolCall<sdk.HarnessAllTools<NativeHarness, ToolSet>>[];
        staticToolCalls: ({
            type: "tool-call";
            toolCallId: string;
            providerExecuted?: boolean;
            providerMetadata?: import("ai").ProviderMetadata;
            toolMetadata?: import("@ai-sdk/provider").JSONObject;
        } & {
            toolName: string;
            input: any;
            dynamic?: false | undefined;
            invalid?: false | undefined;
            error?: never;
            title?: string;
        })[];
        dynamicToolCalls: import("ai").DynamicToolCall[];
        toolResults: import("ai").TypedToolResult<sdk.HarnessAllTools<NativeHarness, ToolSet>>[];
        staticToolResults: {
            type: "tool-result";
            toolCallId: string;
            toolName: string;
            input: any;
            output: any;
            providerExecuted?: boolean;
            providerMetadata?: import("ai").ProviderMetadata;
            toolMetadata?: import("@ai-sdk/provider").JSONObject;
            dynamic?: false | undefined;
            preliminary?: boolean;
            title?: string;
        }[];
        dynamicToolResults: import("ai").DynamicToolResult[];
        finishReason: import("ai").FinishReason;
        rawFinishReason: string | undefined;
        usage: import("ai").LanguageModelUsage;
        totalUsage: import("ai").LanguageModelUsage;
        warnings: import("ai").CallWarning[] | undefined;
        steps: import("ai").StepResult<sdk.HarnessAllTools<NativeHarness, ToolSet>, RuntimeContext>[];
        request: import("ai").LanguageModelRequestMetadata;
        response: import("ai").LanguageModelResponseMetadata;
        providerMetadata: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        output: Effect.Effect<A, AiSdkError, never>;
    }, AiSdkError, never>;
    /** Begin native output streaming in an operation scope tied to the caller's cancellation signal. */
    stream(options: StreamOptions): Effect.Effect<TextStreamResult<sdk.HarnessAllTools<NativeHarness, ToolSet>, RuntimeContext, OutputInterface<A, P, I>, import("ai").StreamTextResult<sdk.HarnessAllTools<NativeHarness, ToolSet>, RuntimeContext, OutputInterface<A, P, I>>>, AiSdkError, Scope>;
    /** Continue an incomplete turn to a complete result, with deferred structured output access. */
    continueGenerate(options: ContinueOptions): Effect.Effect<{
        content: import("ai").ContentPart<sdk.HarnessAllTools<NativeHarness, ToolSet>>[];
        text: string;
        reasoning: (import("ai").ReasoningOutput | import("ai").ReasoningFileOutput)[];
        reasoningText: string | undefined;
        files: import("ai").GeneratedFile[];
        sources: import("@ai-sdk/provider").LanguageModelV4Source[];
        toolCalls: import("ai").TypedToolCall<sdk.HarnessAllTools<NativeHarness, ToolSet>>[];
        staticToolCalls: ({
            type: "tool-call";
            toolCallId: string;
            providerExecuted?: boolean;
            providerMetadata?: import("ai").ProviderMetadata;
            toolMetadata?: import("@ai-sdk/provider").JSONObject;
        } & {
            toolName: string;
            input: any;
            dynamic?: false | undefined;
            invalid?: false | undefined;
            error?: never;
            title?: string;
        })[];
        dynamicToolCalls: import("ai").DynamicToolCall[];
        toolResults: import("ai").TypedToolResult<sdk.HarnessAllTools<NativeHarness, ToolSet>>[];
        staticToolResults: {
            type: "tool-result";
            toolCallId: string;
            toolName: string;
            input: any;
            output: any;
            providerExecuted?: boolean;
            providerMetadata?: import("ai").ProviderMetadata;
            toolMetadata?: import("@ai-sdk/provider").JSONObject;
            dynamic?: false | undefined;
            preliminary?: boolean;
            title?: string;
        }[];
        dynamicToolResults: import("ai").DynamicToolResult[];
        finishReason: import("ai").FinishReason;
        rawFinishReason: string | undefined;
        usage: import("ai").LanguageModelUsage;
        totalUsage: import("ai").LanguageModelUsage;
        warnings: import("ai").CallWarning[] | undefined;
        steps: import("ai").StepResult<sdk.HarnessAllTools<NativeHarness, ToolSet>, RuntimeContext>[];
        request: import("ai").LanguageModelRequestMetadata;
        response: import("ai").LanguageModelResponseMetadata;
        providerMetadata: import("@ai-sdk/provider").SharedV4ProviderMetadata | undefined;
        output: Effect.Effect<A, AiSdkError, never>;
    }, AiSdkError, never>;
    /** Continue an incomplete turn and expose its native output as a scoped stream. */
    continueStream(options: ContinueOptions): Effect.Effect<TextStreamResult<sdk.HarnessAllTools<NativeHarness, ToolSet>, RuntimeContext, OutputInterface<A, P, I>, import("ai").StreamTextResult<sdk.HarnessAllTools<NativeHarness, ToolSet>, RuntimeContext, OutputInterface<A, P, I>>>, AiSdkError, Scope>;
    /** Submit steering text using a registered session. An unregistered handle fails before the SDK call. */
    experimental_steer(options: {
        session: HarnessAgentSession;
        text: string;
    }): Effect.Effect<void, AiSdkError, never>;
}
```

## `HarnessAgentAdapter`

Effect harness handle with provider capabilities and the adapter's built-in tool keys.

This entry exports `HarnessV1` as `HarnessAgentAdapter`.

```text
export type HarnessV1<T extends Record<string, object> = ToolSet> = ReturnType<typeof wrapHarness<T>>;
```

## `HarnessAgentAdapterSession`

Scoped session handle. A successful detach, stop, or destroy closes the session.

This entry exports `HarnessV1Session` as `HarnessAgentAdapterSession`.

```text
export type HarnessV1Session = ReturnType<typeof wrapSession>;
```

## `HarnessAgentBuiltinTool`

Preserve the native and common tool names plus the tool-use classification on the wrapped tool.

This entry exports `HarnessV1BuiltinTool` as `HarnessAgentBuiltinTool`.

```text
export type HarnessV1BuiltinTool<Input = unknown, Output = unknown> = ReturnType<typeof wrapTool<Input, Output, unknown>> & Pick<SDKContract.HarnessV1BuiltinTool<Input, Output>, 'nativeName' | 'commonName' | 'toolUseKind'>;
```

## `HarnessAgentBuiltinToolName`

```text
type HarnessAgentBuiltinToolName = HarnessV1BuiltinToolName;
```

## `HarnessAgentBuiltinTools`

Effect wrappers for built-in native tools exposed by the harness agent.

```text
export type HarnessAgentBuiltinTools = ReturnType<typeof wrapTools>;
```

## `HarnessAgentBuiltinToolUseKind`

```text
type HarnessAgentBuiltinToolUseKind = HarnessV1BuiltinToolUseKind;
```

## `HarnessAgentContinueTurnOptions`

Continue a suspended turn with a new sequential Effect event consumer.

This entry exports `HarnessV1ContinueTurnOptions` as `HarnessAgentContinueTurnOptions`.

```text
export type HarnessV1ContinueTurnOptions<E = never, R = never> = Omit<NativeContinueTurnOptions, 'emit'> & EffectEmit<E, R>;
```

## `HarnessAgentContinueTurnState`

```text
type HarnessAgentContinueTurnState = HarnessV1ContinueTurnState;
```

## `HarnessAgentLifecycleState`

```text
type HarnessAgentLifecycleState = HarnessV1LifecycleState;
```

## `HarnessAgentPendingToolApproval`

```text
type HarnessAgentPendingToolApproval = HarnessV1PendingToolApproval;
```

## `HarnessAgentPendingToolResult`

```text
type HarnessAgentPendingToolResult = HarnessV1PendingToolResult;
```

## `HarnessAgentPermissionMode`

```text
type HarnessAgentPermissionMode = HarnessV1PermissionMode;
```

## `HarnessAgentPrompt`

```text
type HarnessAgentPrompt = HarnessV1Prompt;
```

## `HarnessAgentPromptControl`

Complete a turn only after the SDK finishes and the event consumer drains its queue.

This entry exports `HarnessV1PromptControl` as `HarnessAgentPromptControl`.

```text
export type HarnessV1PromptControl<E = never> = Effect.Success<ReturnType<ReturnType<typeof bindTurn<NativePromptOptions>>>> & {
    readonly done: Effect.Effect<void, AiSdkError | E>;
};
```

## `HarnessAgentPromptTurnOptions`

Begin a prompt turn with a sequential Effect event consumer.

This entry exports `HarnessV1PromptTurnOptions` as `HarnessAgentPromptTurnOptions`.

```text
export type HarnessV1PromptTurnOptions<E = never, R = never> = Omit<NativePromptOptions, 'emit'> & EffectEmit<E, R>;
```

## `HarnessAgentResumeSessionState`

```text
type HarnessAgentResumeSessionState = HarnessV1ResumeSessionState;
```

## `HarnessAgentSandboxConfig`

Configure the SDK sandbox and run bootstrap and session hooks as Effects.

```text
export type HarnessAgentSandboxConfig<E = never, R = never> = Omit<NativeSandboxConfig, 'onBootstrap' | 'onSession'> & {
    readonly onBootstrap?: (options: SandboxBootstrapInput) => Effect.Effect<void, E, R>;
    readonly onSession?: (options: SandboxSessionInput) => Effect.Effect<void, E, R>;
};
```

## `HarnessAgentSandboxCreator`

Optional factory interface for an agent to create its own sandbox for a session.

```text
export interface HarnessAgentSandboxCreator {
    /** Default working directory the agent reports for sandbox operations created by this factory. */
    readonly defaultWorkingDirectory: string;
    /** Acquire a registered sandbox handle and honor the optional session cancellation signal. */
    readonly createSandboxSession: (options: {
        readonly abortSignal?: AbortSignal;
    }) => Effect.Effect<SandboxSession, AiSdkError>;
}
```

## `HarnessAgentSession`

An Effect handle for a running harness session.

The full public type is defined by the [source declaration](../../../src/integrations/harness/agent.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare class HarnessAgentSession {
  private constructor();
  get sessionId(): string;
  get isResume(): boolean;
  get hasUnfinishedTurn(): Effect.Effect<boolean, AiSdkError, never>;
  promptTurn<A, P, I, T extends EffectTools, Active extends EffectTools, R>(options: TurnOptions<A, P, I, T, Active, R, Parameters<NativePromptTurn<A, P, I>>[0]>): Effect.Effect<HarnessAgentTurn<A, P, I>, AiSdkError, Scope | R | import("../../internal/tool.js").ToolRequirements<T[keyof T]> | import("../../internal/tool.js").ToolRequirements<Active[keyof Active]>>;
  continueTurn<A, P, I, T extends EffectTools, Active extends EffectTools, R>(options: TurnOptions<A, P, I, T, Active, R, Parameters<NativeContinueTurn<A, P, I>>[0]>): Effect.Effect<HarnessAgentTurn<A, P, I>, AiSdkError, Scope | R | import("../../internal/tool.js").ToolRequirements<T[keyof T]> | import("../../internal/tool.js").ToolRequirements<Active[keyof Active]>>;
  compact(instructions?: string): Effect.Effect<void, AiSdkError, never>;
  experimental_steerTurn(text: string): Effect.Effect<void, AiSdkError, never>;
  readHistory(options?: Parameters<NativeSession['readHistory']>[0]): Effect.Effect<{
          readonly messages: ReadonlyArray<{
              readonly role: "user";
              readonly content: Array<{
                  text: string;
                  type: "text";
              } | {
                  data: import("@ai-sdk/provider").SharedV4FileData;
                  type: "file";
                  mediaType: string;
                  filename?: string;
              }>;
              readonly at?: string;
              readonly harnessMetadata?: {
                  [x: string]: Record<string, import("@ai-sdk/provider").JSONValue>;
              };
          } | {
              readonly role: "assistant";
              readonly content: Array<{
                  text: string;
                  type: "text";
              } | {
                  data: import("@ai-sdk/provider").SharedV4FileData;
                  type: "file";
                  mediaType: string;
                  filename?: string;
              } | {
                  type: "custom";
                  kind: `${string}.${string}`;
              } | {
                  text: string;
                  type: "reasoning";
              } | {
                  data: import("@ai-sdk/provider").SharedV4FileDataData | import("@ai-sdk/provider").SharedV4FileDataUrl;
                  type: "reasoning-file";
                  mediaType: string;
              } | (Omit<import("@ai-sdk/provider").LanguageModelV4ToolCallPart, "providerOptions"> & {
                  nativeName?: string;
              }) | (Omit<import("@ai-sdk/provider").LanguageModelV4ToolResultPart, "output" | "providerOptions"> & {
                  output: Omit<{
                      type: "text";
                      value: string;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "json";
                      value: import("@ai-sdk/provider").JSONValue;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "execution-denied";
                      reason?: string;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "error-text";
                      value: string;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "error-json";
                      value: import("@ai-sdk/provider").JSONValue;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | {
                      type: "content";
                      value: Array<Omit<Extract<{
                          type: "text";
                          text: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "file";
                          data: import("@ai-sdk/provider").SharedV4FileData;
                          mediaType: string;
                          filename?: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "custom";
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      }, {
                          type: "text";
                      }>, "providerOptions"> | Omit<Extract<{
                          type: "text";
                          text: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "file";
                          data: import("@ai-sdk/provider").SharedV4FileData;
                          mediaType: string;
                          filename?: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "custom";
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      }, {
                          type: "file";
                      }>, "providerOptions"> | Omit<Extract<{
                          type: "text";
                          text: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "file";
                          data: import("@ai-sdk/provider").SharedV4FileData;
                          mediaType: string;
                          filename?: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "custom";
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      }, {
                          type: "custom";
                      }>, "providerOptions">>;
                  };
              })>;
              readonly at?: string;
              readonly harnessMetadata?: {
                  [x: string]: Record<string, import("@ai-sdk/provider").JSONValue>;
              };
          } | {
              readonly role: "tool";
              readonly content: Array<(Omit<import("@ai-sdk/provider").LanguageModelV4ToolResultPart, "output" | "providerOptions"> & {
                  output: Omit<{
                      type: "text";
                      value: string;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "json";
                      value: import("@ai-sdk/provider").JSONValue;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "execution-denied";
                      reason?: string;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "error-text";
                      value: string;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | Omit<{
                      type: "error-json";
                      value: import("@ai-sdk/provider").JSONValue;
                      providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                  }, "providerOptions"> | {
                      type: "content";
                      value: Array<Omit<Extract<{
                          type: "text";
                          text: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "file";
                          data: import("@ai-sdk/provider").SharedV4FileData;
                          mediaType: string;
                          filename?: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "custom";
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      }, {
                          type: "text";
                      }>, "providerOptions"> | Omit<Extract<{
                          type: "text";
                          text: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "file";
                          data: import("@ai-sdk/provider").SharedV4FileData;
                          mediaType: string;
                          filename?: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "custom";
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      }, {
                          type: "file";
                      }>, "providerOptions"> | Omit<Extract<{
                          type: "text";
                          text: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "file";
                          data: import("@ai-sdk/provider").SharedV4FileData;
                          mediaType: string;
                          filename?: string;
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      } | {
                          type: "custom";
                          providerOptions?: import("@ai-sdk/provider").SharedV4ProviderOptions;
                      }, {
                          type: "custom";
                      }>, "providerOptions">>;
                  };
              }) | {
                  type: "tool-approval-response";
                  approvalId: string;
                  approved: boolean;
                  reason?: string;
              }>;
              readonly at?: string;
              readonly harnessMetadata?: {
                  [x: string]: Record<string, import("@ai-sdk/provider").JSONValue>;
              };
          }>;
          readonly cursor: string;
      }, AiSdkError, never>;
  get suspendTurn(): Effect.Effect<{
          readonly harnessId: string;
          readonly specificationVersion: "harness-v1";
          readonly data: import("@ai-sdk/provider").JSONValue;
      } & {
          readonly type: "continue-turn";
          readonly pendingToolApprovals?: readonly {
              readonly approvalId: string;
              readonly toolCallId: string;
              readonly toolName: string;
              readonly input: string;
              readonly kind: "builtin" | "custom";
              readonly providerExecuted?: boolean;
              readonly nativeName?: string;
          }[];
          readonly pendingToolResults?: readonly {
              readonly toolCallId: string;
              readonly toolName: string;
              readonly input: string;
              readonly providerOptions?: import("@ai-sdk/provider-utils").ProviderOptions;
              readonly completedResult?: {
                  readonly output: unknown;
                  readonly isError?: boolean;
                  readonly toolResult?: import("ai").ToolResultPart;
              };
          }[];
          readonly turnSettings?: {
              readonly model?: string;
              readonly skills: ReadonlyArray<{
                  readonly name: string;
                  readonly description: string;
                  readonly content: string;
                  readonly files?: ReadonlyArray<{
                      readonly path: string;
                      readonly content: string;
                  }>;
              }>;
              readonly instructions?: string;
              readonly tools: ReadonlyArray<{
                  readonly name: string;
                  readonly description?: string;
                  readonly inputSchema?: import("json-schema").JSONSchema7;
              }>;
          };
      }, AiSdkError, never>;
  get detach(): Effect.Effect<{
          readonly harnessId: string;
          readonly specificationVersion: "harness-v1";
          readonly data: import("@ai-sdk/provider").JSONValue;
      } & {
          readonly type: "resume-session";
          readonly continueFrom?: {
              readonly harnessId: string;
              readonly specificationVersion: "harness-v1";
              readonly data: import("@ai-sdk/provider").JSONValue;
          } & {
              readonly type: "continue-turn";
              readonly pendingToolApprovals?: readonly {
                  readonly approvalId: string;
                  readonly toolCallId: string;
                  readonly toolName: string;
                  readonly input: string;
                  readonly kind: "builtin" | "custom";
                  readonly providerExecuted?: boolean;
                  readonly nativeName?: string;
              }[];
              readonly pendingToolResults?: readonly {
                  readonly toolCallId: string;
                  readonly toolName: string;
                  readonly input: string;
                  readonly providerOptions?: import("@ai-sdk/provider-utils").ProviderOptions;
                  readonly completedResult?: {
                      readonly output: unknown;
                      readonly isError?: boolean;
                      readonly toolResult?: import("ai").ToolResultPart;
                  };
              }[];
              readonly turnSettings?: {
                  readonly model?: string;
                  readonly skills: ReadonlyArray<{
                      readonly name: string;
                      readonly description: string;
                      readonly content: string;
                      readonly files?: ReadonlyArray<{
                          readonly path: string;
                          readonly content: string;
                      }>;
                  }>;
                  readonly instructions?: string;
                  readonly tools: ReadonlyArray<{
                      readonly name: string;
                      readonly description?: string;
                      readonly inputSchema?: import("json-schema").JSONSchema7;
                  }>;
              };
          };
      }, AiSdkError, never>;
  get stop(): Effect.Effect<{
          readonly harnessId: string;
          readonly specificationVersion: "harness-v1";
          readonly data: import("@ai-sdk/provider").JSONValue;
      } & {
          readonly type: "resume-session";
          readonly continueFrom?: {
              readonly harnessId: string;
              readonly specificationVersion: "harness-v1";
              readonly data: import("@ai-sdk/provider").JSONValue;
          } & {
              readonly type: "continue-turn";
              readonly pendingToolApprovals?: readonly {
                  readonly approvalId: string;
                  readonly toolCallId: string;
                  readonly toolName: string;
                  readonly input: string;
                  readonly kind: "builtin" | "custom";
                  readonly providerExecuted?: boolean;
                  readonly nativeName?: string;
              }[];
              readonly pendingToolResults?: readonly {
                  readonly toolCallId: string;
                  readonly toolName: string;
                  readonly input: string;
                  readonly providerOptions?: import("@ai-sdk/provider-utils").ProviderOptions;
                  readonly completedResult?: {
                      readonly output: unknown;
                      readonly isError?: boolean;
                      readonly toolResult?: import("ai").ToolResultPart;
                  };
              }[];
              readonly turnSettings?: {
                  readonly model?: string;
                  readonly skills: ReadonlyArray<{
                      readonly name: string;
                      readonly description: string;
                      readonly content: string;
                      readonly files?: ReadonlyArray<{
                          readonly path: string;
                          readonly content: string;
                      }>;
                  }>;
                  readonly instructions?: string;
                  readonly tools: ReadonlyArray<{
                      readonly name: string;
                      readonly description?: string;
                      readonly inputSchema?: import("json-schema").JSONSchema7;
                  }>;
              };
          };
      }, AiSdkError, never>;
  get destroy(): Effect.Effect<void, AiSdkError, never>;
}
```

## `HarnessAgentSettings`

Construct an agent from a registered harness, with optional Effect tool, output, and sandbox configuration.

```text
export type HarnessAgentSettings<T extends EffectTools = {}, E = never, R = never, A = unknown, P = A, I = unknown> = CoreOptions<Pick<NativeOptions<A, P, I>, SettingsKeys>, R, T> & {
    readonly harness: {
        readonly harnessId: string;
    };
    readonly tools?: T;
    readonly output?: OutputSpecification<A, P, I, R>;
    readonly prepareCall?: PrepareCall<T, E, R>;
    readonly sandbox?: ReturnType<typeof import('../internal/sandbox.js').wrapSandboxProvider>;
    readonly sandboxConfig?: HarnessAgentSandboxConfig<E, R>;
    readonly onSandboxSession?: HarnessAgentSandboxConfig<E, R>['onSession'];
};
```

## `HarnessAgentSkill`

```text
type HarnessAgentSkill = HarnessV1Skill;
```

## `HarnessAgentStartOptions`

Supply a registered sandbox session for native harness startup or resumption.

This entry exports `HarnessV1StartOptions` as `HarnessAgentStartOptions`.

```text
export type HarnessV1StartOptions = Omit<NativeStartOptions, 'sandboxSession' | 'observability'> & {
    readonly sandboxSession: SandboxSession;
    readonly observability?: HarnessV1Observability;
};
```

## `HarnessAgentStreamPart`

```text
type HarnessAgentStreamPart = HarnessV1StreamPart;
```

## `HarnessAgentToolApprovalConfiguration`

```text
type HarnessAgentToolApprovalConfiguration = Readonly<Record<string, ToolApprovalStatus>>;
```

## `HarnessAgentToolSpec`

```text
type HarnessAgentToolSpec = HarnessV1ToolSpec;
```

## `HarnessAgentTurn`

Scoped turn handle with independent readiness and completion effects and a streamed result.

```text
export type HarnessAgentTurn<A, P = A, I = unknown> = {
    readonly result: TextStreamResult<ToolSet, RuntimeContext, OutputInterface<A, P, I>>;
    readonly ready: Effect.Effect<void, AiSdkError>;
    readonly done: Effect.Effect<void, AiSdkError>;
};
```

## `HarnessAllTools`

Combine built-in and supplied tools. Supplied tools take precedence by name.

```text
export type HarnessAllTools<Harness extends {
    readonly builtinTools: Record<string, object>;
}, Tools extends EffectTools> = Omit<Harness['builtinTools'], keyof Tools> & Tools;
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

## `HarnessDebugConfig`

Consumer-facing diagnostics configuration. Set on `HarnessAgentSettings` to
enable bridge log forwarding and the `HARNESS_DEBUG` stderr default in code.
`HARNESS_DEBUG` / `HARNESS_DEBUG_LEVEL` / `HARNESS_DEBUG_SUBSYSTEMS` env vars
fill any unset field — a convenience default, never the only path.

```text
type HarnessDebugConfig = {
  /** Master switch. Nothing is captured or forwarded when false/unset. */
  readonly enabled?: boolean;
  /** Threshold; events at or above this severity are emitted. Default `debug`. */
  readonly level?: HarnessDebugLevel;
  /** Dotted-prefix subsystem filter for structured events. */
  readonly subsystems?: ReadonlyArray<string>;
};
```

## `HarnessDebugLevel`

Severity of a diagnostic.

```text
type HarnessDebugLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';
```

## `HarnessDiagnostic`

A forwarded bridge diagnostic, normalized for host consumers.

The bridge emits two raw frame kinds — captured console lines (`sandbox-log`)
and structured events (`debug-event`). The framework normalizes both into
this single shape before handing them to a consumer's `onLog` callback, the
`HARNESS_DEBUG` stderr default, and observability reporters. Diagnostics are
kept first-class and per-line — they are never folded into telemetry spans.

```text
type HarnessDiagnostic = {
  /**
   * Severity. Structured events carry their own level; captured console lines
   * map `stderr` → `'warn'` and `stdout` → `'info'`.
   */
  readonly level: HarnessDebugLevel;
  /** Human-readable line (console capture) or message (structured event). */
  readonly message: string;
  /**
   * Dotted subsystem. For captured console output this is
   * `sandbox.log.<source>`; for structured events it is the adapter-supplied
   * subsystem (e.g. `bridge.turn`).
   */
  readonly subsystem: string;
  /** `'log'` = captured console line; `'event'` = structured `bridgeLog`. */
  readonly kind: 'log' | 'event';
  /** Originating sandbox source label (console capture). */
  readonly source?: string;
  /** Which standard stream the line came from (console capture). */
  readonly stream?: 'stdout' | 'stderr';
  /** Structured attributes (structured events only). */
  readonly attrs?: Record<string, unknown>;
  /** Error payload (structured events only). */
  readonly error?: {
    name?: string;
    message: string;
    stack?: string;
  };
  /** The harness session this diagnostic originated from. */
  readonly sessionId?: string;
  /** Host receipt time (epoch ms). */
  readonly timestamp: number;
};
```

## `HarnessDiagnosticConsumer`

Optional diagnostics entry point shared by file reporters and other telemetry consumers.

```text
export interface HarnessDiagnosticConsumer {
    /** Deliver one native harness diagnostic to an Effect consumer. */
    readonly ingestDiagnostic?: (diagnostic: sdk.HarnessDiagnostic) => Effect.Effect<void, AiSdkError>;
}
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

## `HarnessSandboxTemplate`

Reusable sandbox template with native identity and Effect preparation.

```text
export type HarnessSandboxTemplate = ReturnType<typeof wrapTemplate>;
```

## `prepareHarnessSandboxTemplate`

Prepare a provider sandbox template under a local scope and forward the caller's abort signal.

```text
export declare const prepareHarnessSandboxTemplate: <E = never, R = never>(options: PrewarmOptions<E, R>) => Effect.Effect<void, AiSdkError, Exclude<R, Scope>>;
```

## `prepareSandboxForHarness`

Validate the existing session and harness identities before calling native preparation in a scope.

```text
export declare const prepareSandboxForHarness: <E = never, R = never>(options: PrepareOptions<E, R>) => Effect.Effect<sdk.PrepareSandboxForHarnessResult, AiSdkError, Exclude<R, Scope>>;
```

## `PrepareSandboxForHarnessResult`

- **@deprecated** Use `createHarnessSandboxTemplate` and `template.prepare` instead.

```text
type PrepareSandboxForHarnessResult = {
  readonly identity?: string;
  readonly recipeIdentities: Record<string, string>;
  readonly skippedHarnessIds: ReadonlyArray<string>;
};
```

## `prewarmHarness`

Expose the template preparation operation under the prewarming name as well.

```text
export declare const prewarmHarness: <E = never, R = never>(options: PrewarmOptions<E, R>) => Effect.Effect<void, AiSdkError, Exclude<R, Scope>>;
```

## `TraceTreeReporterOptions`

Configure where completed trace tree output is written.

```text
export interface TraceTreeReporterOptions<E = never, R = never> {
    /** Optional Effect sink for rendered trace chunks. Omitting it keeps the SDK's output sink. */
    readonly write?: (chunk: string) => Effect.Effect<void, E, R>;
}
```

