---
title: How to read a resource from an MCP server
doc-type: how-to
sources: [src/integrations/mcp.ts, src/integrations/internal/mcp-contract.ts]
---

# How to read a resource from an MCP server

> **TL;DR:** Open a client against a server that exposes resources. Read a known
> URI and return its text parts while the connection is open.

Set `url` to the HTTP endpoint for the MCP server. Pass the URI that the
server assigns to the resource. For an authenticated server, configure the
transport with the credentials appropriate for that server.

```ts
import { createMCPClient } from '@jambudipa/ai-effect/mcp';
import { Effect } from 'effect';

export const readTextResource = (url: string, uri: string) =>
  Effect.scoped(
    Effect.gen(function* () {
      const client = yield* createMCPClient({
        transport: { type: 'http', url },
      });
      const result = yield* client.readResource({ uri });

      return result.contents.flatMap((part) =>
        'text' in part ? [part.text] : [],
      );
    }),
  );
```

If the URI is unknown, call `client.listResources()` and choose an item.
When the result has a `nextCursor`, call
`client.listResources({ params: { cursor: nextCursor } })` for the next page.
For binary resources, handle the `blob` field as base64 instead of collecting
text parts.

See the [MCP client reference](../../../reference/api/integrations/mcp.md).
