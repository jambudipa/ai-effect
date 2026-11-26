# Vertex Anthropic edge adapter

[The edge entry](edge.ts) wraps Anthropic selectors from the Vertex SDK edge subpath. [The Node entry](../anthropic.ts) exposes the same provider family for Node consumers.

Preserve the SDK signatures for token generation and header settings. Keep any Effect-based resolver within the provider's scope until its requests finish.
