# Integration adapters

These modules adapt SDK handles, callbacks, and streams for the integrations in the parent folder. Start with [operation ownership](operation.ts) for foreign calls and [stream adapters](stream.ts) for resource lifetimes. The public integration modules hold each SDK's entry points.

Keep foreign Promise and callback handling inside the adapter. Use the shared operation owner for callback scope and cancellation. Register and unwrap SDK handles at the boundary so native identity survives the round trip.

The pinned [Durable Agent](durable-agent-types.ts) and [Swarm](swarm-types.ts) contracts keep event and message types aligned with integrations that use older SDKs. The generated MCP, Code Mode, and harness declarations have separate provenance comments and generator or drift checks. Keep their contents aligned with the pinned SDK sources.
