---
title: How to attach a local schema to an MCP tool
doc-type: how-to
sources:
  [
    src/integrations/mcp.ts,
    src/integrations/internal/mcp-contract.ts,
    test/IntegrationAdapters.test.ts,
  ]
---

# How to attach a local schema to an MCP tool

> **TL;DR:** Select a named tool with an Effect schema. The returned descriptor
> exposes schema validation and an Effect-based tool executor.

Use this recipe when an MCP tool takes an input that your application already
models. This example assumes the server lists a tool called `check_stock`
that accepts a string `sku`.

```ts
import { createMCPClient } from '@jambudipa/ai-effect/mcp';
import { Effect, Schema } from 'effect';

const inputSchema = Schema.Struct({ sku: Schema.String });

export const checkStock = (url: string, sku: string) =>
  Effect.scoped(
    Effect.gen(function* () {
      const client = yield* createMCPClient({
        transport: { type: 'http', url },
      });
      const tools = yield* client.tools({
        schemas: { check_stock: { inputSchema } },
      });
      const input = yield* tools.check_stock.inputSchema.validate({ sku });
      return yield* tools.check_stock.execute(input, {
        toolCallId: 'stock-lookup',
        messages: [],
        context: {},
      });
    }),
  );
```

Check the result's `isError` flag before using the lookup's content. If a
model should choose the tool and
supply its inputs, pass the descriptors to `generateText` while the client
is still in scope. Use `toolsFromDefinitions` when the application already
has the list result and can reuse it within that session.

See the [MCP client reference](../../../reference/api/integrations/mcp.md).
