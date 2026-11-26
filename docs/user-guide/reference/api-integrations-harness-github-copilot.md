---
title: "Integration API — harness-github-copilot"
doc-type: reference
sources: [src/integrations/harness-github-copilot.ts, package.json]
---

# harness-github-copilot

> **TL;DR:** The `@jambudipa/ai-effect/harness-github-copilot` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-github-copilot`

## `createGitHubCopilot`

Construct a GitHub Copilot harness in a scope that owns any credential forwarding callbacks.

The full public type is defined by the [source declaration](../../../src/integrations/harness-github-copilot.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createGitHubCopilot: <R = never, E = never>(settings?: GitHubCopilotHarnessSettings<R, E>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/harness-github-copilot').createGitHubCopilot<R, E>>;
```

## `githubCopilot`

Resolve the SDK's default GitHub Copilot harness when the Effect runs.

The full public type is defined by the [source declaration](../../../src/integrations/harness-github-copilot.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const githubCopilot: typeof import('@jambudipa/ai-effect/harness-github-copilot').githubCopilot;
```

## `GitHubCopilotAuthenticationMode`

```text
type GitHubCopilotAuthenticationMode = ACPAuthenticationMode;
```

## `GitHubCopilotBuiltinTools`

Built-in tool handles and keys inferred from the default GitHub Copilot adapter.

```text
export type GitHubCopilotBuiltinTools = Effect.Success<typeof githubCopilot>['builtinTools'];
```

## `GitHubCopilotHarnessSettings`

GitHub Copilot adapter settings with optional credential forwarding in the Effect context.

```text
export type GitHubCopilotHarnessSettings<R = never, E = never> = WithCredentialForwarding<SDKContract.GitHubCopilotHarnessSettings, R, E>;
```

## `JSONObject`

```text
type JSONObject = {
  [key: string]: JSONValue | undefined;
};
```

## `VERSION`

Version reported by the native GitHub Copilot adapter.

```text
export declare const VERSION: string;
```
