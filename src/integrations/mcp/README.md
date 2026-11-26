# MCP standard I/O transport

[`mcp-stdio.ts`](mcp-stdio.ts) makes a child process available to an MCP client through standard input and output. Construction returns an Effect. The child starts only when the caller runs `start` in a scope.

Keep process lifecycle and JSON-RPC transport concerns here. The parent [MCP module](../mcp.ts) owns client operations. The [transport registration](../internal/mcp-stdio.ts) installs native event handlers and manages listener delivery.
