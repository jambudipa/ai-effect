---
title: Core API reference 10
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-errors.ts,
    src/core-message-schema.ts,
    src/core.ts,
    src/index.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 10

> **TL;DR:** Public core and test declarations from `MockImageModelV4` to `OnToolExecutionEndCallback`. Each entry lists its package import and declaration.

## `MockImageModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Construct a registered image model backed by SDK mock results.
Use the registered v4 image test model as a generation input.

```text
declare const MockImageModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").ImageModelV4["provider"];
    modelId?: import("@ai-sdk/provider").ImageModelV4["modelId"];
    maxImagesPerCall?: import("@ai-sdk/provider").ImageModelV4["maxImagesPerCall"];
    supportsFileInputs?: import("@ai-sdk/provider").ImageModelV4["supportsFileInputs"];
    supportsMaskInputs?: import("@ai-sdk/provider").ImageModelV4["supportsMaskInputs"];
    doGenerate?: import("@ai-sdk/provider").ImageModelV4["doGenerate"];
}, Services> | undefined) => Effect.Effect<{
    maxImagesPerCall: (options: {
        modelId: string;
    }) => Effect.Effect<number | undefined, AiSdkError, never>;
    supportsFileInputs: Effect.Effect<boolean | undefined, AiSdkError, never>;
    supportsMaskInputs: Effect.Effect<boolean | undefined, AiSdkError, never>;
    doGenerate: (options: models.ImageModelV4CallOptions) => Effect.Effect<models.ImageModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    readonly model: {
        maxImagesPerCall: (options: {
            modelId: string;
        }) => Effect.Effect<number | undefined, AiSdkError, never>;
        supportsFileInputs: Effect.Effect<boolean | undefined, AiSdkError, never>;
        supportsMaskInputs: Effect.Effect<boolean | undefined, AiSdkError, never>;
        doGenerate: (options: models.ImageModelV4CallOptions) => Effect.Effect<models.ImageModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    };
} & Readonly<Pick<sdk.MockImageModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockImageModelV4 = Effect.Success<ReturnType<typeof MockImageModelV4>>;
```

## `MockLanguageModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate legacy generation and streaming while preserving native v3 call history.
Type the registered v3 language model test double and its exposed call history.

```text
declare const MockLanguageModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").LanguageModelV3["provider"];
    modelId?: import("@ai-sdk/provider").LanguageModelV3["modelId"];
    supportedUrls?: import("@ai-sdk/provider").LanguageModelV3["supportedUrls"] | (() => import("@ai-sdk/provider").LanguageModelV3["supportedUrls"]);
    doGenerate?: import("@ai-sdk/provider").LanguageModelV3["doGenerate"] | models.LanguageModelV3GenerateResult | models.LanguageModelV3GenerateResult[];
    doStream?: import("@ai-sdk/provider").LanguageModelV3["doStream"] | models.LanguageModelV3StreamResult | models.LanguageModelV3StreamResult[];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").LanguageModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").LanguageModelV3["modelId"];
} & {
    readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
} & {
    readonly doGenerate: (options: models.LanguageModelV3CallOptions) => Effect.Effect<models.LanguageModelV3GenerateResult, AiSdkError, never>;
    readonly doStream: (options: models.LanguageModelV3CallOptions) => Effect.Effect<Omit<models.LanguageModelV3StreamResult, "stream"> & {
        stream: import("effect/Stream").Stream<models.LanguageModelV3StreamPart, AiSdkError, never>;
    }, AiSdkError, import("effect/Scope").Scope>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockLanguageModelV3>;
} & Readonly<Pick<sdk.MockLanguageModelV3, "doGenerateCalls" | "doStreamCalls">>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockLanguageModelV3 = Effect.Success<ReturnType<typeof MockLanguageModelV3>>;
```

## `MockLanguageModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate v4 generation and streaming and expose snapshots of native call arguments.
Type the v4 language test model and its native generation and stream call snapshots.

```text
declare const MockLanguageModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").LanguageModelV4["provider"];
    modelId?: import("@ai-sdk/provider").LanguageModelV4["modelId"];
    supportedUrls?: import("@ai-sdk/provider").LanguageModelV4["supportedUrls"] | (() => import("@ai-sdk/provider").LanguageModelV4["supportedUrls"]);
    doGenerate?: import("@ai-sdk/provider").LanguageModelV4["doGenerate"] | models.LanguageModelV4GenerateResult | models.LanguageModelV4GenerateResult[];
    doStream?: import("@ai-sdk/provider").LanguageModelV4["doStream"] | models.LanguageModelV4StreamResult | models.LanguageModelV4StreamResult[];
}, Services> | undefined) => Effect.Effect<{
    specificationVersion: "v4";
    provider: string;
    modelId: string;
    readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
    doGenerate: (options: models.LanguageModelV4CallOptions) => Effect.Effect<models.LanguageModelV4GenerateResult, AiSdkError, never>;
    doStream: (options: models.LanguageModelV4CallOptions) => Effect.Effect<{
        stream: import("effect/Stream").Stream<models.LanguageModelV4StreamPart, AiSdkError, never>;
        request?: {
            url?: string;
            body?: unknown;
        };
        response?: {
            headers?: models.SharedV4Headers;
        };
    }, AiSdkError, import("effect/Scope").Scope>;
} & {
    readonly model: {
        specificationVersion: "v4";
        provider: string;
        modelId: string;
        readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
        doGenerate: (options: models.LanguageModelV4CallOptions) => Effect.Effect<models.LanguageModelV4GenerateResult, AiSdkError, never>;
        doStream: (options: models.LanguageModelV4CallOptions) => Effect.Effect<{
            stream: import("effect/Stream").Stream<models.LanguageModelV4StreamPart, AiSdkError, never>;
            request?: {
                url?: string;
                body?: unknown;
            };
            response?: {
                headers?: models.SharedV4Headers;
            };
        }, AiSdkError, import("effect/Scope").Scope>;
    };
} & Readonly<Pick<sdk.MockLanguageModelV4, "doGenerateCalls" | "doStreamCalls">>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockLanguageModelV4 = Effect.Success<ReturnType<typeof MockLanguageModelV4>>;
```

## `MockLanguageModelV4Options`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** type.

Configure version 4 language model results and callbacks in the test Effect context.

```text
export type MockLanguageModelV4Options<Services = never> = MockOptions<NonNullable<ConstructorParameters<typeof sdk.MockLanguageModelV4>[0]>, Services>;
```

## `MockProviderV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Construct a v3 provider test double with configurable model lookup behavior.
Type a successfully created mock that uses version 3 provider capability names.

```text
declare const MockProviderV3: (settings?: {
    readonly languageModels?: Readonly<Record<string, models.LanguageModelV3>>;
    readonly imageModels?: Readonly<Record<string, models.ImageModelV3>>;
    readonly embeddingModels?: Readonly<Record<string, models.EmbeddingModelV3>>;
    readonly rerankingModels?: Readonly<Record<string, models.RerankingModelV3>>;
    readonly speechModels?: Readonly<Record<string, models.SpeechModelV3>>;
    readonly transcriptionModels?: Readonly<Record<string, models.TranscriptionModelV3>>;
} | undefined) => Effect.Effect<{
    specificationVersion: "v3";
    languageModel: (modelId: string) => Effect.Effect<models.LanguageModelV3, AiSdkError, never>;
    embeddingModel: (modelId: string) => Effect.Effect<models.EmbeddingModelV3, AiSdkError, never>;
    imageModel: (modelId: string) => Effect.Effect<models.ImageModelV3, AiSdkError, never>;
    transcriptionModel: (modelId: string) => Effect.Effect<models.TranscriptionModelV3, AiSdkError, never>;
    speechModel: (modelId: string) => Effect.Effect<models.SpeechModelV3, AiSdkError, never>;
    rerankingModel: (modelId: string) => Effect.Effect<models.RerankingModelV3, AiSdkError, never>;
}, never, never>;
```

```text
export type MockProviderV3 = Effect.Success<ReturnType<typeof MockProviderV3>>;
```

## `MockProviderV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Construct a v4 provider test double with configurable model lookups.
Type a mock provider with version 4 capability names and Effect lookups.

```text
declare const MockProviderV4: (settings?: {
    readonly languageModels?: Readonly<Record<string, {
        specificationVersion: "v4";
        provider: string;
        modelId: string;
        readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
        doGenerate: (options: models.LanguageModelV4CallOptions) => Effect.Effect<models.LanguageModelV4GenerateResult, AiSdkError, never>;
        doStream: (options: models.LanguageModelV4CallOptions) => Effect.Effect<{
            stream: import("effect/Stream").Stream<models.LanguageModelV4StreamPart, AiSdkError, never>;
            request?: {
                url?: string;
                body?: unknown;
            };
            response?: {
                headers?: models.SharedV4Headers;
            };
        }, AiSdkError, import("effect/Scope").Scope>;
    }>>;
    readonly imageModels?: Readonly<Record<string, models.ImageModelV4>>;
    readonly embeddingModels?: Readonly<Record<string, {
        maxEmbeddingsPerCall: Effect.Effect<number | undefined, AiSdkError, never>;
        supportsParallelCalls: Effect.Effect<boolean, AiSdkError, never>;
        doEmbed: (options: models.EmbeddingModelV4CallOptions) => Effect.Effect<models.EmbeddingModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }>>;
    readonly rerankingModels?: Readonly<Record<string, {
        doRerank: (options: models.RerankingModelV4CallOptions) => Effect.Effect<models.RerankingModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }>>;
    readonly speechModels?: Readonly<Record<string, {
        doGenerate: (options: models.SpeechModelV4CallOptions) => Effect.Effect<models.SpeechModelV4Result, AiSdkError, never>;
        doStream: ((options: models.Experimental_SpeechModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_SpeechModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_SpeechModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }>>;
    readonly transcriptionModels?: Readonly<Record<string, {
        doGenerate: (options: models.TranscriptionModelV4CallOptions) => Effect.Effect<models.TranscriptionModelV4Result, AiSdkError, never>;
        doGenerateFromUrl: ((options: Omit<models.TranscriptionModelV4CallOptions, "audio" | "mediaType"> & {
            audio: URL;
        }) => Effect.Effect<models.TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined;
        doStream: ((options: models.Experimental_TranscriptionModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_TranscriptionModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_TranscriptionModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_TranscriptionModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }>>;
} | undefined) => Effect.Effect<{
    specificationVersion: "v4";
    languageModel: (modelId: string) => Effect.Effect<{
        specificationVersion: "v4";
        provider: string;
        modelId: string;
        readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
        doGenerate: (options: models.LanguageModelV4CallOptions) => Effect.Effect<models.LanguageModelV4GenerateResult, AiSdkError, never>;
        doStream: (options: models.LanguageModelV4CallOptions) => Effect.Effect<{
            stream: import("effect/Stream").Stream<models.LanguageModelV4StreamPart, AiSdkError, never>;
            request?: {
                url?: string;
                body?: unknown;
            };
            response?: {
                headers?: models.SharedV4Headers;
            };
        }, AiSdkError, import("effect/Scope").Scope>;
    }, AiSdkError, never>;
    embeddingModel: (modelId: string) => Effect.Effect<{
        maxEmbeddingsPerCall: Effect.Effect<number | undefined, AiSdkError, never>;
        supportsParallelCalls: Effect.Effect<boolean, AiSdkError, never>;
        doEmbed: (options: models.EmbeddingModelV4CallOptions) => Effect.Effect<models.EmbeddingModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, AiSdkError, never>;
    imageModel: (modelId: string) => Effect.Effect<models.ImageModelV4, AiSdkError, never>;
    transcriptionModel: (modelId: string) => Effect.Effect<{
        doGenerate: (options: models.TranscriptionModelV4CallOptions) => Effect.Effect<models.TranscriptionModelV4Result, AiSdkError, never>;
        doGenerateFromUrl: ((options: Omit<models.TranscriptionModelV4CallOptions, "audio" | "mediaType"> & {
            audio: URL;
        }) => Effect.Effect<models.TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined;
        doStream: ((options: models.Experimental_TranscriptionModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_TranscriptionModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_TranscriptionModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_TranscriptionModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, AiSdkError, never>;
    speechModel: (modelId: string) => Effect.Effect<{
        doGenerate: (options: models.SpeechModelV4CallOptions) => Effect.Effect<models.SpeechModelV4Result, AiSdkError, never>;
        doStream: ((options: models.Experimental_SpeechModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_SpeechModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_SpeechModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_SpeechModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, AiSdkError, never>;
    rerankingModel: (modelId: string) => Effect.Effect<{
        doRerank: (options: models.RerankingModelV4CallOptions) => Effect.Effect<models.RerankingModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, AiSdkError, never>;
}, never, never>;
```

```text
export type MockProviderV4 = Effect.Success<ReturnType<typeof MockProviderV4>>;
```

## `MockRerankingModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Create a version 3 reranking test double for legacy model lookup tests.
Use a legacy reranking mock in version 3 document requests.

```text
declare const MockRerankingModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").RerankingModelV3["provider"];
    modelId?: import("@ai-sdk/provider").RerankingModelV3["modelId"];
    doRerank?: import("@ai-sdk/provider").RerankingModelV3["doRerank"];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").RerankingModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").RerankingModelV3["modelId"];
} & {} & {
    readonly doRerank: (options: models.RerankingModelV3CallOptions) => Effect.Effect<{
        ranking: Array<{
            index: number;
            relevanceScore: number;
        }>;
        providerMetadata?: models.SharedV3ProviderMetadata;
        warnings?: Array<models.SharedV3Warning>;
        response?: {
            id?: string;
            timestamp?: Date;
            modelId?: string;
            headers?: models.SharedV3Headers;
            body?: unknown;
        };
    }, AiSdkError, never>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockRerankingModelV3>;
} & Readonly<Pick<sdk.MockRerankingModelV3, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockRerankingModelV3 = Effect.Success<ReturnType<typeof MockRerankingModelV3>>;
```

## `MockRerankingModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Construct a registered reranking model backed by SDK mock results.
Use the registered v4 reranking test model as a document scoring input.

```text
declare const MockRerankingModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").RerankingModelV4["provider"];
    modelId?: import("@ai-sdk/provider").RerankingModelV4["modelId"];
    doRerank?: import("@ai-sdk/provider").RerankingModelV4["doRerank"];
}, Services> | undefined) => Effect.Effect<{
    doRerank: (options: models.RerankingModelV4CallOptions) => Effect.Effect<models.RerankingModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    readonly model: {
        doRerank: (options: models.RerankingModelV4CallOptions) => Effect.Effect<models.RerankingModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    };
} & Readonly<Pick<sdk.MockRerankingModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockRerankingModelV4 = Effect.Success<ReturnType<typeof MockRerankingModelV4>>;
```

## `MockSpeechModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Create a version 3 speech model test double for legacy adapter coverage.
Use a legacy speech model mock in version 3 synthesis requests.

```text
declare const MockSpeechModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").SpeechModelV3["provider"];
    modelId?: import("@ai-sdk/provider").SpeechModelV3["modelId"];
    doGenerate?: import("@ai-sdk/provider").SpeechModelV3["doGenerate"];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").SpeechModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").SpeechModelV3["modelId"];
} & {} & {
    readonly doGenerate: (options: models.SpeechModelV3CallOptions) => Effect.Effect<{
        audio: string | Uint8Array;
        warnings: Array<models.SharedV3Warning>;
        request?: {
            body?: unknown;
        };
        response: {
            timestamp: Date;
            modelId: string;
            headers?: models.SharedV2Headers;
            body?: unknown;
        };
        providerMetadata?: Record<string, models.JSONObject>;
    }, AiSdkError, never>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockSpeechModelV3>;
} & Readonly<Pick<sdk.MockSpeechModelV3, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockSpeechModelV3 = Effect.Success<ReturnType<typeof MockSpeechModelV3>>;
```

## `MockSpeechModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Construct a registered speech synthesis model backed by SDK mock results.
Use the registered v4 speech test model as a synthesis input.

```text
declare const MockSpeechModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").SpeechModelV4["provider"];
    modelId?: import("@ai-sdk/provider").SpeechModelV4["modelId"];
    doGenerate?: import("@ai-sdk/provider").SpeechModelV4["doGenerate"];
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
    };
} & Readonly<Pick<sdk.MockSpeechModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockSpeechModelV4 = Effect.Success<ReturnType<typeof MockSpeechModelV4>>;
```

## `MockTranscriptionModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Create a version 3 transcription test double without a remote audio service.
Use a legacy transcription mock in version 3 audio requests.

```text
declare const MockTranscriptionModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").TranscriptionModelV3["provider"];
    modelId?: import("@ai-sdk/provider").TranscriptionModelV3["modelId"];
    doGenerate?: import("@ai-sdk/provider").TranscriptionModelV3["doGenerate"];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").TranscriptionModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").TranscriptionModelV3["modelId"];
} & {} & {
    readonly doGenerate: (options: models.TranscriptionModelV3CallOptions) => Effect.Effect<{
        text: string;
        segments: Array<{
            text: string;
            startSecond: number;
            endSecond: number;
        }>;
        language: string | undefined;
        durationInSeconds: number | undefined;
        warnings: Array<models.SharedV3Warning>;
        request?: {
            body?: string;
        };
        response: {
            timestamp: Date;
            modelId: string;
            headers?: models.SharedV3Headers;
            body?: unknown;
        };
        providerMetadata?: Record<string, models.JSONObject>;
    }, AiSdkError, never>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockTranscriptionModelV3>;
} & Readonly<Pick<sdk.MockTranscriptionModelV3, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockTranscriptionModelV3 = Effect.Success<ReturnType<typeof MockTranscriptionModelV3>>;
```

## `MockTranscriptionModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Construct a registered transcription model backed by SDK mock results.
Use the registered v4 transcription test model as an audio request input.

```text
declare const MockTranscriptionModelV4: <Services = never>(options?: MockOptions<{
    provider?: NativeTranscription["provider"];
    modelId?: NativeTranscription["modelId"];
    doGenerate?: NativeTranscription["doGenerate"];
    doStream?: NativeTranscription["doStream"];
    doGenerateFromUrl?: NativeTranscription["doGenerateFromUrl"];
}, Services> | undefined) => Effect.Effect<{
    doGenerate: (options: models.TranscriptionModelV4CallOptions) => Effect.Effect<models.TranscriptionModelV4Result, AiSdkError, never>;
    doGenerateFromUrl: ((options: Omit<models.TranscriptionModelV4CallOptions, "audio" | "mediaType"> & {
        audio: URL;
    }) => Effect.Effect<models.TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined;
    doStream: ((options: models.Experimental_TranscriptionModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_TranscriptionModelV4StreamResult & {
        stream: ReadableStream<models.Experimental_TranscriptionModelV4StreamPart>;
    }, "stream"> & {
        stream: import("effect/Stream").Stream<models.Experimental_TranscriptionModelV4StreamPart, AiSdkError, never>;
    }, AiSdkError, import("effect/Scope").Scope>) | undefined;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    readonly model: {
        doGenerate: (options: models.TranscriptionModelV4CallOptions) => Effect.Effect<models.TranscriptionModelV4Result, AiSdkError, never>;
        doGenerateFromUrl: ((options: Omit<models.TranscriptionModelV4CallOptions, "audio" | "mediaType"> & {
            audio: URL;
        }) => Effect.Effect<models.TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined;
        doStream: ((options: models.Experimental_TranscriptionModelV4StreamOptions) => Effect.Effect<Omit<models.Experimental_TranscriptionModelV4StreamResult & {
            stream: ReadableStream<models.Experimental_TranscriptionModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<models.Experimental_TranscriptionModelV4StreamPart, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    };
} & Readonly<Pick<sdk.MockTranscriptionModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockTranscriptionModelV4 = Effect.Success<ReturnType<typeof MockTranscriptionModelV4>>;
```

## `mockValues`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value.

Build a lazy supplier that advances through the SDK mock value sequence on execution.

```text
declare const mockValues: <A>(...values: A[]) => Effect.Effect<() => Effect.Effect<A, AiSdkError, never>, AiSdkError, never>;
```

## `MockVideoModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Create a version 3 video test double for legacy model registration tests.
Use a legacy video mock through its version 3 model handle.

```text
declare const MockVideoModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").Experimental_VideoModelV3["provider"];
    modelId?: import("@ai-sdk/provider").Experimental_VideoModelV3["modelId"];
    maxVideosPerCall?: import("@ai-sdk/provider").Experimental_VideoModelV3["maxVideosPerCall"];
    doGenerate?: import("@ai-sdk/provider").Experimental_VideoModelV3["doGenerate"];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").Experimental_VideoModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").Experimental_VideoModelV3["modelId"];
} & {} & {
    readonly doGenerate: (options: models.Experimental_VideoModelV3CallOptions) => Effect.Effect<{
        videos: Array<models.Experimental_VideoModelV3VideoData>;
        warnings: Array<models.SharedV3Warning>;
        providerMetadata?: models.SharedV3ProviderMetadata;
        response: {
            timestamp: Date;
            modelId: string;
            headers: Record<string, string> | undefined;
        };
    }, AiSdkError, never>;
} & {
    readonly maxVideosPerCall: (options: {
        modelId: string;
    }) => Effect.Effect<number | undefined, AiSdkError>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockVideoModelV3>;
} & Readonly<Pick<sdk.MockVideoModelV3, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockVideoModelV3 = Effect.Success<ReturnType<typeof MockVideoModelV3>>;
```

## `MockVideoModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Create a version 4 video model mock with Effect-compatible webhook callbacks.
Use the registered v4 video test model for requests and webhook assertions.

```text
declare const MockVideoModelV4: <Services = never>(options?: MockVideoOptions<Services>) => Effect.Effect<{
    maxVideosPerCall: (options: {
        modelId: string;
    }) => Effect.Effect<number | undefined, AiSdkError, never>;
    doGenerate: ((options: models.Experimental_VideoModelV4CallOptions) => Effect.Effect<models.Experimental_VideoModelV4Result, AiSdkError, never>) | undefined;
    doStart: ((options: models.Experimental_VideoModelV4CallOptions & {
        webhookUrl?: string;
    }) => Effect.Effect<models.Experimental_VideoModelV4OperationStartResult, AiSdkError, never>) | undefined;
    doStatus: ((options: {
        operation: models.JSONValue;
        abortSignal?: AbortSignal;
        headers?: Record<string, string | undefined>;
    }) => Effect.Effect<models.Experimental_VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined;
    handleWebhookOption: (<E, R, E2, R2>(options: {
        readonly webhook: () => Effect.Effect<{
            readonly url: string;
            readonly received: Effect.Effect<models.Experimental_VideoModelV4OperationWebhook<models.JSONValue>, E2, R2>;
        }, E, R>;
    }) => Effect.Effect<{
        webhookUrl: string;
        received: Effect.Effect<models.Experimental_VideoModelV4OperationWebhook<models.JSONValue>, AiSdkError, never>;
    }, AiSdkError, import("effect/Scope").Scope | R | R2>) | undefined;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    readonly model: {
        maxVideosPerCall: (options: {
            modelId: string;
        }) => Effect.Effect<number | undefined, AiSdkError, never>;
        doGenerate: ((options: models.Experimental_VideoModelV4CallOptions) => Effect.Effect<models.Experimental_VideoModelV4Result, AiSdkError, never>) | undefined;
        doStart: ((options: models.Experimental_VideoModelV4CallOptions & {
            webhookUrl?: string;
        }) => Effect.Effect<models.Experimental_VideoModelV4OperationStartResult, AiSdkError, never>) | undefined;
        doStatus: ((options: {
            operation: models.JSONValue;
            abortSignal?: AbortSignal;
            headers?: Record<string, string | undefined>;
        }) => Effect.Effect<models.Experimental_VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined;
        handleWebhookOption: (<E, R, E2, R2>(options: {
            readonly webhook: () => Effect.Effect<{
                readonly url: string;
                readonly received: Effect.Effect<models.Experimental_VideoModelV4OperationWebhook<models.JSONValue>, E2, R2>;
            }, E, R>;
        }) => Effect.Effect<{
            webhookUrl: string;
            received: Effect.Effect<models.Experimental_VideoModelV4OperationWebhook<models.JSONValue>, AiSdkError, never>;
        }, AiSdkError, import("effect/Scope").Scope | R | R2>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    };
} & Readonly<Pick<sdk.MockVideoModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockVideoModelV4 = Effect.Success<ReturnType<typeof MockVideoModelV4>>;
```

## `ModelInfo`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Common model information used across callback events.

```text
type ModelInfo = {
  /** The provider identifier (e.g., 'openai', 'anthropic'). */
  readonly provider: string;
  /** The specific model identifier (e.g., 'gpt-4o'). */
  readonly modelId: string;
};
```

## `ModelMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A message that can be used in the `messages` field of a prompt.
It can be a user message, an assistant message, or a tool message.

```text
type ModelMessage = SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage;
```

## `modelMessageSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Validate the role-discriminated message union before sending history to a model.

```text
declare const modelMessageSchema: import("./core-schema.js").Schema<sdk.ModelMessage, never>;
```

## `NoContentGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a response without the expected generated content with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a response without the expected generated content.
`NoContentGeneratedError.isInstance` checks its SDK cause.

```text
declare const NoContentGeneratedError: {
    new (args_0?: {
        message?: string;
    } | undefined): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoContentGeneratedError = AiSdkError;
```

## `NoImageGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an image request that produces no image.
Shared Effect error type used for an image request that produces no image.

```text
declare const NoImageGeneratedError: {
    new (args_0: {
        message?: string;
        cause?: Error;
        calls?: Array<sdk.GenerateImageCall>;
        responses?: Array<sdk.ImageModelResponseMetadata>;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoImageGeneratedError = AiSdkError;
```

## `NoObjectGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an object request that produces no valid object.
Shared Effect error type used for an object request that produces no valid object.

```text
declare const NoObjectGeneratedError: {
    new (args_0: {
        message?: string;
        cause?: Error;
        text?: string;
        response: Omit<sdk.LanguageModelResponseMetadata, "messages">;
        usage: sdk.LanguageModelUsage;
        finishReason: sdk.FinishReason;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoObjectGeneratedError = AiSdkError;
```

## `NoOutputGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for generation that produces no usable output.
Shared Effect error type used for generation that produces no usable output.

```text
declare const NoOutputGeneratedError: {
    new (args_0?: {
        message?: string;
        cause?: Error;
    } | undefined): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoOutputGeneratedError = AiSdkError;
```

## `NoSpeechGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a speech request that produces no synthesized audio.
Shared Effect error type used for a speech request that produces no synthesized audio.

```text
declare const NoSpeechGeneratedError: {
    new (options: {
        responses: Array<sdk.SpeechModelResponseMetadata>;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoSpeechGeneratedError = AiSdkError;
```

## `NoSuchModelError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a model selection failure for an unavailable model with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a model selection failure for an unavailable model.
`NoSuchModelError.isInstance` checks its SDK cause.

```text
declare const NoSuchModelError: {
    new (args_0: {
        errorName?: string;
        modelId: string;
        modelType: "languageModel" | "embeddingModel" | "imageModel" | "transcriptionModel" | "speechModel" | "rerankingModel" | "videoModel" | "decisionModel" | "extractionModel" | "evaluationModel";
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoSuchModelError = AiSdkError;
```

## `NoSuchProviderError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a provider identifier absent from the registry.
Shared Effect error type used for a provider identifier absent from the registry.

```text
declare const NoSuchProviderError: {
    new (args_0: {
        modelId: string;
        modelType: "languageModel" | "embeddingModel" | "imageModel" | "transcriptionModel" | "speechModel" | "rerankingModel" | "videoModel" | "decisionModel" | "extractionModel" | "evaluationModel";
        providerId: string;
        availableProviders: string[];
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoSuchProviderError = AiSdkError;
```

## `NoSuchProviderReferenceError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap an unresolved provider reference with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for an unresolved provider reference.
`NoSuchProviderReferenceError.isInstance` checks its SDK cause.

```text
declare const NoSuchProviderReferenceError: {
    new (args_0: {
        provider: string;
        reference: sdk.SharedV4ProviderReference;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoSuchProviderReferenceError = AiSdkError;
```

## `NoSuchToolError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a requested tool name absent from the tool set.
Shared Effect error type used for a requested tool name absent from the tool set.

```text
declare const NoSuchToolError: {
    new (args_0: {
        toolName: string;
        availableTools?: string[] | undefined;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoSuchToolError = AiSdkError;
```

## `NoTranscriptGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an audio request that produces no transcription.
Shared Effect error type used for an audio request that produces no transcription.

```text
declare const NoTranscriptGeneratedError: {
    new (options: {
        responses: Array<sdk.TranscriptionModelResponseMetadata>;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoTranscriptGeneratedError = AiSdkError;
```

## `NoTranslationGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a translation request that produces no translated result.
Shared Effect error type used for a translation request that produces no translated result.

```text
declare const NoTranslationGeneratedError: {
    new (options: {
        response: {
            timestamp: Date;
            modelId: string;
            headers?: Record<string, string>;
        };
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type NoTranslationGeneratedError = AiSdkError;
```

## `NoVideoGeneratedError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a video request that produces no video.
Shared Effect error type used for a video request that produces no video.

```text
declare const NoVideoGeneratedError: {
    new (args_0: {
        message?: string;
        cause?: unknown;
        responses: Array<{
            timestamp: Date;
            modelId: string;
            headers?: Record<string, string>;
            providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata;
        }>;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
} & {
    /** @deprecated Use `isInstance` instead. */
    isNoVideoGeneratedError: (error: unknown) => error is AiSdkError;
};
```

```text
export type NoVideoGeneratedError = AiSdkError;
```

## `ObjectStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ObjectStreamPart<PARTIAL> = {
  type: 'object';
  object: PARTIAL;
} | {
  type: 'text-delta';
  textDelta: string;
} | {
  type: 'error';
  error: unknown;
} | {
  type: 'finish';
  finishReason: FinishReason;
  usage: LanguageModelUsage;
  response: Omit<LanguageModelResponseMetadata, 'messages'>;
  providerMetadata?: ProviderMetadata;
};
```

## `OnFinishEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the final generation outcome with the application's tool and context types.

```text
export type GenerateTextEndEvent<T extends EffectTools = EffectTools, R extends Context = Context> = CoreEvent<sdk.GenerateTextEndEvent<BoundTools<T>, R>, T>;
```

## `OnLanguageModelCallEndCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the native call boundary after a model request ends.

```text
export type OnLanguageModelCallEndCallback<T extends EffectTools = EffectTools, S = never> = CoreCallback<sdk.OnLanguageModelCallEndCallback<BoundTools<T>>, S, T>;
```

## `OnLanguageModelCallStartCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the native call boundary before a language model request starts.

```text
export type OnLanguageModelCallStartCallback<S = never> = CoreCallback<sdk.OnLanguageModelCallStartCallback, S>;
```

## `OnStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the effective generation settings as the SDK starts a run.

```text
export type GenerateTextStartEvent<T extends EffectTools = EffectTools, R extends Context = Context, O extends Output = Output> = CoreEvent<sdk.GenerateTextStartEvent<BoundTools<T>, R, Native<O>>, T>;
```

## `OnStepFinishEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe one completed step for usage, result, and tool bookkeeping.

```text
export type GenerateTextStepEndEvent<T extends EffectTools = EffectTools, R extends Context = Context> = CoreEvent<sdk.GenerateTextStepEndEvent<BoundTools<T>, R>, T>;
```

## `OnStepStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe per-step settings and context before a model call starts.

```text
export type GenerateTextStepStartEvent<T extends EffectTools = EffectTools, R extends Context = Context, O extends Output = Output> = CoreEvent<sdk.GenerateTextStepStartEvent<BoundTools<T>, R, Native<O>>, T>;
```

## `OnToolCallFinishEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type OnToolCallFinishEvent<TOOLS extends ToolSet = ToolSet> = ToolExecutionEndEvent<TOOLS>;
```

## `OnToolCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type OnToolCallStartEvent<TOOLS extends ToolSet = ToolSet> = ToolExecutionStartEvent<TOOLS>;
```

## `OnToolExecutionEndCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe a tool handler's outcome in the same operation context as its start event.

```text
export type OnToolExecutionEndCallback<T extends EffectTools = EffectTools, S = never> = CoreCallback<sdk.OnToolExecutionEndCallback<BoundTools<T>>, S, T>;
```
