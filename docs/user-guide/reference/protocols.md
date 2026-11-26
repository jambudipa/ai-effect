---
title: Provider protocols and utilities
doc-type: reference
sources: [src/protocols, docs/sdk-surface.json]
---

# Provider protocols and utilities

> **TL;DR:** The `provider` entry describes model and provider protocols. The
> `provider-utils` entries expose schema, tool, workflow, transport, and test
> operations in the wrapper's Effect form.

| Entry under `@jambudipa/ai-effect`       | Contract                                                                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `provider`                               | Provider and model types, protocol errors, and JSON value predicates.                                |
| `provider-utils`                         | Schema and tool helpers, request and response utilities, stream adapters, and workflow hook symbols. |
| `provider-utils/experimental-decision`   | Experimental decision protocol helpers.                                                              |
| `provider-utils/experimental-evaluation` | Experimental evaluation protocol helpers.                                                            |
| `provider-utils/experimental-extraction` | Experimental extraction protocol helpers.                                                            |
| `provider-utils/test`                    | Deterministic stream, iteration, and ID fixtures.                                                    |

Wrapped model operations retain the SDK input and result shapes. A model's
protocol version remains part of its contract. Functions that operate on native
streams or SDK requests return Effects or Streams as declared by the wrapper.

The public workflow symbols identify the serializer and deserializer provided
by a compatible model. Both methods return Effects. The serialized payload
follows the pinned SDK. A direct deserialization call can require SDK callbacks
that the payload does not contain, such as the model URL function.

The [SDK surface inventory](../../sdk-surface.json) lists the pinned source
exports for all six entries. See [Provider adapters](providers.md) for their
use in model selection.
