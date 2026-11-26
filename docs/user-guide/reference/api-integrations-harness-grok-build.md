---
title: "Integration API — harness-grok-build"
doc-type: reference
sources: [src/integrations/harness-grok-build.ts, package.json]
---

# harness-grok-build

> **TL;DR:** The `@jambudipa/ai-effect/harness-grok-build` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-grok-build`

## `createGrokBuild`

Construct a Grok Build harness in a scope that owns any credential forwarding callbacks.

The full public type is defined by the [source declaration](../../../src/integrations/harness-grok-build.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createGrokBuild: <R = never, E = never>(settings?: GrokBuildHarnessSettings<R, E>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-grok-build').createGrokBuild<R, E>>;
```

## `grokBuild`

Resolve the SDK's default Grok Build harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-grok-build.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const grokBuild: typeof import('@jambudipa/ai-effect/harness-grok-build').grokBuild;
```

## `GrokBuildAuthenticationMode`

```text
type GrokBuildAuthenticationMode = ACPAuthenticationMode;
```

## `GrokBuildHarnessSettings`

Grok Build adapter settings with optional credential forwarding in the Effect context.

```text
export type GrokBuildHarnessSettings<R = never, E = never> = WithCredentialForwarding<SDKContract.GrokBuildHarnessSettings, R, E>;
```

## `JSONObject`

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `VERSION`

Version reported by the native Grok Build adapter.

```text
export declare const VERSION: string;
```

