# Vertex AI variants

These adapters expose the general Vertex edge provider and the Anthropic, MaaS, and xAI variants. Start with [the general Node provider](../google-vertex.ts) or [the general edge provider](edge.ts) to see how native options, model IDs, and interaction input enter the Effect boundary.

Keep each edge module bound to its corresponding SDK edge subpath. Keep Node workflow hooks with the Node entry that owns them. The specialized adapters expose the selectors supported by their own SDK variants.
