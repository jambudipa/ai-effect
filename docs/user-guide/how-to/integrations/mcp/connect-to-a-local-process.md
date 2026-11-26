---
title: How to connect to a local MCP process
doc-type: how-to
sources:
  [
    src/integrations/mcp.ts,
    src/integrations/mcp/mcp-stdio.ts,
    src/integrations/internal/mcp-stdio.ts,
  ]
---

# How to connect to a local MCP process

> **TL;DR:** Make a standard I/O transport for a local executable. Give it
> to the MCP client and complete all requests before the scope closes.

Use this recipe when you have a local MCP server that uses standard input for
requests and standard output for JSON-RPC replies. Supply the path to the Node
server entry as a command argument, with its working directory if needed.

```ts
import { createMCPClient } from '@jambudipa/ai-effect/mcp';
import { StdioMCPTransport } from '@jambudipa/ai-effect/mcp/mcp-stdio';
import { Effect } from 'effect';

export const listLocalTools = (serverPath: string) =>
  Effect.scoped(
    Effect.gen(function* () {
      const transport = yield* StdioMCPTransport.make({
        command: process.execPath,
        args: [serverPath],
        stderr: 'inherit',
      });

      const client = yield* createMCPClient({ transport });
      const { tools } = yield* client.listTools();
      return tools.map((tool) => tool.name);
    }),
  );
```

Pass the handle directly to `createMCPClient`. The client starts the process
and registers its release. Send server diagnostics to standard error so the
client can parse replies from standard output. If the instance needs
environment variables, supply them with the transport's `env` option.

See the [transport reference](../../../reference/api/integrations/mcp/mcp-stdio.md)
and the [in-process lesson](../../../tutorials/integrations/list-tools-with-a-local-mcp-fixture.md).
