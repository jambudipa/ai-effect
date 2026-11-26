# Vertex MaaS edge adapter

[The edge entry](edge.ts) adapts the Vertex MaaS SDK edge subpath as an OpenAI-compatible provider. [The Node entry](../maas.ts) shares the model selector adapter and uses the Node SDK subpath.

Keep model IDs tied to the native MaaS type. The factory supports an Effect-based header resolver, so keep its scope open during requests.
