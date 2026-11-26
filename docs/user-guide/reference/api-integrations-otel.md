---
title: "Integration API — otel"
doc-type: reference
sources: [src/integrations/otel.ts, package.json]
---

# otel

> **TL;DR:** The `@jambudipa/ai-effect/otel` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/otel`

## `EnrichSpan`

Add attributes synchronously when the OpenTelemetry host creates a span.

```text
export type EnrichSpan = (options: {
    spanType: sdk.OpenTelemetrySpanType;
    operationId: string;
    callId: string;
    runtimeContext: Record<string, unknown> | undefined;
}) => Attributes | undefined;
```

## `formatInputMessages`

Format input messages for native OpenTelemetry attributes.

```text
export declare const formatInputMessages: (...args: Parameters<typeof sdk.formatInputMessages>) => Effect.Effect<sdk.SemConvInputMessage[], import("../internal/operation.js").AiSdkError, never>;
```

## `formatModelMessages`

Format model messages using the SDK's trace representation.

```text
export declare const formatModelMessages: (...args: Parameters<typeof sdk.formatModelMessages>) => Effect.Effect<sdk.SemConvInputMessage[], import("../internal/operation.js").AiSdkError, never>;
```

## `formatObjectOutputMessages`

Format structured output messages for telemetry recording.

```text
export declare const formatObjectOutputMessages: (...args: Parameters<typeof sdk.formatObjectOutputMessages>) => Effect.Effect<sdk.SemConvOutputMessage[], import("../internal/operation.js").AiSdkError, never>;
```

## `formatOutputContent`

Format response content using the native telemetry content representation.

```text
export declare const formatOutputContent: (...args: Parameters<typeof sdk.formatOutputContent>) => Effect.Effect<sdk.SemConvOutputMessage[], import("../internal/operation.js").AiSdkError, never>;
```

## `formatOutputMessages`

Format response messages for native telemetry recording.

```text
export declare const formatOutputMessages: (...args: Parameters<typeof sdk.formatOutputMessages>) => Effect.Effect<sdk.SemConvOutputMessage[], import("../internal/operation.js").AiSdkError, never>;
```

## `formatSystemInstructions`

Format system instructions using the SDK's native telemetry representation.

```text
export declare const formatSystemInstructions: (...args: Parameters<typeof sdk.formatSystemInstructions>) => Effect.Effect<sdk.SemConvSystemInstruction[], import("../internal/operation.js").AiSdkError, never>;
```

## `LegacyOpenTelemetry`

Construct the native legacy telemetry integration through the Effect boundary.
Effect telemetry with every hook supported by the legacy class available.

```text
export declare const LegacyOpenTelemetry: {
    make: (options?: ConstructorParameters<typeof sdk.LegacyOpenTelemetry>[0]) => Effect.Effect<Required<Pick<import("./internal/telemetry.js").EffectTelemetry, keyof sdk.LegacyOpenTelemetry>>, import("../internal/operation.js").AiSdkError, never>;
};

export type LegacyOpenTelemetry = Required<Pick<ReturnType<typeof wrapTelemetry>, keyof sdk.LegacyOpenTelemetry>>;
```

## `OpenTelemetry`

Construct a modern telemetry integration and reject an unregistered durable generator.
Effect telemetry with all hooks supported by the modern native class available.

```text
export declare const OpenTelemetry: {
    make: (options?: OpenTelemetryOptions) => Effect.Effect<Required<Pick<import("./internal/telemetry.js").EffectTelemetry, keyof sdk.OpenTelemetry>>, import("../internal/operation.js").AiSdkError, never>;
};

export type OpenTelemetry = Required<Pick<ReturnType<typeof wrapTelemetry>, keyof sdk.OpenTelemetry>>;
```

## `OpenTelemetryIdGenerator`

Access the durable telemetry identifier generator through Effect.

```text
/** Access the durable telemetry identifier generator through Effect. */
export declare class OpenTelemetryIdGenerator {
    private constructor();
    /** Construct a generator for durable telemetry and register it for integration setup. */
    static make(options?: {
        readonly sampler?: Sampler;
    }): Effect.Effect<OpenTelemetryIdGenerator, import("../internal/operation.js").AiSdkError, never>;
    /** Generate a fresh trace ID when the Effect runs. */
    get generateTraceId(): Effect.Effect<string, import("../internal/operation.js").AiSdkError, never>;
    /** Generate a fresh span ID when the Effect runs. */
    get generateSpanId(): Effect.Effect<string, import("../internal/operation.js").AiSdkError, never>;
    /** Apply the native generator's sampler to the supplied span context. */
    shouldSample(...args: Parameters<sdk.OpenTelemetryIdGenerator['shouldSample']>): Effect.Effect<{
        decision: 0 | 1 | 2;
        traceState?: TraceState;
        attributes?: Attributes;
    }, import("../internal/operation.js").AiSdkError, never>;
    /** Capture the native durable telemetry context associated with the current call. */
    captureContext(...args: Parameters<sdk.OpenTelemetryIdGenerator['captureContext']>): Effect.Effect<import("ai").DurableTelemetryContext, import("../internal/operation.js").AiSdkError, never>;
    /** Start work with the supplied native trace and span IDs for the duration of the callback. */
    withIds<A>(ids: Parameters<sdk.OpenTelemetryIdGenerator['withIds']>[0], startSpan: () => A): Effect.Effect<A, import("../internal/operation.js").AiSdkError, never>;
    /** Return the native identifier generator's string representation. */
    toString(): string;
}
```

## `OpenTelemetryOptions`

Configure telemetry with an optional registered durable generator and synchronous span enrichment.

```text
export type OpenTelemetryOptions = Omit<sdk.OpenTelemetryOptions, 'durable' | 'agentSpanName' | 'enrichSpan'> & {
    readonly durable?: OpenTelemetryIdGenerator;
    readonly agentSpanName?: 'modelId' | 'functionId' | ((options: {
        modelId: string;
        functionId: string | undefined;
    }) => string | undefined);
    readonly enrichSpan?: EnrichSpan;
};
```

## `OpenTelemetrySpanType`

```text
type OpenTelemetrySpanType = 'operation' | 'step' | 'languageModel' | 'tool' | 'embedding' | 'reranking' | 'experimental_decision' | 'experimental_extraction';
```

## `SemConvInputMessage`

```text
interface SemConvInputMessage {
  role: string;
  parts: SemConvPart[];
}
```

## `SemConvOutputMessage`

```text
interface SemConvOutputMessage {
  role: string;
  parts: SemConvPart[];
  finish_reason: string;
}
```

## `SemConvPart`

```text
type SemConvPart = {
  type: 'text';
  content: string;
} | {
  type: 'reasoning';
  content: string;
} | {
  type: 'tool_call';
  id: string | null;
  name: string;
  arguments?: unknown;
} | {
  type: 'tool_call_response';
  id: string | null;
  response: unknown;
} | {
  type: 'blob';
  modality: string;
  mime_type: string | null;
  content: string;
} | {
  type: string;
  [key: string]: unknown;
};
```

## `SemConvSystemInstruction`

```text
interface SemConvSystemInstruction {
  type: string;
  content?: string;
  [key: string]: unknown;
}
```

