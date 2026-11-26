---
title: "Integration API — harness-claude-code"
doc-type: reference
sources: [src/integrations/harness-claude-code.ts, package.json]
---

# harness-claude-code

> **TL;DR:** The `@jambudipa/ai-effect/harness-claude-code` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-claude-code`

## `claudeCode`

Resolve the SDK's default Claude Code harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-claude-code.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const claudeCode: typeof import('@jambudipa/ai-effect/harness-claude-code').claudeCode;
```

## `ClaudeCodeAuthenticationMode`

```text
type ClaudeCodeAuthenticationMode = HarnessV1Authentication;
```

## `ClaudeCodeHarnessSettings`

Configure the Claude Code adapter with scoped credential forwarding and channel observations.

```text
export type ClaudeCodeHarnessSettings<R = never, E = never> = WithCredentialForwarding<Omit<SDKContract.ClaudeCodeHarnessSettings, 'onDebug'>, R, E> & {
    /** Observe a channel event in the harness scope. */
    readonly onDebug?: (...args: Parameters<NonNullable<SDKContract.ClaudeCodeHarnessSettings['onDebug']>>) => Effect.Effect<void, E, R>;
};
```

## `ClaudeCodeThinkingConfig`

```text
type ClaudeCodeThinkingConfig =
  | {
      readonly type: 'adaptive' | 'enabled';
      readonly display?: 'summarized' | 'omitted';
    }
  | {
      readonly type: 'disabled';
    };
```

## `createClaudeCode`

Construct a Claude Code harness, keeping optional debug and credential callbacks in the current scope.

The full public type is defined by the [source declaration](../../../src/integrations/harness-claude-code.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createClaudeCode: <R = never, E = never>(settings?: ClaudeCodeHarnessSettings<R, E>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-claude-code').createClaudeCode<R, E>>;
```

## `JSONObject`

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `VERSION`

Version reported by the native Claude Code adapter.

```text
export declare const VERSION: string;
```

