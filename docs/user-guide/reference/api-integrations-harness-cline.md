---
title: "Integration API — harness-cline"
doc-type: reference
sources: [src/integrations/harness-cline.ts, package.json]
---

# harness-cline

> **TL;DR:** The `@jambudipa/ai-effect/harness-cline` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-cline`

## `cline`

Resolve the SDK's default Cline harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-cline.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const cline: typeof import('@jambudipa/ai-effect/harness-cline').cline;
```

## `ClineAuthenticationMode`

```text
type ClineAuthenticationMode = HarnessV1Authentication;
```

## `ClineHarnessSettings`

```text
type ClineHarnessSettings = {
  readonly auth?: ClineAuthenticationMode;
  readonly mcpServers?: Record<string, unknown>;
  readonly providerId?: string;
  readonly apiKey?: string;
  readonly baseUrl?: string;
  readonly headers?: Record<string, string>;
  readonly reasoningEffort?: ClineReasoningEffort;
  readonly maxIterations?: number;
};
```

## `createCline`

Create a Cline harness lazily with the native adapter settings.

The full public type is defined by the [source declaration](../../../src/integrations/harness-cline.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createCline: (settings?: SDKContract.ClineHarnessSettings) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-cline').createCline>;
```

## `VERSION`

Version reported by the pinned native Cline adapter.

```text
export declare const VERSION: string;
```

