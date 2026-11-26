---
title: "Integration API — devtools"
doc-type: reference
sources: [src/integrations/devtools.ts, package.json]
---

# devtools

> **TL;DR:** The `@jambudipa/ai-effect/devtools` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/devtools`

## `devToolsMiddleware`

Create an Effect middleware that records model requests to DevTools.

```text
export declare const devToolsMiddleware: () => import("effect/Effect").Effect<{
    specificationVersion: "v4";
    apply: (model: import("../core.js").LanguageModelV4) => import("effect/Effect").Effect<{
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
}, import("../internal/operation.js").AiSdkError, never>;
```

## `DevToolsTelemetry`

Create a DevTools integration with Effect lifecycle hooks.

```text
export declare const DevToolsTelemetry: (options?: sdk.DevToolsTelemetryOptions) => import("effect/Effect").Effect<import("./internal/telemetry.js").EffectTelemetry, import("../internal/operation.js").AiSdkError, never>;
```

## `DevToolsTelemetryOptions`

```text
interface DevToolsTelemetryOptions {
  /**
   * Identifier used to group multiple AI SDK calls into one DevTools run.
   * Reuse the same value when resuming an interrupted interaction.
   */
  runId?: string;
}
```
