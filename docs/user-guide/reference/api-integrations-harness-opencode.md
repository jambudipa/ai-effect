---
title: "Integration API — harness-opencode"
doc-type: reference
sources: [src/integrations/harness-opencode.ts, package.json]
---

# harness-opencode

> **TL;DR:** The `@jambudipa/ai-effect/harness-opencode` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-opencode`

## `createOpenCode`

Construct an OpenCode harness in a scope that owns any credential forwarding callbacks.

The full public type is defined by the [source declaration](../../../src/integrations/harness-opencode.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createOpenCode: <R = never, E = never>(settings?: OpenCodeHarnessSettings<R, E>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-opencode').createOpenCode<R, E>>;
```

## `JSONObject`

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `openCode`

Resolve the SDK's default OpenCode harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-opencode.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const openCode: typeof import('@jambudipa/ai-effect/harness-opencode').openCode;
```

## `OpenCodeAuthenticationMode`

```text
type OpenCodeAuthenticationMode = HarnessV1Authentication<
  'direct' | 'anthropic' | 'openai'
>;
```

## `OpenCodeHarnessSettings`

OpenCode adapter settings with optional credential forwarding in the Effect context.

```text
export type OpenCodeHarnessSettings<R = never, E = never> = WithCredentialForwarding<SDKContract.OpenCodeHarnessSettings, R, E>;
```

## `VERSION`

Version reported by the native OpenCode adapter.

```text
export declare const VERSION: string;
```

