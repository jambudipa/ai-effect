---
title: "Integration API — harness/bridge"
doc-type: reference
sources: [src/integrations/harness/bridge.ts, package.json]
---

# harness/bridge

> **TL;DR:** The `@jambudipa/ai-effect/harness/bridge` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness/bridge`

## `BridgeDebugConfig`

Per-session diagnostics config. The host resolves it from settings +
env and sends it on `start.debug`; the bridge gates console capture and
structured `debug-event`s on it. When disabled, nothing is captured or
emitted and no `seq` is consumed.

```text
export interface BridgeDebugConfig {
  enabled?: boolean;
  level?: BridgeDebugLevel;
  subsystems?: string[];
}
```

## `BridgeDebugLevel`

```text
export type BridgeDebugLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';
```

## `BridgeEvent`

Outbound turn event the adapter emits. `seq` is added by the runtime.

```text
export type BridgeEvent = Record<string, unknown> & {
  type: string;
};
```

## `BridgeHandle`

Listening bridge handle returned after the optional listening callback completes.

```text
export type BridgeHandle = ReturnType<typeof wrapBridge>;
```

## `BridgeState`

```text
export type BridgeState = 'init' | 'waiting' | 'running' | 'draining' | 'done';
```

## `BridgeTurn`

Active bridge turn with event emission, tool requests, and the incoming user queue.

```text
export type BridgeTurn = ReturnType<typeof wrapTurn>;
```

## `convertHarnessToolModelOutput`

Convert SDK tool results to bridge model-output content without running the tool again.

```text
export declare const convertHarnessToolModelOutput: (...args: Parameters<typeof sdk.convertHarnessToolModelOutput>) => Effect.Effect<{
    content: sdk.HarnessToolModelOutputContent[];
    isError: boolean;
}, AiSdkError, never>;
```

## `Experimental_BridgeUserMessage`

Queued user message with explicit Effect operations for accepting or rejecting delivery.

```text
export type Experimental_BridgeUserMessage = ReturnType<typeof wrapMessage>;
```

## `Experimental_BridgeUserMessageQueue`

Incoming turn messages with queue depth, delivery stream, and explicit closure.

```text
export type Experimental_BridgeUserMessageQueue = ReturnType<typeof wrapQueue>;
```

## `HarnessBridgeCapabilityUnsupportedError`

Wrap SDK reports for capabilities the current bridge cannot provide.
Tagged SDK error channel used by bridge capability checks.

```text
export declare const HarnessBridgeCapabilityUnsupportedError: {
    make: (args_0: {
        message: string;
        harnessId?: string;
        cause?: unknown;
    }) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type HarnessBridgeCapabilityUnsupportedError = AiSdkError;
```

## `HarnessToolModelOutputContent`

```text
type HarnessToolModelOutputContent = {
  type: 'text';
  text: string;
} | {
  type: 'image';
  data: string;
  mediaType: string;
};
```

## `isWriteProtectedPath`

Run the SDK's write-protection check as a request effect.

```text
export declare const isWriteProtectedPath: (...args: Parameters<typeof sdk.isWriteProtectedPath>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `runBridge`

Start a bridge owned by the calling Effect scope.

```text
export declare const runBridge: <T extends Start, E = never, R = never>(options: RunBridgeOptions<T, E, R>) => Effect.Effect<{
    port: number;
    close: Effect.Effect<void, AiSdkError, never>;
}, AiSdkError | E, import("effect/Scope").Scope | R>;
```

## `RunBridgeOptions`

Bridge settings with lifecycle callbacks that execute in the bridge's Effect context.

```text
export type RunBridgeOptions<T extends Start, E = never, R = never> = Omit<sdk.RunBridgeOptions<T>, 'onStart' | 'onStop' | 'onDestroy' | 'onListening' | 'onExit'> & {
    readonly onStart: (start: T, turn: BridgeTurn) => Effect.Effect<void, E, R>;
    readonly onStop?: () => Effect.Effect<unknown, E, R>;
    readonly onDestroy?: () => Effect.Effect<void, E, R>;
    readonly onListening?: (port: number) => Effect.Effect<void, E, R>;
    readonly onExit?: () => Effect.Effect<void, E, R>;
};
```

