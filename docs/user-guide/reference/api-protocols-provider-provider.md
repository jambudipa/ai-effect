---
title: '@jambudipa/ai-effect/provider API'
doc-type: reference
sources: [src/protocols, src/internal, src/core-middleware.ts, package.json]
---

# @jambudipa/ai-effect/provider API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/provider`. Conditions: `types`.

## `AISDKError`

Wrap a general SDK failure with the native arguments and expose its SDK type guard.
Use the shared `AiSdkError` type for a general SDK failure. `AISDKError.isInstance`
checks its SDK cause.

```text
AISDKError: {
    new (args_0: {
        name: string;
        message: string;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type AISDKError = AiSdkError;
```

## `APICallError`

Wrap a provider API request failure with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for a provider API request failure.
`APICallError.isInstance` checks its SDK cause.

```text
APICallError: {
    new (args_0: {
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode?: number;
        responseHeaders?: Record<string, string>;
        responseBody?: string;
        cause?: unknown;
        isRetryable?: boolean;
        data?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type APICallError = AiSdkError;
```

## `EmbeddingModelV2`

Preserve the SDK protocol for v2 embedding generation, with the native embedding input
retained and lift model operations into Effect.

```text
export type EmbeddingModelV2<Value> = LegacyModel<sdk.EmbeddingModelV2<Value>>;
```

## `EmbeddingModelV2Embedding`

An embedding is a vector, i.e. an array of numbers.
It is e.g. used to represent a text as a vector of word embeddings.

```text
export type EmbeddingModelV2Embedding = Array<number>;
```

## `EmbeddingModelV3`

Preserve the SDK protocol for v3 embedding generation and its batching limits and lift
model operations into Effect.

```text
export type EmbeddingModelV3 = LegacyModel<sdk.EmbeddingModelV3>;
```

## `EmbeddingModelV3CallOptions`

The public declaration does not include a description.

```text
export type EmbeddingModelV3CallOptions = {
  /**
   * List of text values to generate embeddings for.
   */
  values: Array<string>;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: SharedV3Headers;
};
```

## `EmbeddingModelV3Embedding`

An embedding is a vector, i.e. an array of numbers.
It is e.g. used to represent a text as a vector of word embeddings.

```text
export type EmbeddingModelV3Embedding = Array<number>;
```

## `EmbeddingModelV3Middleware`

Wrap v3 embedding calls while preserving native middleware fields and model metadata.

```text
export type EmbeddingModelV3Middleware<R = never> = LegacyMiddleware<sdk.EmbeddingModelV3Middleware, EmbeddingModelV3, R>;
```

## `EmbeddingModelV3Result`

The result of a embedding model doEmbed call.

```text
export type EmbeddingModelV3Result = {
  /**
   * Generated embeddings. They are in the same order as the input values.
   */
  embeddings: Array<EmbeddingModelV3Embedding>;
  /**
   * Token usage. We only have input tokens for embeddings.
   */
  usage?: {
    tokens: number;
  };
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV3ProviderMetadata;
  /**
   * Optional response information for debugging purposes.
   */
  response?: {
    /**
     * Response headers.
     */
    headers?: SharedV3Headers;
    /**
     * The response body.
     */
    body?: unknown;
  };
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV3Warning>;
};
```

## `EmbeddingModelV4`

Use an embedding model handle already registered with the native bridge.

```text
export type EmbeddingModelV4 = ReturnType<typeof wrapEmbeddingModel>;
```

## `EmbeddingModelV4CallOptions`

The public declaration does not include a description.

```text
export type EmbeddingModelV4CallOptions = {
  /**
   * List of text values to generate embeddings for.
   */
  values: Array<string>;
  /**
   * The requested number of dimensions for the output embeddings.
   * Must be a positive integer. Support and allowed values depend on the model
   * and provider implementation.
   */
  dimensions?: number;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: SharedV4Headers;
};
```

## `EmbeddingModelV4Embedding`

An embedding is a vector, i.e. an array of numbers.
It is e.g. used to represent a text as a vector of word embeddings.

```text
export type EmbeddingModelV4Embedding = Array<number>;
```

## `EmbeddingModelV4Middleware`

Preserve the v4-specific import name for the embedding middleware contract.

```text
export type EmbeddingModelV4Middleware<R = never> = EmbeddingModelMiddleware<R>;
```

## `EmbeddingModelV4Result`

The result of a embedding model doEmbed call.

```text
export type EmbeddingModelV4Result = {
  /**
   * Generated embeddings. They are in the same order as the input values.
   */
  embeddings: Array<EmbeddingModelV4Embedding>;
  /**
   * Token usage. We only have input tokens for embeddings.
   */
  usage?: {
    tokens: number;
  };
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Optional response information for debugging purposes.
   */
  response?: {
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * The response body.
     */
    body?: unknown;
  };
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `EmptyResponseBodyError`

Wrap a provider response with no body with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for a provider response with no body.
`EmptyResponseBodyError.isInstance` checks its SDK cause.

```text
EmptyResponseBodyError: {
    new (args_0?: {
        message?: string;
    } | undefined): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type EmptyResponseBodyError = AiSdkError;
```

## `Experimental_BatchV4`

Use a registered batch API while retaining its provider-specific model IDs.

```text
export type BatchV4<ModelIds extends Experimental_BatchV4ModelIds = Experimental_BatchV4ModelIds> = ReturnType<typeof wrapBatch<ModelIds>>;
```

## `Experimental_BatchV4CancelResult`

Result of requesting cancellation of a batch.

```text
type BatchV4CancelResult = {
  readonly providerMetadata?: SharedV4ProviderMetadata;
};
```

## `Experimental_BatchV4Error`

Serializable error information for a batch or batch item.

```text
type BatchV4Error = {
  readonly message: string;
  readonly type?: string;
  readonly code?: string;
  readonly statusCode?: number;
};
```

## `Experimental_BatchV4ItemResult`

A complete terminal result for one request in a batch, discriminated by
modality.

Additional modality-specific item results can be added to this union.

```text
type BatchV4ItemResult = TextBatchV4ItemResult | ImageBatchV4ItemResult;
```

## `Experimental_BatchV4ListItem`

A batch returned by a list operation.

```text
type BatchV4ListItem = BatchV4Status & {
  readonly batchId: string;
};
```

## `Experimental_BatchV4ListOptions`

Options for listing batches.

```text
type BatchV4ListOptions = BatchV4CallOptions & {
  readonly limit?: number;
  readonly cursor?: string;
};
```

## `Experimental_BatchV4ListResult`

Result of listing batches.

```text
type BatchV4ListResult = {
  readonly batches: Array<BatchV4ListItem>;
  readonly nextCursor?: string;
  readonly providerMetadata?: SharedV4ProviderMetadata;
};
```

## `Experimental_BatchV4ModelIds`

Model IDs accepted by each batch modality.

Additional modality-specific model ID types can be added to this mapping.

```text
type BatchV4ModelIds = {
  readonly text?: string;
  readonly image?: string;
};
```

## `Experimental_BatchV4OperationOptions`

Options for a batch status or results operation.

```text
type BatchV4OperationOptions = {
  readonly batchId: string;
} & BatchV4CallOptions;
```

## `Experimental_BatchV4Request`

The public declaration does not include a description.

```text
type BatchV4Request<ModelIds extends BatchV4ModelIds = BatchV4ModelIds> = TextBatchV4Request<ModelIds['text'] & string> | ImageBatchV4Request<ModelIds['image'] & string>;
```

## `Experimental_BatchV4RequestBase`

Fields shared by every request in a batch.

```text
type BatchV4RequestBase<ModelId extends string = string> = {
  /**
   * Application-provided identifier used to correlate the request with its
   * result.
   */
  readonly id: string;
  /**
   * Provider-specific model ID for this request.
   */
  readonly modelId: ModelId;
};
```

## `Experimental_BatchV4StartOptions`

Options for starting a batch of requests discriminated by modality.

Additional modality-specific request variants can be added to
`BatchV4Request`.

```text
type BatchV4StartOptions<ModelIds extends BatchV4ModelIds = BatchV4ModelIds> = BatchV4StartCallOptions & {
  readonly requests: ReadonlyArray<BatchV4Request<ModelIds>>;
};
```

## `Experimental_BatchV4StartResult`

Result of starting a batch.

```text
type BatchV4StartResult = BatchV4Status & {
  readonly batchId: string;
  readonly warnings: Array<{
    readonly requestId?: string;
    readonly warning: SharedV4Warning;
  }>;
};
```

## `Experimental_BatchV4Status`

Normalized lifecycle status for a batch.

```text
type BatchV4Status = {
  readonly status: 'pending' | 'completed' | 'failed';
  readonly rawStatus?: string;
  readonly requestCounts?: {
    readonly total: number;
    readonly pending: number;
    readonly completed: number;
    readonly failed: number;
  };
  readonly error?: BatchV4Error;
  readonly createdAt?: string;
  readonly expiresAt?: string;
  readonly providerMetadata?: SharedV4ProviderMetadata;
};
```

## `Experimental_DecisionModelV4`

Use a registered decision model for structured question responses.

```text
export type DecisionModelV4 = ReturnType<typeof wrapDecisionModel>;
```

## `Experimental_DecisionModelV4Answer`

The public declaration does not include a description.

```text
type DecisionModelV4Answer = {
  type: 'choice';
  /** The selected option, with maximal probability when a distribution exists. */
  choice: string;
  /** Complete distribution over the question's options, when available. */
  probabilities?: Record<string, number>;
} | {
  type: 'score';
  /** Fractional position in [0, number of levels - 1]. */
  score: number;
  /**
   * Complete distribution, keyed by zero-based level indices as strings.
   * When supplied, score is its probability-weighted mean.
   */
  probabilities?: Record<string, number>;
} | {
  type: 'box';
  /** Edges in [0, 1], measured from the image's top-left corner. */
  box: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
} | {
  type: 'boolean';
  /** Model-estimated P(true), in [0, 1]. Not confidence in either outcome. */
  probability: number;
} | {
  /** The model declined to answer this question. Valid for any question type. */
  type: 'refusal';
};
```

## `Experimental_DecisionModelV4CallOptions`

The public declaration does not include a description.

```text
type DecisionModelV4CallOptions = {
  state: DecisionModelV4State;
  questions: Readonly<Record<string, DecisionModelV4Question>>;
  maxOutputTokens?: number;
  /** Reasoning effort for supported models. Language-model adapters default to none. */
  reasoning?: LanguageModelV4CallOptions['reasoning'];
  abortSignal?: AbortSignal;
  headers?: SharedV4Headers;
  providerOptions?: SharedV4ProviderOptions;
};
```

## `Experimental_DecisionModelV4Input`

Content for decision instructions and criteria descriptions.

```text
type DecisionModelV4Input = string | Readonly<JSONObject> | readonly JSONValue[];
```

## `Experimental_DecisionModelV4Question`

A judgment to make about the shared state.

```text
type DecisionModelV4Question = {
  readonly type: 'choice';
  /** May be omitted or null when supported by the provider and criteria define the judgment. */
  readonly instructions?: DecisionModelV4Input | null;
  /** Nonempty map of option names to descriptions. Null means no description. */
  readonly criteria: Readonly<Record<string, DecisionModelV4Input | null>>;
} | {
  readonly type: 'score';
  /** May be omitted or null when supported by the provider and criteria define the judgment. */
  readonly instructions?: DecisionModelV4Input | null;
  /** At least one ordered level, indexed from zero. Providers may require more. */
  readonly criteria: readonly (DecisionModelV4Input | null)[];
} | {
  readonly type: 'box';
  /** May be omitted or null when supported by the provider. */
  readonly instructions?: DecisionModelV4Input | null;
} | {
  readonly type: 'boolean';
  /** May be omitted or null when supported by the provider and criteria define the judgment. */
  readonly instructions?: DecisionModelV4Input | null;
  /** At least one non-null description is required when instructions are absent. */
  readonly criteria?: {
    readonly true?: DecisionModelV4Input | null;
    readonly false?: DecisionModelV4Input | null;
  } | null;
};
```

## `Experimental_DecisionModelV4Result`

The public declaration does not include a description.

```text
type DecisionModelV4Result = {
  /** Exactly one answer per question, under the original question IDs. */
  answers: Record<string, DecisionModelV4Answer>;
  /**
   * Decimal places used when the provider rounds its output. Omit for full
   * precision. Core allows half a unit in the last place per rounded value
   * when checking distribution sums and weighted scores, preserving the values.
   */
  rounding?: {
    probabilityDecimals?: number;
    scoreDecimals?: number;
  };
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  warnings: SharedV4Warning[];
  providerMetadata?: SharedV4ProviderMetadata;
  response?: {
    id?: string;
    timestamp?: Date;
    modelId?: string;
    headers?: SharedV4Headers;
    body?: unknown;
  };
};
```

## `Experimental_DecisionModelV4State`

The public declaration does not include a description.

```text
type DecisionModelV4State = readonly DecisionModelV4StatePart[];
```

## `Experimental_DecisionModelV4StatePart`

The public declaration does not include a description.

```text
type DecisionModelV4StatePart = LanguageModelV4TextPart | LanguageModelV4FilePart | {
  type: 'json';
  value: JSONValue;
};
```

## `Experimental_DecisionRefusalError`

Wrap a decision model refusal with the native arguments and expose its SDK type guard.
Use the shared `AiSdkError` type for a decision model refusal.
`Experimental_DecisionRefusalError.isInstance` checks its SDK cause.

```text
Experimental_DecisionRefusalError: {
    new (args_0: {
        questionIds: string[];
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type Experimental_DecisionRefusalError = AiSdkError;
```

## `Experimental_DecisionUnsupportedQuestionTypeError`

Wrap a question kind unsupported by the decision model with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a question kind unsupported by the decision model.
`Experimental_DecisionUnsupportedQuestionTypeError.isInstance` checks its SDK cause.

```text
Experimental_DecisionUnsupportedQuestionTypeError: {
    new (args_0: {
        questionId: string;
        questionType: string;
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type Experimental_DecisionUnsupportedQuestionTypeError = AiSdkError;
```

## `Experimental_EvaluationModelV4`

Run v4 evaluation requests through Effect while preserving the evaluation SDK protocol.

```text
export type Experimental_EvaluationModelV4 = ReturnType<typeof wrapEvaluationModel>;
```

## `Experimental_EvaluationModelV4Answer`

The public declaration does not include a description.

**@deprecated**: Use `Experimental_DecisionModelV4Answer` instead.

```text
export type Experimental_EvaluationModelV4Answer = DecisionModelV4Answer;
```

## `Experimental_EvaluationModelV4CallOptions`

The public declaration does not include a description.

**@deprecated**: Use `Experimental_DecisionModelV4CallOptions` instead.

```text
export type Experimental_EvaluationModelV4CallOptions = DecisionModelV4CallOptions;
```

## `Experimental_EvaluationModelV4Input`

The public declaration does not include a description.

**@deprecated**: Use `Experimental_DecisionModelV4Input` instead.

```text
export type Experimental_EvaluationModelV4Input = DecisionModelV4Input;
```

## `Experimental_EvaluationModelV4Question`

The public declaration does not include a description.

**@deprecated**: Use `Experimental_DecisionModelV4Question` instead.

```text
export type Experimental_EvaluationModelV4Question = DecisionModelV4Question;
```

## `Experimental_EvaluationModelV4Result`

The public declaration does not include a description.

**@deprecated**: Use `Experimental_DecisionModelV4Result` instead.

```text
export type Experimental_EvaluationModelV4Result = DecisionModelV4Result;
```

## `Experimental_EvaluationUnsupportedQuestionTypeError`

Wrap a question kind unsupported by the evaluation model with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a question kind unsupported by the evaluation
model. `Experimental_EvaluationUnsupportedQuestionTypeError.isInstance` checks its SDK
cause.

```text
Experimental_EvaluationUnsupportedQuestionTypeError: {
    new (args_0: {
        questionId: string;
        questionType: string;
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type Experimental_EvaluationUnsupportedQuestionTypeError = AiSdkError;
```

## `Experimental_ExtractionModelV4`

Use a registered extraction model for structured field responses.

```text
export type ExtractionModelV4 = ReturnType<typeof wrapExtractionModel>;
```

## `Experimental_ExtractionModelV4Answer`

The public declaration does not include a description.

```text
type ExtractionModelV4Answer = ValueAnswer<'text', string> | ValueAnswer<'number', number> | ValueAnswer<'date', string> | ValueAnswer<'time', string> | ValueAnswer<'datetime', string> | ValueAnswer<'duration', number> | {
  type: 'list';
  /** Null when the state does not contain a value for the field. */
  value: string[] | number[] | null;
  /** Probability in [0, 1] that the state does not contain a value. */
  pNull?: number;
  /** Confidence in [0, 1] that `value` is correct. */
  confidence?: number;
  /** One entry per value item, when available. */
  items?: Array<{
    confidence?: number;
    source?: ExtractionModelV4Source;
  }>;
} | {
  /** The model declined to extract this field. Valid for any field type. */
  type: 'refusal';
};
```

## `Experimental_ExtractionModelV4CallOptions`

The public declaration does not include a description.

```text
type ExtractionModelV4CallOptions = {
  /** Ordered text, file, and JSON parts. Answer sources index into this array. */
  state: DecisionModelV4State;
  fields: Readonly<Record<string, ExtractionModelV4Field>>;
  /** `YYYY-MM-DD` date that anchors relative dates and dates without a year. */
  referenceDate?: string;
  maxOutputTokens?: number;
  /** Reasoning effort for supported models. */
  reasoning?: LanguageModelV4CallOptions['reasoning'];
  abortSignal?: AbortSignal;
  headers?: SharedV4Headers;
  providerOptions?: SharedV4ProviderOptions;
};
```

## `Experimental_ExtractionModelV4DurationUnit`

The public declaration does not include a description.

```text
type ExtractionModelV4DurationUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
```

## `Experimental_ExtractionModelV4Field`

A typed value to extract from the shared state.

```text
type ExtractionModelV4Field = {
  /** Free text, returned as a string. */
  readonly type: 'text';
  readonly instructions?: ExtractionModelV4Input | null;
} | {
  /** A number, returned as a finite number. */
  readonly type: 'number';
  readonly instructions?: ExtractionModelV4Input | null;
  /** Unit the value should be expressed in, e.g. `'USD'` or `'kg'`. */
  readonly unit?: string;
  /** Require an integer value. */
  readonly integer?: boolean;
  /** Maximum decimal places, an integer from 0 to 6. */
  readonly decimals?: number;
} | {
  /** A calendar date, returned as `YYYY-MM-DD`. */
  readonly type: 'date';
  readonly instructions?: ExtractionModelV4Input | null;
} | {
  /** A time of day, returned as `HH:MM` or `HH:MM:SS`. */
  readonly type: 'time';
  readonly instructions?: ExtractionModelV4Input | null;
} | {
  /** An ISO 8601 date and time, with an offset when the source has one. */
  readonly type: 'datetime';
  readonly instructions?: ExtractionModelV4Input | null;
} | {
  /** A nonnegative length of time, returned as a number in `unit`. */
  readonly type: 'duration';
  readonly instructions?: ExtractionModelV4Input | null;
  /** Defaults to `'seconds'`. */
  readonly unit?: ExtractionModelV4DurationUnit;
  readonly integer?: boolean;
  /** Maximum decimal places, an integer from 0 to 6. */
  readonly decimals?: number;
} | {
  /** Zero or more values of the same item type. */
  readonly type: 'list';
  readonly instructions?: ExtractionModelV4Input | null;
  readonly items: 'text' | 'number' | 'date';
  /** Require integer items. Only applies to number items. */
  readonly integer?: boolean;
  /** Maximum decimal places for number items, an integer from 0 to 6. */
  readonly decimals?: number;
};
```

## `Experimental_ExtractionModelV4Input`

Content for extraction field instructions.

```text
type ExtractionModelV4Input = DecisionModelV4Input;
```

## `Experimental_ExtractionModelV4Result`

The public declaration does not include a description.

```text
type ExtractionModelV4Result = {
  /** Exactly one answer per field, under the original field IDs. */
  answers: Record<string, ExtractionModelV4Answer>;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  warnings: SharedV4Warning[];
  providerMetadata?: SharedV4ProviderMetadata;
  response?: {
    id?: string;
    timestamp?: Date;
    modelId?: string;
    headers?: SharedV4Headers;
    body?: unknown;
  };
};
```

## `Experimental_ExtractionModelV4Source`

Where in the state a value was found.

```text
type ExtractionModelV4Source = {
  type: 'text';
  /** Index of a text part in the state. */
  part: number;
  /** Start offset in UTF-16 code units, inclusive. */
  start: number;
  /** End offset in UTF-16 code units, exclusive. */
  end: number;
} | {
  type: 'file';
  /** Index of the file part the value was read from. */
  part: number;
};
```

## `Experimental_ExtractionRefusalError`

Wrap an extraction model refusal with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for an extraction model refusal.
`Experimental_ExtractionRefusalError.isInstance` checks its SDK cause.

```text
Experimental_ExtractionRefusalError: {
    new (args_0: {
        fieldIds: string[];
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type Experimental_ExtractionRefusalError = AiSdkError;
```

## `Experimental_ExtractionUnsupportedFieldTypeError`

Wrap a schema field type unsupported by the extraction model with the native arguments
and expose its SDK type guard.
Use the shared `AiSdkError` type for a schema field type unsupported by the extraction
model. `Experimental_ExtractionUnsupportedFieldTypeError.isInstance` checks its SDK
cause.

```text
Experimental_ExtractionUnsupportedFieldTypeError: {
    new (args_0: {
        fieldId: string;
        fieldType: string;
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type Experimental_ExtractionUnsupportedFieldTypeError = AiSdkError;
```

## `Experimental_ImageBatchV4ItemResult`

A complete terminal result for one request in an image batch.

```text
type ImageBatchV4ItemResult = {
  readonly type: 'image';
} & BatchV4ItemResultBase<ImageModelV4Result>;
```

## `Experimental_ImageBatchV4Request`

One image generation request in a batch.

```text
type ImageBatchV4Request<ModelId extends string = string> = BatchV4RequestBase<ModelId> & {
  readonly type: 'image';
  readonly options: Pick<ImageModelV4CallOptions, 'prompt' | 'n' | 'size' | 'aspectRatio' | 'seed' | 'files' | 'mask' | 'providerOptions'>;
};
```

## `Experimental_RealtimeFactoryV4`

Select realtime models and access adapted factory methods such as token or session
requests where available.

```text
export type Experimental_RealtimeFactoryV4 = ReturnType<typeof wrapRealtimeFactory>;
```

## `Experimental_RealtimeFactoryV4GetTokenOptions`

The public declaration does not include a description.

```text
type RealtimeFactoryV4GetTokenOptions = {
  model: string;
} & RealtimeModelV4ClientSecretOptions;
```

## `Experimental_RealtimeFactoryV4GetTokenResult`

The public declaration does not include a description.

```text
type RealtimeFactoryV4GetTokenResult = {
  token: string;
  url: string;
  expiresAt?: number;
};
```

## `Experimental_RealtimeModelV4`

Use the registered Effect model handle for a version 4 realtime session.

```text
export type RealtimeModelV4 = ReturnType<typeof wrapRealtimeModel>;
```

## `Experimental_RealtimeModelV4AudioMessage`

An audio message from the user (complete audio, not streamed).

```text
type RealtimeModelV4AudioMessage = {
  type: 'audio-message';
  role: 'user';
  /**
   * Base64-encoded audio data.
   */
  audio: string;
};
```

## `Experimental_RealtimeModelV4ClientEvent`

Normalized events sent from the browser to the realtime model.
Each provider maps this to its native event format before sending
over the WebSocket.

```text
type RealtimeModelV4ClientEvent = {
  type: 'session-update';
  config: RealtimeModelV4SessionConfig;
  eventId?: string;
} | {
  type: 'session-start';
  config: RealtimeModelV4SessionConfig;
  eventId?: string;
} | {
  type: 'session-close';
  eventId?: string;
} | {
  type: 'input-audio-mute';
  eventId?: string;
} | {
  type: 'input-audio-unmute';
  eventId?: string;
} | {
  type: 'context-append';
  content: string;
  delegationId: string | null;
  eventId?: string;
  providerOptions?: SharedV4ProviderOptions;
} | {
  type: 'input-audio-append';
  /**
   * Base64-encoded audio chunk to append to the input buffer.
   */
  audio: string;
  eventId?: string;
} | {
  type: 'input-audio-commit';
} | {
  type: 'input-audio-clear';
} | {
  type: 'conversation-item-create';
  item: RealtimeModelV4ConversationItem;
} | {
  type: 'conversation-item-truncate';
  /**
   * The ID of the assistant message item to truncate.
   */
  itemId: string;
  /**
   * The index of the content part to truncate.
   */
  contentIndex: number;
  /**
   * Truncate audio after this many milliseconds.
   */
  audioEndMs: number;
} | {
  type: 'response-create';
  options?: {
    modalities?: string[];
    instructions?: string;
    metadata?: Record<string, unknown>;
  };
} | {
  type: 'response-cancel';
};
```

## `Experimental_RealtimeModelV4ClientSecretOptions`

Options for creating an ephemeral client secret for browser-side
WebSocket connections to a realtime model.

```text
type RealtimeModelV4ClientSecretOptions = {
  /**
   * Number of seconds until the client secret expires.
   */
  expiresAfterSeconds?: number;
  /**
   * Optional session configuration to embed in the token request.
   * Some providers (e.g. Google) require the full session config at token creation time.
   */
  sessionConfig?: RealtimeModelV4SessionConfig;
};
```

## `Experimental_RealtimeModelV4ClientSecretResult`

Result of creating an ephemeral client secret.

```text
type RealtimeModelV4ClientSecretResult = {
  /**
   * The ephemeral token value. Used as a Bearer token or in the
   * WebSocket subprotocol header for authentication.
   */
  token: string;
  /**
   * The WebSocket URL to connect to. Includes any provider-specific
   * query parameters (e.g. model ID).
   */
  url: string;
  /**
   * Unix timestamp (seconds) when this client secret expires.
   */
  expiresAt?: number;
};
```

## `Experimental_RealtimeModelV4ConversationItem`

A conversation item that can be created by the client and sent to
the model via the conversation.item.create event.

```text
type RealtimeModelV4ConversationItem = RealtimeModelV4TextMessage | RealtimeModelV4AudioMessage | RealtimeModelV4FunctionCallOutput;
```

## `Experimental_RealtimeModelV4FunctionCallOutput`

The output of a function call, sent back to the model so it can
continue generating a response using the tool result.

```text
type RealtimeModelV4FunctionCallOutput = {
  type: 'function-call-output';
  /**
   * The call ID from the function-call-arguments-done event.
   * Must match so the model knows which function call this result is for.
   */
  callId: string;
  /**
   * The name of the function that was called.
   * Required by some providers (e.g. Google) in the tool response routing.
   */
  name?: string;
  /**
   * JSON string containing the function call result.
   */
  output: string;
};
```

## `Experimental_RealtimeModelV4ServerConnection`

Descriptor for a server-initiated upstream WebSocket connection: the URL to
dial plus the headers (and optional subprotocols) to send on the handshake.

Unlike `getWebSocketConfig` — which is browser-side and authenticates with a
short-lived token carried in a subprotocol — this carries the long-lived
provider credential in `headers` and is intended for a trusted server or
proxy that owns the socket itself.

```text
type RealtimeModelV4ServerConnection = {
  /**
   * The `wss://` (or `ws://`) URL to connect to, including any provider-specific
   * query parameters (e.g. model id, transcription intent).
   */
  url: string;
  /**
   * Headers to send on the WebSocket handshake, including provider
   * authentication (e.g. `Authorization: Bearer <key>`).
   */
  headers: Record<string, string>;
  /**
   * Optional WebSocket subprotocols to negotiate on the handshake.
   */
  protocols?: string[];
};
```

## `Experimental_RealtimeModelV4ServerEvent`

Normalized events emitted by the realtime model (model → browser).
Each provider maps its native event format to this discriminated union.

Every event includes a `raw` field with the original provider-specific
event data for debugging and provider-specific access.

```text
type RealtimeModelV4ServerEvent = {
  type: 'session-started';
  sessionId: string;
  delegationMode?: 'client' | 'provider';
  raw: unknown;
} | {
  type: 'session-closed';
  sessionId?: string;
  usage: {
    seconds: number;
  };
  reason: string;
  raw: unknown;
} | {
  type: 'session-usage';
  /** Cumulative duration snapshot, not an increment. */
  usage: {
    seconds: number;
  };
  contextWindowUsageRatio?: number;
  raw: unknown;
} | {
  type: 'audio-chunk';
  delta: string;
  raw: unknown;
} | {
  type: 'transcript-fragment';
  speaker: 'user' | 'assistant';
  delta: string;
  startMs: number;
  endMs: number;
  raw: unknown;
} | {
  type: 'delegation-created';
  delegationId: string;
  target?: 'client' | 'provider';
  offsetMs?: number;
  responseId?: string;
  raw: unknown;
} | {
  type: 'command-acknowledged';
  /** Provider-native command name that was acknowledged. */
  command: string;
  clientEventId?: string;
  raw: unknown;
} | {
  type: 'session-created';
  sessionId?: string;
  raw: unknown;
} | {
  type: 'session-updated';
  raw: unknown;
} | {
  type: 'speech-started';
  itemId?: string;
  raw: unknown;
} | {
  type: 'speech-stopped';
  itemId?: string;
  raw: unknown;
} | {
  type: 'audio-committed';
  itemId?: string;
  previousItemId?: string;
  raw: unknown;
} | {
  type: 'conversation-item-added';
  itemId: string;
  item: unknown;
  raw: unknown;
} | {
  type: 'input-transcription-completed';
  itemId: string;
  transcript: string;
  usage?: RealtimeModelV4Usage;
  raw: unknown;
} | {
  type: 'response-created';
  responseId: string;
  raw: unknown;
} | {
  type: 'response-done';
  responseId: string;
  status: string;
  usage?: RealtimeModelV4Usage;
  raw: unknown;
} | {
  type: 'output-item-added';
  responseId: string;
  itemId: string;
  raw: unknown;
} | {
  type: 'output-item-done';
  responseId: string;
  itemId: string;
  raw: unknown;
} | {
  type: 'content-part-added';
  responseId: string;
  itemId: string;
  raw: unknown;
} | {
  type: 'content-part-done';
  responseId: string;
  itemId: string;
  raw: unknown;
} | {
  type: 'audio-delta';
  responseId: string;
  itemId: string;
  /**
   * Base64-encoded audio chunk.
   */
  delta: string;
  raw: unknown;
} | {
  type: 'audio-done';
  responseId: string;
  itemId: string;
  raw: unknown;
} | {
  type: 'audio-transcript-delta';
  responseId: string;
  itemId: string;
  /**
   * Text chunk of the audio transcript.
   */
  delta: string;
  raw: unknown;
} | {
  type: 'audio-transcript-done';
  responseId: string;
  itemId: string;
  transcript?: string;
  raw: unknown;
} | {
  type: 'text-delta';
  responseId: string;
  itemId: string;
  /**
   * Text chunk of the model's text response.
   */
  delta: string;
  raw: unknown;
} | {
  type: 'text-done';
  responseId: string;
  itemId: string;
  text?: string;
  raw: unknown;
} | {
  type: 'function-call-arguments-delta';
  responseId: string;
  itemId: string;
  callId: string;
  /**
   * Partial JSON string of function call arguments.
   */
  delta: string;
  raw: unknown;
} | {
  type: 'function-call-arguments-done';
  responseId: string;
  itemId: string;
  callId: string;
  /**
   * The name of the function to call.
   */
  name: string;
  /**
   * Complete JSON string of function call arguments.
   */
  arguments: string;
  raw: unknown;
} | {
  type: 'error';
  message: string;
  code?: string;
  clientEventId?: string;
  raw: unknown;
} | {
  type: 'custom';
  /**
   * The original event type string from the provider.
   */
  rawType: string;
  /** Provider usage snapshot without an inferred response association. */
  usage?: RealtimeModelV4Usage;
  raw: unknown;
};
```

## `Experimental_RealtimeModelV4SessionConfig`

Provider-neutral configuration for a realtime session.
Each provider maps this to their specific session.update payload.

```text
type RealtimeModelV4SessionConfig = {
  /**
   * System instructions for the model.
   */
  instructions?: string;
  /**
   * Voice to use for audio output.
   */
  voice?: string;
  /**
   * Which output modalities the model should produce.
   */
  outputModalities?: Array<'text' | 'audio'>;
  /**
   * Audio format configuration for input audio.
   */
  inputAudioFormat?: SharedV4AudioFormat;
  /**
   * Input audio transcription configuration.
   *
   * When enabled, providers that support input transcription emit normalized
   * `input-transcription-completed` events that can be rendered as user
   * messages.
   */
  inputAudioTranscription?: {
    /**
     * Provider-specific transcription model.
     */
    model?: string;
    /**
     * Optional language hint for the input audio.
     */
    language?: string;
    /**
     * Optional prompt to guide transcription.
     */
    prompt?: string;
  };
  /**
   * Output audio transcription configuration.
   *
   * When enabled, providers that support output transcription emit normalized
   * `audio-transcript-delta` / `audio-transcript-done` events for the model's
   * spoken response. Some providers transcribe output by default; setting this
   * makes the behavior explicit rather than relying on that default.
   */
  outputAudioTranscription?: {
    /**
     * Provider-specific transcription model.
     */
    model?: string;
    /**
     * Optional language hint for the output audio.
     */
    language?: string;
    /**
     * Optional prompt to guide transcription.
     */
    prompt?: string;
  };
  /**
   * Audio format configuration for output audio.
   */
  outputAudioFormat?: SharedV4AudioFormat;
  /**
   * Voice activity detection configuration.
   * Set to null or type 'disabled' to turn off VAD (push-to-talk mode).
   */
  turnDetection?: {
    /**
     * VAD mode. 'server-vad' for automatic detection,
     * 'semantic-vad' for OpenAI's semantic detection,
     * 'disabled' to turn off VAD.
     */
    type: 'server-vad' | 'semantic-vad' | 'disabled';
    /**
     * VAD activation threshold (0.0-1.0).
     * Higher values require louder audio to trigger.
     */
    threshold?: number;
    /**
     * How long the user must be silent (in ms) before
     * the server ends the turn.
     */
    silenceDurationMs?: number;
    /**
     * Amount of audio (in ms) to include before the
     * detected start of speech.
     */
    prefixPaddingMs?: number;
  } | null;
  /**
   * Tool definitions available to the model in this session.
   */
  tools?: RealtimeModelV4ToolDefinition[];
  /**
   * Provider-specific options that are passed through to the provider.
   */
  providerOptions?: Record<string, unknown>;
};
```

## `Experimental_RealtimeModelV4SessionIntent`

The realtime endpoint variant to open.

Most providers expose a single conversational ("conversation") voice
endpoint; some additionally expose dedicated transcription
endpoints that live at a different URL. `intent` selects which one a
server-side connection should target. Providers should fail fast when an
intent is not supported by their endpoint and codec.

```text
type RealtimeModelV4SessionIntent = 'conversation' | 'transcription';
```

## `Experimental_RealtimeModelV4TextMessage`

A text message from the user.

```text
type RealtimeModelV4TextMessage = {
  type: 'text-message';
  role: 'user';
  text: string;
};
```

## `Experimental_RealtimeModelV4ToolDefinition`

A tool definition for realtime models. Sent as part of the session
configuration so the model knows which functions it can call.

```text
type RealtimeModelV4ToolDefinition = {
  /**
   * The type of the tool (always 'function').
   */
  type: 'function';
  /**
   * The name of the tool. Unique within the session.
   */
  name: string;
  /**
   * A description of what the tool does. The model uses this to decide
   * whether to call the tool.
   */
  description?: string;
  /**
   * JSON Schema describing the parameters the tool expects.
   */
  parameters: JSONSchema7$1;
};
```

## `Experimental_RealtimeModelV4Transport`

Use the Effect handle for realtime transport actions after scoped acquisition.

```text
export type RealtimeTransport = ReturnType<typeof transportHandle>;
```

## `Experimental_RealtimeModelV4TransportOptions`

Configure realtime transports with Effect callbacks whose dependencies belong to the
caller.

```text
export type Experimental_RealtimeModelV4TransportOptions<E = unknown, R = never> = RealtimeTransportOptions<E, R>;
```

## `Experimental_RealtimeModelV4Usage`

Normalized realtime usage on completion events or provider custom snapshots.
Snapshots without a response association must not be summed as increments.

Counts are the provider's raw counts: the input buckets INCLUDE any cached
tokens, and the cached portions are reported separately in
`cachedInput*Tokens`. This mirrors how providers report realtime usage on the
wire and lets a consumer apply its own cached-vs-uncached billing split
without re-parsing the event's `raw` payload.

Every field is optional: providers only populate what they actually report,
and the whole `usage` object is omitted when nothing is observable. Gross
totals can include modalities without a dedicated text/audio bucket.

```text
type RealtimeModelV4Usage = {
  /** Gross input tokens across all reported modalities; includes cached tokens. */
  inputTokens?: number;
  /** Gross output tokens across all reported modalities. */
  outputTokens?: number;
  /** Cached portion of gross input tokens, when the provider reports a total. */
  cachedInputTokens?: number;
  /**
   * Input text tokens (includes any cached text tokens).
   */
  inputTextTokens?: number;
  /**
   * Input audio tokens (includes any cached audio tokens).
   */
  inputAudioTokens?: number;
  /**
   * Output text tokens.
   */
  outputTextTokens?: number;
  /**
   * Output audio tokens.
   */
  outputAudioTokens?: number;
  /**
   * Cached portion of the input text tokens (subset of `inputTextTokens`).
   */
  cachedInputTextTokens?: number;
  /**
   * Cached portion of the input audio tokens (subset of `inputAudioTokens`).
   */
  cachedInputAudioTokens?: number;
  /**
   * Audio duration in seconds. Populated for duration-billed transcription.
   */
  seconds?: number;
};
```

## `Experimental_SpeechModelV4StreamOptions`

Options for a speech model stream call.

```text
type SpeechModelV4StreamOptions = {
  /**
   * Text to convert to speech, as a stream of text parts.
   *
   * Parts are synthesized in order. Providers with an incremental text
   * input transport forward text as it arrives; providers that only accept
   * complete text read the stream to completion before synthesis. The end of
   * the stream signals the end of the input text. A part's optional `voice`
   * selects its speaker on providers that support several voices.
   *
   * The provider owns the stream once `doStream` is called. It must release
   * it in every terminal path: cancel it (or its locked reader) when the
   * abort signal fires, when the consumer cancels the returned stream, when
   * setup fails before or after the stream is locked, and when the provider
   * fails. Leaving it unread and uncancelled keeps the caller's text producer
   * running indefinitely. After a normal finish the stream is fully read.
   */
  text: ReadableStream<SpeechModelV4StreamTextPart>;
  /**
   * The voice to use for speech synthesis.
   * This is provider-specific and may be a voice ID, name, or other identifier.
   */
  voice?: string;
  /**
   * The desired format of the output audio chunks, e.g.
   * `{ type: 'audio/pcm', rate: 24000 }` or `{ type: 'audio/mpeg' }`.
   * When absent, the provider default format is used.
   */
  outputFormat?: SharedV4AudioFormat;
  /**
   * Instructions for the speech generation e.g. "Speak in a slow and steady tone".
   */
  instructions?: string;
  /**
   * The speed of the speech generation.
   */
  speed?: number;
  /**
   * The language for speech generation. This should be an ISO 639-1 language code (e.g. "en", "es", "fr")
   * or "auto" for automatic language detection. Provider support varies.
   */
  language?: string;
  /**
   * Additional provider-specific options that are passed through to the provider.
   *
   * The outer record is keyed by the provider name, and the inner record is keyed
   * by provider-specific option names.
   */
  providerOptions?: SpeechModelV4ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP/WebSocket-based providers that support headers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * When true, providers should include raw provider chunks in the stream.
   */
  includeRawChunks?: boolean;
};
```

## `Experimental_SpeechModelV4StreamPart`

The public declaration does not include a description.

```text
type SpeechModelV4StreamPart = {
  /**
   * Stream start event with warnings for the call, e.g. unsupported settings.
   */
  type: 'stream-start';
  warnings: Array<SharedV4Warning>;
} | {
  /**
   * Output audio chunk, in generation order. Chunks are not necessarily
   * standalone files; concatenate them to reconstruct the audio.
   *
   * `Uint8Array` chunks contain raw audio bytes. `string` chunks contain
   * base64-encoded raw audio bytes.
   *
   * A chunk may be empty when it only carries `providerMetadata` for a
   * point in the audio, e.g. a provider's end-of-turn marker.
   */
  type: 'audio';
  /**
   * Optional provider identifier for the chunk.
   */
  id?: string;
  audio: Uint8Array | string;
  /**
   * Format of the audio chunk, e.g. `{ type: 'audio/mpeg' }` or
   * `{ type: 'audio/pcm', rate: 24000 }`.
   */
  audioFormat: SharedV4AudioFormat;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Metadata for the response, emitted once available.
   */
  type: 'response-metadata';
  timestamp?: Date;
  modelId?: string;
  headers?: SharedV4Headers;
  body?: unknown;
} | {
  /**
   * Metadata that is available after the stream is finished. Emitted
   * exactly once, after all audio chunks.
   */
  type: 'finish';
  /**
   * Usage information for the call, if known.
   */
  usage?: SpeechModelV4StreamUsage;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Raw provider chunks if enabled.
   */
  type: 'raw';
  rawValue: unknown;
} | {
  /**
   * A non-fatal error; the stream continues and may carry more of them.
   * Providers signal an unrecoverable failure by erroring the stream, or
   * by closing it without a `finish` part.
   */
  type: 'error';
  error: unknown;
};
```

## `Experimental_SpeechModelV4StreamResult`

The result of a speech model doStream call.

```text
type SpeechModelV4StreamResult = {
  /**
   * The stream.
   */
  stream: ReadableStream<SpeechModelV4StreamPart>;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Request body or setup payload that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response data.
   */
  response?: {
    /**
     * Timestamp for the start of the streamed response.
     */
    timestamp?: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId?: string;
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response body.
     */
    body?: unknown;
  };
};
```

## `Experimental_SpeechModelV4StreamTextPart`

One piece of streamed input text. Consecutive parts are synthesized in
order as one continuous script.

```text
type SpeechModelV4StreamTextPart = {
  type: 'text';
  /**
   * The text to synthesize. Parts may split anywhere, including mid-word.
   */
  text: string;
  /**
   * The voice that speaks this part. Like the call's `voice`, the value is
   * provider-specific (a voice ID, name, or other identifier). Defaults to the
   * call's `voice` (or the provider's default voice). Providers that support
   * several voices per stream (e.g. dialogue) switch speakers when it changes.
   * Single-voice providers fail the stream (error it) when a part's voice
   * differs from the voice of the call.
   */
  voice?: string;
  /**
   * Additional provider-specific options for this part, keyed by provider
   * name (e.g. to start a new speaker turn without changing the voice).
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `Experimental_SpeechModelV4StreamUsage`

Usage information for a speech stream call.

All fields are optional because providers bill speech with different
units (input characters, text tokens, and/or audio tokens).

```text
type SpeechModelV4StreamUsage = {
  /**
   * Number of input text characters (Unicode code points) that were sent
   * for synthesis, if known. Character-billed providers report this.
   */
  inputCharacters?: number;
  /**
   * Number of input text tokens, if reported.
   */
  inputTokens?: number;
  /**
   * Number of output audio tokens, if reported.
   */
  outputTokens?: number;
  /**
   * Raw usage information from the provider, in the shape the provider
   * returns it.
   */
  raw?: JSONObject;
};
```

## `Experimental_SpeechTranslationModelV4`

Use a registered model for audio translation requests.

```text
export type SpeechTranslationModelV4 = ReturnType<typeof wrapSpeechTranslationModel>;
```

## `Experimental_SpeechTranslationModelV4StreamOptions`

Options for a speech translation model stream call.

```text
type SpeechTranslationModelV4StreamOptions = {
  /**
   * Source audio chunks to transform.
   *
   * `Uint8Array` chunks contain raw audio bytes. `string` chunks contain
   * base64-encoded raw audio bytes.
   */
  audio: ReadableStream<Uint8Array | string>;
  /**
   * The input audio format for the raw audio chunks.
   */
  inputAudioFormat: SharedV4AudioFormat;
  /**
   * The language to produce output audio and text in, as a BCP-47-style
   * language tag (e.g. `en`, `es`, `fr-CA`). Supported values are
   * provider-specific and validated by the provider.
   */
  targetLanguage: string;
  /**
   * The language of the source audio, as a BCP-47-style language tag.
   * When absent, providers should auto-detect the source language.
   */
  sourceLanguage?: string;
  /**
   * The desired audio format for output audio chunks.
   * When absent, the provider default output format is used.
   */
  outputAudioFormat?: SharedV4AudioFormat;
  /**
   * Additional provider-specific options that are passed through to the provider.
   *
   * The outer record is keyed by the provider name, and the inner record is keyed
   * by provider-specific option names.
   */
  providerOptions?: SpeechTranslationModelV4ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP/WebSocket-based providers that support headers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * When true, providers should include raw provider chunks in the stream.
   */
  includeRawChunks?: boolean;
};
```

## `Experimental_SpeechTranslationModelV4StreamPart`

The public declaration does not include a description.

```text
type SpeechTranslationModelV4StreamPart = {
  /**
   * Stream start event with warnings for the call, e.g. unsupported settings.
   */
  type: 'stream-start';
  warnings: Array<SharedV4Warning>;
} | {
  /**
   * Output audio chunk.
   *
   * `Uint8Array` chunks contain raw audio bytes. `string` chunks contain
   * base64-encoded raw audio bytes.
   */
  type: 'audio';
  id?: string;
  audio: Uint8Array | string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Append-only output text delta.
   *
   * Output text is append-only: providers stream `output-text-delta`
   * parts and finalize per-utterance with `output-text-final`. There is
   * no partial/revision part for output text by design for now.
   */
  type: 'output-text-delta';
  id?: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Final output text for a provider-defined segment or utterance.
   *
   * Output text is append-only: providers stream `output-text-delta`
   * parts and finalize per-utterance with `output-text-final`. There is
   * no partial/revision part for output text by design for now.
   */
  type: 'output-text-final';
  id?: string;
  text: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Append-only source transcript delta.
   */
  type: 'source-transcript-delta';
  id?: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Non-final source transcript text. The text may be revised by later parts.
   */
  type: 'source-transcript-partial';
  id?: string;
  text: string;
  startSecond?: number;
  endSecond?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Final source transcript text for a provider-defined segment or utterance.
   */
  type: 'source-transcript-final';
  id?: string;
  text: string;
  startSecond?: number;
  endSecond?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Metadata for the response, emitted once available.
   */
  type: 'response-metadata';
  timestamp?: Date;
  modelId?: string;
  headers?: SharedV4Headers;
  body?: unknown;
} | {
  /**
   * Metadata that is available after the stream is finished.
   */
  type: 'finish';
  /**
   * The final source-language transcript of the input audio.
   */
  sourceText: string;
  /**
   * The final output text. May be an empty string for providers that
   * produce only audio output.
   */
  outputText: string;
  /**
   * The duration of the source audio in seconds, if available.
   */
  durationInSeconds?: number;
  /**
   * Usage information for the call, if reported by the provider.
   */
  usage?: SpeechTranslationModelV4Usage;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: Record<string, JSONObject>;
} | {
  /**
   * Raw provider chunks if enabled.
   */
  type: 'raw';
  rawValue: unknown;
} | {
  /**
   * Error parts are streamed, allowing for multiple errors.
   */
  type: 'error';
  error: unknown;
};
```

## `Experimental_SpeechTranslationModelV4StreamResult`

The result of a speech translation model doStream call.

```text
type SpeechTranslationModelV4StreamResult = {
  /**
   * The stream.
   */
  stream: ReadableStream<SpeechTranslationModelV4StreamPart>;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Request body or setup payload that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response data.
   */
  response?: {
    /**
     * Timestamp for the start of the streamed response.
     */
    timestamp?: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId?: string;
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response body.
     */
    body?: unknown;
  };
};
```

## `Experimental_SpeechTranslationModelV4Usage`

Usage information for a speech translation call.

All fields are optional because providers report usage with different
granularity (seconds of audio, audio tokens, and/or text tokens).

```text
type SpeechTranslationModelV4Usage = {
  /**
   * Seconds of input audio that were processed, if reported.
   */
  inputAudioSeconds?: number;
  /**
   * Number of input audio tokens, if reported.
   */
  inputAudioTokens?: number;
  /**
   * Number of output audio tokens, if reported.
   */
  outputAudioTokens?: number;
  /**
   * Number of input text tokens, if reported.
   */
  inputTextTokens?: number;
  /**
   * Number of output text tokens, if reported.
   */
  outputTextTokens?: number;
};
```

## `Experimental_StreamingSpeechModelV4`

Adapt the v4 streaming speech model for effectful speech operations and scoped
connections.

```text
export type Experimental_StreamingSpeechModelV4 = ReturnType<typeof wrapStreamingSpeechModel>;
```

## `Experimental_TextBatchV4ItemResult`

A complete terminal result for one request in a text batch.

```text
type TextBatchV4ItemResult = {
  readonly type: 'text';
} & BatchV4ItemResultBase<LanguageModelV4GenerateResult>;
```

## `Experimental_TextBatchV4Request`

A normalized text generation request within a batch.

```text
type TextBatchV4Request<ModelId extends string = string> = BatchV4RequestBase<ModelId> & {
  readonly type: 'text';
  readonly options: Pick<LanguageModelV4CallOptions, 'prompt' | 'maxOutputTokens' | 'temperature' | 'stopSequences' | 'topP' | 'topK' | 'presencePenalty' | 'frequencyPenalty' | 'seed' | 'reasoning' | 'responseFormat' | 'toolChoice' | 'tools' | 'providerOptions'>;
};
```

## `Experimental_TranscriptionModelV4StreamOptions`

The public declaration does not include a description.

```text
type TranscriptionModelV4StreamOptions = {
  /**
   * Audio chunks to transcribe.
   *
   * `Uint8Array` chunks contain raw audio bytes. `string` chunks contain
   * base64-encoded raw audio bytes.
   */
  audio: ReadableStream<Uint8Array | string>;
  /**
   * The input audio format for the raw audio chunks.
   */
  inputAudioFormat: SharedV4AudioFormat;
  /**
   * Additional provider-specific options that are passed through to the provider.
   *
   * The outer record is keyed by the provider name, and the inner record is keyed
   * by provider-specific option names.
   */
  providerOptions?: TranscriptionModelV4ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP/WebSocket-based providers that support headers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * When true, providers should include raw provider chunks in the stream.
   */
  includeRawChunks?: boolean;
};
```

## `Experimental_TranscriptionModelV4StreamPart`

The public declaration does not include a description.

```text
type TranscriptionModelV4StreamPart = {
  /**
   * Stream start event with warnings for the call, e.g. unsupported settings.
   */
  type: 'stream-start';
  warnings: Array<SharedV4Warning>;
} | {
  /**
   * Append-only transcript delta.
   */
  type: 'transcript-delta';
  id?: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Non-final transcript text. The text may be revised by later parts.
   */
  type: 'transcript-partial';
  id?: string;
  text: string;
  startSecond?: number;
  durationInSeconds?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Final transcript text for a provider-defined segment or utterance.
   */
  type: 'transcript-final';
  id?: string;
  text: string;
  startSecond?: number;
  endSecond?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Metadata for the response, emitted once available.
   */
  type: 'response-metadata';
  timestamp?: Date;
  modelId?: string;
  headers?: SharedV4Headers;
  body?: unknown;
} | {
  /**
   * Metadata that is available after the stream is finished.
   */
  type: 'finish';
  text: string;
  segments: Array<{
    text: string;
    startSecond: number;
    endSecond: number;
  }>;
  language?: string;
  durationInSeconds?: number;
  /**
   * Usage information reported by the provider, in the provider's native
   * JSON-compatible shape.
   */
  usage?: JSONObject;
  providerMetadata?: Record<string, JSONObject>;
} | {
  /**
   * Raw provider chunks if enabled.
   */
  type: 'raw';
  rawValue: unknown;
} | {
  /**
   * Error parts are streamed, allowing for multiple errors.
   */
  type: 'error';
  error: unknown;
};
```

## `Experimental_TranscriptionModelV4StreamResult`

The result of a transcription model doStream call.

```text
type TranscriptionModelV4StreamResult = {
  /**
   * The stream.
   */
  stream: ReadableStream<TranscriptionModelV4StreamPart>;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Request body or setup payload that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response data.
   */
  response?: {
    /**
     * Timestamp for the start of the streamed response.
     */
    timestamp?: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId?: string;
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response body.
     */
    body?: unknown;
  };
};
```

## `Experimental_VideoModelV3`

Preserve the SDK protocol for experimental v3 video generation and lift model operations
into Effect.

```text
export type Experimental_VideoModelV3 = LegacyModel<sdk.Experimental_VideoModelV3>;
```

## `Experimental_VideoModelV3CallOptions`

The public declaration does not include a description.

```text
type VideoModelV3CallOptions = {
  /**
   * Text prompt for the video generation.
   */
  prompt: string | undefined;
  /**
   * Number of videos to generate. Default: 1.
   * Most video models only support n=1 due to computational cost.
   */
  n: number;
  /**
   * Aspect ratio of the videos to generate.
   * Must have the format `{width}:{height}`, or `'adaptive'` to inherit the
   * ratio from the input media.
   * `undefined` will use the provider's default aspect ratio.
   * Common values: '16:9', '9:16', '1:1', '21:9', '4:3'
   */
  aspectRatio: `${number}:${number}` | 'adaptive' | undefined;
  /**
   * Resolution of the video to generate.
   * Format: `{width}x{height}` (e.g., '1280x720', '1920x1080')
   * `undefined` will use the provider's default resolution.
   */
  resolution: `${number}x${number}` | undefined;
  /**
   * Duration of the video in seconds.
   * `undefined` will use the provider's default duration.
   * Typically 3-10 seconds for most models.
   */
  duration: number | undefined;
  /**
   * Frames per second (FPS) for the video.
   * `undefined` will use the provider's default FPS.
   * Common values: 24, 30, 60
   */
  fps: number | undefined;
  /**
   * Seed for deterministic video generation.
   * `undefined` will use a random seed.
   */
  seed: number | undefined;
  /**
   * Input image for image-to-video generation.
   * The image serves as the starting frame that the model will animate.
   */
  image: VideoModelV3File | undefined;
  /**
   * Role-tagged image inputs for first-last-frame generation.
   * Each entry declares whether it is the `first_frame` or the
   * `last_frame` of the generated video.
   */
  frameImages: Array<VideoModelV3FrameImage> | undefined;
  /**
   * Reference inputs for reference-to-video generation.
   *
   * Each entry is an image or video file. Providers route each reference by
   * its media type (image vs. video) and warn when a reference kind is
   * unsupported.
   */
  inputReferences: Array<VideoModelV3File> | undefined;
  /**
   * Whether the model should generate audio alongside the video.
   */
  generateAudio: boolean | undefined;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * Example:
   * {
   *   "fal": {
   *     "loop": true,
   *     "motionStrength": 0.8
   *   }
   * }
   */
  providerOptions: SharedV3ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `Experimental_VideoModelV3File`

A video or image file that can be used for video editing or image-to-video generation.
Supports both image inputs (for image-to-video) and video inputs (for editing).

```text
type VideoModelV3File = {
  type: 'file';
  /**
   * The IANA media type of the file.
   * Video types: 'video/mp4', 'video/webm', 'video/quicktime'
   * Image types: 'image/png', 'image/jpeg', 'image/webp'
   */
  mediaType: string;
  /**
   * File data as base64 encoded string or binary data.
   */
  data: string | Uint8Array;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV3ProviderMetadata;
} | {
  type: 'url';
  /**
   * The URL of the video or image file.
   */
  url: string;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV3ProviderMetadata;
};
```

## `Experimental_VideoModelV3FrameImage`

A role-tagged image input for image-to-video and first-last-frame generation.

```text
type VideoModelV3FrameImage = {
  /**
   * The image file used for this frame.
   */
  image: VideoModelV3File;
  /**
   * Which frame this image represents.
   */
  frameType: VideoModelV3FrameType;
};
```

## `Experimental_VideoModelV3FrameType`

The role a frame image plays in video generation.

- `first_frame`: the starting frame the model animates from
- `last_frame`: the ending frame the model animates towards

```text
type VideoModelV3FrameType = 'first_frame' | 'last_frame';
```

## `Experimental_VideoModelV3VideoData`

Generated video data. Can be a URL, base64-encoded string, or binary data.

```text
type VideoModelV3VideoData = {
  /**
   * Video available as a URL (most common for video providers).
   */
  type: 'url';
  url: string;
  mediaType: string;
} | {
  /**
   * Video as base64-encoded string.
   */
  type: 'base64';
  data: string;
  mediaType: string;
} | {
  /**
   * Video as binary data.
   */
  type: 'binary';
  data: Uint8Array;
  mediaType: string;
};
```

## `Experimental_VideoModelV4`

Use a registered model for video generation, polling, or webhook integration.

```text
export type VideoModelV4 = ReturnType<typeof wrapVideoModel>;
```

## `Experimental_VideoModelV4CallOptions`

The public declaration does not include a description.

```text
type VideoModelV4CallOptions = {
  /**
   * Text prompt for the video generation.
   */
  prompt: string | undefined;
  /**
   * Number of videos to generate. Default: 1.
   * Most video models only support n=1 due to computational cost.
   */
  n: number;
  /**
   * Aspect ratio of the videos to generate.
   * Must have the format `{width}:{height}`, or `'adaptive'` to inherit the
   * ratio from the input media.
   * `undefined` will use the provider's default aspect ratio.
   * Common values: '16:9', '9:16', '1:1', '21:9', '4:3'
   */
  aspectRatio: `${number}:${number}` | 'adaptive' | undefined;
  /**
   * Resolution of the video to generate.
   * Format: `{width}x{height}` (e.g., '1280x720', '1920x1080')
   * `undefined` will use the provider's default resolution.
   */
  resolution: `${number}x${number}` | undefined;
  /**
   * Duration of the video in seconds.
   * `undefined` will use the provider's default duration.
   * Typically 3-10 seconds for most models.
   */
  duration: number | undefined;
  /**
   * Frames per second (FPS) for the video.
   * `undefined` will use the provider's default FPS.
   * Common values: 24, 30, 60
   */
  fps: number | undefined;
  /**
   * Seed for deterministic video generation.
   * `undefined` will use a random seed.
   */
  seed: number | undefined;
  /**
   * Input image for image-to-video generation.
   * The image serves as the starting frame that the model will animate.
   */
  image: VideoModelV4File | undefined;
  /**
   * Role-tagged image inputs for first-last-frame generation.
   * Each entry declares whether it is the `first_frame` or the
   * `last_frame` of the generated video.
   */
  frameImages: Array<VideoModelV4FrameImage> | undefined;
  /**
   * Reference inputs for reference-to-video generation.
   *
   * Each entry is an image or video file. Providers route each reference by
   * its media type (image vs. video) and warn when a reference kind is
   * unsupported.
   */
  inputReferences: Array<VideoModelV4File> | undefined;
  /**
   * Whether the model should generate audio alongside the video.
   */
  generateAudio: boolean | undefined;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * Example:
   * {
   *   "fal": {
   *     "loop": true,
   *     "motionStrength": 0.8
   *   }
   * }
   */
  providerOptions: SharedV4ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `Experimental_VideoModelV4File`

A video or image file that can be used for video editing or image-to-video generation.
Supports both image inputs (for image-to-video) and video inputs (for editing).

```text
type VideoModelV4File = {
  type: 'file';
  /**
   * The IANA media type of the file.
   * Video types: 'video/mp4', 'video/webm', 'video/quicktime'
   * Image types: 'image/png', 'image/jpeg', 'image/webp'
   */
  mediaType: string;
  /**
   * File data as base64 encoded string or binary data.
   */
  data: string | Uint8Array;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV4ProviderMetadata;
} | {
  type: 'url';
  /**
   * The URL of the video or image file.
   */
  url: string;
  /**
   * The media type of the referenced file, when known.
   * Video types: 'video/mp4', 'video/webm', 'video/quicktime'
   * Image types: 'image/png', 'image/jpeg', 'image/webp'
   */
  mediaType?: string;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV4ProviderMetadata;
};
```

## `Experimental_VideoModelV4FrameImage`

A role-tagged image input for image-to-video and first-last-frame generation.

```text
type VideoModelV4FrameImage = {
  /**
   * The image file used for this frame.
   */
  image: VideoModelV4File;
  /**
   * Which frame this image represents.
   */
  frameType: VideoModelV4FrameType;
};
```

## `Experimental_VideoModelV4FrameType`

The role a frame image plays in video generation.

- `first_frame`: the starting frame the model animates from
- `last_frame`: the ending frame the model animates towards

```text
type VideoModelV4FrameType = 'first_frame' | 'last_frame';
```

## `Experimental_VideoModelV4OperationStartResult`

Result returned by `doStart` when initiating an asynchronous video generation.

```text
type VideoModelV4OperationStartResult = {
  /**
   * JSON-serializable opaque reference passed to `doStatus` to check the
   * status of the generation (e.g., a task ID or prediction URL).
   */
  operation: JSONValue;
  /**
   * Warnings for the call, e.g. unsupported features.
   */
  warnings: Array<SharedV4Warning>;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    /**
     * Timestamp for the start of the response.
     */
    timestamp: Date;
    /**
     * The ID of the response model that was used.
     */
    modelId: string;
    /**
     * Response headers.
     */
    headers: Record<string, string> | undefined;
  };
};
```

## `Experimental_VideoModelV4OperationStatusResult`

Result returned by `doStatus` when checking the status of an
asynchronous video generation.

```text
type VideoModelV4OperationStatusResult = {
  /**
   * The video generation is still in progress.
   */
  status: 'pending';
  /**
   * Warnings for the call.
   */
  warnings?: Array<SharedV4Warning>;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    timestamp: Date;
    modelId: string;
    headers: Record<string, string> | undefined;
  };
} | {
  /**
   * The video generation is complete.
   */
  status: 'completed';
  /**
   * Generated videos.
   */
  videos: Array<VideoModelV4VideoData>;
  /**
   * Warnings for the call.
   */
  warnings: Array<SharedV4Warning>;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    timestamp: Date;
    modelId: string;
    headers: Record<string, string> | undefined;
  };
} | {
  /**
   * The video generation failed.
   */
  status: 'error';
  /**
   * A human-readable error message describing why the generation failed.
   */
  error: string;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    timestamp: Date;
    modelId: string;
    headers: Record<string, string> | undefined;
  };
};
```

## `Experimental_VideoModelV4OperationWebhook`

Data received from a webhook notification during asynchronous video
generation. Generic over the body type so providers/consumers can
narrow it to a specific shape.

```text
type VideoModelV4OperationWebhook<TBody = JSONValue> = {
  headers: Record<string, string>;
  body: TBody;
};
```

## `Experimental_VideoModelV4Result`

The result of a video model doGenerate call.

```text
type VideoModelV4Result = {
  /**
   * Generated videos as URLs, base64 strings, binary data, or upload confirmations.
   *
   * Most providers return URLs to video files (MP4, WebM) due to large file sizes.
   * Use the discriminated union to indicate the type of video data being returned.
   */
  videos: Array<VideoModelV4VideoData>;
  /**
   * Warnings for the call, e.g. unsupported features.
   */
  warnings: Array<SharedV4Warning>;
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is provider-specific metadata.
   *
   * ```ts
   * {
   *   "fal": {
   *     "videos": [{
   *       "duration": 5.0,
   *       "fps": 24,
   *       "width": 1280,
   *       "height": 720
   *     }]
   *   }
   * }
   * ```
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    /**
     * Timestamp for the start of the generated response.
     */
    timestamp: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId: string;
    /**
     * Response headers.
     */
    headers: Record<string, string> | undefined;
  };
};
```

## `Experimental_VideoModelV4VideoData`

Generated video data, or confirmation of delivery to caller-managed storage.

```text
type VideoModelV4VideoData = {
  /**
   * The provider completed delivery to caller-managed storage.
   * No downloadable URL or video bytes are available to the SDK.
   * Never include a signed upload URL in this result.
   */
  type: 'uploaded';
  mediaType: string;
} | {
  /**
   * Video available as a URL (most common for video providers).
   */
  type: 'url';
  url: string;
  mediaType: string;
} | {
  /**
   * Video as base64-encoded string.
   */
  type: 'base64';
  data: string;
  mediaType: string;
} | {
  /**
   * Video as binary data.
   */
  type: 'binary';
  data: Uint8Array;
  mediaType: string;
};
```

## `FilesV4`

Use a registered file API for direct provider file operations and SDK adapters.

```text
export type FilesV4Handle = ReturnType<typeof wrapFiles>;
```

## `FilesV4DeleteFileCallOptions`

Options for deleting a file via the files interface.

```text
type FilesV4DeleteFileCallOptions = {
  /**
   * The provider reference of the file, as returned by `uploadFile`.
   */
  file: SharedV4ProviderReference;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `FilesV4DeleteFileResult`

Result of deleting a file via the files interface.

```text
type FilesV4DeleteFileResult = {
  /**
   * A provider reference mapping provider names to provider-specific file identifiers.
   * Contains only the operated provider's entry — when working with a merged
   * multi-provider reference, do not reassign it with this result.
   */
  providerReference: SharedV4ProviderReference;
  /**
   * Whether the provider confirmed the deletion.
   */
  deleted: boolean;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Warnings from the provider.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `FilesV4DownloadFileCallOptions`

Options for downloading file content via the files interface.

```text
type FilesV4DownloadFileCallOptions = {
  /**
   * The provider reference of the file, as returned by `uploadFile`.
   */
  file: SharedV4ProviderReference;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `FilesV4DownloadFileResult`

Result of downloading file content via the files interface.

```text
type FilesV4DownloadFileResult = {
  /**
   * The file content as a byte stream.
   * The consumer is responsible for draining or cancelling the stream.
   */
  content: ReadableStream<Uint8Array>;
  /**
   * The IANA media type of the file, if available from the provider.
   */
  mediaType?: string;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Warnings from the provider.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `FilesV4GetFileMetadataCallOptions`

Options for retrieving file metadata via the files interface.

```text
type FilesV4GetFileMetadataCallOptions = {
  /**
   * The provider reference of the file, as returned by `uploadFile`.
   */
  file: SharedV4ProviderReference;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `FilesV4GetFileMetadataResult`

Result of retrieving file metadata via the files interface.

```text
type FilesV4GetFileMetadataResult = {
  /**
   * A provider reference mapping provider names to provider-specific file identifiers.
   * Contains only the operated provider's entry — when working with a merged
   * multi-provider reference, do not reassign it with this result.
   */
  providerReference: SharedV4ProviderReference;
  /**
   * The filename of the file, if available from the provider.
   */
  filename?: string;
  /**
   * The IANA media type of the file, if available from the provider.
   */
  mediaType?: string;
  /**
   * The size of the file in bytes, if available from the provider.
   */
  byteSize?: number;
  /**
   * When the file was created, if available from the provider.
   */
  createdAt?: Date;
  /**
   * When the provider will delete the file (retention expiry),
   * if available from the provider.
   */
  expiresAt?: Date;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Warnings from the provider.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `FilesV4UploadFileCallOptions`

Options for uploading a file via the files interface.

```text
type FilesV4UploadFileCallOptions = {
  /**
   * The file data.
   *
   * - `{ type: 'data', data }`: raw bytes (`Uint8Array`) or a base64-encoded string.
   * - `{ type: 'text', text }`: inline text (UTF-8).
   * - `{ type: 'stream', stream }`: a byte stream (not buffered by providers
   *   that support streaming uploads).
   */
  data: SharedV4FileDataData | SharedV4FileDataText | FilesV4UploadFileStreamData;
  /**
   * The IANA media type of the file (e.g. `'application/pdf'`).
   */
  mediaType: string;
  /**
   * The filename of the file.
   */
  filename?: string;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `FilesV4UploadFileResult`

Result of uploading a file via the files interface.

```text
type FilesV4UploadFileResult = {
  /**
   * A provider reference mapping provider names to provider-specific file identifiers.
   * The key is the canonical provider name (e.g. `openai`) and may differ from
   * the interface's `provider` id (e.g. `openai.files`).
   */
  providerReference: SharedV4ProviderReference;
  /**
   * The IANA media type of the uploaded file, if available from the provider.
   */
  mediaType?: string;
  /**
   * The filename of the uploaded file, if available from the provider.
   */
  filename?: string;
  /**
   * The size of the uploaded file in bytes, if available from the provider.
   */
  byteSize?: number;
  /**
   * When the file was created, if available from the provider.
   */
  createdAt?: Date;
  /**
   * When the provider will delete the file (retention expiry, e.g. from a
   * requested upload TTL), if available from the provider.
   */
  expiresAt?: Date;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Warnings from the provider.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `FilesV4UploadFileStreamData`

File data variant containing a byte stream. Providers that support
streaming uploads send it without buffering the full file in memory.

```text
interface FilesV4UploadFileStreamData {
  type: 'stream';
  stream: ReadableStream<Uint8Array>;
}
```

## `getErrorMessage`

Use the SDK error formatting rules inside an Effect so formatting failures enter the
error channel.

```text
getErrorMessage: (error: unknown) => Effect.Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `ImageModelV2`

Preserve the SDK protocol for v2 image generation and lift model operations into Effect.

```text
export type ImageModelV2 = LegacyModel<sdk.ImageModelV2>;
```

## `ImageModelV2CallOptions`

The public declaration does not include a description.

```text
type ImageModelV2CallOptions = {
  /**
   * Prompt for the image generation.
   */
  prompt: string;
  /**
   * Number of images to generate.
   */
  n: number;
  /**
   * Size of the images to generate.
   * Must have the format `{width}x{height}`.
   * `undefined` will use the provider's default size.
   */
  size: `${number}x${number}` | undefined;
  /**
   * Aspect ratio of the images to generate.
   * Must have the format `{width}:{height}`.
   * `undefined` will use the provider's default aspect ratio.
   */
  aspectRatio: `${number}:${number}` | undefined;
  /**
   * Seed for the image generation.
   * `undefined` will use the provider's default seed.
   */
  seed: number | undefined;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   * "openai": {
   * "style": "vivid"
   * }
   * }
   * ```
   */
  providerOptions: SharedV2ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `ImageModelV2CallWarning`

Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.

```text
type ImageModelV2CallWarning = {
  type: 'unsupported-setting';
  setting: keyof ImageModelV2CallOptions;
  details?: string;
} | {
  type: 'other';
  message: string;
};
```

## `ImageModelV2ProviderMetadata`

The public declaration does not include a description.

```text
type ImageModelV2ProviderMetadata = Record<string, {
  images: JSONArray;
} & JSONValue>;
```

## `ImageModelV3`

Preserve the SDK protocol for v3 image generation and lift model operations into Effect.

```text
export type ImageModelV3 = LegacyModel<sdk.ImageModelV3>;
```

## `ImageModelV3CallOptions`

The public declaration does not include a description.

```text
type ImageModelV3CallOptions = {
  /**
   * Prompt for the image generation. Some operations, like upscaling, may not require a prompt.
   */
  prompt: string | undefined;
  /**
   * Number of images to generate.
   */
  n: number;
  /**
   * Size of the images to generate.
   * Must have the format `{width}x{height}`.
   * `undefined` will use the provider's default size.
   */
  size: `${number}x${number}` | undefined;
  /**
   * Aspect ratio of the images to generate.
   * Must have the format `{width}:{height}`.
   * `undefined` will use the provider's default aspect ratio.
   */
  aspectRatio: `${number}:${number}` | undefined;
  /**
   * Seed for the image generation.
   * `undefined` will use the provider's default seed.
   */
  seed: number | undefined;
  /**
   * Array of images for image editing or variation generation.
   * The images should be provided as base64 encoded strings or binary data.
   */
  files: ImageModelV3File[] | undefined;
  /**
   * Mask image for inpainting operations.
   * The mask should be provided as base64 encoded strings or binary data.
   */
  mask: ImageModelV3File | undefined;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   *
   * ```ts
   * {
   *   "openai": {
   *     "style": "vivid"
   *   }
   * }
   * ```
   */
  providerOptions: SharedV3ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `ImageModelV3File`

An image file that can be used for image editing or variation generation.

```text
type ImageModelV3File = {
  type: 'file';
  /**
   * The IANA media type of the file, e.g. `image/png`. Any string is supported.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Generated file data as base64 encoded strings or binary data.
   *
   * The file data should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the file data should be returned
   * as base64 encoded strings. If the API returns binary data, the file data should
   * be returned as binary data.
   */
  data: string | Uint8Array;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV3ProviderMetadata;
} | {
  type: 'url';
  /**
   * The URL of the image file.
   */
  url: string;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV3ProviderMetadata;
};
```

## `ImageModelV3Middleware`

Wrap v3 image calls and allow image limits to resolve through Effect.

```text
export type ImageModelV3Middleware<R = never> = LegacyMiddleware<sdk.ImageModelV3Middleware, ImageModelV3, R>;
```

## `ImageModelV3ProviderMetadata`

The public declaration does not include a description.

```text
type ImageModelV3ProviderMetadata = Record<string, {
  images: JSONArray;
} & JSONValue>;
```

## `ImageModelV3Usage`

Usage information for an image model call.

```text
type ImageModelV3Usage = {
  /**
   * The number of input (prompt) tokens used.
   */
  inputTokens: number | undefined;
  /**
   * The number of output tokens used, if reported by the provider.
   */
  outputTokens: number | undefined;
  /**
   * The total number of tokens as reported by the provider.
   */
  totalTokens: number | undefined;
};
```

## `ImageModelV4`

Accept an image model handle with a fixed or deferred per-request image limit.

```text
export type ImageModelV4 = ReturnType<typeof wrapImageModel> | ReturnType<typeof wrapFixedImageModel>;
```

## `ImageModelV4CallOptions`

The public declaration does not include a description.

```text
type ImageModelV4CallOptions = {
  /**
   * Prompt for the image generation. Some operations, like upscaling, may not require a prompt.
   */
  prompt: string | undefined;
  /**
   * Number of images to generate.
   */
  n: number;
  /**
   * Size of the images to generate.
   * Must have the format `{width}x{height}`.
   * `undefined` will use the provider's default size.
   */
  size: `${number}x${number}` | undefined;
  /**
   * Aspect ratio of the images to generate.
   * Must have the format `{width}:{height}`.
   * `undefined` will use the provider's default aspect ratio.
   */
  aspectRatio: `${number}:${number}` | undefined;
  /**
   * Seed for the image generation.
   * `undefined` will use the provider's default seed.
   */
  seed: number | undefined;
  /**
   * Array of images for image editing or variation generation.
   * The images should be provided as base64 encoded strings or binary data.
   */
  files: ImageModelV4File[] | undefined;
  /**
   * Mask image for inpainting operations.
   * The mask should be provided as base64 encoded strings or binary data.
   */
  mask: ImageModelV4File | undefined;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   *
   * ```ts
   * {
   *   "openai": {
   *     "style": "vivid"
   *   }
   * }
   * ```
   */
  providerOptions: SharedV4ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `ImageModelV4File`

An image file that can be used for image editing or variation generation.

```text
type ImageModelV4File = {
  type: 'file';
  /**
   * The IANA media type of the file, e.g. `image/png`. Any string is supported.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Generated file data as base64 encoded strings or binary data.
   *
   * The file data should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the file data should be returned
   * as base64 encoded strings. If the API returns binary data, the file data should
   * be returned as binary data.
   */
  data: string | Uint8Array;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV4ProviderMetadata;
} | {
  type: 'url';
  /**
   * The URL of the image file.
   */
  url: string;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerOptions?: SharedV4ProviderMetadata;
};
```

## `ImageModelV4Middleware`

Preserve the v4-specific import name for the image middleware contract.

```text
export type ImageModelV4Middleware<R = never> = ImageModelMiddleware<R>;
```

## `ImageModelV4ProviderMetadata`

The public declaration does not include a description.

```text
type ImageModelV4ProviderMetadata = Record<string, {
  images: JSONArray;
} & JSONValue>;
```

## `ImageModelV4Result`

The result of an image model doGenerate call.

```text
type ImageModelV4Result = {
  /**
   * Generated images as base64 encoded strings or binary data.
   * The images should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the images should be returned
   * as base64 encoded strings. If the API returns binary data, the images should
   * be returned as binary data.
   */
  images: Array<string> | Array<Uint8Array>;
  /**
   * Whether an unsuccessful result, such as an empty image result, can be
   * retried. When omitted, the result is unclassified.
   */
  isRetryable?: boolean;
  /**
   * Warnings for the call, e.g. unsupported features.
   */
  warnings: Array<SharedV4Warning>;
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is provider-specific metadata. It always includes an
   * `images` key with image-specific metadata
   *
   * ```ts
   * {
   * "openai": {
   * "images": ["revisedPrompt": "Revised prompt here."]
   * }
   * }
   * ```
   */
  providerMetadata?: ImageModelV4ProviderMetadata;
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    /**
     * Timestamp for the start of the generated response.
     */
    timestamp: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId: string;
    /**
     * Response headers.
     */
    headers: Record<string, string> | undefined;
  };
  /**
   * Optional token usage for the image generation call (if the provider reports it).
   */
  usage?: ImageModelV4Usage;
};
```

## `ImageModelV4Usage`

Usage information for an image model call.

```text
type ImageModelV4Usage = {
  /**
   * The number of input (prompt) tokens used.
   */
  inputTokens: number | undefined;
  /**
   * The number of output tokens used, if reported by the provider.
   */
  outputTokens: number | undefined;
  /**
   * The total number of tokens as reported by the provider.
   */
  totalTokens: number | undefined;
};
```

## `InvalidArgumentError`

Wrap an invalid argument at an SDK validation boundary with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for an invalid argument at an SDK validation boundary.
`InvalidArgumentError.isInstance` checks its SDK cause.

```text
InvalidArgumentError: {
    new (args_0: {
        argument: string;
        message: string;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type InvalidArgumentError = AiSdkError;
```

## `InvalidPromptError`

Wrap a prompt rejected during SDK validation with the native arguments and expose its
SDK type guard.
Use the shared `AiSdkError` type for a prompt rejected during SDK validation.
`InvalidPromptError.isInstance` checks its SDK cause.

```text
InvalidPromptError: {
    new (args_0: {
        prompt: unknown;
        message: string;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type InvalidPromptError = AiSdkError;
```

## `InvalidResponseDataError`

Wrap response data rejected during SDK validation with the native arguments and expose
its SDK type guard.
Use the shared `AiSdkError` type for response data rejected during SDK validation.
`InvalidResponseDataError.isInstance` checks its SDK cause.

```text
InvalidResponseDataError: {
    new (args_0: {
        data: unknown;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type InvalidResponseDataError = AiSdkError;
```

## `isJSONArray`

Narrow unknown input to a JSON-compatible array using the SDK guard.

```text
isJSONArray: (value: unknown) => value is JSONArray
```

## `isJSONObject`

Narrow unknown input to a JSON-compatible object using the SDK guard.

```text
isJSONObject: (value: unknown) => value is JSONObject
```

## `isJSONValue`

Narrow unknown input to a JSON-compatible value using the SDK guard.

```text
isJSONValue: (value: unknown) => value is JSONValue
```

## `JSONArray`

The public declaration does not include a description.

```text
type JSONArray = JSONValue[];
```

## `JSONObject`

The public declaration does not include a description.

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `JSONParseError`

Wrap a failure to parse an SDK JSON payload with the native arguments and expose its SDK
type guard.
Use the shared `AiSdkError` type for a failure to parse an SDK JSON payload.
`JSONParseError.isInstance` checks its SDK cause.

```text
JSONParseError: {
    new (args_0: {
        text: string;
        cause: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type JSONParseError = AiSdkError;
```

## `JSONSchema7`

The public declaration does not include a description.

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

## `JSONSchema7Definition`

JSON Schema v7

**@see**: https://tools.ietf.org/html/draft-handrews-json-schema-validation-01

```text
export type JSONSchema7Definition = JSONSchema7 | boolean;
```

## `JSONValue`

A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.

```text
type JSONValue = null | string | number | boolean | Readonly<JSONObject> | readonly JSONValue[];
```

## `LanguageModelV2`

Preserve the SDK protocol for v2 language generation and streaming and lift model
operations into Effect.

```text
export type LanguageModelV2 = LegacyModel<sdk.LanguageModelV2>;
```

## `LanguageModelV2CallOptions`

The public declaration does not include a description.

```text
export type LanguageModelV2CallOptions = {
  /**
   * A language mode prompt is a standardized prompt type.
   *
   * Note: This is **not** the user-facing prompt. The AI SDK methods will map the
   * user-facing prompt types such as chat or instruction prompts to this format.
   * That approach allows us to evolve the user  facing prompts without breaking
   * the language model interface.
   */
  prompt: LanguageModelV2Prompt;
  /**
   * Maximum number of tokens to generate.
   */
  maxOutputTokens?: number;
  /**
   * Temperature setting. The range depends on the provider and model.
   */
  temperature?: number;
  /**
   * Stop sequences.
   * If set, the model will stop generating text when one of the stop sequences is generated.
   * Providers may have limits on the number of stop sequences.
   */
  stopSequences?: string[];
  /**
   * Nucleus sampling.
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
   */
  presencePenalty?: number;
  /**
   * Frequency penalty setting. It affects the likelihood of the model
   * to repeatedly use the same words or phrases.
   */
  frequencyPenalty?: number;
  /**
   * Response format. The output can either be text or JSON. Default is text.
   *
   * If JSON is selected, a schema can optionally be provided to guide the LLM.
   */
  responseFormat?: {
    type: 'text';
  } | {
    type: 'json';
    /**
     * JSON schema that the generated output should conform to.
     */
    schema?: JSONSchema7$1;
    /**
     * Name of output that should be generated. Used by some providers for additional LLM guidance.
     */
    name?: string;
    /**
     * Description of the output that should be generated. Used by some providers for additional LLM guidance.
     */
    description?: string;
  };
  /**
   * The seed (integer) to use for random sampling. If set and supported
   * by the model, calls will generate deterministic results.
   */
  seed?: number;
  /**
   * The tools that are available for the model.
   */
  tools?: Array<LanguageModelV2FunctionTool | LanguageModelV2ProviderDefinedTool>;
  /**
   * Specifies how the tool should be selected. Defaults to 'auto'.
   */
  toolChoice?: LanguageModelV2ToolChoice;
  /**
   * Include raw chunks in the stream. Only applicable for streaming calls.
   */
  includeRawChunks?: boolean;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
};
```

## `LanguageModelV2CallWarning`

Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.

```text
export type LanguageModelV2CallWarning = {
  type: 'unsupported-setting';
  setting: Omit<keyof LanguageModelV2CallOptions, 'prompt'>;
  details?: string;
} | {
  type: 'unsupported-tool';
  tool: LanguageModelV2FunctionTool | LanguageModelV2ProviderDefinedTool;
  details?: string;
} | {
  type: 'other';
  message: string;
};
```

## `LanguageModelV2Content`

The public declaration does not include a description.

```text
export type LanguageModelV2Content = LanguageModelV2Text | LanguageModelV2Reasoning | LanguageModelV2File | LanguageModelV2Source | LanguageModelV2ToolCall | LanguageModelV2ToolResult;
```

## `LanguageModelV2DataContent`

Data content. Can be a Uint8Array, base64 encoded data as a string or a URL.

```text
export type LanguageModelV2DataContent = Uint8Array | string | URL;
```

## `LanguageModelV2File`

A file that has been generated by the model.
Generated files as base64 encoded strings or binary data.
The files should be returned without any unnecessary conversion.

```text
export type LanguageModelV2File = {
  type: 'file';
  /**
   * The IANA media type of the file, e.g. `image/png` or `audio/mp3`.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Generated file data as base64 encoded strings or binary data.
   *
   * The file data should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the file data should be returned
   * as base64 encoded strings. If the API returns binary data, the file data should
   * be returned as binary data.
   */
  data: string | Uint8Array;
};
```

## `LanguageModelV2FilePart`

File content part of a prompt. It contains a file.

```text
export interface LanguageModelV2FilePart {
  type: 'file';
  /**
   * Optional filename of the file.
   */
  filename?: string;
  /**
   * File data. Can be a Uint8Array, base64 encoded data as a string or a URL.
   */
  data: LanguageModelV2DataContent;
  /**
   * IANA media type of the file.
   *
   * Can support wildcards, e.g. `image/*` (in which case the provider needs to take appropriate action).
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}
```

## `LanguageModelV2FinishReason`

Reason why a language model finished generating a response.

Can be one of the following:
- `stop`: model generated stop sequence
- `length`: model generated maximum number of tokens
- `content-filter`: content filter violation stopped the model
- `tool-calls`: model triggered tool calls
- `error`: model stopped because of an error
- `other`: model stopped for other reasons
- `unknown`: the model has not transmitted a finish reason

```text
export type LanguageModelV2FinishReason = 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
```

## `LanguageModelV2FunctionTool`

A tool has a name, a description, and a set of parameters.

Note: this is **not** the user-facing tool definition. The AI SDK methods will
map the user-facing tool definitions to this format.

```text
export type LanguageModelV2FunctionTool = {
  /**
   * The type of the tool (always 'function').
   */
  type: 'function';
  /**
   * The name of the tool. Unique within this model call.
   */
  name: string;
  /**
   * A description of the tool. The language model uses this to understand the
   * tool's purpose and to provide better completion suggestions.
   */
  description?: string;
  /**
   * The parameters that the tool expects. The language model uses this to
   * understand the tool's input requirements and to provide matching suggestions.
   */
  inputSchema: JSONSchema7$1;
  /**
   * The provider-specific options for the tool.
   */
  providerOptions?: SharedV2ProviderOptions;
};
```

## `LanguageModelV2Message`

The public declaration does not include a description.

```text
export type LanguageModelV2Message = ({
  role: 'system';
  content: string;
} | {
  role: 'user';
  content: Array<LanguageModelV2TextPart | LanguageModelV2FilePart>;
} | {
  role: 'assistant';
  content: Array<LanguageModelV2TextPart | LanguageModelV2FilePart | LanguageModelV2ReasoningPart | LanguageModelV2ToolCallPart | LanguageModelV2ToolResultPart>;
} | {
  role: 'tool';
  content: Array<LanguageModelV2ToolResultPart>;
}) & {
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
};
```

## `LanguageModelV2Middleware`

Wrap v2 generation and streaming operations with Effect middleware hooks.

```text
export type LanguageModelV2Middleware<R = never> = LegacyMiddleware<sdk.LanguageModelV2Middleware, LanguageModelV2, R>;
```

## `LanguageModelV2Prompt`

A prompt is a list of messages.

Note: Not all models and prompt formats support multi-modal inputs and
tool calls. The validation happens at runtime.

Note: This is not a user-facing prompt. The AI SDK methods will map the
user-facing prompt types such as chat or instruction prompts to this format.

```text
export type LanguageModelV2Prompt = Array<LanguageModelV2Message>;
```

## `LanguageModelV2ProviderDefinedTool`

The configuration of a tool that is defined by the provider.

```text
export type LanguageModelV2ProviderDefinedTool = {
  /**
   * The type of the tool (always 'provider-defined').
   */
  type: 'provider-defined';
  /**
   * The ID of the tool. Should follow the format `<provider-name>.<unique-tool-name>`.
   */
  id: `${string}.${string}`;
  /**
   * The name of the tool that the user must use in the tool set.
   */
  name: string;
  /**
   * The arguments for configuring the tool. Must match the expected arguments defined by the provider for this tool.
   */
  args: Record<string, unknown>;
};
```

## `LanguageModelV2Reasoning`

Reasoning that the model has generated.

```text
export type LanguageModelV2Reasoning = {
  type: 'reasoning';
  text: string;
  /**
   * Optional provider-specific metadata for the reasoning part.
   */
  providerMetadata?: SharedV2ProviderMetadata;
};
```

## `LanguageModelV2ReasoningPart`

Reasoning content part of a prompt. It contains a string of reasoning text.

```text
export interface LanguageModelV2ReasoningPart {
  type: 'reasoning';
  /**
   * The reasoning text.
   */
  text: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}
```

## `LanguageModelV2ResponseMetadata`

The public declaration does not include a description.

```text
export interface LanguageModelV2ResponseMetadata {
  /**
   * ID for the generated response, if the provider sends one.
   */
  id?: string;
  /**
   * Timestamp for the start of the generated response, if the provider sends one.
   */
  timestamp?: Date;
  /**
   * The ID of the response model that was used to generate the response, if the provider sends one.
   */
  modelId?: string;
}
```

## `LanguageModelV2Source`

A source that has been used as input to generate the response.

```text
export type LanguageModelV2Source = {
  type: 'source';
  /**
   * The type of source - URL sources reference web content.
   */
  sourceType: 'url';
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * The URL of the source.
   */
  url: string;
  /**
   * The title of the source.
   */
  title?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: SharedV2ProviderMetadata;
} | {
  type: 'source';
  /**
   * The type of source - document sources reference files/documents.
   */
  sourceType: 'document';
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * IANA media type of the document (e.g., 'application/pdf').
   */
  mediaType: string;
  /**
   * The title of the document.
   */
  title: string;
  /**
   * Optional filename of the document.
   */
  filename?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: SharedV2ProviderMetadata;
};
```

## `LanguageModelV2StreamPart`

The public declaration does not include a description.

```text
export type LanguageModelV2StreamPart = {
  type: 'text-start';
  providerMetadata?: SharedV2ProviderMetadata;
  id: string;
} | {
  type: 'text-delta';
  id: string;
  providerMetadata?: SharedV2ProviderMetadata;
  delta: string;
} | {
  type: 'text-end';
  providerMetadata?: SharedV2ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-start';
  providerMetadata?: SharedV2ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-delta';
  id: string;
  providerMetadata?: SharedV2ProviderMetadata;
  delta: string;
} | {
  type: 'reasoning-end';
  id: string;
  providerMetadata?: SharedV2ProviderMetadata;
} | {
  type: 'tool-input-start';
  id: string;
  toolName: string;
  providerMetadata?: SharedV2ProviderMetadata;
  providerExecuted?: boolean;
} | {
  type: 'tool-input-delta';
  id: string;
  delta: string;
  providerMetadata?: SharedV2ProviderMetadata;
} | {
  type: 'tool-input-end';
  id: string;
  providerMetadata?: SharedV2ProviderMetadata;
} | LanguageModelV2ToolCall | LanguageModelV2ToolResult | LanguageModelV2File | LanguageModelV2Source | {
  type: 'stream-start';
  warnings: Array<LanguageModelV2CallWarning>;
} | ({
  type: 'response-metadata';
} & LanguageModelV2ResponseMetadata) | {
  type: 'finish';
  usage: LanguageModelV2Usage;
  finishReason: LanguageModelV2FinishReason;
  providerMetadata?: SharedV2ProviderMetadata;
} | {
  type: 'raw';
  rawValue: unknown;
} | {
  type: 'error';
  error: unknown;
};
```

## `LanguageModelV2Text`

Text that the model has generated.

```text
export type LanguageModelV2Text = {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  providerMetadata?: SharedV2ProviderMetadata;
};
```

## `LanguageModelV2TextPart`

Text content part of a prompt. It contains a string of text.

```text
export interface LanguageModelV2TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}
```

## `LanguageModelV2ToolCall`

Tool calls that the model has generated.

```text
export type LanguageModelV2ToolCall = {
  type: 'tool-call';
  /**
   * The identifier of the tool call. It must be unique across all tool calls.
   */
  toolCallId: string;
  /**
   * The name of the tool that should be called.
   */
  toolName: string;
  /**
   * Stringified JSON object with the tool call arguments. Must match the
   * parameters schema of the tool.
   */
  input: string;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Additional provider-specific metadata for the tool call.
   */
  providerMetadata?: SharedV2ProviderMetadata;
};
```

## `LanguageModelV2ToolCallPart`

Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).

```text
export interface LanguageModelV2ToolCallPart {
  type: 'tool-call';
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  input: unknown;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}
```

## `LanguageModelV2ToolChoice`

The public declaration does not include a description.

```text
export type LanguageModelV2ToolChoice = {
  type: 'auto';
} | {
  type: 'none';
} | {
  type: 'required';
} | {
  type: 'tool';
  toolName: string;
};
```

## `LanguageModelV2ToolResultOutput`

The public declaration does not include a description.

```text
export type LanguageModelV2ToolResultOutput = {
  type: 'text';
  value: string;
} | {
  type: 'json';
  value: JSONValue;
} | {
  type: 'error-text';
  value: string;
} | {
  type: 'error-json';
  value: JSONValue;
} | {
  type: 'content';
  value: Array<{
    type: 'text';
    /**
     * Text content.
     */
    text: string;
  } | {
    type: 'media';
    /**
     * Base-64 encoded media data.
     */
    data: string;
    /**
     * IANA media type.
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType: string;
  }>;
};
```

## `LanguageModelV2ToolResultPart`

Tool result content part of a prompt. It contains the result of the tool call with the matching ID.

```text
export interface LanguageModelV2ToolResultPart {
  type: 'tool-result';
  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call.
   */
  output: LanguageModelV2ToolResultOutput;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV2ProviderOptions;
}
```

## `LanguageModelV2Usage`

Usage information for a language model call.

If your API return additional usage information, you can add it to the
provider metadata under your provider's key.

```text
export type LanguageModelV2Usage = {
  /**
   * The number of input (prompt) tokens used.
   */
  inputTokens: number | undefined;
  /**
   * The number of output (completion) tokens used.
   */
  outputTokens: number | undefined;
  /**
   * The total number of tokens as reported by the provider.
   * This number might be different from the sum of `inputTokens` and `outputTokens`
   * and e.g. include reasoning tokens or other overhead.
   */
  totalTokens: number | undefined;
  /**
   * The number of reasoning tokens used.
   */
  reasoningTokens?: number | undefined;
  /**
   * The number of cached input tokens.
   */
  cachedInputTokens?: number | undefined;
};
```

## `LanguageModelV3`

Preserve the SDK protocol for v3 language generation and streaming and lift model
operations into Effect.

```text
export type LanguageModelV3 = LegacyModel<sdk.LanguageModelV3>;
```

## `LanguageModelV3CallOptions`

The public declaration does not include a description.

```text
export type LanguageModelV3CallOptions = {
  /**
   * A language mode prompt is a standardized prompt type.
   *
   * Note: This is **not** the user-facing prompt. The AI SDK methods will map the
   * user-facing prompt types such as chat or instruction prompts to this format.
   * That approach allows us to evolve the user  facing prompts without breaking
   * the language model interface.
   */
  prompt: LanguageModelV3Prompt;
  /**
   * Maximum number of tokens to generate.
   */
  maxOutputTokens?: number;
  /**
   * Temperature setting. The range depends on the provider and model.
   */
  temperature?: number;
  /**
   * Stop sequences.
   * If set, the model will stop generating text when one of the stop sequences is generated.
   * Providers may have limits on the number of stop sequences.
   */
  stopSequences?: string[];
  /**
   * Nucleus sampling.
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
   */
  presencePenalty?: number;
  /**
   * Frequency penalty setting. It affects the likelihood of the model
   * to repeatedly use the same words or phrases.
   */
  frequencyPenalty?: number;
  /**
   * Response format. The output can either be text or JSON. Default is text.
   *
   * If JSON is selected, a schema can optionally be provided to guide the LLM.
   */
  responseFormat?: {
    type: 'text';
  } | {
    type: 'json';
    /**
     * JSON schema that the generated output should conform to.
     */
    schema?: JSONSchema7$1;
    /**
     * Name of output that should be generated. Used by some providers for additional LLM guidance.
     */
    name?: string;
    /**
     * Description of the output that should be generated. Used by some providers for additional LLM guidance.
     */
    description?: string;
  };
  /**
   * The seed (integer) to use for random sampling. If set and supported
   * by the model, calls will generate deterministic results.
   */
  seed?: number;
  /**
   * The tools that are available for the model.
   */
  tools?: Array<LanguageModelV3FunctionTool | LanguageModelV3ProviderTool>;
  /**
   * Specifies how the tool should be selected. Defaults to 'auto'.
   */
  toolChoice?: LanguageModelV3ToolChoice;
  /**
   * Include raw chunks in the stream. Only applicable for streaming calls.
   */
  includeRawChunks?: boolean;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
};
```

## `LanguageModelV3Content`

The public declaration does not include a description.

```text
export type LanguageModelV3Content = LanguageModelV3Text | LanguageModelV3Reasoning | LanguageModelV3File | LanguageModelV3ToolApprovalRequest | LanguageModelV3Source | LanguageModelV3ToolCall | LanguageModelV3ToolResult;
```

## `LanguageModelV3DataContent`

Data content. Can be a Uint8Array, base64 encoded data as a string or a URL.

```text
export type LanguageModelV3DataContent = Uint8Array | string | URL;
```

## `LanguageModelV3File`

A file that has been generated by the model.
Generated files as base64 encoded strings or binary data.
The files should be returned without any unnecessary conversion.

```text
export type LanguageModelV3File = {
  type: 'file';
  /**
   * The IANA media type of the file, e.g. `image/png` or `audio/mp3`.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Generated file data as base64 encoded strings or binary data.
   *
   * The file data should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the file data should be returned
   * as base64 encoded strings. If the API returns binary data, the file data should
   * be returned as binary data.
   */
  data: string | Uint8Array;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3FilePart`

File content part of a prompt. It contains a file.

```text
export interface LanguageModelV3FilePart {
  type: 'file';
  /**
   * Optional filename of the file.
   */
  filename?: string;
  /**
   * File data. Can be a Uint8Array, base64 encoded data as a string or a URL.
   */
  data: LanguageModelV3DataContent;
  /**
   * IANA media type of the file.
   *
   * Can support wildcards, e.g. `image/*` (in which case the provider needs to take appropriate action).
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
}
```

## `LanguageModelV3FinishReason`

Reason why a language model finished generating a response.

Contains both a unified finish reason and a raw finish reason from the provider.
The unified finish reason is used to provide a consistent finish reason across different providers.
The raw finish reason is used to provide the original finish reason from the provider.

```text
export type LanguageModelV3FinishReason = {
  /**
   * Unified finish reason. This enables using the same finish reason across different providers.
   *
   * Can be one of the following:
   * - `stop`: model generated stop sequence
   * - `length`: model generated maximum number of tokens
   * - `content-filter`: content filter violation stopped the model
   * - `tool-calls`: model triggered tool calls
   * - `error`: model stopped because of an error
   * - `other`: model stopped for other reasons
   */
  unified: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other';
  /**
   * Raw finish reason from the provider.
   * This is the original finish reason from the provider.
   */
  raw: string | undefined;
};
```

## `LanguageModelV3FunctionTool`

A tool has a name, a description, and a set of parameters.

Note: this is **not** the user-facing tool definition. The AI SDK methods will
map the user-facing tool definitions to this format.

```text
export type LanguageModelV3FunctionTool = {
  /**
   * The type of the tool (always 'function').
   */
  type: 'function';
  /**
   * The name of the tool. Unique within this model call.
   */
  name: string;
  /**
   * A description of the tool. The language model uses this to understand the
   * tool's purpose and to provide better completion suggestions.
   */
  description?: string;
  /**
   * The parameters that the tool expects. The language model uses this to
   * understand the tool's input requirements and to provide matching suggestions.
   */
  inputSchema: JSONSchema7$1;
  /**
   * An optional list of input examples that show the language
   * model what the input should look like.
   */
  inputExamples?: Array<{
    input: JSONObject;
  }>;
  /**
   * Strict mode setting for the tool.
   *
   * Providers that support strict mode will use this setting to determine
   * how the input should be generated. Strict mode will always produce
   * valid inputs, but it might limit what input schemas are supported.
   */
  strict?: boolean;
  /**
   * The provider-specific options for the tool.
   */
  providerOptions?: SharedV3ProviderOptions;
};
```

## `LanguageModelV3GenerateResult`

The result of a language model doGenerate call.

```text
export type LanguageModelV3GenerateResult = {
  /**
   * Ordered content that the model has generated.
   */
  content: Array<LanguageModelV3Content>;
  /**
   * The finish reason.
   */
  finishReason: LanguageModelV3FinishReason;
  /**
   * The usage information.
   */
  usage: LanguageModelV3Usage;
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV3ProviderMetadata;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Request HTTP body that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response information for telemetry and debugging purposes.
   */
  response?: LanguageModelV3ResponseMetadata & {
    /**
     * Response headers.
     */
    headers?: SharedV3Headers;
    /**
     * Response HTTP body.
     */
    body?: unknown;
  };
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV3Warning>;
};
```

## `LanguageModelV3Message`

The public declaration does not include a description.

```text
export type LanguageModelV3Message = ({
  role: 'system';
  content: string;
} | {
  role: 'user';
  content: Array<LanguageModelV3TextPart | LanguageModelV3FilePart>;
} | {
  role: 'assistant';
  content: Array<LanguageModelV3TextPart | LanguageModelV3FilePart | LanguageModelV3ReasoningPart | LanguageModelV3ToolCallPart | LanguageModelV3ToolResultPart>;
} | {
  role: 'tool';
  content: Array<LanguageModelV3ToolResultPart | LanguageModelV3ToolApprovalResponsePart>;
}) & {
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
};
```

## `LanguageModelV3Middleware`

Wrap v3 generation and streaming operations with Effect middleware hooks.

```text
export type LanguageModelV3Middleware<R = never> = LegacyMiddleware<sdk.LanguageModelV3Middleware, LanguageModelV3, R>;
```

## `LanguageModelV3Prompt`

A prompt is a list of messages.

Note: Not all models and prompt formats support multi-modal inputs and
tool calls. The validation happens at runtime.

Note: This is not a user-facing prompt. The AI SDK methods will map the
user-facing prompt types such as chat or instruction prompts to this format.

```text
export type LanguageModelV3Prompt = Array<LanguageModelV3Message>;
```

## `LanguageModelV3ProviderTool`

The configuration of a provider tool.

Provider tools are tools that are specific to a certain provider.
The input and output schemas are defined be the provider, and
some of the tools are also executed on the provider systems.

```text
export type LanguageModelV3ProviderTool = {
  /**
   * The type of the tool (always 'provider').
   */
  type: 'provider';
  /**
   * The ID of the tool. Should follow the format `<provider-id>.<unique-tool-name>`.
   */
  id: `${string}.${string}`;
  /**
   * The name of the tool. Unique within this model call.
   */
  name: string;
  /**
   * The arguments for configuring the tool. Must match the expected arguments defined by the provider for this tool.
   */
  args: Record<string, unknown>;
};
```

## `LanguageModelV3Reasoning`

Reasoning that the model has generated.

```text
export type LanguageModelV3Reasoning = {
  type: 'reasoning';
  text: string;
  /**
   * Optional provider-specific metadata for the reasoning part.
   */
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3ReasoningPart`

Reasoning content part of a prompt. It contains a string of reasoning text.

```text
export interface LanguageModelV3ReasoningPart {
  type: 'reasoning';
  /**
   * The reasoning text.
   */
  text: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
}
```

## `LanguageModelV3ResponseMetadata`

The public declaration does not include a description.

```text
export interface LanguageModelV3ResponseMetadata {
  /**
   * ID for the generated response, if the provider sends one.
   */
  id?: string;
  /**
   * Timestamp for the start of the generated response, if the provider sends one.
   */
  timestamp?: Date;
  /**
   * The ID of the response model that was used to generate the response, if the provider sends one.
   */
  modelId?: string;
}
```

## `LanguageModelV3Source`

A source that has been used as input to generate the response.

```text
export type LanguageModelV3Source = {
  type: 'source';
  /**
   * The type of source - URL sources reference web content.
   */
  sourceType: 'url';
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * The URL of the source.
   */
  url: string;
  /**
   * The title of the source.
   */
  title?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: SharedV3ProviderMetadata;
} | {
  type: 'source';
  /**
   * The type of source - document sources reference files/documents.
   */
  sourceType: 'document';
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * IANA media type of the document (e.g., 'application/pdf').
   */
  mediaType: string;
  /**
   * The title of the document.
   */
  title: string;
  /**
   * Optional filename of the document.
   */
  filename?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3StreamPart`

The public declaration does not include a description.

```text
export type LanguageModelV3StreamPart = {
  type: 'text-start';
  providerMetadata?: SharedV3ProviderMetadata;
  id: string;
} | {
  type: 'text-delta';
  id: string;
  providerMetadata?: SharedV3ProviderMetadata;
  delta: string;
} | {
  type: 'text-end';
  providerMetadata?: SharedV3ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-start';
  providerMetadata?: SharedV3ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-delta';
  id: string;
  providerMetadata?: SharedV3ProviderMetadata;
  delta: string;
} | {
  type: 'reasoning-end';
  id: string;
  providerMetadata?: SharedV3ProviderMetadata;
} | {
  type: 'tool-input-start';
  id: string;
  toolName: string;
  providerMetadata?: SharedV3ProviderMetadata;
  providerExecuted?: boolean;
  dynamic?: boolean;
  title?: string;
} | {
  type: 'tool-input-delta';
  id: string;
  delta: string;
  providerMetadata?: SharedV3ProviderMetadata;
} | {
  type: 'tool-input-end';
  id: string;
  providerMetadata?: SharedV3ProviderMetadata;
} | LanguageModelV3ToolApprovalRequest | LanguageModelV3ToolCall | LanguageModelV3ToolResult | LanguageModelV3File | LanguageModelV3Source | {
  type: 'stream-start';
  warnings: Array<SharedV3Warning>;
} | ({
  type: 'response-metadata';
} & LanguageModelV3ResponseMetadata) | {
  type: 'finish';
  usage: LanguageModelV3Usage;
  finishReason: LanguageModelV3FinishReason;
  providerMetadata?: SharedV3ProviderMetadata;
} | {
  type: 'raw';
  rawValue: unknown;
} | {
  type: 'error';
  error: unknown;
};
```

## `LanguageModelV3StreamResult`

The result of a language model doStream call.

```text
export type LanguageModelV3StreamResult = {
  /**
   * The stream.
   */
  stream: ReadableStream<LanguageModelV3StreamPart>;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Request HTTP body that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response data.
   */
  response?: {
    /**
     * Response headers.
     */
    headers?: SharedV3Headers;
  };
};
```

## `LanguageModelV3Text`

Text that the model has generated.

```text
export type LanguageModelV3Text = {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3TextPart`

Text content part of a prompt. It contains a string of text.

```text
export interface LanguageModelV3TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
}
```

## `LanguageModelV3ToolApprovalRequest`

Tool approval request emitted by a provider for a provider-executed tool call.

This is used for flows where the provider executes the tool (e.g. MCP tools)
but requires an explicit user approval before continuing.

```text
export type LanguageModelV3ToolApprovalRequest = {
  type: 'tool-approval-request';
  /**
   * ID of the approval request. This ID is referenced by the subsequent
   * tool-approval-response (tool message) to approve or deny execution.
   */
  approvalId: string;
  /**
   * The tool call ID that this approval request is for.
   */
  toolCallId: string;
  /**
   * Additional provider-specific metadata for the approval request.
   */
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3ToolApprovalResponsePart`

Tool approval response content part of a prompt. It contains the user's
decision to approve or deny a provider-executed tool call.

```text
export interface LanguageModelV3ToolApprovalResponsePart {
  type: 'tool-approval-response';
  /**
   * ID of the approval request that this response refers to.
   */
  approvalId: string;
  /**
   * Whether the approval was granted (true) or denied (false).
   */
  approved: boolean;
  /**
   * Optional reason for approval or denial.
   */
  reason?: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
}
```

## `LanguageModelV3ToolCall`

Tool calls that the model has generated.

```text
export type LanguageModelV3ToolCall = {
  type: 'tool-call';
  /**
   * The identifier of the tool call. It must be unique across all tool calls.
   */
  toolCallId: string;
  /**
   * The name of the tool that should be called.
   */
  toolName: string;
  /**
   * Stringified JSON object with the tool call arguments. Must match the
   * parameters schema of the tool.
   */
  input: string;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Whether the tool is dynamic, i.e. defined at runtime.
   * For example, MCP (Model Context Protocol) tools that are executed by the provider.
   */
  dynamic?: boolean;
  /**
   * Additional provider-specific metadata for the tool call.
   */
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3ToolCallPart`

Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).

```text
export interface LanguageModelV3ToolCallPart {
  type: 'tool-call';
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  input: unknown;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
}
```

## `LanguageModelV3ToolChoice`

The public declaration does not include a description.

```text
export type LanguageModelV3ToolChoice = {
  type: 'auto';
} | {
  type: 'none';
} | {
  type: 'required';
} | {
  type: 'tool';
  toolName: string;
};
```

## `LanguageModelV3ToolResult`

Result of a tool call that has been executed by the provider.

```text
export type LanguageModelV3ToolResult = {
  type: 'tool-result';
  /**
   * The ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call. This is a JSON-serializable object.
   */
  result: NonNullable<JSONValue>;
  /**
   * Optional flag if the result is an error or an error message.
   */
  isError?: boolean;
  /**
   * Whether the tool result is preliminary.
   *
   * Preliminary tool results replace each other, e.g. image previews.
   * There always has to be a final, non-preliminary tool result.
   *
   * If this flag is set to true, the tool result is preliminary.
   * If this flag is not set or is false, the tool result is not preliminary.
   */
  preliminary?: boolean;
  /**
   * Whether the tool is dynamic, i.e. defined at runtime.
   * For example, MCP (Model Context Protocol) tools that are executed by the provider.
   */
  dynamic?: boolean;
  /**
   * Additional provider-specific metadata for the tool result.
   */
  providerMetadata?: SharedV3ProviderMetadata;
};
```

## `LanguageModelV3ToolResultOutput`

Result of a tool call.

```text
export type LanguageModelV3ToolResultOutput = {
  /**
   * Text tool output that should be directly sent to the API.
   */
  type: 'text';
  value: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV3ProviderOptions;
} | {
  type: 'json';
  value: JSONValue;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV3ProviderOptions;
} | {
  /**
   * Type when the user has denied the execution of the tool call.
   */
  type: 'execution-denied';
  /**
   * Optional reason for the execution denial.
   */
  reason?: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV3ProviderOptions;
} | {
  type: 'error-text';
  value: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV3ProviderOptions;
} | {
  type: 'error-json';
  value: JSONValue;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV3ProviderOptions;
} | {
  type: 'content';
  value: Array<{
    type: 'text';
    /**
     * Text content.
     */
    text: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    type: 'file-data';
    /**
     * Base-64 encoded media data.
     */
    data: string;
    /**
     * IANA media type.
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType: string;
    /**
     * Optional filename of the file.
     */
    filename?: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    type: 'file-url';
    /**
     * URL of the file.
     */
    url: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    type: 'file-id';
    /**
     * ID of the file.
     *
     * If you use multiple providers, you need to
     * specify the provider specific ids using
     * the Record option. The key is the provider
     * name, e.g. 'openai' or 'anthropic'.
     */
    fileId: string | Record<string, string>;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    /**
     * Images that are referenced using base64 encoded data.
     */
    type: 'image-data';
    /**
     * Base-64 encoded image data.
     */
    data: string;
    /**
     * IANA media type.
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    /**
     * Images that are referenced using a URL.
     */
    type: 'image-url';
    /**
     * URL of the image.
     */
    url: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    /**
     * Images that are referenced using a provider file id.
     */
    type: 'image-file-id';
    /**
     * Image that is referenced using a provider file id.
     *
     * If you use multiple providers, you need to
     * specify the provider specific ids using
     * the Record option. The key is the provider
     * name, e.g. 'openai' or 'anthropic'.
     */
    fileId: string | Record<string, string>;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  } | {
    /**
     * Custom content part. This can be used to implement
     * provider-specific content parts.
     */
    type: 'custom';
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV3ProviderOptions;
  }>;
};
```

## `LanguageModelV3ToolResultPart`

Tool result content part of a prompt. It contains the result of the tool call with the matching ID.

```text
export interface LanguageModelV3ToolResultPart {
  type: 'tool-result';
  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call.
   */
  output: LanguageModelV3ToolResultOutput;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
}
```

## `LanguageModelV3Usage`

Usage information for a language model call.

```text
export type LanguageModelV3Usage = {
  /**
   * Information about the input tokens.
   */
  inputTokens: {
    /**
     * The total number of input (prompt) tokens used.
     */
    total: number | undefined;
    /**
     * The number of non-cached input (prompt) tokens used.
     */
    noCache: number | undefined;
    /**
     * The number of cached input (prompt) tokens read.
     */
    cacheRead: number | undefined;
    /**
     * The number of cached input (prompt) tokens written.
     */
    cacheWrite: number | undefined;
  };
  /**
   * Information about the output tokens.
   */
  outputTokens: {
    /**
     * The total number of output (completion) tokens used.
     */
    total: number | undefined;
    /**
     * The number of text tokens used.
     */
    text: number | undefined;
    /**
     * The number of reasoning tokens used.
     */
    reasoning: number | undefined;
  };
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

An Effect handle to a v4 SDK language model.

```text
export type LanguageModelV4 = ReturnType<typeof wrapLanguageModel>;
```

## `LanguageModelV4CallOptions`

The public declaration does not include a description.

```text
export type LanguageModelV4CallOptions = {
  /**
   * A language mode prompt is a standardized prompt type.
   *
   * Note: This is **not** the user-facing prompt. The AI SDK methods will map the
   * user-facing prompt types such as chat or instruction prompts to this format.
   * That approach allows us to evolve the user  facing prompts without breaking
   * the language model interface.
   */
  prompt: LanguageModelV4Prompt;
  /**
   * Maximum number of tokens to generate.
   */
  maxOutputTokens?: number;
  /**
   * Temperature setting. The range depends on the provider and model.
   */
  temperature?: number;
  /**
   * Stop sequences.
   * If set, the model will stop generating text when one of the stop sequences is generated.
   * Providers may have limits on the number of stop sequences.
   */
  stopSequences?: string[];
  /**
   * Nucleus sampling.
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
   */
  presencePenalty?: number;
  /**
   * Frequency penalty setting. It affects the likelihood of the model
   * to repeatedly use the same words or phrases.
   */
  frequencyPenalty?: number;
  /**
   * Response format. The output can either be text or JSON. Default is text.
   *
   * If JSON is selected, a schema can optionally be provided to guide the LLM.
   */
  responseFormat?: {
    type: 'text';
  } | {
    type: 'json';
    /**
     * JSON schema that the generated output should conform to.
     */
    schema?: JSONSchema7$1;
    /**
     * Name of output that should be generated. Used by some providers for additional LLM guidance.
     */
    name?: string;
    /**
     * Description of the output that should be generated. Used by some providers for additional LLM guidance.
     */
    description?: string;
  };
  /**
   * The seed (integer) to use for random sampling. If set and supported
   * by the model, calls will generate deterministic results.
   */
  seed?: number;
  /**
   * The tools that are available for the model.
   */
  tools?: Array<LanguageModelV4FunctionTool | LanguageModelV4ProviderTool>;
  /**
   * Specifies how the tool should be selected. Defaults to 'auto'.
   */
  toolChoice?: LanguageModelV4ToolChoice;
  /**
   * Include raw chunks in the stream. Only applicable for streaming calls.
   */
  includeRawChunks?: boolean;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Reasoning effort level for the model. Controls how much reasoning
   * the model performs before generating a response. Defaults to 'provider-default'.
   */
  reasoning?: 'provider-default' | 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `LanguageModelV4Citation`

A reference supporting generated text. Citations are attached to the text
they support, independently of the complete set of retrieved sources.

```text
export type LanguageModelV4Citation = {
  /** The referenced URL or document. */
  source: LanguageModelV4Source;
  /** Start offset in the containing generated text, when supplied by the provider. */
  startIndex?: number;
  /** Exclusive end offset in the containing generated text, when supplied by the provider. */
  endIndex?: number;
  /** The supporting passage from the source, when supplied by the provider. */
  citedText?: string;
};
```

## `LanguageModelV4Content`

The public declaration does not include a description.

```text
export type LanguageModelV4Content = LanguageModelV4Text | LanguageModelV4Reasoning | LanguageModelV4CustomContent | LanguageModelV4ReasoningFile | LanguageModelV4File | LanguageModelV4ToolApprovalRequest | LanguageModelV4Source | LanguageModelV4ToolCall | LanguageModelV4ToolResult;
```

## `LanguageModelV4CustomContent`

A provider-specific content block that does not map to another standardized
content part type.

```text
export type LanguageModelV4CustomContent = {
  type: 'custom';
  /**
   * The kind of custom content, in the format `{provider}.{provider-type}`.
   */
  kind: `${string}.${string}`;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4CustomPart`

Provider-specific content part of a prompt. It contains no standardized
payload beyond provider-specific options.

```text
export interface LanguageModelV4CustomPart {
  type: 'custom';
  /**
   * The kind of custom content, in the format `{provider}.{provider-type}`.
   */
  kind: `${string}.${string}`;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4File`

A file that has been generated by the model.
Generated files as base64 encoded strings or binary data.
The files should be returned without any unnecessary conversion.

```text
export type LanguageModelV4File = {
  type: 'file';
  /**
   * The IANA media type of the file, e.g. `image/png` or `audio/mp3`.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Generated file data as a tagged discriminated union:
   *
   * - `{ type: 'data', data }`: raw bytes (Uint8Array) or base64-encoded string.
   * - `{ type: 'url', url }`: a URL that points to the file.
   *
   * The file data should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the file data should be returned
   * as base64 encoded strings. If the API returns binary data, the file data should
   * be returned as binary data.
   */
  data: SharedV4FileDataData | SharedV4FileDataUrl;
  /**
   * Optional provider-specific metadata for the file part.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4FilePart`

File content part of a prompt. It contains a file.

```text
export interface LanguageModelV4FilePart {
  type: 'file';
  /**
   * Optional filename of the file.
   */
  filename?: string;
  /**
   * File data as a tagged discriminated union:
   *
   * - `{ type: 'data', data }`: raw bytes (Uint8Array) or base64-encoded string.
   * - `{ type: 'url', url }`: a URL that points to the file.
   * - `{ type: 'reference', reference }`: a provider reference (`{ [provider]: id }`).
   * - `{ type: 'text', text }`: inline text content (e.g. an inline text document).
   */
  data: SharedV4FileData;
  /**
   * Either a full IANA media type (`type/subtype`, e.g. `image/png`) or just
   * the top-level IANA segment (e.g. `image`, `audio`, `video`, `text`).
   *
   * `*`-subtype wildcards (e.g. `image/*`) are normalized as equivalent to the
   * top-level segment alone (e.g. `image`). Providers can use the helpers in
   * `@ai-sdk/provider-utils` (`isFullMediaType`, `getTopLevelMediaType`,
   * `detectMediaType`) to resolve the field according to their API
   * requirements.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4FinishReason`

Reason why a language model finished generating a response.

Contains both a unified finish reason and a raw finish reason from the provider.
The unified finish reason is used to provide a consistent finish reason across different providers.
The raw finish reason is used to provide the original finish reason from the provider.

```text
export type LanguageModelV4FinishReason = {
  /**
   * Unified finish reason. This enables using the same finish reason across different providers.
   *
   * Can be one of the following:
   * - `stop`: model generated stop sequence
   * - `length`: model generated maximum number of tokens
   * - `content-filter`: content filter violation stopped the model
   * - `tool-calls`: model triggered tool calls
   * - `error`: model stopped because of an error
   * - `interrupted`: provider stream ended without a completion signal; output may be incomplete
   * - `other`: model stopped for other reasons
   */
  unified: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'interrupted' | 'other';
  /**
   * Raw finish reason from the provider.
   * This is the original finish reason from the provider.
   */
  raw: string | undefined;
};
```

## `LanguageModelV4FunctionTool`

A tool has a name, a description, and a set of parameters.

Note: this is **not** the user-facing tool definition. The AI SDK methods will
map the user-facing tool definitions to this format.

```text
export type LanguageModelV4FunctionTool = {
  /**
   * The type of the tool (always 'function').
   */
  type: 'function';
  /**
   * The name of the tool. Unique within this model call.
   */
  name: string;
  /**
   * A description of the tool. The language model uses this to understand the
   * tool's purpose and to provide better completion suggestions.
   */
  description?: string;
  /**
   * The parameters that the tool expects. The language model uses this to
   * understand the tool's input requirements and to provide matching suggestions.
   */
  inputSchema: JSONSchema7$1;
  /**
   * An optional list of input examples that show the language
   * model what the input should look like.
   */
  inputExamples?: Array<{
    input: JSONObject;
  }>;
  /**
   * Strict mode setting for the tool.
   *
   * Providers that support strict mode will use this setting to determine
   * how the input should be generated. Strict mode will always produce
   * valid inputs, but it might limit what input schemas are supported.
   */
  strict?: boolean;
  /**
   * The provider-specific options for the tool.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `LanguageModelV4GenerateResult`

The result of a language model doGenerate call.

```text
export type LanguageModelV4GenerateResult = {
  /**
   * Ordered content that the model has generated.
   */
  content: Array<LanguageModelV4Content>;
  /**
   * Text to parse for structured JSON output when it differs from the
   * concatenation of all text parts in `content` (e.g. drafts followed by a
   * final answer). This does not replace or remove any generated content.
   *
   * When omitted, consumers concatenate all text parts. An empty string is
   * an explicit selection and must not fall back to the other text parts.
   */
  structuredOutputText?: string;
  /**
   * The finish reason.
   */
  finishReason: LanguageModelV4FinishReason;
  /**
   * The usage information.
   */
  usage: LanguageModelV4Usage;
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /** The actual HTTP endpoint used for this request, when known. */
    url?: string;
    /**
     * Request HTTP body that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response information for telemetry and debugging purposes.
   */
  response?: LanguageModelV4ResponseMetadata & {
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response HTTP body.
     */
    body?: unknown;
  };
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `LanguageModelV4Message`

The public declaration does not include a description.

```text
export type LanguageModelV4Message = ({
  role: 'system';
  content: string;
} | {
  role: 'user';
  content: Array<LanguageModelV4TextPart | LanguageModelV4FilePart>;
} | {
  role: 'assistant';
  content: Array<LanguageModelV4TextPart | LanguageModelV4FilePart | LanguageModelV4CustomPart | LanguageModelV4ReasoningPart | LanguageModelV4ReasoningFilePart | LanguageModelV4ToolCallPart | LanguageModelV4ToolResultPart>;
} | {
  role: 'tool';
  content: Array<LanguageModelV4ToolResultPart | LanguageModelV4ToolApprovalResponsePart>;
}) & {
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `LanguageModelV4Middleware`

Preserve the v4-specific import name for the language middleware contract.

```text
export type LanguageModelV4Middleware<R = never> = LanguageModelMiddleware<R>;
```

## `LanguageModelV4Prompt`

A prompt is a list of messages.

Note: Not all models and prompt formats support multi-modal inputs and
tool calls. The validation happens at runtime.

Note: This is not a user-facing prompt. The AI SDK methods will map the
user-facing prompt types such as chat or instruction prompts to this format.

```text
export type LanguageModelV4Prompt = Array<LanguageModelV4Message>;
```

## `LanguageModelV4ProviderTool`

The configuration of a provider tool.

Provider tools are tools that are specific to a certain provider.
The input and output schemas are defined be the provider, and
some of the tools are also executed on the provider systems.

```text
export type LanguageModelV4ProviderTool = {
  /**
   * The type of the tool (always 'provider').
   */
  type: 'provider';
  /**
   * The ID of the tool. Should follow the format `<provider-id>.<unique-tool-name>`.
   */
  id: `${string}.${string}`;
  /**
   * The name of the tool. Unique within this model call.
   */
  name: string;
  /**
   * The arguments for configuring the tool. Must match the expected arguments defined by the provider for this tool.
   */
  args: Record<string, unknown>;
};
```

## `LanguageModelV4Reasoning`

Reasoning that the model has generated.

```text
export type LanguageModelV4Reasoning = {
  type: 'reasoning';
  text: string;
  /**
   * Optional provider-specific metadata for the reasoning part.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4ReasoningFile`

A file that has been generated by the model as part of reasoning.
Generated files as base64 encoded strings or binary data.
The files should be returned without any unnecessary conversion.

```text
export type LanguageModelV4ReasoningFile = {
  type: 'reasoning-file';
  /**
   * The IANA media type of the file, e.g. `image/png` or `audio/mp3`.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Generated file data as a tagged discriminated union:
   *
   * - `{ type: 'data', data }`: raw bytes (Uint8Array) or base64-encoded string.
   * - `{ type: 'url', url }`: a URL that points to the file.
   *
   * The file data should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the file data should be returned
   * as base64 encoded strings. If the API returns binary data, the file data should
   * be returned as binary data.
   */
  data: SharedV4FileDataData | SharedV4FileDataUrl;
  /**
   * Optional provider-specific metadata for the reasoning file part.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4ReasoningFilePart`

Reasoning file content part of a prompt. It contains a file generated as part of reasoning.

```text
export interface LanguageModelV4ReasoningFilePart {
  type: 'reasoning-file';
  /**
   * File data as a tagged discriminated union:
   *
   * - `{ type: 'data', data }`: raw bytes (Uint8Array) or base64-encoded string.
   * - `{ type: 'url', url }`: a URL that points to the file.
   */
  data: SharedV4FileDataData | SharedV4FileDataUrl;
  /**
   * IANA media type of the file.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4ReasoningPart`

Reasoning content part of a prompt. It contains a string of reasoning text.

```text
export interface LanguageModelV4ReasoningPart {
  type: 'reasoning';
  /**
   * The reasoning text.
   */
  text: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4ResponseMetadata`

The public declaration does not include a description.

```text
export interface LanguageModelV4ResponseMetadata {
  /**
   * ID for the generated response, if the provider sends one.
   */
  id?: string;
  /**
   * Timestamp for the start of the generated response, if the provider sends one.
   */
  timestamp?: Date;
  /**
   * The ID of the response model that was used to generate the response, if the provider sends one.
   */
  modelId?: string;
}
```

## `LanguageModelV4Source`

A source that has been used as input to generate the response.

```text
export type LanguageModelV4Source = {
  type: 'source';
  /**
   * The type of source - URL sources reference web content.
   */
  sourceType: 'url';
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * The URL of the source.
   */
  url: string;
  /**
   * The title of the source.
   */
  title?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'source';
  /**
   * The type of source - document sources reference files/documents.
   */
  sourceType: 'document';
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * IANA media type of the document (e.g., 'application/pdf').
   */
  mediaType: string;
  /**
   * The title of the document.
   */
  title: string;
  /**
   * Optional filename of the document.
   */
  filename?: string;
  /**
   * Additional provider metadata for the source.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4StreamPart`

The public declaration does not include a description.

```text
export type LanguageModelV4StreamPart = {
  type: 'text-start';
  providerMetadata?: SharedV4ProviderMetadata;
  id: string;
} | {
  type: 'text-delta';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
  delta: string;
} | {
  type: 'text-end';
  /** References supporting the text block with this ID. */
  citations?: Array<LanguageModelV4Citation>;
  providerMetadata?: SharedV4ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-start';
  providerMetadata?: SharedV4ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-delta';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
  delta: string;
} | {
  type: 'reasoning-end';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'tool-input-start';
  id: string;
  toolName: string;
  /**
   * Encoding of the input deltas. Defaults to JSON when omitted.
   * Text deltas concatenate to a raw string. The final tool-call input
   * must still be JSON-encoded, regardless of the delta encoding.
   */
  inputEncoding?: 'json' | 'text';
  providerMetadata?: SharedV4ProviderMetadata;
  providerExecuted?: boolean;
  dynamic?: boolean;
  title?: string;
} | {
  type: 'tool-input-delta';
  id: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'tool-input-end';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | LanguageModelV4ToolApprovalRequest | LanguageModelV4ToolCall | LanguageModelV4ToolResult | LanguageModelV4CustomContent | LanguageModelV4File | LanguageModelV4ReasoningFile | LanguageModelV4Source | {
  type: 'stream-start';
  warnings: Array<SharedV4Warning>;
} | ({
  type: 'response-metadata';
} & LanguageModelV4ResponseMetadata) | {
  type: 'finish';
  usage: LanguageModelV4Usage;
  finishReason: LanguageModelV4FinishReason;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'ping';
} | {
  type: 'raw';
  rawValue: unknown;
} | {
  type: 'error';
  error: unknown;
};
```

## `LanguageModelV4StreamResult`

The result of a language model doStream call.

```text
export type LanguageModelV4StreamResult = {
  /**
   * The stream.
   */
  stream: ReadableStream<LanguageModelV4StreamPart>;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /** The actual HTTP endpoint used for this request, when known. */
    url?: string;
    /**
     * Request HTTP body that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response data.
   */
  response?: {
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
  };
};
```

## `LanguageModelV4Text`

Text that the model has generated.

```text
export type LanguageModelV4Text = {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  /** References supporting this text, separate from retrieved sources. */
  citations?: Array<LanguageModelV4Citation>;
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4TextPart`

Text content part of a prompt. It contains a string of text.

```text
export interface LanguageModelV4TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4ToolApprovalRequest`

Tool approval request emitted by a provider for a provider-executed tool call.

This is used for flows where the provider executes the tool (e.g. MCP tools)
but requires an explicit user approval before continuing.

```text
export type LanguageModelV4ToolApprovalRequest = {
  type: 'tool-approval-request';
  /**
   * ID of the approval request. This ID is referenced by the subsequent
   * tool-approval-response (tool message) to approve or deny execution.
   */
  approvalId: string;
  /**
   * The tool call ID that this approval request is for.
   */
  toolCallId: string;
  /**
   * Additional provider-specific metadata for the approval request.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4ToolApprovalResponsePart`

Tool approval response content part of a prompt. It contains the user's
decision to approve or deny a provider-executed tool call.

```text
export interface LanguageModelV4ToolApprovalResponsePart {
  type: 'tool-approval-response';
  /**
   * ID of the approval request that this response refers to.
   */
  approvalId: string;
  /**
   * Whether the approval was granted (true) or denied (false).
   */
  approved: boolean;
  /**
   * Optional reason for approval or denial.
   */
  reason?: string;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4ToolCall`

Tool calls that the model has generated.

```text
export type LanguageModelV4ToolCall = {
  type: 'tool-call';
  /**
   * The identifier of the tool call. It must be unique across all tool calls.
   */
  toolCallId: string;
  /**
   * The name of the tool that should be called.
   */
  toolName: string;
  /**
   * JSON-encoded tool input. Must match the input schema of the tool.
   * String inputs must also be JSON-encoded, even when input deltas use text
   * encoding.
   */
  input: string;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Whether the tool is dynamic, i.e. defined at runtime.
   * For example, MCP (Model Context Protocol) tools that are executed by the provider.
   */
  dynamic?: boolean;
  /**
   * Additional provider-specific metadata for the tool call.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4ToolCallPart`

Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).

```text
export interface LanguageModelV4ToolCallPart {
  type: 'tool-call';
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  input: unknown;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4ToolChoice`

The public declaration does not include a description.

```text
export type LanguageModelV4ToolChoice = {
  type: 'auto';
} | {
  type: 'none';
} | {
  type: 'required';
} | {
  type: 'tool';
  toolName: string;
};
```

## `LanguageModelV4ToolResult`

Result of a tool call that has been executed by the provider.

```text
export type LanguageModelV4ToolResult = {
  type: 'tool-result';
  /**
   * The ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call. This is a JSON-serializable object.
   */
  result: NonNullable<JSONValue>;
  /**
   * Optional flag if the result is an error or an error message.
   */
  isError?: boolean;
  /**
   * Whether the tool result is preliminary.
   *
   * Preliminary tool results replace each other, e.g. image previews.
   * There always has to be a final, non-preliminary tool result.
   *
   * If this flag is set to true, the tool result is preliminary.
   * If this flag is not set or is false, the tool result is not preliminary.
   */
  preliminary?: boolean;
  /**
   * Whether the tool is dynamic, i.e. defined at runtime.
   * For example, MCP (Model Context Protocol) tools that are executed by the provider.
   */
  dynamic?: boolean;
  /**
   * Additional provider-specific metadata for the tool result.
   */
  providerMetadata?: SharedV4ProviderMetadata;
};
```

## `LanguageModelV4ToolResultOutput`

Result of a tool call.

```text
export type LanguageModelV4ToolResultOutput = {
  /**
   * Text tool output that should be directly sent to the API.
   */
  type: 'text';
  value: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV4ProviderOptions;
} | {
  type: 'json';
  value: JSONValue;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV4ProviderOptions;
} | {
  /**
   * Type when the user has denied the execution of the tool call.
   */
  type: 'execution-denied';
  /**
   * Optional reason for the execution denial.
   */
  reason?: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV4ProviderOptions;
} | {
  type: 'error-text';
  value: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV4ProviderOptions;
} | {
  type: 'error-json';
  value: JSONValue;
  /**
   * Provider-specific options.
   */
  providerOptions?: SharedV4ProviderOptions;
} | {
  type: 'content';
  value: Array<{
    type: 'text';
    /**
     * Text content.
     */
    text: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV4ProviderOptions;
  } | {
    type: 'file';
    /**
     * File data as a tagged discriminated union:
     *
     * - `{ type: 'data', data }`: raw bytes (Uint8Array) or base64-encoded string.
     * - `{ type: 'url', url }`: a URL that points to the file.
     * - `{ type: 'reference', reference }`: a provider reference (`{ [provider]: id }`).
     * - `{ type: 'text', text }`: inline text content (e.g. an inline text document).
     */
    data: SharedV4FileData;
    /**
     * Either a full IANA media type (`type/subtype`, e.g. `image/png`) or just
     * the top-level IANA segment (e.g. `image`, `audio`, `video`, `text`).
     *
     * `*`-subtype wildcards (e.g. `image/*`) are normalized as equivalent to the
     * top-level segment alone (e.g. `image`). Providers can use the helpers in
     * `@ai-sdk/provider-utils` (`isFullMediaType`, `getTopLevelMediaType`,
     * `detectMediaType`) to resolve the field according to their API
     * requirements.
     *
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType: string;
    /**
     * Optional filename of the file.
     */
    filename?: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV4ProviderOptions;
  } | {
    /**
     * Custom content part. This can be used to implement
     * provider-specific content parts.
     */
    type: 'custom';
    /**
     * Provider-specific options.
     */
    providerOptions?: SharedV4ProviderOptions;
  }>;
};
```

## `LanguageModelV4ToolResultPart`

Tool result content part of a prompt. It contains the result of the tool call with the matching ID.

```text
export interface LanguageModelV4ToolResultPart {
  type: 'tool-result';
  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call.
   */
  output: LanguageModelV4ToolResultOutput;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `LanguageModelV4Usage`

Usage information for a language model call.

```text
export type LanguageModelV4Usage = {
  /**
   * Information about the input tokens.
   */
  inputTokens: {
    /**
     * The total number of input (prompt) tokens used.
     */
    total: number | undefined;
    /**
     * The number of non-cached input (prompt) tokens used.
     */
    noCache: number | undefined;
    /**
     * The number of cached input (prompt) tokens read.
     */
    cacheRead: number | undefined;
    /**
     * The number of cached input (prompt) tokens written.
     */
    cacheWrite: number | undefined;
  };
  /**
   * Information about the output tokens.
   */
  outputTokens: {
    /**
     * The total number of output (completion) tokens used.
     */
    total: number | undefined;
    /**
     * The number of text tokens used.
     */
    text: number | undefined;
    /**
     * The number of reasoning tokens used.
     */
    reasoning: number | undefined;
  };
  /**
   * Raw usage information from the provider.
   *
   * This is the usage information in the shape that the provider returns.
   * It can include additional information that is not part of the standard usage information.
   */
  raw?: JSONObject;
};
```

## `LoadAPIKeyError`

Wrap an SDK API key lookup failure with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for an SDK API key lookup failure.
`LoadAPIKeyError.isInstance` checks its SDK cause.

```text
LoadAPIKeyError: {
    new (args_0: {
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type LoadAPIKeyError = AiSdkError;
```

## `LoadSettingError`

Wrap an SDK configuration lookup failure with the native arguments and expose its SDK
type guard.
Use the shared `AiSdkError` type for an SDK configuration lookup failure.
`LoadSettingError.isInstance` checks its SDK cause.

```text
LoadSettingError: {
    new (args_0: {
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type LoadSettingError = AiSdkError;
```

## `ModelCapabilities`

Model metadata shared by provider implementations and generated documentation.

These declarations describe the capabilities exposed by the provider. They do
not introduce validation or change request behavior. Provider catalogs keep
protocol details and request configuration alongside this metadata, and may
resolve different entries for different API endpoints.

This contract is intentionally independent of the versioned model interfaces.
Providers can adopt it without requiring changes to existing model objects.

```text
type ModelCapabilities = {
  /** Omitted sections are undeclared, not explicitly unsupported. */
  readonly language?: {
    readonly inputs: {
      readonly image: ModelCapability;
      readonly audio: ModelCapability;
    };
    readonly objectGeneration: ModelCapability;
    readonly tools: {
      readonly usage: ModelCapability;
      readonly streaming: ModelCapability;
    };
    readonly reasoning: {
      readonly support: ModelCapability;
      /** Omission means the provider does not declare an exhaustive list. */
      readonly efforts?: readonly string[];
    };
    readonly sampling: {
      readonly temperature: ModelCapability;
      readonly topP: ModelCapability;
      readonly logprobs: ModelCapability;
    };
  };
  readonly embedding?: {
    readonly defaultDimensions: number;
    readonly customDimensions: ModelCapability;
  };
  readonly image?: {
    readonly sizes: readonly string[] | {
      readonly description: string;
    };
    readonly fileInput: ModelCapability;
    readonly maskInput: ModelCapability;
    readonly maxImagesPerCall: number | undefined;
  };
  readonly video?: {
    readonly inputs: {
      readonly text: ModelCapability;
      /** The single starting image passed through the `image` option. */
      readonly image: ModelCapability;
      /** Role-tagged images passed through the `frameImages` option. */
      readonly firstFrame: ModelCapability;
      readonly lastFrame: ModelCapability;
      /** Media passed through the `inputReferences` option. */
      readonly referenceImage: ModelCapability;
      readonly referenceVideo: ModelCapability;
    };
    readonly generateAudio: ModelCapability;
    readonly aspectRatio: ModelCapability;
    readonly resolution: ModelCapability;
    readonly duration: ModelCapability;
    readonly fps: ModelCapability;
    readonly seed: ModelCapability;
    /** Undefined means the catalog does not declare a fixed limit. */
    readonly maxVideosPerCall: number | undefined;
  };
  readonly reranking?: {
    /** Input support exposed by the provider, including compatibility conversions. */
    readonly documents: {
      readonly text: ModelCapability;
      readonly object: ModelCapability;
    };
    readonly topN: ModelCapability;
  };
  readonly decision?: {
    readonly questionTypes: {
      readonly boolean: ModelCapability;
      readonly choice: ModelCapability;
      readonly score: ModelCapability;
      readonly box: ModelCapability;
    };
    readonly inputs: {
      readonly image: ModelCapability;
    };
    readonly reasoning: ModelCapability;
    readonly maxOutputTokens: ModelCapability;
  };
  readonly transcription?: {
    readonly transcription: ModelCapability;
    readonly streaming: ModelCapability;
    readonly duration: ModelCapability;
    readonly segments: ModelCapability;
    readonly language: ModelCapability;
    readonly streamingDelay?: ModelCapability;
  };
  readonly speechTranslation?: {
    readonly translatedAudio: ModelCapability;
    readonly translatedText: ModelCapability;
    readonly sourceTranscript: ModelCapability;
  };
  readonly speech?: {
    readonly instructions: ModelCapability;
  };
  readonly realtime?: {
    readonly conversation: 'continuous' | 'turn-based';
    readonly transports: readonly ('websocket' | 'webrtc')[];
    readonly connections: readonly ('client-secret-websocket' | 'server-websocket' | 'webrtc')[];
  };
};
```

## `ModelCapability`

Support declared by a provider's model catalog.

`unknown` is distinct from unsupported. A condition describes when support is
available; it is documentation, not an expression to execute. Providers remain
responsible for evaluating their typed request policies.

```text
type ModelCapability = boolean | 'unknown' | {
  readonly condition: string;
};
```

## `ModelEntry`

One provider-owned model record, which can declare several operations.
RequestConfig is a provider-defined type for request encoding and defaults.
Feature support belongs in capabilities, including provider-specific features.

```text
type ModelEntry<RequestConfig = never> = {
  readonly capabilities: ModelCapabilities;
  /** Omitted sections or options are undeclared, not explicitly unsupported. */
  readonly providerOptions?: ModelProviderOptions;
  readonly requestConfig?: RequestConfig;
};
```

## `ModelProviderOptions`

Per-model support for the options in the provider's
`ProviderOptionDefinitions`, keyed by the same sections and option names.

```text
type ModelProviderOptions = { readonly [Section in keyof ModelCapabilities]?: Readonly<Record<string, ModelCapability>>; };
```

## `NoContentGeneratedError`

Wrap a response without the expected generated content with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a response without the expected generated content.
`NoContentGeneratedError.isInstance` checks its SDK cause.

```text
NoContentGeneratedError: {
    new (args_0?: {
        message?: string;
    } | undefined): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type NoContentGeneratedError = AiSdkError;
```

## `NoSuchModelError`

Wrap a model selection failure for an unavailable model with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a model selection failure for an unavailable model.
`NoSuchModelError.isInstance` checks its SDK cause.

```text
NoSuchModelError: {
    new (args_0: {
        errorName?: string;
        modelId: string;
        modelType: "languageModel" | "embeddingModel" | "imageModel" | "transcriptionModel" | "speechModel" | "rerankingModel" | "videoModel" | "decisionModel" | "extractionModel" | "evaluationModel";
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type NoSuchModelError = AiSdkError;
```

## `NoSuchProviderReferenceError`

Wrap an unresolved provider reference with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for an unresolved provider reference.
`NoSuchProviderReferenceError.isInstance` checks its SDK cause.

```text
NoSuchProviderReferenceError: {
    new (args_0: {
        provider: string;
        reference: sdk.SharedV4ProviderReference;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type NoSuchProviderReferenceError = AiSdkError;
```

## `ProviderOptionDefinition`

A provider option, declared once at the provider level.

```text
type ProviderOptionDefinition = {
  readonly description: string;
};
```

## `ProviderOptionDefinitions`

The provider options a provider accepts, grouped by the operation they
configure. Section names match `ModelCapabilities`; option names match the
keys accepted under `providerOptions.<provider>` for that operation.

```text
type ProviderOptionDefinitions = { readonly [Section in keyof ModelCapabilities]?: Readonly<Record<string, ProviderOptionDefinition>>; };
```

## `ProviderV2`

Expose the v2 provider selectors with lazy model selection and optional audio model
support.

```text
export interface ProviderV2<R = never> {
    /** Select the provider language model for the native ID when the Effect runs. */
    languageModel(modelId: string): ModelSelection<LanguageModelV2, R>;
    /**
     * Select the embedding model using the SDK text embedding selector for this protocol.
     */
    textEmbeddingModel(modelId: string): ModelSelection<EmbeddingModelV2<string>, R>;
    /** Select the provider image model for the native ID when the Effect runs. */
    imageModel(modelId: string): ModelSelection<ImageModelV2, R>;
    /**
     * Select an audio transcription model when the provider exposes this optional
     * capability.
     */
    transcriptionModel?(modelId: string): ModelSelection<TranscriptionModelV2, R>;
    /**
     * Select a speech synthesis model when the provider exposes this optional capability.
     */
    speechModel?(modelId: string): ModelSelection<SpeechModelV2, R>;
}
```

## `ProviderV3`

Expose v3 model selectors and the version discriminator for providers with mixed
protocol support.

```text
export interface ProviderV3<R = never> {
    /** Identify a v3 provider when selecting a compatible SDK protocol. */
    readonly specificationVersion: 'v3';
    /** Select the provider language model for the native ID when the Effect runs. */
    languageModel(modelId: string): ModelSelection<LanguageModelV3, R>;
    /** Select an embedding model using the v3 SDK embedding selector. */
    embeddingModel(modelId: string): ModelSelection<EmbeddingModelV3, R>;
    /**
     * Select the embedding model using the SDK text embedding selector for this protocol.
     */
    textEmbeddingModel?(modelId: string): ModelSelection<EmbeddingModelV3, R>;
    /** Select the provider image model for the native ID when the Effect runs. */
    imageModel(modelId: string): ModelSelection<ImageModelV3, R>;
    /**
     * Select an audio transcription model when the provider exposes this optional
     * capability.
     */
    transcriptionModel?(modelId: string): ModelSelection<TranscriptionModelV3, R>;
    /**
     * Select a speech synthesis model when the provider exposes this optional capability.
     */
    speechModel?(modelId: string): ModelSelection<SpeechModelV3, R>;
    /** Select a reranker when the v3 provider exposes the optional selector. */
    rerankingModel?(modelId: string): ModelSelection<RerankingModelV3, R>;
}
```

## `ProviderV4`

Share a base Effect provider shape across v4 SDK adapters.

```text
export type ProviderV4 = ReturnType<typeof wrapProviderBase>;
```

## `RerankingModelV3`

Preserve the SDK protocol for v3 reranking and lift model operations into Effect.

```text
export type RerankingModelV3 = LegacyModel<sdk.RerankingModelV3>;
```

## `RerankingModelV3CallOptions`

The public declaration does not include a description.

```text
type RerankingModelV3CallOptions = {
  /**
   * Documents to rerank.
   * Either a list of texts or a list of JSON objects.
   */
  documents: {
    type: 'text';
    values: string[];
  } | {
    type: 'object';
    values: JSONObject[];
  };
  /**
   * The query is a string that represents the query to rerank the documents against.
   */
  query: string;
  /**
   * Optional limit returned documents to the top n documents.
   */
  topN?: number;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV3ProviderOptions;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: SharedV3Headers;
};
```

## `RerankingModelV4`

Use a registered model for document scoring and reranking.

```text
export type RerankingModelV4 = ReturnType<typeof wrapRerankingModel>;
```

## `RerankingModelV4CallOptions`

The public declaration does not include a description.

```text
type RerankingModelV4CallOptions = {
  /**
   * Documents to rerank.
   * Either a list of texts or a list of JSON objects.
   */
  documents: {
    type: 'text';
    values: string[];
  } | {
    type: 'object';
    values: JSONObject[];
  };
  /**
   * The query is a string that represents the query to rerank the documents against.
   */
  query: string;
  /**
   * Optional limit returned documents to the top n documents.
   */
  topN?: number;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: SharedV4Headers;
};
```

## `RerankingModelV4Result`

The result of a reranking model doRerank call.

```text
type RerankingModelV4Result = {
  /**
   * Ordered list of reranked documents (via index before reranking).
   * The documents are sorted by the descending order of relevance scores.
   */
  ranking: Array<{
    /**
     * The index of the document in the original list of documents before reranking.
     */
    index: number;
    /**
     * The relevance score of the document after reranking.
     */
    relevanceScore: number;
  }>;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings?: Array<SharedV4Warning>;
  /**
   * Optional response information for debugging purposes.
   */
  response?: {
    /**
     * ID for the generated response, if the provider sends one.
     */
    id?: string;
    /**
     * Timestamp for the start of the generated response, if the provider sends one.
     */
    timestamp?: Date;
    /**
     * The ID of the response model that was used to generate the response, if the provider sends one.
     */
    modelId?: string;
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response body.
     */
    body?: unknown;
  };
};
```

## `SharedV2Headers`

The public declaration does not include a description.

```text
export type SharedV2Headers = Record<string, string>;
```

## `SharedV2ProviderMetadata`

Additional provider-specific metadata.
Metadata are additional outputs from the provider.
They are passed through to the provider from the AI SDK
and enable provider-specific functionality
that can be fully encapsulated in the provider.

This enables us to quickly ship provider-specific functionality
without affecting the core AI SDK.

The outer record is keyed by the provider name, and the inner
record is keyed by the provider-specific metadata key.

```json
{
  "anthropic": {
    "cacheControl": { "type": "ephemeral" }
  }
}
```

```text
export type SharedV2ProviderMetadata = Record<string, Record<string, JSONValue>>;
```

## `SharedV2ProviderOptions`

Additional provider-specific options.
Options are additional input to the provider.
They are passed through to the provider from the AI SDK
and enable provider-specific functionality
that can be fully encapsulated in the provider.

This enables us to quickly ship provider-specific functionality
without affecting the core AI SDK.

The outer record is keyed by the provider name, and the inner
record is keyed by the provider-specific metadata key.

```json
{
  "anthropic": {
    "cacheControl": { "type": "ephemeral" }
  }
}
```

```text
export type SharedV2ProviderOptions = Record<string, Record<string, JSONValue>>;
```

## `SharedV3Headers`

The public declaration does not include a description.

```text
export type SharedV3Headers = Record<string, string>;
```

## `SharedV3ProviderMetadata`

Additional provider-specific metadata.
Metadata are additional outputs from the provider.
They are passed through to the provider from the AI SDK
and enable provider-specific functionality
that can be fully encapsulated in the provider.

This enables us to quickly ship provider-specific functionality
without affecting the core AI SDK.

The outer record is keyed by the provider name, and the inner
record is keyed by the provider-specific metadata key.

```json
{
  "anthropic": {
    "cacheControl": { "type": "ephemeral" }
  }
}
```

```text
export type SharedV3ProviderMetadata = Record<string, JSONObject>;
```

## `SharedV3ProviderOptions`

Additional provider-specific options.
Options are additional input to the provider.
They are passed through to the provider from the AI SDK
and enable provider-specific functionality
that can be fully encapsulated in the provider.

This enables us to quickly ship provider-specific functionality
without affecting the core AI SDK.

The outer record is keyed by the provider name, and the inner
record is keyed by the provider-specific metadata key.

```json
{
  "anthropic": {
    "cacheControl": { "type": "ephemeral" }
  }
}
```

```text
export type SharedV3ProviderOptions = Record<string, JSONObject>;
```

## `SharedV3Warning`

Warning from the model.

For example, that certain features are unsupported or compatibility
functionality is used (which might lead to suboptimal results).

```text
export type SharedV3Warning = {
  /**
   * A feature is not supported by the model.
   */
  type: 'unsupported';
  /**
   * The feature that is not supported.
   */
  feature: string;
  /**
   * Additional details about the warning.
   */
  details?: string;
} | {
  /**
   * A compatibility feature is used that might lead to suboptimal results.
   */
  type: 'compatibility';
  /**
   * The feature that is used in a compatibility mode.
   */
  feature: string;
  /**
   * Additional details about the warning.
   */
  details?: string;
} | {
  /**
   * Other warning.
   */
  type: 'other';
  /**
   * The message of the warning.
   */
  message: string;
};
```

## `SharedV4AudioFormat`

Audio format configuration shared by provider V4 model specifications.

```text
export type SharedV4AudioFormat = {
  /**
   * Audio format type, e.g. `audio/pcm`, `audio/pcmu`, or `audio/pcma`.
   */
  type: string;
  /**
   * Sample rate in Hz. Only applicable for formats that require a rate.
   */
  rate?: number;
};
```

## `SharedV4FileData`

File data as a tagged discriminated union:

- `{ type: 'data', data }`: raw bytes (`Uint8Array`) or base64-encoded string.
- `{ type: 'url', url }`: a URL that points to the file.
- `{ type: 'reference', reference }`: a provider reference (`{ [provider]: id }`).
- `{ type: 'text', text }`: inline text content (e.g. an inline text document).

```text
export type SharedV4FileData = SharedV4FileDataData | SharedV4FileDataUrl | SharedV4FileDataReference | SharedV4FileDataText;
```

## `SharedV4FileDataData`

File data variant containing raw bytes (`Uint8Array`) or a base64-encoded
string.

```text
export interface SharedV4FileDataData {
  type: 'data';
  data: Uint8Array | string;
}
```

## `SharedV4FileDataReference`

File data variant containing a provider reference (`{ [provider]: id }`).

```text
export interface SharedV4FileDataReference {
  type: 'reference';
  reference: SharedV4ProviderReference;
}
```

## `SharedV4FileDataText`

File data variant containing inline text content (e.g. an inline text
document).

```text
export interface SharedV4FileDataText {
  type: 'text';
  text: string;
}
```

## `SharedV4FileDataUrl`

File data variant containing a URL that points to the file.

```text
export interface SharedV4FileDataUrl {
  type: 'url';
  url: URL;
  /**
   * The original URL string before it was parsed into a `URL`.
   *
   * This is available when parsing would change the string and a provider
   * needs to preserve an opaque non-HTTP URI exactly.
   */
  originalUrl?: string;
}
```

## `SharedV4Headers`

The public declaration does not include a description.

```text
export type SharedV4Headers = Record<string, string>;
```

## `SharedV4ProviderMetadata`

Additional provider-specific metadata.
Metadata are additional outputs from the provider.
They are passed through to the provider from the AI SDK
and enable provider-specific functionality
that can be fully encapsulated in the provider.

This enables us to quickly ship provider-specific functionality
without affecting the core AI SDK.

The outer record is keyed by the provider name, and the inner
record is keyed by the provider-specific metadata key.

```json
{
  "anthropic": {
    "cacheControl": { "type": "ephemeral" }
  }
}
```

```text
export type SharedV4ProviderMetadata = Record<string, JSONObject>;
```

## `SharedV4ProviderOptions`

Additional provider-specific options.
Options are additional input to the provider.
They are passed through to the provider from the AI SDK
and enable provider-specific functionality
that can be fully encapsulated in the provider.

This enables us to quickly ship provider-specific functionality
without affecting the core AI SDK.

The outer record is keyed by the provider name, and the inner
record is keyed by the provider-specific metadata key.

```json
{
  "anthropic": {
    "cacheControl": { "type": "ephemeral" }
  }
}
```

```text
export type SharedV4ProviderOptions = Record<string, JSONObject>;
```

## `SharedV4ProviderReference`

A mapping of provider names to provider-specific file identifiers.

Provider references allow files to be identified across different
providers without re-uploading, by storing each provider's own
identifier for the same logical file.

```json
{
  "openai": "file-abc123",
  "anthropic": "file-xyz789"
}
```

The `type?: never` constraint excludes any object that has a `type`
property, so a `SharedV4ProviderReference` cannot be confused with a
tagged file-data shape (e.g. `{ type: 'data', data }` or
`{ type: 'reference', reference }`) when both appear in the same union.

```text
export type SharedV4ProviderReference = Record<string, string> & {
  type?: never;
};
```

## `SharedV4Warning`

Warning from the model.

For example, that certain features are unsupported or compatibility
functionality is used (which might lead to suboptimal results).

```text
export type SharedV4Warning = {
  /**
   * A feature is not supported by the model.
   */
  type: 'unsupported';
  /**
   * The feature that is not supported.
   */
  feature: string;
  /**
   * Additional details about the warning.
   */
  details?: string;
} | {
  /**
   * A compatibility feature is used that might lead to suboptimal results.
   */
  type: 'compatibility';
  /**
   * The feature that is used in a compatibility mode.
   */
  feature: string;
  /**
   * Additional details about the warning.
   */
  details?: string;
} | {
  /**
   * A deprecated feature or option is being used.
   */
  type: 'deprecated';
  /**
   * The deprecated setting or feature name.
   */
  setting: string;
  /**
   * A human-readable message explaining what to use instead.
   */
  message: string;
} | {
  /**
   * Other warning.
   */
  type: 'other';
  /**
   * The message of the warning.
   */
  message: string;
};
```

## `SkillsV4`

Use a registered skill API for SDK skill uploads.

```text
export type SkillsV4Handle = ReturnType<typeof wrapSkills>;
```

## `SkillsV4File`

The public declaration does not include a description.

```text
interface SkillsV4File {
  /**
   * The path of the file relative to the skill root.
   */
  path: string;
  /**
   * The file data.
   *
   * - `{ type: 'data', data }`: raw bytes (`Uint8Array`) or a base64-encoded string.
   * - `{ type: 'text', text }`: inline text (UTF-8).
   */
  data: SharedV4FileDataData | SharedV4FileDataText;
}
```

## `SkillsV4UploadSkillCallOptions`

The public declaration does not include a description.

```text
interface SkillsV4UploadSkillCallOptions {
  /**
   * The files that make up the skill.
   */
  files: SkillsV4File[];
  /**
   * Optional human-readable title for the skill.
   */
  displayTitle?: string;
  /**
   * Additional provider-specific options.
   */
  providerOptions?: SharedV4ProviderOptions;
}
```

## `SkillsV4UploadSkillResult`

The public declaration does not include a description.

```text
interface SkillsV4UploadSkillResult {
  /**
   * A provider reference mapping provider names to provider-specific skill identifiers.
   */
  providerReference: SharedV4ProviderReference;
  /**
   * Optional human-readable title for the uploaded skill.
   */
  displayTitle?: string;
  /**
   * Optional name of the uploaded skill.
   */
  name?: string;
  /**
   * Optional description of what the uploaded skill does.
   */
  description?: string;
  /**
   * Optional latest version identifier of the uploaded skill.
   */
  latestVersion?: string;
  /**
   * Additional provider-specific metadata.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: SharedV4Warning[];
}
```

## `SpeechModelV2`

Preserve the SDK protocol for v2 speech synthesis and lift model operations into Effect.

```text
export type SpeechModelV2 = LegacyModel<sdk.SpeechModelV2>;
```

## `SpeechModelV2CallOptions`

The public declaration does not include a description.

```text
type SpeechModelV2CallOptions = {
  /**
   * Text to convert to speech.
   */
  text: string;
  /**
   * The voice to use for speech synthesis.
   * This is provider-specific and may be a voice ID, name, or other identifier.
   */
  voice?: string;
  /**
   * The desired output format for the audio e.g. "mp3", "wav", etc.
   */
  outputFormat?: string;
  /**
   * Instructions for the speech generation e.g. "Speak in a slow and steady tone".
   */
  instructions?: string;
  /**
   * The speed of the speech generation.
   */
  speed?: number;
  /**
   * The language for speech generation. This should be an ISO 639-1 language code (e.g. "en", "es", "fr")
   * or "auto" for automatic language detection. Provider support varies.
   */
  language?: string;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   *   "openai": {}
   * }
   * ```
   */
  providerOptions?: SpeechModelV2ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `SpeechModelV2CallWarning`

Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.

```text
type SpeechModelV2CallWarning = {
  type: 'unsupported-setting';
  setting: keyof SpeechModelV2CallOptions;
  details?: string;
} | {
  type: 'other';
  message: string;
};
```

## `SpeechModelV3`

Preserve the SDK protocol for v3 speech synthesis and lift model operations into Effect.

```text
export type SpeechModelV3 = LegacyModel<sdk.SpeechModelV3>;
```

## `SpeechModelV3CallOptions`

The public declaration does not include a description.

```text
type SpeechModelV3CallOptions = {
  /**
   * Text to convert to speech.
   */
  text: string;
  /**
   * The voice to use for speech synthesis.
   * This is provider-specific and may be a voice ID, name, or other identifier.
   */
  voice?: string;
  /**
   * The desired output format for the audio e.g. "mp3", "wav", etc.
   */
  outputFormat?: string;
  /**
   * Instructions for the speech generation e.g. "Speak in a slow and steady tone".
   */
  instructions?: string;
  /**
   * The speed of the speech generation.
   */
  speed?: number;
  /**
   * The language for speech generation. This should be an ISO 639-1 language code (e.g. "en", "es", "fr")
   * or "auto" for automatic language detection. Provider support varies.
   */
  language?: string;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   *   "openai": {}
   * }
   * ```
   */
  providerOptions?: SpeechModelV3ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `SpeechModelV4`

Use a registered speech model with an optional streaming method.

```text
export type SpeechModelV4 = ReturnType<typeof wrapSpeechModel>;
```

## `SpeechModelV4CallOptions`

The public declaration does not include a description.

```text
type SpeechModelV4CallOptions = {
  /**
   * Text to convert to speech.
   */
  text: string;
  /**
   * The voice to use for speech synthesis.
   * This is provider-specific and may be a voice ID, name, or other identifier.
   */
  voice?: string;
  /**
   * The desired output format for the audio e.g. "mp3", "wav", etc.
   */
  outputFormat?: string;
  /**
   * Instructions for the speech generation e.g. "Speak in a slow and steady tone".
   */
  instructions?: string;
  /**
   * The speed of the speech generation.
   */
  speed?: number;
  /**
   * The language for speech generation. This should be an ISO 639-1 language code (e.g. "en", "es", "fr")
   * or "auto" for automatic language detection. Provider support varies.
   */
  language?: string;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   *   "openai": {}
   * }
   * ```
   */
  providerOptions?: SpeechModelV4ProviderOptions$1;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `SpeechModelV4Result`

The result of a speech model doGenerate call.

```text
type SpeechModelV4Result = {
  /**
   * Generated audio as an ArrayBuffer.
   * The audio should be returned without any unnecessary conversion.
   * If the API returns base64 encoded strings, the audio should be returned
   * as base64 encoded strings. If the API returns binary data, the audio
   * should be returned as binary data.
   */
  audio: string | Uint8Array;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV4Warning>;
  /**
   * Usage information reported by the provider, in the provider's native
   * JSON-compatible shape.
   */
  usage?: JSONObject;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Response body (available only for providers that use HTTP requests).
     */
    body?: unknown;
  };
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    /**
     * Timestamp for the start of the generated response.
     */
    timestamp: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId: string;
    /**
     * Response headers.
     */
    headers?: SharedV2Headers;
    /**
     * Response body.
     */
    body?: unknown;
  };
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: Record<string, JSONObject>;
};
```

## `TooManyEmbeddingValuesForCallError`

Wrap an embedding request that exceeds the model input count per call with the native
arguments and expose its SDK type guard.
Use the shared `AiSdkError` type for an embedding request that exceeds the model input
count per call. `TooManyEmbeddingValuesForCallError.isInstance` checks its SDK cause.

```text
TooManyEmbeddingValuesForCallError: {
    new (options: {
        provider: string;
        modelId: string;
        maxEmbeddingsPerCall: number;
        values: Array<unknown>;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type TooManyEmbeddingValuesForCallError = AiSdkError;
```

## `TranscriptionModelV2`

Preserve the SDK protocol for v2 transcription and lift model operations into Effect.

```text
export type TranscriptionModelV2 = LegacyModel<sdk.TranscriptionModelV2>;
```

## `TranscriptionModelV2CallOptions`

The public declaration does not include a description.

```text
type TranscriptionModelV2CallOptions = {
  /**
   * Audio data to transcribe.
   * Accepts a `Uint8Array` or `string`, where `string` is a base64 encoded audio file.
   */
  audio: Uint8Array | string;
  /**
   * The IANA media type of the audio data.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   * "openai": {
   * "timestampGranularities": ["word"]
   * }
   * }
   * ```
   */
  providerOptions?: TranscriptionModelV2ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `TranscriptionModelV2CallWarning`

Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.

```text
type TranscriptionModelV2CallWarning = {
  type: 'unsupported-setting';
  setting: keyof TranscriptionModelV2CallOptions;
  details?: string;
} | {
  type: 'other';
  message: string;
};
```

## `TranscriptionModelV3`

Preserve the SDK protocol for v3 transcription and lift model operations into Effect.

```text
export type TranscriptionModelV3 = LegacyModel<sdk.TranscriptionModelV3>;
```

## `TranscriptionModelV3CallOptions`

The public declaration does not include a description.

```text
type TranscriptionModelV3CallOptions = {
  /**
   * Audio data to transcribe.
   * Accepts a `Uint8Array` or `string`, where `string` is a base64 encoded audio file.
   */
  audio: Uint8Array | string;
  /**
   * The IANA media type of the audio data.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   * "openai": {
   * "timestampGranularities": ["word"]
   * }
   * }
   * ```
   */
  providerOptions?: TranscriptionModelV3ProviderOptions;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `TranscriptionModelV4`

Use a registered transcription model with an optional streaming method.

```text
export type TranscriptionModelV4 = ReturnType<typeof wrapTranscriptionModel>;
```

## `TranscriptionModelV4CallOptions`

The public declaration does not include a description.

```text
type TranscriptionModelV4CallOptions = {
  /**
   * Audio data to transcribe.
   * Accepts a `Uint8Array` or `string`, where `string` is a base64 encoded audio file.
   */
  audio: Uint8Array | string;
  /**
   * The IANA media type of the audio data.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Word and segment timings to request.
   *
   * Supporting adapters map this onto the provider's native control when that
   * provider option is omitted. An explicit provider option wins. Supporting
   * adapters warn when they cannot provide a requested granularity.
   * An empty array requests no additional timing detail; it does not suppress
   * timings returned by default.
   */
  timestampGranularities?: Array<TranscriptionModelV4TimestampGranularity>;
  /**
   * Additional provider-specific options that are passed through to the provider
   * as body parameters.
   *
   * The outer record is keyed by the provider name, and the inner
   * record is keyed by the provider-specific metadata key.
   * ```ts
   * {
   * "openai": {
   * "timestampGranularities": ["word"]
   * }
   * }
   * ```
   */
  providerOptions?: TranscriptionModelV4ProviderOptions$1;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
};
```

## `TranscriptionModelV4Result`

The result of a transcription model doGenerate call.

```text
type TranscriptionModelV4Result = {
  /**
   * The complete transcribed text from the audio.
   */
  text: string;
  /**
   * Array of transcript segments with timing information.
   * Each segment represents a portion of the transcribed text with start and end times.
   */
  segments: Array<{
    /**
     * The text content of this segment.
     */
    text: string;
    /**
     * The start time of this segment in seconds.
     */
    startSecond: number;
    /**
     * The end time of this segment in seconds.
     */
    endSecond: number;
  }>;
  /**
   * Word-level timings reported by the provider, whether requested or returned
   * by default. Existing `segments` behavior is preserved; some providers also
   * put word timings in `segments`. Omitted when word timings are unavailable.
   */
  words?: Array<{
    /**
     * The text of this word.
     */
    text: string;
    /**
     * The start time of this word in seconds.
     */
    startSecond: number;
    /**
     * The end time of this word in seconds.
     */
    endSecond: number;
  }>;
  /**
   * The detected language of the audio content, as an ISO-639-1 code (e.g., 'en' for English).
   * May be undefined if the language couldn't be detected.
   */
  language: string | undefined;
  /**
   * The total duration of the audio file in seconds.
   * May be undefined if the duration couldn't be determined.
   */
  durationInSeconds: number | undefined;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV4Warning>;
  /**
   * Usage information reported by the provider, in the provider's native
   * JSON-compatible shape.
   */
  usage?: JSONObject;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /**
     * Raw request HTTP body that was sent to the provider API as a string (JSON should be stringified).
     * Non-HTTP(s) providers should not set this.
     */
    body?: string;
  };
  /**
   * Response information for telemetry and debugging purposes.
   */
  response: {
    /**
     * Timestamp for the start of the generated response.
     */
    timestamp: Date;
    /**
     * The ID of the response model that was used to generate the response.
     */
    modelId: string;
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response body.
     */
    body?: unknown;
  };
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: Record<string, JSONObject>;
};
```

## `TranscriptionModelV4TimestampGranularity`

Timing detail to request from a transcription model.
`word` is for word highlighting. `segment` is for caption-sized phrases.

```text
type TranscriptionModelV4TimestampGranularity = 'word' | 'segment';
```

## `TypeValidationContext`

The public declaration does not include a description.

```text
interface TypeValidationContext {
  /**
   * Field path in dot notation (e.g., "message.metadata", "message.parts[3].data")
   */
  field?: string;
  /**
   * Entity name (e.g., tool name, data type name)
   */
  entityName?: string;
  /**
   * Entity identifier (e.g., message ID, tool call ID)
   */
  entityId?: string;
}
```

## `TypeValidationError`

Construct or wrap a validation failure while preserving the SDK cause for the type
guard.
Use the shared `AiSdkError` type for validation failures. Inspect the cause with
`TypeValidationError.isInstance`.

```text
TypeValidationError: {
    new (args_0: {
        value: unknown;
        cause: unknown;
        context?: sdk.TypeValidationContext;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
} & {
    wrap: (options: Parameters<typeof sdk.TypeValidationError.wrap>[0]) => import("effect/Effect").Effect<AiSdkError, AiSdkError, never>;
}
```

```text
export type TypeValidationError = AiSdkError;
```

## `UnsupportedFunctionalityError`

Wrap an operation that the selected SDK model cannot perform with the native arguments
and expose its SDK type guard.
Use the shared `AiSdkError` type for an operation that the selected SDK model cannot
perform. `UnsupportedFunctionalityError.isInstance` checks its SDK cause.

```text
UnsupportedFunctionalityError: {
    new (args_0: {
        functionality: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
}
```

```text
export type UnsupportedFunctionalityError = AiSdkError;
```

## `VideoModelV4`

Use a registered model for video generation, polling, or webhook integration.

```text
export type VideoModelV4 = ReturnType<typeof wrapVideoModel>;
```

