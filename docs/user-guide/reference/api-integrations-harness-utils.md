---
title: "Integration API — harness/utils"
doc-type: reference
sources: [src/integrations/harness/utils.ts, package.json]
---

# harness/utils

> **TL;DR:** The `@jambudipa/ai-effect/harness/utils` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness/utils`

## `applyCredentialForwarding`

Apply native credential forwarding with a local scope for the optional Effect callback.

```text
export declare const applyCredentialForwarding: <R = never, E = never>(input: WithCredentialCallback<Parameters<typeof sdk.applyCredentialForwarding>[0], R, E>) => Effect.Effect<Record<string, string>, AiSdkError, Exclude<R, Scope.Scope>>;
```

## `BRIDGE_AUTH_PUBLIC_KEY_ENV`

Sandbox environment key for the public half of bridge authentication material.

```text
export declare const BRIDGE_AUTH_PUBLIC_KEY_ENV = "BRIDGE_AUTH_PUBLIC_KEY";
```

## `BridgeAuthKeyPair`

```text
interface BridgeAuthKeyPair {
  readonly privateKey: string;
  readonly publicKey: string;
}
```

## `BridgeHello`

```text
type BridgeHello = z.infer<typeof harnessV1BridgeHelloSchema>;
```

## `BridgeReadyErrorContext`

Expose the wrapped process and captured output tail to readiness error callbacks.

```text
export type BridgeReadyErrorContext = Omit<SDKContract.BridgeReadyErrorContext, 'proc'> & {
    readonly proc: Process;
};
```

## `BridgeReadySource`

```text
type BridgeReadySource = 'stdout' | 'metadata';
```

## `classifyDiskLog`

Classify the SDK's disk-log content through its asynchronous boundary.

```text
export declare const classifyDiskLog: (...args: Parameters<typeof sdk.classifyDiskLog>) => Effect.Effect<SDKContract.DiskLogRecoveryMode, AiSdkError, never>;
```

## `convertHarnessToolModelOutput`

Adapt native tool results to bridge model output without executing the tools again.

```text
export declare const convertHarnessToolModelOutput: (...args: Parameters<typeof sdk.convertHarnessToolModelOutput>) => Effect.Effect<{
    content: SDKContract.HarnessToolModelOutputContent[];
    isError: boolean;
}, AiSdkError, never>;
```

## `createBridgeAuthKeyPair`

Create bridge authentication material lazily through the SDK's tagged boundary.

```text
export declare const createBridgeAuthKeyPair: (...args: Parameters<typeof sdk.createBridgeAuthKeyPair>) => Effect.Effect<SDKContract.BridgeAuthKeyPair, AiSdkError, never>;
```

## `createBridgeErrorHandler`

Build a lazy handler for the SDK's bridge error event shape.

```text
export declare const createBridgeErrorHandler: (...args: Parameters<typeof sdk.createBridgeErrorHandler>) => (event: Parameters<ReturnType<typeof sdk.createBridgeErrorHandler>>[0]) => Effect.Effect<void, AiSdkError, never>;
```

## `createBridgeStartupError`

Build a tagged startup error after the native helper inspects the registered process.

```text
export declare const createBridgeStartupError: (options: StartupErrorOptions) => Effect.Effect<AiSdkError, AiSdkError, never>;
```

## `createBridgeWebSocketConnect`

Connect to the native bridge with the same cancellation signal used by the channel.

```text
export declare const createBridgeWebSocketConnect: (options: CreateBridgeWebSocketConnectOptions) => (connect: SDKContract.SandboxChannelConnectOptions) => Effect.Effect<import("ws").default, AiSdkError, never>;
```

## `CreateBridgeWebSocketConnectOptions`

Native WebSocket configuration with a synchronous observer for the bridge hello message.

```text
export type CreateBridgeWebSocketConnectOptions = Omit<SDKContract.CreateBridgeWebSocketConnectOptions, 'onHello'> & {
    readonly onHello?: (message: SDKContract.BridgeHello) => void;
};
```

## `createCredentialRequestTransformation`

Construct the native credential request transformation through the tagged synchronous boundary.

```text
export declare const createCredentialRequestTransformation: (...args: Parameters<typeof sdk.createCredentialRequestTransformation>) => Effect.Effect<{
    readonly match: {
        readonly host: string;
        readonly path?: {
            exact: string;
        } | {
            startsWith: string;
        } | {
            regex: string;
        };
        readonly method?: ReadonlyArray<string>;
        readonly queryString?: ReadonlyArray<{
            readonly key?: {
                exact: string;
            } | {
                startsWith: string;
            } | {
                regex: string;
            };
            readonly value?: {
                exact: string;
            } | {
                startsWith: string;
            } | {
                regex: string;
            };
        }>;
        readonly headers?: ReadonlyArray<{
            readonly key?: {
                exact: string;
            } | {
                startsWith: string;
            } | {
                regex: string;
            };
            readonly value?: {
                exact: string;
            } | {
                startsWith: string;
            } | {
                regex: string;
            };
        }>;
    };
    readonly transform: {
        readonly headers: Readonly<Record<string, string>>;
    };
}, AiSdkError, never>;
```

## `createReadBridgeAsset`

Return an Effect reader whose requested asset name must exist in the supplied URL map.

```text
export declare const createReadBridgeAsset: <const Urls extends Record<string, URL>>(urls: Urls) => (name: Extract<keyof Urls, string>) => Effect.Effect<string, AiSdkError, never>;
```

## `DiskLogRecoveryMode`

```text
type DiskLogRecoveryMode = 'replay' | 'rerun';
```

## `drainBridgeProcessStream`

Consume a bridge process stream using the SDK's drain convention.

```text
export declare const drainBridgeProcessStream: (...args: Parameters<typeof sdk.drainBridgeProcessStream>) => Effect.Effect<void, AiSdkError, never>;
```

## `encodeHarnessPathSegment`

Encode a harness identifier for use as one path segment.

```text
export declare const encodeHarnessPathSegment: (...args: Parameters<typeof sdk.encodeHarnessPathSegment>) => Effect.Effect<string, AiSdkError, never>;
```

## `Experimental_BridgeUserMessageRequest`

```text
type Experimental_BridgeUserMessageRequest = {
  type: 'user-message';
  messageId: string;
  text: string;
};
```

## `Experimental_BridgeUserMessageResponse`

```text
type Experimental_BridgeUserMessageResponse = {
  type: 'user-message-response';
  messageId: string;
  accepted: boolean;
  error?: {
    message: string;
  };
};
```

## `Experimental_BridgeUserMessageSubmitter`

Submitter handle with an explicit early close operation owned by the acquisition scope.

```text
export type Experimental_BridgeUserMessageSubmitter = ReturnType<typeof wrapSubmitter>;
```

## `experimental_createBridgeUserMessageSubmitter`

Allocate a bridge submitter and close it at scope exit, logging tagged release failures.

```text
export declare const experimental_createBridgeUserMessageSubmitter: (options: BridgeSubmitterTransport) => Effect.Effect<{
    submit: (text: string) => Effect.Effect<void, AiSdkError, never>;
    close: (error?: unknown) => Effect.Effect<void, AiSdkError, never>;
}, AiSdkError, Scope.Scope>;
```

## `extractHarnessPromptContent`

Extract the supported prompt content parts from the SDK input shape.

```text
export declare const extractHarnessPromptContent: (...args: Parameters<typeof sdk.extractHarnessPromptContent>) => Effect.Effect<string | ({
    type: "text";
    text: string;
} | {
    type: "image";
    data: string;
    mediaType: string;
})[], AiSdkError, never>;
```

## `formatBridgeError`

Format a bridge failure as a diagnostic message through the native helper.

```text
export declare const formatBridgeError: (...args: Parameters<typeof sdk.formatBridgeError>) => Effect.Effect<string, AiSdkError, never>;
```

## `forwardBridgeProcessStream`

Forward a bridge process stream to the native diagnostics consumer.

```text
export declare const forwardBridgeProcessStream: (...args: Parameters<typeof sdk.forwardBridgeProcessStream>) => Effect.Effect<void, AiSdkError, never>;
```

## `generateSandboxCredentialPlaceholder`

Create the placeholder value the SDK uses in a sandbox instead of the original credential.

```text
export declare const generateSandboxCredentialPlaceholder: (...args: Parameters<typeof sdk.generateSandboxCredentialPlaceholder>) => Effect.Effect<string, AiSdkError, never>;
```

## `getAiGatewayAuthFromEnv`

Read the SDK's AI Gateway authentication configuration from the supplied environment.

```text
export declare const getAiGatewayAuthFromEnv: (...args: Parameters<typeof sdk.getAiGatewayAuthFromEnv>) => Effect.Effect<{
    apiKey: string | undefined;
    baseUrl: string;
}, AiSdkError, never>;
```

## `getJwtExpiresAt`

Read a token's expiry using the SDK helper. Parsing alone does not authenticate a token.

```text
export declare const getJwtExpiresAt: (...args: Parameters<typeof sdk.getJwtExpiresAt>) => Effect.Effect<number | undefined, AiSdkError, never>;
```

## `getRestrictedSandboxSession`

Obtain and register the native restricted view of a sandbox session.

```text
export declare const getRestrictedSandboxSession: (input: SandboxSession) => Effect.Effect<{
    description: string;
    readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<Stream.Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never> | null, AiSdkError, Scope.Scope>;
    readBinaryFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, AiSdkError, never>;
    readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, AiSdkError, never>;
    writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, AiSdkError, never>;
    writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, AiSdkError, never>;
    writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, AiSdkError, never>;
    stat: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, AiSdkError, never>;
    listDirectory: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, AiSdkError, never>;
    deleteFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<boolean, AiSdkError, never>;
    spawn: {
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
            stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
            pid: number | undefined;
            stdout: Effect.Effect<Stream.Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>, AiSdkError, Scope.Scope>;
            stderr: Effect.Effect<Stream.Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>, AiSdkError, Scope.Scope>;
            wait: Effect.Effect<{
                exitCode: number;
            }, AiSdkError, never>;
            kill: Effect.Effect<void, AiSdkError, never>;
        } & {
            readonly stdin: WritableStream<Uint8Array>;
        }, import("../../internal/operation.js").AiSdkError, Scope.Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<Process, import("../../internal/operation.js").AiSdkError, Scope.Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<Process, import("../../internal/operation.js").AiSdkError, Scope.Scope>;
    };
    run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
        exitCode: number;
        stdout: string;
        stderr: string;
        stdoutLength?: number;
        stderrLength?: number;
    }, AiSdkError, never>;
}, AiSdkError, never>;
```

## `HarnessPromptContent`

```text
type HarnessPromptContent = z.infer<typeof harnessPromptContentSchema>;
```

## `HarnessPromptContentPart`

```text
type HarnessPromptContentPart = z.infer<typeof harnessPromptContentPartSchema>;
```

## `harnessPromptContentSchema`

Validate the SDK's supported harness prompt content through its Effect schema wrapper.

```text
export declare const harnessPromptContentSchema: {
    jsonSchema: Effect.Effect<import("json-schema").JSONSchema7, AiSdkError, never>;
    validate: (input: unknown) => Effect.Effect<string | ({
        type: "text";
        text: string;
    } | {
        type: "image";
        data: string;
        mediaType: string;
    })[], AiSdkError, never>;
};
```

## `HarnessToolModelOutputContent`

```text
type HarnessToolModelOutputContent =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      data: string;
      mediaType: string;
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

## `isAccessTokenExpiringSoon`

Let the SDK apply its expiry threshold to an access token's lifetime.

```text
export declare const isAccessTokenExpiringSoon: (...args: Parameters<typeof sdk.isAccessTokenExpiringSoon>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isHarnessAuthenticationEnvironment`

Test whether the native harness supports the supplied authentication environment.

```text
export declare const isHarnessAuthenticationEnvironment: (...args: Parameters<typeof sdk.isHarnessAuthenticationEnvironment>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isLinux`

Use the pinned SDK's Linux environment check as a lazy Effect.

```text
export declare const isLinux: (...args: Parameters<typeof sdk.isLinux>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isMacOS`

Use the pinned SDK's macOS environment check as a lazy Effect.

```text
export declare const isMacOS: (...args: Parameters<typeof sdk.isMacOS>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isSandboxCredentialPlaceholder`

Test whether a value is already an SDK sandbox credential placeholder.

```text
export declare const isSandboxCredentialPlaceholder: (...args: Parameters<typeof sdk.isSandboxCredentialPlaceholder>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isSandboxWriteProtectedPath`

Check a sandbox path against the native write protection policy with the caller's abort signal.

```text
export declare const isSandboxWriteProtectedPath: (options: Sandboxed<Parameters<typeof sdk.isSandboxWriteProtectedPath>[0], "sandbox">) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isWindows`

Use the pinned SDK's Windows environment check as a lazy Effect.

```text
export declare const isWindows: (...args: Parameters<typeof sdk.isWindows>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `logBridgeError`

Send a bridge error to the native logger and bind optional diagnostics to the caller's Effect context.

```text
export declare const logBridgeError: <E = never, R = never>(options: LogBridgeErrorOptions<E, R>) => Effect.Effect<void, AiSdkError | E, R>;
```

## `markBridgeStarting`

Record bridge startup in a registered sandbox through the native lifecycle helper.

```text
export declare const markBridgeStarting: (options: Sandboxed<Parameters<typeof sdk.markBridgeStarting>[0], "sandbox">) => Effect.Effect<void, AiSdkError, never>;
```

## `maskSandboxCredentials`

Ask the SDK to redact sandbox credential values in content before reporting it.

```text
export declare const maskSandboxCredentials: (...args: Parameters<typeof sdk.maskSandboxCredentials>) => Effect.Effect<Record<string, string>, AiSdkError, never>;
```

## `normalizeHarnessToolModelOutput`

Normalize bridge tool output into the content shape the SDK expects.

```text
export declare const normalizeHarnessToolModelOutput: (...args: Parameters<typeof sdk.normalizeHarnessToolModelOutput>) => Effect.Effect<import("@ai-sdk/provider-utils").ToolResultOutput, AiSdkError, never>;
```

## `OAuthCredential`

```text
type OAuthCredential = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
};
```

## `parseJwtPayload`

Decode the token payload through the native parser. Use verification before trusting claims.

```text
export declare const parseJwtPayload: (...args: Parameters<typeof sdk.parseJwtPayload>) => Effect.Effect<Readonly<Record<string, unknown>> | undefined, AiSdkError, never>;
```

## `readLinuxSecretServicePassword`

Request an authorized credential lookup through the SDK's Linux Secret Service integration.

```text
export declare const readLinuxSecretServicePassword: (...args: Parameters<typeof sdk.readLinuxSecretServicePassword>) => Effect.Effect<string | undefined, AiSdkError, never>;
```

## `readMacOSKeychainPassword`

Request an authorized credential lookup through the SDK's macOS Keychain integration.

```text
export declare const readMacOSKeychainPassword: (...args: Parameters<typeof sdk.readMacOSKeychainPassword>) => Effect.Effect<string | undefined, AiSdkError, never>;
```

## `readWindowsCredentialManagerPassword`

Request an authorized credential lookup through the SDK's Windows Credential Manager integration.

```text
export declare const readWindowsCredentialManagerPassword: (...args: Parameters<typeof sdk.readWindowsCredentialManagerPassword>) => Effect.Effect<string | undefined, AiSdkError, never>;
```

## `refreshOAuthAccessToken`

Ask the native SDK to refresh an OAuth token using its supplied refresh settings.

```text
export declare const refreshOAuthAccessToken: (...args: Parameters<typeof sdk.refreshOAuthAccessToken>) => Effect.Effect<SDKContract.RefreshOAuthAccessTokenResult, AiSdkError, never>;
```

## `RefreshOAuthAccessTokenResult`

```text
type RefreshOAuthAccessTokenResult = {
  readonly accessToken: string;
  readonly expiresAt: number;
  readonly refreshToken?: string;
};
```

## `resolveBridgeEndpoint`

Resolve the bridge endpoint using a registered sandbox's network configuration.

```text
export declare const resolveBridgeEndpoint: (options: Sandboxed<Parameters<typeof sdk.resolveBridgeEndpoint>[0], "sandboxSession">) => Effect.Effect<{
    readonly url: string;
    readonly headers?: Readonly<Record<string, string>>;
}, AiSdkError, never>;
```

## `resolveBridgePort`

Resolve the bridge port using the registered session and the SDK's configuration rules.

```text
export declare const resolveBridgePort: (options: Sandboxed<Parameters<typeof sdk.resolveBridgePort>[0], "sandboxSession">) => Effect.Effect<number, AiSdkError, never>;
```

## `resolveSandboxCredentialEnvironment`

Resolve sandbox credential environment values with interruption scoped to the lookup.

```text
export declare const resolveSandboxCredentialEnvironment: <R = never, E = never>(input: WithCredentialCallback<Parameters<typeof sdk.resolveSandboxCredentialEnvironment>[0], R, E>) => Effect.Effect<Record<string, string>, AiSdkError, Exclude<R, Scope.Scope>>;
```

## `resolveSandboxDefaultWorkingDirectory`

Resolve the effective working directory from the registered sandbox's native settings.

```text
export declare const resolveSandboxDefaultWorkingDirectory: (options: Sandboxed<Parameters<typeof sdk.resolveSandboxDefaultWorkingDirectory>[0], "sandboxSession">) => Effect.Effect<string, AiSdkError, never>;
```

## `resolveSandboxHomeDir`

Resolve the home directory using a registered sandbox and a cancellable native request.

```text
export declare const resolveSandboxHomeDir: (options: Sandboxed<Parameters<typeof sdk.resolveSandboxHomeDir>[0], "sandbox">) => Effect.Effect<string, AiSdkError, never>;
```

## `SandboxChannel`

A scoped, ordered channel to a harness bridge.

```text
/** A scoped, ordered channel to a harness bridge. */
export declare class SandboxChannel<Out extends Frame, In extends Frame = Frame> {
    private constructor();
    /** Acquire a channel and bind connection, validation, and callbacks to the owning scope. */
    static make<Out extends Frame, In extends Frame = Frame, R = never, E = never>(options: SandboxChannelOptions<Out, R, E>): Effect.Effect<SandboxChannel<Out, In>, AiSdkError, Scope.Scope | R>;
    /** Read the event cursor that the native channel tracks for reconnection. */
    get lastSeenEventId(): Effect.Effect<number, AiSdkError, never>;
    /** Open the native connection with the supplied channel options. */
    open(options?: Parameters<Channel<Out, In>['open']>[0]): Effect.Effect<void, AiSdkError, never>;
    /** Mark listener attachment for the lifetime of the scope, then release the native attachment. */
    beginListenerAttachment(): Effect.Effect<void, AiSdkError, Scope.Scope>;
    /** Stream frames with the selected discriminator and detach the listener when collection stops. */
    on<T extends Out['type']>(type: T): Stream.Stream<Extract<Out, {
        type: T;
    }>, AiSdkError, never>;
    /** Listen for native closure codes and reasons through a synchronous callback. */
    onClose(handler: (code: number, reason: string) => void): Effect.Effect<void, AiSdkError, never>;
    /** Attach a reconnect listener for the current scope and detach it at scope exit. */
    onReconnect(handler: () => void): Effect.Effect<void, AiSdkError, Scope.Scope>;
    /** Send a frame with optional disconnection buffering and no Effect delivery callback. */
    send(message: In, options?: Omit<ChannelSendOptions<never, never>, 'onSent'>): Effect.Effect<void, AiSdkError>;
    /** Send a frame with a delivery callback owned by the current scope. */
    send<E, R>(message: In, options: ChannelSendOptions<E, R>): Effect.Effect<void, AiSdkError, R | Scope.Scope>;
    /** Begin native close without relinquishing the separately scoped cleanup action. */
    get beginClose(): Effect.Effect<void, AiSdkError, never>;
    /** Close the native channel through its tagged synchronous boundary. */
    get close(): Effect.Effect<void, AiSdkError, never>;
    /** Suspend the connection through the SDK's reconnectable lifecycle operation. */
    get suspend(): Effect.Effect<number, AiSdkError, never>;
    /** Read whether the SDK has closed the channel. */
    get isClosed(): Effect.Effect<boolean, AiSdkError, never>;
}
```

## `SandboxChannelConnectOptions`

```text
interface SandboxChannelConnectOptions {
  readonly abortSignal: AbortSignal;
  readonly reason: 'open' | 'reconnect';
}
```

## `SandboxChannelDebugEvent`

```text
type SandboxChannelDebugEvent =
  | {
      event: 'reconnect-attempt';
      attempt: number;
      lastSeenEventId: number;
    }
  | {
      event: 'reconnected';
      attempt: number;
      lastSeenEventId: number;
    }
  | {
      event: 'reconnect-failed';
      attempts: number;
      lastSeenEventId: number;
      cause: unknown;
    };
```

## `SandboxChannelOptions`

Channel options with an Effect connection callback, schema-based frame decoding, and scoped observers.

```text
export type SandboxChannelOptions<Out extends Frame, R = never, E = never> = Omit<SDKContract.SandboxChannelOptions<Out>, 'connect' | 'outboundSchema' | 'onDebug' | 'onDiagnostic' | 'onBridgeError'> & {
    readonly connect: (options: SDKContract.SandboxChannelConnectOptions) => Effect.Effect<Awaited<ReturnType<SDKContract.SandboxChannelOptions<Out>['connect']>>, E, R>;
    readonly outboundSchema: Schema.ConstraintDecoder<Out, R>;
    readonly onDebug?: (event: SDKContract.SandboxChannelDebugEvent) => Effect.Effect<void, E, R>;
    readonly onDiagnostic?: (event: Extract<Out, {
        type: 'sandbox-log' | 'debug-event';
    }>) => Effect.Effect<void, E, R>;
    readonly onBridgeError?: (event: Extract<Out, {
        type: 'error';
    }>) => Effect.Effect<void, E, R>;
};
```

## `SandboxChannelReconnectOptions`

```text
interface SandboxChannelReconnectOptions {
  readonly maxElapsedMs?: number;
  readonly initialDelayMs?: number;
  readonly maxDelayMs?: number;
}
```

## `shellQuote`

Quote one value using the SDK's shell argument convention.

```text
export declare const shellQuote: (...args: Parameters<typeof sdk.shellQuote>) => Effect.Effect<string, AiSdkError, never>;
```

## `shouldResolveNativeSubscription`

Determine whether the SDK should try the harness's native subscription credentials.

```text
export declare const shouldResolveNativeSubscription: (...args: Parameters<typeof sdk.shouldResolveNativeSubscription>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `SkillFilePathMode`

```text
type SkillFilePathMode = 'relative' | 'strip-leading-slashes';
```

## `sleep`

Wait for the native retry delay while allowing Effect interruption to cancel the wait.

```text
export declare const sleep: (options: Parameters<typeof sdk.sleep>[0]) => Effect.Effect<void, AiSdkError, never>;
```

## `stopPreviousBridge`

Stop an earlier bridge through the registered sandbox with cancellable native cleanup.

```text
export declare const stopPreviousBridge: (options: Sandboxed<Parameters<typeof sdk.stopPreviousBridge>[0], "sandbox">) => Effect.Effect<void, AiSdkError, never>;
```

## `validateBridgeSandboxSettings`

Validate bridge settings through the native sandbox before opening a connection.

```text
export declare const validateBridgeSandboxSettings: (options: Sandboxed<Parameters<typeof sdk.validateBridgeSandboxSettings>[0], "sandboxSession">) => Effect.Effect<void, AiSdkError, never>;
```

## `waitForBridgeReady`

Observe readiness through the native SDK and run error callbacks under the same cancellation signal.

```text
export declare const waitForBridgeReady: <R = never, E = never>(options: WaitForBridgeReadyOptions<R, E>) => Effect.Effect<SDKContract.WaitForBridgeReadyResult, AiSdkError, Exclude<R, Scope.Scope>>;
```

## `WaitForBridgeReadyOptions`

Supply a registered process and sandbox and optionally customize timeout and exit errors as Effects.

```text
export type WaitForBridgeReadyOptions<R = never, E = never> = Omit<SDKContract.WaitForBridgeReadyOptions, 'proc' | 'sandbox' | 'createTimeoutError' | 'createExitError'> & {
    readonly proc: Process;
    readonly sandbox: SandboxSession;
    readonly createTimeoutError?: (context: BridgeReadyErrorContext) => Effect.Effect<Error, E, R>;
    readonly createExitError?: (context: BridgeReadyErrorContext) => Effect.Effect<Error, E, R>;
};
```

## `WaitForBridgeReadyResult`

```text
type WaitForBridgeReadyResult = {
  port: number;
  source: BridgeReadySource;
  stdoutTail: string[];
};
```

## `warnCredentialBrokeringUnavailable`

Emit the SDK diagnostic for a sandbox environment without credential brokering support.

```text
export declare const warnCredentialBrokeringUnavailable: (...args: Parameters<typeof sdk.warnCredentialBrokeringUnavailable>) => Effect.Effect<void, AiSdkError, never>;
```

## `warnMintBridgeTokenIgnored`

Emit the SDK diagnostic for a bridge token setting that has no effect.

```text
export declare const warnMintBridgeTokenIgnored: (...args: Parameters<typeof sdk.warnMintBridgeTokenIgnored>) => Effect.Effect<void, AiSdkError, never>;
```

## `writeInstructions`

Write harness instructions using a registered sandbox and the native write format.

```text
export declare const writeInstructions: (options: Sandboxed<Parameters<typeof sdk.writeInstructions>[0], "sandbox">) => Effect.Effect<SDKContract.WriteInstructionsResult, AiSdkError, never>;
```

## `WriteInstructionsOptions`

Instruction write settings for a registered sandbox session.

```text
export type WriteInstructionsOptions = Sandboxed<SDKContract.WriteInstructionsOptions, 'sandbox'>;
```

## `WriteInstructionsResult`

```text
type WriteInstructionsResult = {
  changed: boolean;
  filePath: string;
};
```

## `writeSkills`

Write harness skill files through native path validation within the registered sandbox.

```text
export declare const writeSkills: (options: WriteSkillsOptions) => Effect.Effect<SDKContract.WriteSkillsResult, AiSdkError, never>;
```

## `WriteSkillsOptions`

Skill write options with synchronous validation messages for invalid skill names and paths.

```text
export type WriteSkillsOptions = Omit<Sandboxed<SDKContract.WriteSkillsOptions, 'sandbox'>, 'invalidSkillNameMessage' | 'invalidSkillFilePathMessage'> & {
    readonly invalidSkillNameMessage?: (input: {
        name: string;
    }) => string;
    readonly invalidSkillFilePathMessage?: (input: {
        skillName: string;
        filePath: string;
    }) => string;
};
```

## `WriteSkillsResult`

```text
type WriteSkillsResult = {
  changed: boolean;
  written: string[];
  removed: string[];
  unchanged: string[];
};
```

