---
title: "Integration API — valibot"
doc-type: reference
sources: [src/integrations/valibot.ts, package.json]
---

# valibot

> **TL;DR:** The `@jambudipa/ai-effect/valibot` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/valibot`

## `valibotSchema`

Adapt Valibot validation and JSON Schema conversion to lazy Effects.

```text
export declare const valibotSchema: <S extends Valibot.GenericSchema<unknown, unknown, Valibot.BaseIssue<unknown>>>(schema: S) => Effect.Effect<{
    jsonSchema: Effect.Effect<import("json-schema").JSONSchema7, import("../internal/operation.js").AiSdkError, never>;
    validate: (input: unknown) => Effect.Effect<Valibot.InferOutput<S>, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, never>;
```

