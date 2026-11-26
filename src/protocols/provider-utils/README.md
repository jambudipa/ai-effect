# Provider utility subpaths

These modules adapt the SDK's experimental decision, evaluation, and extraction model constructors and expose utilities for provider tests. Start with [experimental-decision.ts](experimental-decision.ts) for the wrapper pattern and [test.ts](test.ts) for stream fixtures.

Keep the SDK's native workflow symbols on the model constructors. Test utilities normalize reads to Effect streams and release native readers with their scopes.
