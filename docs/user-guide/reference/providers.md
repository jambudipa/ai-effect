---
title: Provider adapters
doc-type: reference
sources:
  [
    package.json,
    docs/sdk-surface.json,
    src/providers,
    src/internal/provider-adapter.ts,
    src/internal/provider-model.ts,
    src/core-providers.ts,
  ]
---

# Provider adapters

> **TL;DR:** Provider subpaths expose the pinned SDK provider settings and
> model IDs. Factories and model selectors produce Effect values. Exact
> capabilities depend on the provider and entry.

| Item               | Contract                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Factory            | Creates a wrapped provider on Effect execution, for example `createOpenAI(settings)`.                    |
| Default provider   | Preconfigured selector for the provider, for example `openai`.                                           |
| Model selector     | Effect for a model handle from an ID, for example `provider('gpt-5-mini')`.                              |
| Capability methods | Named selectors for the operations the pinned provider supports, for example `embeddingModel` on OpenAI. |
| Provider tools     | Effect operations that return provider tool descriptors where available.                                 |
| Workflow hooks     | `WORKFLOW_SERIALIZE` and `WORKFLOW_DESERIALIZE` return Effects on constructors that expose them.         |

`amazon-bedrock/anthropic`, `amazon-bedrock/mantle`, and the Google Vertex
subpaths have distinct import routes. Vertex's `edge` paths select the
corresponding SDK edge entry. The full list and the upstream package names
are in [Import paths](import-paths.md).

The settings type for each factory defines its options, such as credentials,
endpoint, headers, and fetch. The [SDK surface inventory](../../sdk-surface.json)
lists the exports of each pinned provider. See
[How to choose a provider and model](../how-to/choose-a-provider.md) for an
application example.
