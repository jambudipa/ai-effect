---
title: '@jambudipa/ai-effect/provider-utils/experimental-decision API'
doc-type: reference
sources: [src/protocols, src/internal, src/core-middleware.ts, package.json]
---

# @jambudipa/ai-effect/provider-utils/experimental-decision API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/provider-utils/experimental-decision`. Conditions: `types`.

## `Experimental_DecisionLanguageModel`

Effect model for decision requests through the native workflow-capable model.
Construct the native decision model lazily and expose its workflow serialization hooks.

```text
export type Experimental_DecisionLanguageModel = ReturnType<typeof wrapEvaluationModel>;
```

```text
Experimental_DecisionLanguageModel: WrappedWorkflowLanguageConstructor<typeof NativeModel, Experimental_DecisionLanguageModel>
```

