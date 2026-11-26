---
title: Core API reference 04
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-experimental.ts,
    src/core-providers.ts,
    src/core.ts,
    src/index.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 04

> **TL;DR:** Public core and test declarations from `Experimental_DecisionModelCallStartEvent` to `Experimental_ExtractStartEvent`. Each entry lists its package import and declaration.

## `Experimental_DecisionModelCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired when the decision model call begins.

The logical model call includes any provider retries.

```text
type DecisionModelCallStartEvent = {
  /** Unique identifier for the outer decision call. */
  readonly callId: string;
  /** Identifies the inner operation (`ai.decide.doDecide`). */
  readonly operationId: 'ai.decide.doDecide';
  /** The provider identifier. */
  readonly provider: string;
  /** The decision model identifier. */
  readonly modelId: string;
  /** The shared state used to make decisions. */
  readonly state: Experimental_DecisionModelV4CallOptions['state'];
  /** The questions to decide against the shared state. */
  readonly questions: Experimental_DecisionModelV4CallOptions['questions'];
};
```

## `Experimental_DecisionProviderRegistry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Add decision model selection to the ordinary model and resource selectors.

```text
export type Experimental_DecisionProviderRegistry<Providers extends ProviderMap = ProviderMap, Separator extends string = ':'> = ProviderRegistryProvider<Providers, Separator> & {
    readonly decisionModel: RegistrySelector<Providers, Separator, 'decisionModel', ReturnType<typeof wrapDecisionModel>>;
    readonly evaluationModel: RegistrySelector<Providers, Separator, 'decisionModel', ReturnType<typeof wrapEvaluationModel>>;
};
```

## `Experimental_DecisionQuestion`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

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

## `Experimental_DecisionRefusalError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a decision model refusal with the native arguments and expose its SDK type guard.
Use the shared `AiSdkError` type for a decision model refusal.
`Experimental_DecisionRefusalError.isInstance` checks its SDK cause.

```text
declare const Experimental_DecisionRefusalError: {
    new (args_0: {
        questionIds: string[];
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type Experimental_DecisionRefusalError = AiSdkError;
```

## `Experimental_DecisionResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DecisionResult<QUESTIONS extends Record<string, Experimental_DecisionModelV4Question>> = {
  readonly answers: { [ID in keyof QUESTIONS]: DecisionAnswer<QUESTIONS[ID]>; };
  readonly usage: {
    inputTokens: number | undefined;
    outputTokens: number | undefined;
    totalTokens: number | undefined;
  };
  readonly warnings: Experimental_DecisionModelV4Result['warnings'];
  readonly rounding: Experimental_DecisionModelV4Result['rounding'];
  readonly providerMetadata: Experimental_DecisionModelV4Result['providerMetadata'];
  readonly response: NonNullable<Experimental_DecisionModelV4Result['response']> & {
    timestamp: Date;
    modelId: string;
  };
};
```

## `Experimental_DecisionState`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Shared text, JSON data, or ordered multimodal parts for a decision.

```text
type DecisionState = string | Readonly<JSONObject> | readonly DecisionStatePart[];
```

## `Experimental_DecisionStatePart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DecisionStatePart = TextPart | FilePart | {
  type: 'json';
  value: JSONValue;
};
```

## `Experimental_DecisionUnsupportedQuestionTypeError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a question kind unsupported by the decision model with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a question kind unsupported by the decision model.
`Experimental_DecisionUnsupportedQuestionTypeError.isInstance` checks its SDK cause.

```text
declare const Experimental_DecisionUnsupportedQuestionTypeError: {
    new (args_0: {
        questionId: string;
        questionType: string;
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type Experimental_DecisionUnsupportedQuestionTypeError = AiSdkError;
```

## `experimental_decodeRealtimeAudio`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Decode the provider audio representation into the native SDK audio format.

```text
declare const experimental_decodeRealtimeAudio: (...args: Parameters<typeof sdk.experimental_decodeRealtimeAudio>) => Float32Array<ArrayBufferLike>;
```

## `Experimental_DownloadFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Download inputs through either overload of the adapted SDK downloader.

```text
export type Experimental_DownloadFunction = Effect.Success<ReturnType<typeof createDownload>>;
```

## `experimental_encodeRealtimeAudio`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Encode provider audio input lazily and translate SDK encoding failures to `AiSdkError`.

```text
declare const experimental_encodeRealtimeAudio: (...args: Parameters<typeof sdk.experimental_encodeRealtimeAudio>) => string;
```

## `experimental_evaluate`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Retain the SDK compatibility spelling for the decision operation.

```text
declare const experimental_evaluate: <const Q extends Questions, C extends SdkContext = SdkContext, R = never>(options: ExperimentalOptions<NativeDecisionOptions<Q, C>, Experimental_DecisionModel, R>) => Effect.Effect<sdk.Experimental_DecisionResult<Q>, AiSdkError, R>;
```

## `Experimental_EvaluateEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluateEndEvent<RUNTIME_CONTEXT extends Context = Context> = DecideEndEvent<RUNTIME_CONTEXT>;
```

## `Experimental_EvaluateStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluateStartEvent<RUNTIME_CONTEXT extends Context = Context> = DecideStartEvent<RUNTIME_CONTEXT>;
```

## `Experimental_EvaluationAnswer`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluationAnswer<QUESTION extends Experimental_DecisionModelV4Question> = DecisionAnswer<QUESTION>;
```

## `Experimental_EvaluationMockModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate evaluation model responses using the SDK compatibility model class.
Use the registered evaluation test model when exercising compatibility names.

```text
declare const Experimental_EvaluationMockModelV4: <Services = never>(options?: MockOptions<{
    provider?: string;
    modelId?: string;
    supportedQuestionTypes?: import("@ai-sdk/provider").Experimental_DecisionModelV4["supportedQuestionTypes"];
    doDecide?: import("@ai-sdk/provider").Experimental_DecisionModelV4["doDecide"];
    doEvaluate?: import("@ai-sdk/provider").Experimental_DecisionModelV4["doDecide"];
}, Services> | undefined) => Effect.Effect<{
    supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
    doDecide: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    doEvaluate: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
} & {
    readonly model: {
        supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
        doDecide: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    } & {
        doEvaluate: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
    };
} & Readonly<Pick<sdk.Experimental_DecisionMockModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type Experimental_EvaluationMockModelV4 = Effect.Success<ReturnType<typeof Experimental_EvaluationMockModelV4>>;
```

## `Experimental_EvaluationModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Keep the older evaluation type spelling compatible with decision model inputs.

```text
export type Experimental_EvaluationModel = Experimental_DecisionModel;
```

## `Experimental_EvaluationModelCallEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluationModelCallEndEvent = DecisionModelCallEndEvent;
```

## `Experimental_EvaluationModelCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluationModelCallStartEvent = DecisionModelCallStartEvent;
```

## `Experimental_EvaluationProviderRegistry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose the decision selector under the SDK's evaluation compatibility name.

```text
export type Experimental_EvaluationProviderRegistry<Providers extends ProviderMap = ProviderMap, Separator extends string = ':'> = Experimental_DecisionProviderRegistry<Providers, Separator>;
```

## `Experimental_EvaluationQuestion`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluationQuestion = Experimental_DecisionModelV4Question;
```

## `Experimental_EvaluationResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_EvaluationResult<QUESTIONS extends Record<string, Experimental_DecisionModelV4Question>> = DecisionResult<QUESTIONS>;
```

## `Experimental_EvaluationUnsupportedQuestionTypeError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a question kind unsupported by the evaluation model with the native arguments and
expose its SDK type guard.
Use the shared `AiSdkError` type for a question kind unsupported by the evaluation
model. `Experimental_EvaluationUnsupportedQuestionTypeError.isInstance` checks its SDK
cause.

```text
declare const Experimental_EvaluationUnsupportedQuestionTypeError: {
    new (args_0: {
        questionId: string;
        questionType: string;
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type Experimental_EvaluationUnsupportedQuestionTypeError = AiSdkError;
```

## `experimental_extract`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Extract keyed fields through a registered model and retain the inferred field names.

```text
declare const experimental_extract: <const F extends Fields, C extends SdkContext = SdkContext, R = never>(options: ExperimentalOptions<NativeExtractionOptions<F, C>, Experimental_ExtractionModel, R>) => Effect.Effect<sdk.Experimental_ExtractionResult<F>, AiSdkError, R>;
```

## `Experimental_ExtractEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onEnd` callback for extraction operations.

Called when the operation completes successfully.

```text
type ExtractEndEvent<RUNTIME_CONTEXT extends Context = Context> = ExtractStartEvent<RUNTIME_CONTEXT> & {
  /** Exactly one typed answer per field ID. */
  readonly answers: ExtractionResult<Record<string, Experimental_ExtractionModelV4Field>>['answers'];
  /** Token usage for the extraction operation. */
  readonly usage: ExtractionResult<Record<string, Experimental_ExtractionModelV4Field>>['usage'];
  /** Warnings from the extraction model. */
  readonly warnings: ExtractionResult<Record<string, Experimental_ExtractionModelV4Field>>['warnings'];
  /** Optional provider-specific metadata. */
  readonly providerMetadata: ExtractionResult<Record<string, Experimental_ExtractionModelV4Field>>['providerMetadata'];
  /** Response metadata, including the resolved model ID and timestamp. */
  readonly response: ExtractionResult<Record<string, Experimental_ExtractionModelV4Field>>['response'];
};
```

## `Experimental_ExtractionAnswer`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ExtractionAnswer<FIELD extends Experimental_ExtractionModelV4Field> = FIELD extends {
  type: 'list';
} ? {
  type: 'list';
  value: ExtractionValue<FIELD> | null;
  pNull?: number;
  confidence?: number;
  items?: Array<{
    confidence?: number;
    source?: Experimental_ExtractionModelV4Source;
  }>;
} : {
  type: FIELD['type'];
  value: ExtractionValue<FIELD> | null;
  guess?: ExtractionValue<FIELD>;
  pNull?: number;
  confidence?: number;
  source?: Experimental_ExtractionModelV4Source;
};
```

## `Experimental_ExtractionField`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

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

## `Experimental_ExtractionMockModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate structured extraction responses for a registered extraction handle.
Use the registered extraction test model for structured output requests.

```text
declare const Experimental_ExtractionMockModelV4: <Services = never>(options?: MockOptions<{
    provider?: string;
    modelId?: string;
    supportedFieldTypes?: import("@ai-sdk/provider").Experimental_ExtractionModelV4["supportedFieldTypes"];
    doExtract?: import("@ai-sdk/provider").Experimental_ExtractionModelV4["doExtract"];
}, Services> | undefined) => Effect.Effect<{
    supportedFieldTypes: readonly ("number" | "text" | "date" | "time" | "datetime" | "duration" | "list")[];
    doExtract: (options: models.Experimental_ExtractionModelV4CallOptions) => Effect.Effect<models.Experimental_ExtractionModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    readonly model: {
        supportedFieldTypes: readonly ("number" | "text" | "date" | "time" | "datetime" | "duration" | "list")[];
        doExtract: (options: models.Experimental_ExtractionModelV4CallOptions) => Effect.Effect<models.Experimental_ExtractionModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    };
} & Readonly<Pick<sdk.Experimental_ExtractionMockModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type Experimental_ExtractionMockModelV4 = Effect.Success<ReturnType<typeof Experimental_ExtractionMockModelV4>>;
```

## `Experimental_ExtractionModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Select an extraction model by registry ID or by a registered version 4 handle.

```text
export type Experimental_ExtractionModel = string | ExtractionModelV4;
```

## `Experimental_ExtractionModelCallEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired after the extraction model response has been validated.

Contains the result of the logical model call, including any retries.

```text
type ExtractionModelCallEndEvent = ExtractionModelCallStartEvent & {
  /** Exactly one answer per field ID. */
  readonly answers: Experimental_ExtractionModelV4Result['answers'];
  /** Token usage reported by the extraction model. */
  readonly usage?: Experimental_ExtractionModelV4Result['usage'];
  /** Warnings from the extraction model. */
  readonly warnings: Experimental_ExtractionModelV4Result['warnings'];
  /** Optional provider-specific metadata. */
  readonly providerMetadata?: Experimental_ExtractionModelV4Result['providerMetadata'];
  /** Optional raw response metadata from the provider. */
  readonly response?: Experimental_ExtractionModelV4Result['response'];
};
```

## `Experimental_ExtractionModelCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired when the extraction model call begins.

The logical model call includes any provider retries.

```text
type ExtractionModelCallStartEvent = {
  /** Unique identifier for the outer extraction call. */
  readonly callId: string;
  /** Identifies the inner operation (`ai.extract.doExtract`). */
  readonly operationId: 'ai.extract.doExtract';
  /** The provider identifier. */
  readonly provider: string;
  /** The extraction model identifier. */
  readonly modelId: string;
  /** The shared state to extract field values from. */
  readonly state: Experimental_ExtractionModelV4CallOptions['state'];
  /** The fields to extract from the shared state. */
  readonly fields: Experimental_ExtractionModelV4CallOptions['fields'];
  /** `YYYY-MM-DD` date that anchors relative dates and dates without a year. */
  readonly referenceDate?: Experimental_ExtractionModelV4CallOptions['referenceDate'];
};
```

## `Experimental_ExtractionProviderRegistry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose extraction selection alongside the decision and evaluation interfaces.

```text
export type Experimental_ExtractionProviderRegistry<Providers extends ProviderMap = ProviderMap, Separator extends string = ':'> = Experimental_DecisionProviderRegistry<Providers, Separator> & {
    readonly extractionModel: RegistrySelector<Providers, Separator, 'extractionModel', ReturnType<typeof wrapExtractionModel>>;
};
```

## `Experimental_ExtractionRefusalError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap an extraction model refusal with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for an extraction model refusal.
`Experimental_ExtractionRefusalError.isInstance` checks its SDK cause.

```text
declare const Experimental_ExtractionRefusalError: {
    new (args_0: {
        fieldIds: string[];
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type Experimental_ExtractionRefusalError = AiSdkError;
```

## `Experimental_ExtractionResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ExtractionResult<FIELDS extends Record<string, Experimental_ExtractionModelV4Field>> = {
  readonly answers: { [ID in keyof FIELDS]: ExtractionAnswer<FIELDS[ID]>; };
  readonly usage: {
    inputTokens: number | undefined;
    outputTokens: number | undefined;
    totalTokens: number | undefined;
  };
  readonly warnings: Experimental_ExtractionModelV4Result['warnings'];
  readonly providerMetadata: Experimental_ExtractionModelV4Result['providerMetadata'];
  readonly response: NonNullable<Experimental_ExtractionModelV4Result['response']> & {
    timestamp: Date;
    modelId: string;
  };
};
```

## `Experimental_ExtractionSource`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

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

## `Experimental_ExtractionState`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Shared text, JSON data, or ordered multimodal parts for a decision.

```text
type DecisionState = string | Readonly<JSONObject> | readonly DecisionStatePart[];
```

## `Experimental_ExtractionStatePart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DecisionStatePart = TextPart | FilePart | {
  type: 'json';
  value: JSONValue;
};
```

## `Experimental_ExtractionUnsupportedFieldTypeError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a schema field type unsupported by the extraction model with the native arguments
and expose its SDK type guard.
Use the shared `AiSdkError` type for a schema field type unsupported by the extraction
model. `Experimental_ExtractionUnsupportedFieldTypeError.isInstance` checks its SDK
cause.

```text
declare const Experimental_ExtractionUnsupportedFieldTypeError: {
    new (args_0: {
        fieldId: string;
        fieldType: string;
        provider: string;
        modelId: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type Experimental_ExtractionUnsupportedFieldTypeError = AiSdkError;
```

## `Experimental_ExtractionValue`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ExtractionValue<FIELD extends Experimental_ExtractionModelV4Field> = FIELD extends {
  type: 'number' | 'duration';
} ? number : FIELD extends {
  type: 'list';
  items: infer ITEMS;
} ? ITEMS extends 'number' ? number[] : string[] : string;
```

## `Experimental_ExtractStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onStart` callback for extraction operations.

Called when the operation begins, before the extraction model is called.

```text
type ExtractStartEvent<RUNTIME_CONTEXT extends Context = Context> = {
  /** User-defined runtime context. */
  readonly runtimeContext: RUNTIME_CONTEXT;
  /** Unique identifier for this extraction call, used to correlate events. */
  readonly callId: string;
  /** Identifies the operation type (`ai.extract`). */
  readonly operationId: 'ai.extract';
  /** The provider identifier. */
  readonly provider: string;
  /** The extraction model identifier. */
  readonly modelId: string;
  /** The shared state to extract field values from. */
  readonly state: DecisionState;
  /** The fields to extract from the shared state. */
  readonly fields: Readonly<Record<string, Experimental_ExtractionModelV4Field>>;
  /** `YYYY-MM-DD` date that anchors relative dates and dates without a year. */
  readonly referenceDate?: string;
  /** Maximum output tokens requested for the extraction. */
  readonly maxOutputTokens?: number;
  /** Reasoning effort requested for the extraction. */
  readonly reasoning?: Experimental_ExtractionModelV4CallOptions['reasoning'];
  /** Maximum number of retries for the extraction model call. */
  readonly maxRetries: number;
  /** Additional HTTP headers sent with the request. */
  readonly headers: Record<string, string> | undefined;
  /** Additional provider-specific options. */
  readonly providerOptions: ProviderOptions;
};
```
