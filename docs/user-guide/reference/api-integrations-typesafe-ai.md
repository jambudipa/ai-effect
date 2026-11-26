---
title: "Integration API — typesafe-ai"
doc-type: reference
sources: [src/integrations/typesafe-ai.ts, package.json]
---

# typesafe-ai

> **TL;DR:** The `@jambudipa/ai-effect/typesafe-ai` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/typesafe-ai`

## `createTypeSafeAi`

Adapt native TypeSafe AI provider creation to the shared Effect provider boundary.

```text
export declare const createTypeSafeAi: import("../internal/provider-settings.js").ProviderFactory<sdk.TypeSafeAiProviderSettings, "apiKey", {
    decisionModel: (modelId: sdk.Experimental_TypeSafeAiDecisionModelId) => import("effect/Effect").Effect<{
        supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
        doDecide: (options: import("@ai-sdk/provider").Experimental_DecisionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_DecisionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>;
    evaluationModel: (modelId: sdk.Experimental_TypeSafeAiDecisionModelId) => import("effect/Effect").Effect<{
        supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
        doDecide: (options: import("@ai-sdk/provider").Experimental_DecisionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_DecisionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    } & {
        doEvaluate: (options: import("@ai-sdk/provider").Experimental_DecisionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_DecisionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>;
    specificationVersion: "v4";
    languageModel: (modelId: string) => import("effect/Effect").Effect<{
        specificationVersion: "v4";
        provider: string;
        modelId: string;
        readonly supportedUrls: import("effect/Effect").Effect<Record<string, RegExp[]>, import("../internal/operation.js").AiSdkError, never>;
        doGenerate: (options: import("@ai-sdk/provider").LanguageModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").LanguageModelV4GenerateResult, import("../internal/operation.js").AiSdkError, never>;
        doStream: (options: import("@ai-sdk/provider").LanguageModelV4CallOptions) => import("effect/Effect").Effect<{
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").LanguageModelV4StreamPart, import("../internal/operation.js").AiSdkError, never>;
            request?: {
                url?: string;
                body?: unknown;
            };
            response?: {
                headers?: import("@ai-sdk/provider").SharedV4Headers;
            };
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    }, import("../internal/operation.js").AiSdkError, never>;
    embeddingModel: (modelId: string) => import("effect/Effect").Effect<{
        maxEmbeddingsPerCall: import("effect/Effect").Effect<number | undefined, import("../internal/operation.js").AiSdkError, never>;
        supportsParallelCalls: import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
        doEmbed: (options: import("@ai-sdk/provider").EmbeddingModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").EmbeddingModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>;
    imageModel: (modelId: string) => import("effect/Effect").Effect<{
        maxImagesPerCall: (options: {
            modelId: string;
        }) => import("effect/Effect").Effect<number | undefined, import("../internal/operation.js").AiSdkError, never>;
        supportsFileInputs: import("effect/Effect").Effect<boolean | undefined, import("../internal/operation.js").AiSdkError, never>;
        supportsMaskInputs: import("effect/Effect").Effect<boolean | undefined, import("../internal/operation.js").AiSdkError, never>;
        doGenerate: (options: import("@ai-sdk/provider").ImageModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").ImageModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>;
    transcriptionModel: ((modelId: string) => import("effect/Effect").Effect<{
        doGenerate: (options: import("@ai-sdk/provider").TranscriptionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").TranscriptionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        doGenerateFromUrl: ((options: Omit<import("@ai-sdk/provider").TranscriptionModelV4CallOptions, "audio" | "mediaType"> & {
            audio: URL;
        }) => import("effect/Effect").Effect<import("@ai-sdk/provider").TranscriptionModelV4Result | undefined, import("../internal/operation.js").AiSdkError, never>) | undefined;
        doStream: ((options: import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamOptions) => import("effect/Effect").Effect<Omit<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamResult & {
            stream: ReadableStream<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamPart, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    speechModel: ((modelId: string) => import("effect/Effect").Effect<{
        doGenerate: (options: import("@ai-sdk/provider").SpeechModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").SpeechModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        doStream: ((options: import("@ai-sdk/provider").Experimental_SpeechModelV4StreamOptions) => import("effect/Effect").Effect<Omit<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamResult & {
            stream: ReadableStream<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamPart, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    rerankingModel: ((modelId: string) => import("effect/Effect").Effect<{
        doRerank: (options: import("@ai-sdk/provider").RerankingModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").RerankingModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    files: (() => import("effect/Effect").Effect<{
        specificationVersion: "v4";
        provider: string;
        uploadFile: (options: import("@ai-sdk/provider").FilesV4UploadFileCallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").FilesV4UploadFileResult, import("../internal/operation.js").AiSdkError, never>;
        getFileMetadata: ((options: import("@ai-sdk/provider").FilesV4GetFileMetadataCallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").FilesV4GetFileMetadataResult, import("../internal/operation.js").AiSdkError, never>) | undefined;
        downloadFile: ((options: Parameters<(options: import("@ai-sdk/provider").FilesV4DownloadFileCallOptions) => PromiseLike<import("@ai-sdk/provider").FilesV4DownloadFileResult>>[0]) => import("effect/Effect").Effect<{
            content: import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>;
            mediaType?: string;
            providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata;
            warnings: Array<import("@ai-sdk/provider").SharedV4Warning>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>) | undefined;
        deleteFile: ((options: import("@ai-sdk/provider").FilesV4DeleteFileCallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").FilesV4DeleteFileResult, import("../internal/operation.js").AiSdkError, never>) | undefined;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    skills: (() => import("effect/Effect").Effect<{
        specificationVersion: "v4";
        provider: string;
        uploadSkill: (options: Parameters<(params: import("@ai-sdk/provider").SkillsV4UploadSkillCallOptions) => PromiseLike<import("@ai-sdk/provider").SkillsV4UploadSkillResult>>[0]) => import("effect/Effect").Effect<import("@ai-sdk/provider").SkillsV4UploadSkillResult, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
}>;
```

## `Experimental_TypeSafeAiDecisionModelId`

This entry exports `TypeSafeAiDecisionModelId` as `Experimental_TypeSafeAiDecisionModelId`.

```text
type TypeSafeAiDecisionModelId = TypeSafeAiModelIds['decision'] | (string & {});
```

## `Experimental_TypeSafeAiEvaluationModelId`

- **@deprecated** Use `Experimental_TypeSafeAiDecisionModelId` instead.

```text
export type Experimental_TypeSafeAiEvaluationModelId = TypeSafeAiDecisionModelId;
```

## `typeSafeAi`

Resolve the SDK's default provider when the Effect runs.

```text
export declare const typeSafeAi: import("effect/Effect").Effect<{
    decisionModel: (modelId: sdk.Experimental_TypeSafeAiDecisionModelId) => import("effect/Effect").Effect<{
        supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
        doDecide: (options: import("@ai-sdk/provider").Experimental_DecisionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_DecisionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>;
    evaluationModel: (modelId: sdk.Experimental_TypeSafeAiDecisionModelId) => import("effect/Effect").Effect<{
        supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
        doDecide: (options: import("@ai-sdk/provider").Experimental_DecisionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_DecisionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    } & {
        doEvaluate: (options: import("@ai-sdk/provider").Experimental_DecisionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_DecisionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>;
    specificationVersion: "v4";
    languageModel: (modelId: string) => import("effect/Effect").Effect<{
        specificationVersion: "v4";
        provider: string;
        modelId: string;
        readonly supportedUrls: import("effect/Effect").Effect<Record<string, RegExp[]>, import("../internal/operation.js").AiSdkError, never>;
        doGenerate: (options: import("@ai-sdk/provider").LanguageModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").LanguageModelV4GenerateResult, import("../internal/operation.js").AiSdkError, never>;
        doStream: (options: import("@ai-sdk/provider").LanguageModelV4CallOptions) => import("effect/Effect").Effect<{
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").LanguageModelV4StreamPart, import("../internal/operation.js").AiSdkError, never>;
            request?: {
                url?: string;
                body?: unknown;
            };
            response?: {
                headers?: import("@ai-sdk/provider").SharedV4Headers;
            };
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    }, import("../internal/operation.js").AiSdkError, never>;
    embeddingModel: (modelId: string) => import("effect/Effect").Effect<{
        maxEmbeddingsPerCall: import("effect/Effect").Effect<number | undefined, import("../internal/operation.js").AiSdkError, never>;
        supportsParallelCalls: import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
        doEmbed: (options: import("@ai-sdk/provider").EmbeddingModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").EmbeddingModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>;
    imageModel: (modelId: string) => import("effect/Effect").Effect<{
        maxImagesPerCall: (options: {
            modelId: string;
        }) => import("effect/Effect").Effect<number | undefined, import("../internal/operation.js").AiSdkError, never>;
        supportsFileInputs: import("effect/Effect").Effect<boolean | undefined, import("../internal/operation.js").AiSdkError, never>;
        supportsMaskInputs: import("effect/Effect").Effect<boolean | undefined, import("../internal/operation.js").AiSdkError, never>;
        doGenerate: (options: import("@ai-sdk/provider").ImageModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").ImageModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>;
    transcriptionModel: ((modelId: string) => import("effect/Effect").Effect<{
        doGenerate: (options: import("@ai-sdk/provider").TranscriptionModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").TranscriptionModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        doGenerateFromUrl: ((options: Omit<import("@ai-sdk/provider").TranscriptionModelV4CallOptions, "audio" | "mediaType"> & {
            audio: URL;
        }) => import("effect/Effect").Effect<import("@ai-sdk/provider").TranscriptionModelV4Result | undefined, import("../internal/operation.js").AiSdkError, never>) | undefined;
        doStream: ((options: import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamOptions) => import("effect/Effect").Effect<Omit<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamResult & {
            stream: ReadableStream<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamPart, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    speechModel: ((modelId: string) => import("effect/Effect").Effect<{
        doGenerate: (options: import("@ai-sdk/provider").SpeechModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").SpeechModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        doStream: ((options: import("@ai-sdk/provider").Experimental_SpeechModelV4StreamOptions) => import("effect/Effect").Effect<Omit<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamResult & {
            stream: ReadableStream<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamPart>;
        }, "stream"> & {
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamPart, import("../internal/operation.js").AiSdkError, never>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>) | undefined;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    rerankingModel: ((modelId: string) => import("effect/Effect").Effect<{
        doRerank: (options: import("@ai-sdk/provider").RerankingModelV4CallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").RerankingModelV4Result, import("../internal/operation.js").AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    files: (() => import("effect/Effect").Effect<{
        specificationVersion: "v4";
        provider: string;
        uploadFile: (options: import("@ai-sdk/provider").FilesV4UploadFileCallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").FilesV4UploadFileResult, import("../internal/operation.js").AiSdkError, never>;
        getFileMetadata: ((options: import("@ai-sdk/provider").FilesV4GetFileMetadataCallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").FilesV4GetFileMetadataResult, import("../internal/operation.js").AiSdkError, never>) | undefined;
        downloadFile: ((options: Parameters<(options: import("@ai-sdk/provider").FilesV4DownloadFileCallOptions) => PromiseLike<import("@ai-sdk/provider").FilesV4DownloadFileResult>>[0]) => import("effect/Effect").Effect<{
            content: import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>;
            mediaType?: string;
            providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata;
            warnings: Array<import("@ai-sdk/provider").SharedV4Warning>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>) | undefined;
        deleteFile: ((options: import("@ai-sdk/provider").FilesV4DeleteFileCallOptions) => import("effect/Effect").Effect<import("@ai-sdk/provider").FilesV4DeleteFileResult, import("../internal/operation.js").AiSdkError, never>) | undefined;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
    skills: (() => import("effect/Effect").Effect<{
        specificationVersion: "v4";
        provider: string;
        uploadSkill: (options: Parameters<(params: import("@ai-sdk/provider").SkillsV4UploadSkillCallOptions) => PromiseLike<import("@ai-sdk/provider").SkillsV4UploadSkillResult>>[0]) => import("effect/Effect").Effect<import("@ai-sdk/provider").SkillsV4UploadSkillResult, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>) | undefined;
}, import("../internal/operation.js").AiSdkError, never>;
```

## `TypeSafeAiDecisionModelOptions`

```text
type TypeSafeAiDecisionModelOptions = InferSchema<typeof typesafeAiDecisionModelOptions>;
```

## `TypeSafeAiFilePartProviderOptions`

```text
type TypeSafeAiFilePartProviderOptions = InferSchema<typeof typesafeAiFilePartProviderOptions>;
```

## `TypeSafeAiProvider`

Wrapped provider handle with Effect model factories and SDK tool metadata.

```text
export type TypeSafeAiProvider = ReturnType<typeof wrapTypeSafeAi>;
```

## `TypeSafeAiProviderSettings`

TypeSafe AI provider settings with any Effect services needed by the shared factory adapter.

```text
export type TypeSafeAiProviderSettings<E = never, R = never> = EffectProviderSettings<sdk.TypeSafeAiProviderSettings, 'apiKey', E, R>;
```

## `VERSION`

Version reported by the native TypeSafe AI package.

```text
export declare const VERSION: string;
```
