# SDK integrations

These entry points adapt optional AI SDK packages to Effect. Start with [`mcp.ts`](mcp.ts) for MCP, [`harness.ts`](harness.ts) for harness contracts, or [`workflow.ts`](workflow.ts) for durable Workflow agents. Import the specific integration subpath from application code. The core entry point remains independent of these optional hosts.

Keep native constructors, promise calls, and stream conversion inside the integration boundary. Preserve native options and output types, map foreign failures to `AiSdkError`, and forward cancellation to the native operation. Give acquired clients, sessions, and streams a scope that owns cleanup.

Use the [internal adapters](internal/README.md) for shared conversion and resource handling. Keep each host's public contracts in its integration entry point. The legacy adapters keep their pinned protocol types distinct from the current core SDK types.
