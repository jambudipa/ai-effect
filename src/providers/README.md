# Provider adapters

These modules expose the native provider factories and model selectors as lazy Effects. Each adapter retains the SDK's model IDs, options, and supported capabilities. A provider subpath loads the SDK for that provider.

Start with [Alibaba](alibaba.ts) for the standard factory pattern. `adaptProviderFactory` binds supported Effect settings to a scope, and the model wrappers in [internal](../internal/provider-adapter.ts) adapt native operations. Keep the accepting scope open for credential or header callbacks that the SDK can call later. Keep credentials and network calls lazy, and map foreign failures at the SDK boundary.
