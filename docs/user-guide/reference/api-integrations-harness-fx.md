---
title: "Integration API — harness-fx"
doc-type: reference
sources: [src/integrations/harness-fx.ts, package.json]
---

# harness-fx

> **TL;DR:** The `@jambudipa/ai-effect/harness-fx` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-fx`

## `createFx`

Construct an Fx harness without allocating a callback scope when native storage suffices.
Construct an Fx harness with optional Effect session storage owned by the current scope.

```text
export declare function createFx(settings?: FxHarnessSettings & {
    readonly sessionStorage?: never;
}): Effect.Effect<FxHarness, AiSdkError>;

export declare function createFx<E = never, R = never>(settings?: FxHarnessSettings<E, R>): Effect.Effect<FxHarness, AiSdkError, Scope | R>;
```

## `fx`

Resolve the SDK's default Fx harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-fx.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const fx: typeof import('@jambudipa/ai-effect/harness-fx').fx;
```

## `FxAuthenticationMode`

```text
type FxAuthenticationMode = HarnessV1Authentication;
```

## `FxHarnessSettings`

Configure Fx with optional storage that can use captured Effect services.

```text
export type FxHarnessSettings<E = never, R = never> = Omit<SDKContract.FxHarnessSettings, 'sessionStorage'> & {
    readonly sessionStorage?: FxSessionStorage<E, R>;
};
```

## `FxSessionStorage`

Persist and read session entries using Effects in the harness's callback context.

```text
export type FxSessionStorage<E = never, R = never> = WithEffectCallbacks<SDKContract.FxSessionStorage, 'append' | 'read', E, R>;
```

## `VERSION`

Version reported by the pinned native Fx adapter.

```text
export declare const VERSION: string;
```
