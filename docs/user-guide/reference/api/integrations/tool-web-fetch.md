---
title: "Integration API — tool-web-fetch"
doc-type: reference
sources: [src/integrations/tool-web-fetch.ts, package.json]
---

# tool-web-fetch

> **TL;DR:** The `@jambudipa/ai-effect/tool-web-fetch` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/tool-web-fetch`

## `experimental_createWebFetchTool`

Create a tool that fetches documents with the SDK's URL restrictions.

The full public type is defined by the [source declaration](../../../../../src/integrations/tool-web-fetch.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const experimental_createWebFetchTool: (...args: Parameters<typeof createNativeTool>) =>
  ReturnType<typeof import('@jambudipa/ai-effect/tool-web-fetch').experimental_createWebFetchTool>;
```
