---
title: "Integration API — harness-codex"
doc-type: reference
sources: [src/integrations/harness-codex.ts, package.json]
---

# harness-codex

> **TL;DR:** The `@jambudipa/ai-effect/harness-codex` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-codex`

## `codex`

Resolve the SDK's default Codex harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-codex.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const codex: typeof import('@jambudipa/ai-effect/harness-codex').codex;
```

## `CodexAuthenticationMode`

```text
type CodexAuthenticationMode = HarnessV1Authentication;
```

## `CodexHarnessSettings`

Codex adapter settings with optional credential forwarding in the Effect context.

```text
export type CodexHarnessSettings<R = never, E = never> = WithCredentialForwarding<SDKContract.CodexHarnessSettings, R, E>;
```

## `createCodex`

Construct a Codex harness in a scope that owns any credential forwarding callbacks.

The full public type is defined by the [source declaration](../../../src/integrations/harness-codex.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createCodex: <R = never, E = never>(settings?: CodexHarnessSettings<R, E>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-codex').createCodex<R, E>>;
```

## `JSONObject`

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `VERSION`

Version reported by the native Codex adapter.

```text
export declare const VERSION: string;
```

