---
title: '@jambudipa/ai-effect/provider-utils/experimental-evaluation API'
doc-type: reference
sources: [src/protocols, src/internal, src/core-middleware.ts, package.json]
---

# @jambudipa/ai-effect/provider-utils/experimental-evaluation API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/provider-utils/experimental-evaluation`. Conditions: `types`.

## `DecisionLanguageModel`

Effect model for evaluation requests through the native workflow-capable model.
Construct the native evaluation model lazily and expose its workflow serialization
hooks.

```text
export type Experimental_EvaluationLanguageModel = ReturnType<typeof wrapEvaluationModel>;
```

```text
Experimental_EvaluationLanguageModel: WrappedWorkflowLanguageConstructor<typeof NativeModel, Experimental_EvaluationLanguageModel>
```

## `Experimental_EvaluationLanguageModel`

Effect model for evaluation requests through the native workflow-capable model.
Construct the native evaluation model lazily and expose its workflow serialization
hooks.

```text
export type Experimental_EvaluationLanguageModel = ReturnType<typeof wrapEvaluationModel>;
```

```text
Experimental_EvaluationLanguageModel: WrappedWorkflowLanguageConstructor<typeof NativeModel, Experimental_EvaluationLanguageModel>
```

