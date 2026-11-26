# Workflow client and video

Use [`client.ts`](client.ts) for the chat client transport and [`video.ts`](video.ts) for durable video generation in a Workflow host. The parent [Workflow module](../workflow.ts) owns the agent and UI stream adapters.

Keep client callbacks in the transport's Effect scope. Forward video configuration to the native Workflow SDK after resolving the caller's string model ID or wrapped provider model.
