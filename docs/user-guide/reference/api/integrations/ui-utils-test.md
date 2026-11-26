---
title: "Integration API — ui-utils/test"
doc-type: reference
sources: [src/integrations/ui-utils-test.ts, package.json]
---

# ui-utils/test

> **TL;DR:** The `@jambudipa/ai-effect/ui-utils/test` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/ui-utils/test`

## `mockFetchDataStream`

```text
export declare const mockFetchDataStream: (...args: Parameters<SDK["mockFetchDataStream"]>) => Effect.Effect<{
    requestBody: Effect.Effect<unknown, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, never>;
```

## `mockFetchDataStreamWithGenerator`

```text
export declare const mockFetchDataStreamWithGenerator: (...args: Parameters<SDK["mockFetchDataStreamWithGenerator"]>) => Effect.Effect<{
    requestBody: Effect.Effect<unknown, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, never>;
```

## `mockFetchError`

```text
export declare const mockFetchError: (...args: Parameters<SDK["mockFetchError"]>) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
```

## `mockFetchTextStream`

```text
export declare const mockFetchTextStream: (...args: Parameters<SDK["mockFetchTextStream"]>) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
```
