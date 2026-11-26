# Framework adapters

These modules adapt the AI SDK's UI and React Server Components APIs. Each framework subpath keeps its native reactive state and exposes request commands as Effects.

Start with [lifetime.ts](lifetime.ts) for cancellation and cleanup, [chat.ts](chat.ts) for shared chat behavior, and [options.ts](options.ts) for schema and callback conversion. Keep native lifecycle registration in the framework that owns the view. The host callback bridge runs at the boundary and cancels pending work when its view releases.

Keep [RSC client hooks](rsc-client.ts) and [RSC server operations](rsc-server.ts) in separate entry points. The server owns action context and stream writers, and the client consumes the native React hosted values.
