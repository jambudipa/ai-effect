---
title: The boundary between Effect and the SDK
doc-type: explanation
sources:
  [
    src/AiSdk.ts,
    src/core.ts,
    src/internal/operation.ts,
    src/internal/tool.ts,
    src/internal/output.ts,
    src/internal/provider-model.ts,
  ]
---

# The boundary between Effect and the SDK

> **TL;DR:** The SDK still owns model options, result formats, and protocol
> behavior. The wrapper makes operations lazy and supplies Effect services,
> lifetimes, and tagged errors at the boundary.

The wrapper keeps the SDK as the source of the model and tool contracts. A
provider handle still identifies a model by its native ID and accepts its
provider options. A wrapper can therefore expose the SDK's full generation
result even when an application only reads its `text` field.

The wrapper controls when it calls the SDK. Building the Effect allows the
application to add dependencies and failure handling before a request starts.
The `AiSdk` service groups common operations under a layer and leaves the core
functions available as direct imports. Code can use a replacement service layer
for tests while keeping the application program intact.

The adapter also converts Effect callbacks back to the form a native SDK
expects. A tool's `execute` can use an application service. A callback that the
SDK calls synchronously must finish without suspension because the SDK needs its
result on the same call stack. The adapter runs each callback under the context
and lifetime of the operation that registered it.

SDK failures cross the boundary as tagged errors. `AiSdkError` exposes the
operation and a bounded set of diagnostic fields. The wrapper redacts the
original cause because a provider can include request data or credentials in
its failure details.

See the [Core API reference](../reference/core.md) and
[Scopes and cancellation](scopes-and-cancellation.md).
