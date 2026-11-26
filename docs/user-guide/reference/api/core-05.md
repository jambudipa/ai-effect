---
title: Core API reference 05
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-experimental.ts,
    src/core-models.ts,
    src/core-realtime.ts,
    src/core-tools.ts,
    src/core.ts,
    src/index.ts,
    src/testing.ts,
  ]
---

# Core API reference 05

> **TL;DR:** Public core and test declarations from `experimental_filterActiveTools` to `Experimental_SandboxFileStat`. Each entry lists its package import and declaration.

## `experimental_filterActiveTools`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Remove inactive tool definitions without cloning the original set when no restriction applies.

```text
export declare function filterActiveTools<Tools extends EffectTools | undefined, Active extends ActiveTools<NonNullable<Tools>>>({ tools, activeTools, }: {
    readonly tools: Tools;
    readonly activeTools: Active;
}): ActiveToolSubset<Tools, Active>;
```

## `Experimental_GeneratedImage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_GeneratedImage = GeneratedFile;
```

## `experimental_generateSpeech`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Synthesize speech and expose the generated audio through lazy encoding accessors.

```text
declare const generateSpeech: <R = never>(options: Options<Parameters<typeof sdk.generateSpeech>[0], SpeechModel, R>) => Effect.Effect<sdk.SpeechResult, AiSdkError, R>;
```

## `experimental_generateVideo`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Run video generation to completion with the caller's timeout, signal, and optional webhook.

```text
declare const experimental_generateVideo: <R = never>(options: VideoOptions<R>) => Effect.Effect<sdk.GenerateVideoResult, AiSdkError, R>;
```

## `experimental_getBatchResults`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Stream available batch results under a scope that owns cancellation and result parsing.

```text
declare const experimental_getBatchResults: <Tools extends EffectTools = {}, A = string, P = string, I = never, R = never>(options: BatchResultsOptions<Tools, A, P, I, R>) => Stream.Stream<sdk.Experimental_BatchItemResult<BoundTools<Tools>, sdk.Output.Output<A, P, I> | undefined>, AiSdkError, Exclude<R, Scope.Scope> | Exclude<import("./internal/tool.js").ToolRequirements<Tools[keyof Tools]>, Scope.Scope>>;
```

## `Experimental_GetBatchResultsOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer result streaming options from the tools and optional output parser.

```text
export type Experimental_GetBatchResultsOptions<Tools extends EffectTools = {}, Output = undefined> = BatchResultsOptions<Tools, SelectedOutput<Output>[0], SelectedOutput<Output>[1], SelectedOutput<Output>[2], SelectedOutput<Output>[3]>;
```

## `experimental_getBatchStatus`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Read the current state of an existing batch job with caller cancellation.

```text
declare const experimental_getBatchStatus: (options: BatchOptions<NativeBatchStatusOptions>) => Effect.Effect<import("@ai-sdk/provider").Experimental_BatchV4Status, AiSdkError, never>;
```

## `Experimental_GetBatchStatusOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a batch provider handle or accessor alongside the native status lookup options.

```text
export type Experimental_GetBatchStatusOptions = BatchOptions<NativeBatchStatusOptions>;
```

## `experimental_getRealtimeToolDefinitions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Bind the caller's Effect tools before generating native realtime tool definitions.

```text
declare const experimental_getRealtimeToolDefinitions: <Tools extends EffectTools>(options: RealtimeDefinitions<Parameters<typeof sdk.experimental_getRealtimeToolDefinitions<BoundTools<Tools>>>[0], Tools>) => Effect.Effect<import("@ai-sdk/provider").Experimental_RealtimeModelV4ToolDefinition[], AiSdkError, ToolServices<Tools>>;
```

## `experimental_getVideoStatus`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Query a video job through the same model capability that submitted it.

```text
declare const experimental_getVideoStatus: (model: VideoModel, options: NativeGetVideoStatusOptions) => Effect.Effect<import("@ai-sdk/provider").Experimental_VideoModelV4OperationStatusResult, AiSdkError, never>;
```

## `Experimental_ImageBatchGenerationResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A normalized result for a successful image batch item.

```text
type ImageBatchGenerationResult = {
  readonly images: Array<GeneratedFile>;
  readonly warnings: Array<Warning>;
  readonly response: ImageModelResponseMetadata;
  readonly providerMetadata?: ImageModelV4ProviderMetadata;
  readonly usage?: ImageModelUsage;
};
```

## `Experimental_ImageBatchItemResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A complete terminal result for one request in an image batch.

```text
type ImageBatchItemResult = {
  readonly type: 'image';
} & ((ImageBatchGenerationResult & {
  readonly id: string;
  readonly status: 'succeeded';
}) | {
  readonly id: string;
  readonly status: 'failed';
  readonly error: BatchError;
  readonly providerMetadata?: ProviderMetadata;
} | {
  readonly id: string;
  readonly status: 'cancelled' | 'expired';
  readonly error?: BatchError;
  readonly providerMetadata?: ProviderMetadata;
});
```

## `Experimental_ImageBatchRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

One image generation request within a batch.

```text
type ImageBatchRequest<ModelId extends string = string> = {
  id: string;
  type: 'image';
  model: ModelId;
  prompt: GenerateImagePrompt;
  n?: number;
  size?: `${number}x${number}`;
  aspectRatio?: `${number}:${number}`;
  seed?: number;
  providerOptions?: ProviderOptions;
};
```

## `Experimental_InferAgentUIMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the UI message type of an agent.

```text
type InferAgentUIMessage<AGENT, MESSAGE_METADATA = unknown> = UIMessage<MESSAGE_METADATA, never, InferUITools<InferAgentTools<AGENT>>>;
```

## `Experimental_LanguageModelStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Type the model-call stream's events with the registered tool set.

```text
export type LanguageModelStreamPart<T extends EffectTools = EffectTools> = sdk.LanguageModelStreamPart<BoundTools<T>>;
```

## `experimental_listBatches`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

List jobs with the provided paging and filtering options or use the SDK defaults.

```text
declare const experimental_listBatches: (options?: BatchOptions<NativeBatchListOptions>) => Effect.Effect<sdk.Experimental_ListBatchesResult, AiSdkError, never>;
```

## `Experimental_ListBatchesOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a batch provider handle or accessor alongside native list and paging options.

```text
export type Experimental_ListBatchesOptions = BatchOptions<NativeBatchListOptions>;
```

## `Experimental_ListBatchesResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

One page of listed batches.

```text
type ListBatchesResult = {
  readonly batches: Array<Batch>;
  readonly nextCursor?: string;
  readonly providerMetadata?: ProviderMetadata;
};
```

## `Experimental_LogWarningsFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Report SDK warnings through a callback that can depend on Effect services.

```text
export type LogWarningsFunction<S = never> = CoreCallback<sdk.LogWarningsFunction, S>;
```

## `Experimental_MockSpeechTranslationModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate the SDK's speech translation model without a remote audio service.
Use the registered speech translation test model for audio translation.

```text
declare const Experimental_MockSpeechTranslationModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").Experimental_SpeechTranslationModelV4["provider"];
    modelId?: import("@ai-sdk/provider").Experimental_SpeechTranslationModelV4["modelId"];
    doStream?: import("@ai-sdk/provider").Experimental_SpeechTranslationModelV4["doStream"];
}, Services> | undefined) => Effect.Effect<{
    doStream: (options: models.Experimental_SpeechTranslationModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechTranslationModelV4StreamResult & {
        stream: ReadableStream<models.Experimental_SpeechTranslationModelV4StreamPart>;
    }, "stream"> & {
        stream: import("effect/Stream").Stream<models.Experimental_SpeechTranslationModelV4StreamPart, AiSdkError, never>;
    }, AiSdkError, import("effect/Scope").Scope>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    readonly model: {
        doStream: (options: models.Experimental_SpeechTranslationModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechTranslationModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_SpeechTranslationModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_SpeechTranslationModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    };
} & Readonly<Pick<sdk.Experimental_MockSpeechTranslationModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type Experimental_MockSpeechTranslationModelV4 = Effect.Success<ReturnType<typeof Experimental_MockSpeechTranslationModelV4>>;
```

## `Experimental_MockStreamingSpeechModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate streaming speech through the SDK model test double.
Use the registered streaming speech test model for incremental audio tests.

```text
declare const Experimental_MockStreamingSpeechModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").Experimental_StreamingSpeechModelV4["provider"];
    modelId?: import("@ai-sdk/provider").Experimental_StreamingSpeechModelV4["modelId"];
    doGenerate?: import("@ai-sdk/provider").Experimental_StreamingSpeechModelV4["doGenerate"];
    doStream?: import("@ai-sdk/provider").Experimental_StreamingSpeechModelV4["doStream"];
}, Services> | undefined) => Effect.Effect<{
    doGenerate: (options: models.SpeechModelV4CallOptions) => Effect.Effect<models.SpeechModelV4Result, AiSdkError, never>;
    doStream: ((options: models.Experimental_SpeechModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechModelV4StreamResult & {
        stream: ReadableStream<models.Experimental_SpeechModelV4StreamPart>;
    }, "stream"> & {
        stream: import("effect/Stream").Stream<models.Experimental_SpeechModelV4StreamPart, AiSdkError, never>;
    }, AiSdkError, import("effect/Scope").Scope>) | undefined;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    doStream: (options: models.Experimental_SpeechModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechModelV4StreamResult & {
        stream: ReadableStream<models.Experimental_SpeechModelV4StreamPart>;
    }, "stream"> & {
        stream: import("effect/Stream").Stream<models.Experimental_SpeechModelV4StreamPart, AiSdkError, never>;
    }, AiSdkError, import("effect/Scope").Scope>;
} & {
    readonly model: {
        doGenerate: (options: models.SpeechModelV4CallOptions) => Effect.Effect<models.SpeechModelV4Result, AiSdkError, never>;
        doStream: ((options: models.Experimental_SpeechModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_SpeechModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_SpeechModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    } & {
        doStream: (options: models.Experimental_SpeechModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_SpeechModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_SpeechModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>;
    };
} & Readonly<Pick<sdk.Experimental_MockStreamingSpeechModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type Experimental_MockStreamingSpeechModelV4 = Effect.Success<ReturnType<typeof Experimental_MockStreamingSpeechModelV4>>;
```

## `Experimental_RealtimeClientEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeClientEvent = Experimental_RealtimeModelV4ClientEvent;
```

## `Experimental_RealtimeFactory`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Type the adapter factory that creates Effect-backed realtime model handles.

```text
export type Experimental_RealtimeFactory = ReturnType<typeof wrapRealtimeFactory>;
```

## `Experimental_RealtimeFactoryGetTokenOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeFactoryGetTokenOptions = Experimental_RealtimeFactoryV4GetTokenOptions;
```

## `Experimental_RealtimeFactoryGetTokenResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeFactoryGetTokenResult = Experimental_RealtimeFactoryV4GetTokenResult;
```

## `Experimental_RealtimeModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Represent a model that supports the version 4 realtime protocol.

```text
export type Experimental_RealtimeModel = RealtimeModelV4;
```

## `Experimental_RealtimeServerConnection`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeServerConnection = Experimental_RealtimeModelV4ServerConnection;
```

## `Experimental_RealtimeServerEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeServerEvent = Experimental_RealtimeModelV4ServerEvent;
```

## `Experimental_RealtimeSessionConfig`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeSessionConfig = Experimental_RealtimeModelV4SessionConfig;
```

## `Experimental_RealtimeSessionIntent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeSessionIntent = Experimental_RealtimeModelV4SessionIntent;
```

## `Experimental_RealtimeSessionOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Preserve native session configuration and replace SDK callbacks with Effect functions.

```text
export type Experimental_RealtimeSessionOptions<R = never> = {
    [Name in keyof NativeOptions]: Name extends 'model' ? RealtimeModelV4 : Name extends 'onToolCall' ? (args: ToolCall) => Effect.Effect<unknown, unknown, R> : Name extends 'onEvent' ? (event: ServerEvent) => Effect.Effect<void, unknown, R> : Name extends 'onError' ? (error: Error) => Effect.Effect<void, unknown, R> : NativeOptions[Name];
};
```

## `Experimental_RealtimeSessionState`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeSessionState = {
  delegationMode?: 'client' | 'provider';
  sessionId?: string;
  transcripts: Extract<RealtimeServerEvent, {
    type: 'transcript-fragment';
  }>[];
  delegations: Extract<RealtimeServerEvent, {
    type: 'delegation-created';
  }>[];
  usage?: {
    seconds: number;
  };
  finalization: 'pending' | 'confirmed' | 'unconfirmed';
  terminationReason?: string;
  isInputMuted: boolean;
};
```

## `Experimental_RealtimeSetupResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Response shape for the realtime setup/token endpoint.
The client uses this to establish a WebSocket connection and
configure the session with tool definitions.

```text
type RealtimeSetupResponse = {
  token: string;
  url: string;
  expiresAt?: number;
  tools?: RealtimeToolDefinition[];
};
```

## `Experimental_RealtimeState`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
interface RealtimeState {
  status: RealtimeStatus;
  messages: UIMessage[];
  events: RealtimeServerEvent[];
  isCapturing: boolean;
  isPlaying: boolean;
  session?: RealtimeSessionState;
}
```

## `Experimental_RealtimeStatus`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeStatus = 'disconnected' | 'connecting' | 'connected' | 'closing' | 'error';
```

## `Experimental_RealtimeToolDefinition`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeToolDefinition = Experimental_RealtimeModelV4ToolDefinition;
```

## `Experimental_RealtimeUsage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type RealtimeUsage = Experimental_RealtimeModelV4Usage;
```

## `experimental_resampleAudio`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resample audio with the SDK rate options and report conversion errors through Effect.

```text
declare const experimental_resampleAudio: (...args: Parameters<typeof sdk.experimental_resampleAudio>) => Float32Array<ArrayBufferLike>;
```

## `Experimental_SandboxDirectoryEntry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Entry in a directory listing, returned by `SandboxSession.listDirectory`.

```text
type SandboxDirectoryEntry = {
  /**
   * Name of the entry, without the directory path.
   */
  name: string;
  /**
   * Type of the entry. Symbolic links are reported as `symlink` and not
   * followed. `other` covers devices, sockets, and named pipes.
   */
  type: 'file' | 'directory' | 'symlink' | 'other';
};
```

## `Experimental_SandboxFileStat`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Information about a file or directory in the sandbox, returned by
`SandboxSession.stat`. Symbolic links are followed.

```text
type SandboxFileStat = {
  /**
   * Type of the path. `other` covers devices, sockets, and named pipes.
   */
  type: 'file' | 'directory' | 'other';
  /**
   * Size in bytes. The size of a directory is implementation-defined.
   */
  size: number;
};
```
