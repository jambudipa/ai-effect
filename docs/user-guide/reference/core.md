---
title: Core API
doc-type: reference
sources:
  [
    src/index.ts,
    src/AiSdk.ts,
    src/core.ts,
    src/core-models.ts,
    src/testing.ts,
    src/internal/operation.ts,
    src/internal/text-stream.ts,
    src/internal/output.ts,
  ]
---

# Core API

> **TL;DR:** The root entry exposes `AiSdk` and the core API. The `ai` subpath
> exposes core functions directly. The `ai/test` subpath provides model fixtures
> and stream fixtures.

### Service and direct functions

| API                                             | Contract                                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `AiSdk`                                         | Effect service key. `AiSdk.layer` installs the bundled implementation.                                                                     |
| `AiSdkService`                                  | Service shape for implementations supplied by the application.                                                                             |
| `generateText`                                  | Effect with text, output, step details, and generation metadata.                                                                           |
| `AiSdk.streamText`                              | Stream of generation events. Each consumer starts a request.                                                                               |
| `streamText`                                    | Scoped Effect with an SDK stream result. It provides `textStream`, `stream`, `fullStream`, and Effect fields for metadata such as `usage`. |
| `experimental_streamTextLowMemory`              | Scoped stream result with a single-consumer buffering mode.                                                                                |
| `embed`, `embedMany`, `rerank`                  | Effects with embedding or ranking results.                                                                                                 |
| `generateImage`, `generateSpeech`, `transcribe` | Effects with the model-specific result and metadata.                                                                                       |
| `ToolLoopAgent`                                 | Agent with Effect `generate` and scoped `stream` operations.                                                                               |

### Other core exports

| Group                    | Representative exports                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Output and validation    | `Output`, `generateObject`, `streamObject`, `asSchema`, `jsonSchema`, `zodSchema`, `validateUIMessages` |
| Tools and stopping       | `tool`, `dynamicTool`, `toolSearch`, `stepCountIs`, `hasToolCall`                                       |
| Providers and middleware | `createGateway`, `createProviderRegistry`, `customProvider`, `wrapLanguageModel`, `wrapEmbeddingModel`  |
| Chat and UI streams      | `DefaultChatTransport`, `DirectChatTransport`, `createUIMessageStream`, `createUIMessageStreamResponse` |
| Files and telemetry      | `createDownload`, `uploadFile`, `uploadSkill`, `registerTelemetry`                                      |
| Experimental operations  | Batch requests, video, realtime, streamed speech, translation, decision, evaluation, and extraction.    |

`Output` exposes `text`, `json`, `choice`, `object`, and `array` as Effect
constructors. Structured output retains the inferred type of its schema. Model
strings follow SDK gateway resolution. Model handles preserve provider types.

`AiSdkError` includes `operation`, `category`, an optional `status`, and an
optional `requestId`. Its original cause is redacted. `AiSdkStreamAborted`
represents an SDK abort event. A `tool-error` event remains part of the event
stream.

The `ai/test` exports include `MockLanguageModelV3`, `MockLanguageModelV4`,
mock providers, model fixtures for other operations, and stream helpers such
as `simulateReadableStream`. Mock constructors use an Effect scope, and their
result handles expose call histories.

See the [SDK surface inventory](../../sdk-surface.json) for the pinned names
behind `ai` and `ai/test`. The package declarations give the wrapper signatures.
See [Scopes and cancellation](../explanation/scopes-and-cancellation.md) for
the stream lifetime and [How to test an AI feature](../how-to/testing/test-an-ai-feature.md)
for fixtures.
