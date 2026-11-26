---
title: List tools with a local MCP fixture
doc-type: tutorial
sources: [src/integrations/mcp.ts, test/IntegrationAdapters.test.ts]
---

# List tools with a local MCP fixture

> **TL;DR:** Connect an MCP client to an in-process transport. List a tool
> called `check_stock` and verify that scope closure releases the transport.

Use Node.js 24 and the project from [Get your first text result](../getting-started/first-text-result.md).
The transport replies in the same process. You need no server URL or credentials.

1. Create `mcp-fixture.mjs`.

   ```js
   import { createMCPClient } from '@jambudipa/ai-effect/mcp';
   import { Effect, Option, Ref } from 'effect';

   const program = Effect.gen(function* () {
     const events = yield* Ref.make(Option.none());
     const closes = yield* Ref.make(0);

     const transport = {
       start: (options) => Ref.set(events, Option.some(options)),
       send: (message) =>
         Effect.gen(function* () {
           const options = yield* Ref.get(events);
           if (
             Option.isNone(options) ||
             !('method' in message && 'id' in message)
           ) {
             return;
           }

           if (message.method === 'initialize') {
             yield* options.value.onMessage({
               jsonrpc: '2.0',
               id: message.id,
               result: {
                 protocolVersion: '2025-11-25',
                 capabilities: { tools: {} },
                 serverInfo: { name: 'inventory-fixture', version: '1.0' },
               },
             });
           }

           if (message.method === 'tools/list') {
             yield* options.value.onMessage({
               jsonrpc: '2.0',
               id: message.id,
               result: {
                 tools: [
                   { name: 'check_stock', inputSchema: { type: 'object' } },
                 ],
               },
             });
           }
         }),
       close: () => Ref.update(closes, (count) => count + 1),
     };

     const toolNames = yield* Effect.scoped(
       Effect.gen(function* () {
         const client = yield* createMCPClient({ transport });
         const result = yield* client.listTools();
         return result.tools.map((tool) => tool.name);
       }),
     );

     return { toolNames, closes: yield* Ref.get(closes) };
   });

   const result = await Effect.runPromise(program);
   console.log('Tools: ' + result.toolNames.join(', '));
   console.log('Transport closes: ' + result.closes);
   ```

2. Run the program.

   ```sh
   node mcp-fixture.mjs
   ```

   ```text
   Tools: check_stock
   Transport closes: 1
   ```

3. Change `check_stock` to `find_item` in the fixture response. Run the program.
   The tool name changes and the close count stays at one.

Next, [connect to a local MCP process](../../how-to/integrations/mcp/connect-to-a-local-process.md)
or [read an MCP resource](../../how-to/integrations/mcp/read-a-resource.md).
