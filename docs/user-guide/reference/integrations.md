---
title: Integration adapters
doc-type: reference
sources: [src/integrations, package.json, docs/sdk-surface.json]
---

# Integration adapters

> **TL;DR:** Integration subpaths expose the pinned SDK's MCP, agent, workflow,
> telemetry, validation, and host APIs. The wrapper adapts operations but keeps
> protocol data and host requirements from those packages.

| Group                    | Entry paths under `@jambudipa/ai-effect`                                                      | Public features                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| MCP                      | `mcp`, `mcp/mcp-stdio`                                                                        | Scoped client creation, tool and resource operations, app metadata, HTTP and stdio transport, and event support.     |
| Harnesses                | `harness`, `harness/agent`, `harness/bridge`, `harness/utils`, `harness-*`                    | Harness descriptors, agent sessions, bridge schemas, host adapters, and supporting operations.                       |
| Agent workflows          | `durable-agent`, `swarm`, `workflow`, `workflow/client`, `workflow/video`, `workflow-harness` | Workflow agent and transport, session orchestration, and workflow operations.                                        |
| Tools and sandboxes      | `code-mode`, `tool-bash`, `tool-web-fetch`, `sandbox-just-bash`, `sandbox-vercel`, `tools`    | Tool factories and Effect-managed SDK sandbox interfaces. `tools` has an empty public runtime namespace for the pin. |
| Interoperability         | `langchain`, `llamaindex`, `valibot`, `typesafe-ai`                                           | Adapter entries for alternate runtimes, schemas, and typed providers.                                                |
| Observability and policy | `otel`, `devtools`, `policy-opa`                                                              | OpenTelemetry, SDK middleware, and capability policy adapters.                                                       |
| UI, tests, and terminal  | `ui-utils`, `ui-utils/test`, `test-server`, `test-server/with-vitest`, `tui`                  | Legacy UI stream utilities, fixture servers, and terminal adapters.                                                  |

`createMCPClient` returns an Effect that requires a scope. The acquired client
exposes Effects such as `listTools`, `tools`, `callTool`, and `readResource`.
The configuration determines whether it exposes managed MCP events. See
[How to connect an MCP client](../how-to/connect-an-mcp-client.md).

The pinned `DurableAgent` supports execution through `stream()`. Its
`generate()` method fails with `AiSdkError` because the SDK leaves that method
unimplemented.

The [import paths](import-paths.md) list every harness host. The
[SDK surface inventory](../../sdk-surface.json) records names and condition
targets for each integration. Compatibility information for the Pi host is in
[Installation and compatibility](installation.md).
