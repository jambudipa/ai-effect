# Vertex xAI edge adapter

[The edge entry](edge.ts) wraps xAI language model selection on Vertex for edge runtimes. [The Node entry](../xai.ts) binds the equivalent Node SDK functions.

Keep the edge imports on the SDK edge subpath. Bind Effect-based header resolution to the provider's scope so the SDK can request the header values during calls.
