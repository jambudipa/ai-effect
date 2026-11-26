---
title: '@jambudipa/ai-effect/provider-utils/experimental-extraction API'
doc-type: reference
sources: [src/protocols, src/internal, src/core-middleware.ts, package.json]
---

# @jambudipa/ai-effect/provider-utils/experimental-extraction API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/provider-utils/experimental-extraction`. Conditions: `types`.

## `Experimental_ExtractionLanguageModel`

Effect model for structured extraction through the native workflow-capable model.
Construct the native extraction model lazily and expose its workflow serialization
hooks.

```text
export type Experimental_ExtractionLanguageModel = ReturnType<typeof wrapExtractionModel>;
```

```text
Experimental_ExtractionLanguageModel: WrappedWorkflowLanguageConstructor<typeof NativeModel, Experimental_ExtractionLanguageModel>
```
