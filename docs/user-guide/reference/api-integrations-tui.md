---
title: "Integration API — tui"
doc-type: reference
sources: [src/integrations/tui.ts, package.json]
---

# tui

> **TL;DR:** The `@jambudipa/ai-effect/tui` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/tui`

## `AgentTUIAgent`

Minimal Effect agent contract accepted by the native terminal host adapter.

```text
export interface AgentTUIAgent<T extends EffectTools = {}, E = never, R = never> {
    /** Tool set exposed to the terminal host after binding its execution services. */
    readonly tools: T;
    /** Produce a scoped stream of model events for the terminal host to render. */
    readonly stream: (input: AgentCall) => Effect.Effect<{
        readonly fullStream: Stream.Stream<TextStreamPart<ToolSet>, E, R>;
    }, E, R | Scope.Scope>;
}
```

## `ResponseStatisticsMode`

Controls which response statistic is shown.

- `outputTokenCount`: show the number of output tokens in the response.
- `outputTokensPerSecond`: show output token throughput for the response.

```text
type ResponseStatisticsMode = 'outputTokenCount' | 'outputTokensPerSecond';
```

## `runAgentTUI`

Start the native terminal host with an Effect agent or transport.

```text
export declare const runAgentTUI: <T extends EffectTools = {}, E = never, R = never>(options: RunAgentTUIOptions<T, E, R>) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, Exclude<R, Scope.Scope> | Exclude<import("../internal/tool.js").ToolRequirements<T[keyof T]>, Scope.Scope>>;
```

## `RunAgentTUIOptions`

Select either a streaming Effect agent and optional sandbox or a registered chat transport.

```text
export type RunAgentTUIOptions<T extends EffectTools = {}, E = never, R = never> = NativeOptions & ({
    readonly transport: ChatTransport;
    readonly agent?: never;
    readonly sandbox?: never;
} | {
    readonly agent: AgentTUIAgent<T, E, R>;
    readonly sandbox?: SandboxSession;
    readonly transport?: never;
});
```

## `TerminalPartDisplayMode`

Controls how terminal UI sections for stream parts are displayed.

- `full`: show the section header and full content.
- `collapsed`: show only the section header.
- `auto-collapsed`: show the latest section expanded until another visible
  section appears, then collapse it.
- `hidden`: omit the section entirely.

```text
type TerminalPartDisplayMode = 'full' | 'collapsed' | 'auto-collapsed' | 'hidden';
```

