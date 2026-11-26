---
title: Core API reference 09
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-errors.ts,
    src/core-middleware.ts,
    src/core-schema.ts,
    src/core-tools.ts,
    src/core-utilities.ts,
    src/core.ts,
    src/index.ts,
    src/internal/chat-transport.ts,
    src/internal/language-model.ts,
    src/protocols/provider-errors.ts,
    src/protocols/provider-utils/test.ts,
    src/testing.ts,
  ]
---

# Core API reference 09

> **TL;DR:** Public core and test declarations from `isCustomContentUIPart` to `MockImageModelV3`. Each entry lists its package import and declaration.

## `isCustomContentUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Distinguish provider-defined custom content before reading its payload.

```text
declare const isCustomContentUIPart: (part: UIMessagePart<UIDataTypes, UITools>) => part is CustomContentUIPart;
```

## `isDataUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Recognize application data parts by the SDK `data-` discriminator prefix.

```text
declare const isDataUIPart: <Data extends UIDataTypes>(part: UIMessagePart<Data, UITools>) => part is DataUIPart<Data>;
```

## `isDeepEqualData`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Compare structured data with the SDK equality rules inside a lazy effect.

```text
declare const isDeepEqualData: (left: unknown, right: unknown) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isDynamicToolUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Recognize a tool whose name was supplied at runtime.

```text
declare const isDynamicToolUIPart: (part: UIMessagePart<UIDataTypes, UITools>) => part is DynamicToolUIPart;
```

## `isFileUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Identify a file attachment before reading its media type and URL.

```text
declare const isFileUIPart: (part: UIMessagePart<UIDataTypes, UITools>) => part is FileUIPart;
```

## `isLoopFinished`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Leave normal completion to the SDK loop by supplying no additional stopping condition.

```text
declare const isLoopFinished: () => () => boolean;
```

## `isReasoningFileUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Recognize a file that belongs to a reasoning step.

```text
declare const isReasoningFileUIPart: (part: UIMessagePart<UIDataTypes, UITools>) => part is ReasoningFileUIPart;
```

## `isReasoningUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Recognize a reasoning text part before rendering it alongside the answer.

```text
declare const isReasoningUIPart: (part: UIMessagePart<UIDataTypes, UITools>) => part is ReasoningUIPart;
```

## `isStaticToolUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Recognize statically registered tools by the `tool-` discriminator prefix.

```text
declare const isStaticToolUIPart: <Tools extends UITools>(part: UIMessagePart<UIDataTypes, Tools>) => part is ToolUIPart<Tools>;
```

## `isStepCount`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Stop when the number of completed steps equals the specified count.

```text
declare const isStepCount: (stepCount: number) => ({ steps }: Steps) => boolean;
```

## `isTextUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Select plain response text from the mixed UI message parts.

```text
declare const isTextUIPart: (part: UIMessagePart<UIDataTypes, UITools>) => part is TextUIPart;
```

## `isToolOutputErrorUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Identify a tool execution failure before reading the error output fields.

```text
declare const isToolOutputErrorUIPart: <Tools extends UITools>(part: UIMessagePart<UIDataTypes, Tools>) => part is ToolOutputErrorUIPart<Tools>;
```

## `isToolUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Accept both registered and runtime-discovered tools without inspecting their output state.

```text
declare const isToolUIPart: <Tools extends UITools>(part: UIMessagePart<UIDataTypes, Tools>) => part is ToolUIPart<Tools> | DynamicToolUIPart;
```

## `JSONParseError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a failure to parse an SDK JSON payload with the native arguments and expose its SDK
type guard.
Use the shared `AiSdkError` type for a failure to parse an SDK JSON payload.
`JSONParseError.isInstance` checks its SDK cause.

```text
declare const JSONParseError: {
    new (args_0: {
        text: string;
        cause: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type JSONParseError = AiSdkError;
```

## `jsonSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Register a lazy JSON Schema document and an optional Effect validation callback.

```text
declare const jsonSchema: <A = unknown, R = never>(document: SchemaDocument<R>, options?: {
    readonly validate?: ValidateFunction<A, R>;
}) => Effect.Effect<Schema<A, R>>;
```

## `JSONSchema7`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
export interface JSONSchema7 {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: JSONSchema7Version | undefined;
    $comment?: string | undefined;

    /**
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
     */
    $defs?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
     */
    type?: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
    enum?: JSONSchema7Type[] | undefined;
    const?: JSONSchema7Type | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
     */
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
     */
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
     */
    items?: JSONSchema7Definition | JSONSchema7Definition[] | undefined;
    additionalItems?: JSONSchema7Definition | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;
    patternProperties?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;
    additionalProperties?: JSONSchema7Definition | undefined;
    dependencies?: {
        [key: string]: JSONSchema7Definition | string[];
    } | undefined;
    propertyNames?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: JSONSchema7Definition | undefined;
    then?: JSONSchema7Definition | undefined;
    else?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: JSONSchema7Definition[] | undefined;
    anyOf?: JSONSchema7Definition[] | undefined;
    oneOf?: JSONSchema7Definition[] | undefined;
    not?: JSONSchema7Definition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
     */
    format?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
     */
    contentMediaType?: string | undefined;
    contentEncoding?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: {
        [key: string]: JSONSchema7Definition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
     */
    title?: string | undefined;
    description?: string | undefined;
    default?: JSONSchema7Type | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    examples?: JSONSchema7Type | undefined;
}
```

## `JsonToSseTransformStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Create paired web-stream endpoints for serializing JSON values as server-sent events.
Type the readable and writable endpoints that share one SSE transform.

```text
declare const JsonToSseTransformStream: () => Effect.Effect<{
    readable: ReadableStream<string>;
    writable: WritableStream<unknown>;
}, import("./internal/operation.js").AiSdkError, never>;
```

```text
export type JsonToSseTransformStream = Effect.Success<ReturnType<typeof JsonToSseTransformStream>>;
```

## `JSONValue`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type JSONValue$1 = JSONValue;
```

## `LanguageModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept SDK registry IDs and supported native model versions at the Core boundary.

```text
export type LanguageModel = Extract<SdkLanguageModel, string> | LanguageModelV2 | LanguageModelV3 | LanguageModelV4;
```

## `LanguageModelCallEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe a completed language model call with public tool bindings.

```text
export type LanguageModelCallEndEvent<T extends EffectTools = EffectTools> = CoreEvent<sdk.LanguageModelCallEndEvent<BoundTools<T>>, T>;
```

## `LanguageModelCallOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Model-facing generation controls. These settings influence how the model
generates its response (token limits, sampling, penalties, stop sequences,
seed, reasoning).

```text
type LanguageModelCallOptions = {
  /**
   * Maximum number of tokens to generate.
   */
  maxOutputTokens?: number;
  /**
   * Temperature setting. The range depends on the provider and model.
   *
   * It is recommended to set either `temperature` or `topP`, but not both.
   */
  temperature?: number;
  /**
   * Nucleus sampling. This is a number between 0 and 1.
   *
   * E.g. 0.1 would mean that only tokens with the top 10% probability mass
   * are considered.
   *
   * It is recommended to set either `temperature` or `topP`, but not both.
   */
  topP?: number;
  /**
   * Only sample from the top K options for each subsequent token.
   *
   * Used to remove "long tail" low probability responses.
   * Recommended for advanced use cases only. You usually only need to use temperature.
   */
  topK?: number;
  /**
   * Presence penalty setting. It affects the likelihood of the model to
   * repeat information that is already in the prompt.
   *
   * The presence penalty is a number between -1 (increase repetition)
   * and 1 (maximum penalty, decrease repetition). 0 means no penalty.
   */
  presencePenalty?: number;
  /**
   * Frequency penalty setting. It affects the likelihood of the model
   * to repeatedly use the same words or phrases.
   *
   * The frequency penalty is a number between -1 (increase repetition)
   * and 1 (maximum penalty, decrease repetition). 0 means no penalty.
   */
  frequencyPenalty?: number;
  /**
   * Stop sequences.
   * If set, the model will stop generating text when one of the stop sequences is generated.
   * Providers may have limits on the number of stop sequences.
   */
  stopSequences?: string[];
  /**
   * The seed (integer) to use for random sampling. If set and supported
   * by the model, calls will generate deterministic results.
   */
  seed?: number;
  /**
   * Reasoning effort level for the model. Controls how much reasoning
   * the model performs before generating a response.
   *
   * Use `'provider-default'` to use the provider's default reasoning level.
   * Use `'none'` to disable reasoning (if supported by the provider).
   */
  reasoning?: LanguageModelV4CallOptions['reasoning'];
};
```

## `LanguageModelCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onLanguageModelCallStart` callback.

Called immediately before the provider model call begins.
Unlike `onStepStart`, this only represents model invocation work.

```text
type LanguageModelCallStartEvent = ModelInfo & {
  /** Unique identifier for this generation call, used to correlate events. */
  readonly callId: string;
  /** Prepared tool definitions for the model call, if any. */
  readonly tools: ReadonlyArray<Record<string, unknown>> | undefined;
} & StandardizedPrompt & LanguageModelCallOptions;
```

## `LanguageModelMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Transform language model parameters and wrap generation or streaming with Effect callbacks.

```text
export type LanguageModelMiddleware<R = never> = Identity<LanguageModelV4> & {
    readonly overrideSupportedUrls?: (options: {
        model: LanguageModelV4;
    }) => Middleware<R, Record<string, RegExp[]>>;
    readonly transformParams?: (options: LanguageArgs & {
        type: 'generate' | 'stream';
    }) => Middleware<R, LanguageArgs['params']>;
    readonly wrapGenerate?: (options: LanguageNext) => Middleware<R, native.LanguageModelV4GenerateResult>;
    readonly wrapStream?: (options: LanguageNext) => Middleware<R, LanguageStream>;
};
```

## `LanguageModelRequestMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Metadata for a language model request.

```text
type LanguageModelRequestMetadata = {
  /** HTTP origin used for this request, without URL credentials, paths, queries or fragments. */
  readonly url?: string;
  /**
   * The input messages that were sent to the model for this step.
   */
  readonly messages?: Array<ModelMessage>;
  /**
   * Request HTTP body that was sent to the provider API.
   */
  readonly body?: unknown;
};
```

## `LanguageModelResponseMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Metadata for a language model response.

```text
type LanguageModelResponseMetadata = {
  /**
   * The response messages that were generated during the call.
   * Response messages can be either assistant messages or tool messages.
   * They contain a generated id.
   */
  readonly messages: Array<ResponseMessage>;
  /**
   * ID for the generated response.
   */
  readonly id: string;
  /**
   * Timestamp for the start of the generated response.
   */
  readonly timestamp: Date;
  /**
   * The ID of the response model that was used to generate the response.
   */
  readonly modelId: string;
  /**
   * Response headers (available only for providers that use HTTP requests).
   */
  readonly headers?: Record<string, string>;
  /**
   * Response body (available only for providers that use HTTP requests).
   */
  readonly body?: unknown;
};
```

## `LanguageModelStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Type the model-call stream's events with the registered tool set.

```text
export type LanguageModelStreamPart<T extends EffectTools = EffectTools> = sdk.LanguageModelStreamPart<BoundTools<T>>;
```

## `LanguageModelUsage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Represents the number of tokens used in a prompt and completion.

```text
type LanguageModelUsage = {
  /**
   * The total number of input (prompt) tokens used.
   */
  inputTokens: number | undefined;
  /**
   * Detailed information about the input tokens.
   */
  inputTokenDetails: {
    /**
     * The number of non-cached input (prompt) tokens used.
     */
    noCacheTokens: number | undefined;
    /**
     * The number of cached input (prompt) tokens read.
     */
    cacheReadTokens: number | undefined;
    /**
     * The number of cached input (prompt) tokens written.
     */
    cacheWriteTokens: number | undefined;
  };
  /**
   * The number of total output (completion) tokens used.
   */
  outputTokens: number | undefined;
  /**
   * Detailed information about the output tokens.
   */
  outputTokenDetails: {
    /**
     * The number of text tokens used.
     */
    textTokens: number | undefined;
    /**
     * The number of reasoning tokens used.
     */
    reasoningTokens: number | undefined;
  };
  /**
   * The total number of tokens used.
   */
  totalTokens: number | undefined;
  /**
   * Raw usage information from the provider.
   *
   * This is the usage information in the shape that the provider returns.
   * It can include additional information that is not part of the standard usage information.
   */
  raw?: JSONObject;
};
```

## `LanguageModelV4`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

An Effect handle to a v4 SDK language model.

```text
export type LanguageModelV4 = ReturnType<typeof wrapLanguageModel>;
```

## `lastAssistantMessageIsCompleteWithApprovalResponses`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Check whether the last assistant message can resume after approval responses arrive.

```text
declare const lastAssistantMessageIsCompleteWithApprovalResponses: (options: {
    messages: sdk.UIMessage[];
}) => Effect.Effect<boolean, AiSdkError, never>;
```

## `lastAssistantMessageIsCompleteWithToolCalls`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Check whether the last assistant message has completed the UI tool-call round.

```text
declare const lastAssistantMessageIsCompleteWithToolCalls: (options: {
    messages: sdk.UIMessage[];
}) => Effect.Effect<boolean, AiSdkError, never>;
```

## `LoadAPIKeyError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap an SDK API key lookup failure with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for an SDK API key lookup failure.
`LoadAPIKeyError.isInstance` checks its SDK cause.

```text
declare const LoadAPIKeyError: {
    new (args_0: {
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type LoadAPIKeyError = AiSdkError;
```

## `LoadSettingError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap an SDK configuration lookup failure with the native arguments and expose its SDK
type guard.
Use the shared `AiSdkError` type for an SDK configuration lookup failure.
`LoadSettingError.isInstance` checks its SDK cause.

```text
declare const LoadSettingError: {
    new (args_0: {
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type LoadSettingError = AiSdkError;
```

## `LogWarningsFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Report SDK warnings through a callback that can depend on Effect services.

```text
export type LogWarningsFunction<S = never> = CoreCallback<sdk.LogWarningsFunction, S>;
```

## `makeChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Supply Effect commands for a custom transport used in a framework host.

```text
declare const makeChatTransport: <Message extends UIMessage = UIMessage>(handlers: ChatTransportHandlers<Message>) => ChatTransport<Message>;
```

## `MessageConversionError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a failed conversion from UI history to a model message.
Shared Effect error type used for a failed conversion from UI history to a model message.

```text
declare const MessageConversionError: {
    new (args_0: {
        originalMessage: Omit<sdk.UIMessage, "id">;
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type MessageConversionError = AiSdkError;
```

## `MissingToolResultsError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a previous tool call whose required result is absent.
Shared Effect error type used for a previous tool call whose required result is absent.

```text
declare const MissingToolResultsError: {
    new (args_0: {
        toolCallIds: string[];
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type MissingToolResultsError = AiSdkError;
```

## `MockEmbeddingModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate legacy embeddings and retain the tested call arguments.
Type the registered v3 embedding test double and its exposed call history.

```text
declare const MockEmbeddingModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").EmbeddingModelV3["provider"];
    modelId?: import("@ai-sdk/provider").EmbeddingModelV3["modelId"];
    maxEmbeddingsPerCall?: import("@ai-sdk/provider").EmbeddingModelV3["maxEmbeddingsPerCall"] | null;
    supportsParallelCalls?: import("@ai-sdk/provider").EmbeddingModelV3["supportsParallelCalls"];
    doEmbed?: import("@ai-sdk/provider").EmbeddingModelV3["doEmbed"] | Awaited<ReturnType<import("@ai-sdk/provider").EmbeddingModelV3["doEmbed"]>> | Awaited<ReturnType<import("@ai-sdk/provider").EmbeddingModelV3["doEmbed"]>>[];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").EmbeddingModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").EmbeddingModelV3["modelId"];
} & {
    readonly maxEmbeddingsPerCall: Effect.Effect<number | undefined, AiSdkError, never>;
    readonly supportsParallelCalls: Effect.Effect<boolean, AiSdkError, never>;
} & {
    readonly doEmbed: (options: models.EmbeddingModelV3CallOptions) => Effect.Effect<models.EmbeddingModelV3Result, AiSdkError, never>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockEmbeddingModelV3>;
} & Readonly<Pick<sdk.MockEmbeddingModelV3, "doEmbedCalls">>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockEmbeddingModelV3 = Effect.Success<ReturnType<typeof MockEmbeddingModelV3>>;
```

## `MockEmbeddingModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate v4 embeddings and expose native call history for assertions.
Type the v4 embedding test model and its exposed call snapshots.

```text
declare const MockEmbeddingModelV4: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").EmbeddingModelV4["provider"];
    modelId?: import("@ai-sdk/provider").EmbeddingModelV4["modelId"];
    maxEmbeddingsPerCall?: import("@ai-sdk/provider").EmbeddingModelV4["maxEmbeddingsPerCall"] | null;
    maxInputBytesPerCall?: PromiseLike<number | undefined> | number | undefined;
    supportsParallelCalls?: import("@ai-sdk/provider").EmbeddingModelV4["supportsParallelCalls"];
    doEmbed?: import("@ai-sdk/provider").EmbeddingModelV4["doEmbed"] | Awaited<ReturnType<import("@ai-sdk/provider").EmbeddingModelV4["doEmbed"]>> | Awaited<ReturnType<import("@ai-sdk/provider").EmbeddingModelV4["doEmbed"]>>[];
}, Services> | undefined) => Effect.Effect<{
    maxEmbeddingsPerCall: Effect.Effect<number | undefined, AiSdkError, never>;
    supportsParallelCalls: Effect.Effect<boolean, AiSdkError, never>;
    doEmbed: (options: models.EmbeddingModelV4CallOptions) => Effect.Effect<models.EmbeddingModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    [EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL]: Effect.Effect<number | undefined, AiSdkError, never>;
} & {
    readonly model: {
        maxEmbeddingsPerCall: Effect.Effect<number | undefined, AiSdkError, never>;
        supportsParallelCalls: Effect.Effect<boolean, AiSdkError, never>;
        doEmbed: (options: models.EmbeddingModelV4CallOptions) => Effect.Effect<models.EmbeddingModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    } & {
        [EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL]: Effect.Effect<number | undefined, AiSdkError, never>;
    };
} & Readonly<Pick<sdk.MockEmbeddingModelV4, "doEmbedCalls">>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockEmbeddingModelV4 = Effect.Success<ReturnType<typeof MockEmbeddingModelV4>>;
```

## `mockId`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value.

Create a deterministic fixture ID generator whose successive reads run in Effect.

```text
declare const mockId: (options?: Parameters<typeof sdk.mockId>[0]) => Effect.Effect<IdGenerator, AiSdkError, never>;
```

## `MockImageModelV3`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Create a version 3 image model test double for legacy adapter coverage.
Use a legacy image model mock where a version 3 request is expected.

```text
declare const MockImageModelV3: <Services = never>(options?: MockOptions<{
    provider?: import("@ai-sdk/provider").ImageModelV3["provider"];
    modelId?: import("@ai-sdk/provider").ImageModelV3["modelId"];
    maxImagesPerCall?: import("@ai-sdk/provider").ImageModelV3["maxImagesPerCall"];
    doGenerate?: import("@ai-sdk/provider").ImageModelV3["doGenerate"];
}, Services> | undefined) => Effect.Effect<{
    readonly specificationVersion: "v3";
    readonly provider: import("@ai-sdk/provider").ImageModelV3["provider"];
    readonly modelId: import("@ai-sdk/provider").ImageModelV3["modelId"];
} & {} & {
    readonly doGenerate: (options: models.ImageModelV3CallOptions) => Effect.Effect<{
        images: Array<string> | Array<Uint8Array>;
        warnings: Array<models.SharedV3Warning>;
        providerMetadata?: models.ImageModelV3ProviderMetadata;
        response: {
            timestamp: Date;
            modelId: string;
            headers: Record<string, string> | undefined;
        };
        usage?: models.ImageModelV3Usage;
    }, AiSdkError, never>;
} & {
    readonly maxImagesPerCall: (options: {
        modelId: string;
    }) => Effect.Effect<number | undefined, AiSdkError>;
} & {
    readonly model: import("./internal/legacy-model.js").LegacyModel<sdk.MockImageModelV3>;
} & Readonly<Pick<sdk.MockImageModelV3, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type MockImageModelV3 = Effect.Success<ReturnType<typeof MockImageModelV3>>;
```
