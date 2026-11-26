# Provider protocols

This folder exposes the Effect versions of the low-level provider and provider-utils SDK subpaths. Start with [provider.ts](provider.ts) for the model contracts and versioned selectors. Use [provider-utils-operations.ts](provider-utils-operations.ts) for the request, response, schema, tool, and stream bridges.

Keep the native payloads and protocol versions at the boundary. Adapt failures into `AiSdkError` and let the operation scope own readers and callback resources. The generated plain exports are in `provider-utils-simple.ts` and the SDK data inventory. Keep them in sync with their generators.
