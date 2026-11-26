# Amazon Bedrock variants

This folder contains the adapters for Bedrock's Anthropic and Mantle SDK subpaths. Start with [Anthropic](anthropic.ts) for model and tool selectors or [Mantle](mantle.ts) for its language model factory. [The parent adapter](../amazon-bedrock.ts) serves the standard Bedrock provider.

Preserve the credential resolver settings of each SDK subpath. Keep Mantle compatible with both package entry conditions, since its export supports ESM import and CommonJS require.
