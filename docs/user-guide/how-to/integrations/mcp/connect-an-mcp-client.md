---
title: How to connect an MCP client
doc-type: how-to
sources: [src/integrations/mcp.ts, src/integrations/mcp/mcp-stdio.ts]
---

# How to connect an MCP client

> **TL;DR:** Create the client inside an Effect scope. Use an HTTP transport
> for a remote server or an stdio transport for a local process. Scope closure
> closes the client.

1. Get the URL and credential settings for the MCP server you use.
2. Open the client and list the available tools within its scope.

   ```ts
   import { createMCPClient } from '@jambudipa/ai-effect/mcp';
   import { Effect } from 'effect';

   const listTools = (url: string) =>
     Effect.scoped(
       Effect.gen(function* () {
         const client = yield* createMCPClient({
           transport: { type: 'http', url },
         });
         return yield* client.listTools();
       }),
     );
   ```

3. Keep operations that use the connection in the same scope. For example,
   obtain tool descriptors with `client.tools()` and pass them to a model
   request before the scope closes.

For a local MCP server, build a `StdioMCPTransport` from
`@jambudipa/ai-effect/mcp/mcp-stdio` and pass its handle as `transport`.
See [Integration adapters](../../../reference/integrations.md) for the MCP exports.
