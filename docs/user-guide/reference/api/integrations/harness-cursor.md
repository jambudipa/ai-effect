---
title: "Integration API — harness-cursor"
doc-type: reference
sources: [src/integrations/harness-cursor.ts, package.json]
---

# harness-cursor

> **TL;DR:** The `@jambudipa/ai-effect/harness-cursor` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-cursor`

## `createCursor`

Construct a Cursor harness in a scope that owns any credential forwarding callbacks.

The full public type is defined by the [source declaration](../../../../../src/integrations/harness-cursor.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createCursor: <R = never, E = never>(settings?: CursorHarnessSettings<R, E>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-cursor').createCursor<R, E>>;
```

## `cursor`

Resolve the SDK's default Cursor harness when the Effect runs.

The full public type is defined by the [source declaration](../../../../../src/integrations/harness-cursor.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const cursor: typeof import('@jambudipa/ai-effect/harness-cursor').cursor;
```

## `CursorAuthenticationMode`

```text
type CursorAuthenticationMode = ACPAuthenticationMode;
```

## `CursorHarnessSettings`

Cursor adapter settings with optional credential forwarding in the Effect context.

```text
export type CursorHarnessSettings<R = never, E = never> = WithCredentialForwarding<SDKContract.CursorHarnessSettings, R, E>;
```

## `JSONObject`

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `VERSION`

Version reported by the native Cursor adapter.

```text
export declare const VERSION: string;
```
