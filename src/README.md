# Package source

The package root and `@jambudipa/ai-effect/ai` expose the core model operations. Start with
[`index.ts`](index.ts) for the package root and [`core.ts`](core.ts) for the core API. Use
[`AiSdk.ts`](AiSdk.ts) when an application needs to replace the built-in model operations with an
Effect layer.

Keep SDK calls lazy. Bind native callbacks and model handles at the bridge under
[`internal/`](internal/). Keep provider, protocol, framework, and integration entry points in
their own folders so a core import does not require optional SDK packages.
