---
title: "Integration API — tool-bash"
doc-type: reference
sources: [src/integrations/tool-bash.ts, package.json]
---

# tool-bash

> **TL;DR:** The `@jambudipa/ai-effect/tool-bash` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/tool-bash`

## `experimental_createBashTool`

Create a Bash tool using the caller-owned sandbox.

The full public type is defined by the [source declaration](../../../src/integrations/tool-bash.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const experimental_createBashTool: (options: Options) =>
  ReturnType<typeof import('@jambudipa/ai-effect/tool-bash').experimental_createBashTool>;
```
