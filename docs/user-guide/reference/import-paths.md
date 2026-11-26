---
title: Import paths
doc-type: reference
sources: [package.json, docs/sdk-surface.json, scripts/sync-sdk-exports.mjs]
---

# Import paths

> **TL;DR:** The package exports 117 pinned SDK paths, plus its root service and
> package metadata. This list shows the runtime conditions for each path.

The [SDK surface inventory](../../sdk-surface.json) records upstream runtime and
type names for each resolver context. The wrapper manifest selects the corresponding
runtime and declaration files. The `inception` and `tools` paths have an empty
runtime namespace in the pinned surface.

A package with no public npm import entry has no wrapper subpath. The inventory
records the CLI-only `@ai-sdk/codemod` and the no-entry `@ai-sdk/spacexai` and
`@ai-sdk/specification` packages.

### Core and package metadata

See the [API contracts](core.md).

| Wrapper import                      | Pinned SDK entry | Runtime       |
| ----------------------------------- | ---------------- | ------------- |
| `@jambudipa/ai-effect`              | Package entry    | ESM           |
| `@jambudipa/ai-effect/ai`           | `ai`             | ESM           |
| `@jambudipa/ai-effect/ai/test`      | `ai/test`        | ESM           |
| `@jambudipa/ai-effect/package.json` | Package entry    | JSON metadata |

### Model providers

See the [API contracts](providers.md).

| Wrapper import                                      | Pinned SDK entry                       | Runtime          |
| --------------------------------------------------- | -------------------------------------- | ---------------- |
| `@jambudipa/ai-effect/alibaba`                      | `@ai-sdk/alibaba`                      | ESM              |
| `@jambudipa/ai-effect/amazon-bedrock`               | `@ai-sdk/amazon-bedrock`               | ESM              |
| `@jambudipa/ai-effect/amazon-bedrock/anthropic`     | `@ai-sdk/amazon-bedrock/anthropic`     | ESM              |
| `@jambudipa/ai-effect/amazon-bedrock/mantle`        | `@ai-sdk/amazon-bedrock/mantle`        | ESM and CommonJS |
| `@jambudipa/ai-effect/anthropic`                    | `@ai-sdk/anthropic`                    | ESM              |
| `@jambudipa/ai-effect/anthropic-aws`                | `@ai-sdk/anthropic-aws`                | ESM              |
| `@jambudipa/ai-effect/assemblyai`                   | `@ai-sdk/assemblyai`                   | ESM              |
| `@jambudipa/ai-effect/azure`                        | `@ai-sdk/azure`                        | ESM              |
| `@jambudipa/ai-effect/baseten`                      | `@ai-sdk/baseten`                      | ESM              |
| `@jambudipa/ai-effect/black-forest-labs`            | `@ai-sdk/black-forest-labs`            | ESM              |
| `@jambudipa/ai-effect/bytedance`                    | `@ai-sdk/bytedance`                    | ESM              |
| `@jambudipa/ai-effect/cartesia`                     | `@ai-sdk/cartesia`                     | ESM              |
| `@jambudipa/ai-effect/cerebras`                     | `@ai-sdk/cerebras`                     | ESM              |
| `@jambudipa/ai-effect/cohere`                       | `@ai-sdk/cohere`                       | ESM              |
| `@jambudipa/ai-effect/deepgram`                     | `@ai-sdk/deepgram`                     | ESM              |
| `@jambudipa/ai-effect/deepinfra`                    | `@ai-sdk/deepinfra`                    | ESM              |
| `@jambudipa/ai-effect/deepseek`                     | `@ai-sdk/deepseek`                     | ESM              |
| `@jambudipa/ai-effect/elevenlabs`                   | `@ai-sdk/elevenlabs`                   | ESM              |
| `@jambudipa/ai-effect/fal`                          | `@ai-sdk/fal`                          | ESM              |
| `@jambudipa/ai-effect/fireworks`                    | `@ai-sdk/fireworks`                    | ESM              |
| `@jambudipa/ai-effect/fish-audio`                   | `@ai-sdk/fish-audio`                   | ESM              |
| `@jambudipa/ai-effect/gateway`                      | `@ai-sdk/gateway`                      | ESM              |
| `@jambudipa/ai-effect/gladia`                       | `@ai-sdk/gladia`                       | ESM              |
| `@jambudipa/ai-effect/gmicloud`                     | `@ai-sdk/gmicloud`                     | ESM              |
| `@jambudipa/ai-effect/google`                       | `@ai-sdk/google`                       | ESM              |
| `@jambudipa/ai-effect/google-vertex`                | `@ai-sdk/google-vertex`                | ESM              |
| `@jambudipa/ai-effect/google-vertex/anthropic`      | `@ai-sdk/google-vertex/anthropic`      | ESM              |
| `@jambudipa/ai-effect/google-vertex/anthropic/edge` | `@ai-sdk/google-vertex/anthropic/edge` | ESM              |
| `@jambudipa/ai-effect/google-vertex/edge`           | `@ai-sdk/google-vertex/edge`           | ESM              |
| `@jambudipa/ai-effect/google-vertex/maas`           | `@ai-sdk/google-vertex/maas`           | ESM              |
| `@jambudipa/ai-effect/google-vertex/maas/edge`      | `@ai-sdk/google-vertex/maas/edge`      | ESM              |
| `@jambudipa/ai-effect/google-vertex/xai`            | `@ai-sdk/google-vertex/xai`            | ESM              |
| `@jambudipa/ai-effect/google-vertex/xai/edge`       | `@ai-sdk/google-vertex/xai/edge`       | ESM              |
| `@jambudipa/ai-effect/groq`                         | `@ai-sdk/groq`                         | ESM              |
| `@jambudipa/ai-effect/heygen`                       | `@ai-sdk/heygen`                       | ESM              |
| `@jambudipa/ai-effect/huggingface`                  | `@ai-sdk/huggingface`                  | ESM              |
| `@jambudipa/ai-effect/hume`                         | `@ai-sdk/hume`                         | ESM              |
| `@jambudipa/ai-effect/inception`                    | `@ai-sdk/inception`                    | ESM              |
| `@jambudipa/ai-effect/klingai`                      | `@ai-sdk/klingai`                      | ESM              |
| `@jambudipa/ai-effect/liquid`                       | `@ai-sdk/liquid`                       | ESM              |
| `@jambudipa/ai-effect/lmnt`                         | `@ai-sdk/lmnt`                         | ESM              |
| `@jambudipa/ai-effect/luma`                         | `@ai-sdk/luma`                         | ESM              |
| `@jambudipa/ai-effect/minimax`                      | `@ai-sdk/minimax`                      | ESM              |
| `@jambudipa/ai-effect/mistral`                      | `@ai-sdk/mistral`                      | ESM              |
| `@jambudipa/ai-effect/moonshotai`                   | `@ai-sdk/moonshotai`                   | ESM              |
| `@jambudipa/ai-effect/open-responses`               | `@ai-sdk/open-responses`               | ESM              |
| `@jambudipa/ai-effect/openai`                       | `@ai-sdk/openai`                       | ESM              |
| `@jambudipa/ai-effect/openai-compatible`            | `@ai-sdk/openai-compatible`            | ESM              |
| `@jambudipa/ai-effect/parallel`                     | `@ai-sdk/parallel`                     | ESM              |
| `@jambudipa/ai-effect/perplexity`                   | `@ai-sdk/perplexity`                   | ESM              |
| `@jambudipa/ai-effect/prodia`                       | `@ai-sdk/prodia`                       | ESM              |
| `@jambudipa/ai-effect/quiverai`                     | `@ai-sdk/quiverai`                     | ESM              |
| `@jambudipa/ai-effect/replicate`                    | `@ai-sdk/replicate`                    | ESM              |
| `@jambudipa/ai-effect/revai`                        | `@ai-sdk/revai`                        | ESM              |
| `@jambudipa/ai-effect/scaledown`                    | `@ai-sdk/scaledown`                    | ESM              |
| `@jambudipa/ai-effect/tencent`                      | `@ai-sdk/tencent`                      | ESM              |
| `@jambudipa/ai-effect/togetherai`                   | `@ai-sdk/togetherai`                   | ESM              |
| `@jambudipa/ai-effect/topaz`                        | `@ai-sdk/topaz`                        | ESM              |
| `@jambudipa/ai-effect/vercel`                       | `@ai-sdk/vercel`                       | ESM              |
| `@jambudipa/ai-effect/voyage`                       | `@ai-sdk/voyage`                       | ESM              |
| `@jambudipa/ai-effect/xai`                          | `@ai-sdk/xai`                          | ESM              |
| `@jambudipa/ai-effect/zai`                          | `@ai-sdk/zai`                          | ESM              |

### Provider protocols

See the [API contracts](protocols.md).

| Wrapper import                                                | Pinned SDK entry                                 | Runtime |
| ------------------------------------------------------------- | ------------------------------------------------ | ------- |
| `@jambudipa/ai-effect/provider`                               | `@ai-sdk/provider`                               | ESM     |
| `@jambudipa/ai-effect/provider-utils`                         | `@ai-sdk/provider-utils`                         | ESM     |
| `@jambudipa/ai-effect/provider-utils/experimental-decision`   | `@ai-sdk/provider-utils/experimental-decision`   | ESM     |
| `@jambudipa/ai-effect/provider-utils/experimental-evaluation` | `@ai-sdk/provider-utils/experimental-evaluation` | ESM     |
| `@jambudipa/ai-effect/provider-utils/experimental-extraction` | `@ai-sdk/provider-utils/experimental-extraction` | ESM     |
| `@jambudipa/ai-effect/provider-utils/test`                    | `@ai-sdk/provider-utils/test`                    | ESM     |

### Framework hosts

See the [API contracts](frameworks.md).

| Wrapper import                 | Pinned SDK entry  | Runtime              |
| ------------------------------ | ----------------- | -------------------- |
| `@jambudipa/ai-effect/angular` | `@ai-sdk/angular` | ESM                  |
| `@jambudipa/ai-effect/react`   | `@ai-sdk/react`   | ESM                  |
| `@jambudipa/ai-effect/rsc`     | `@ai-sdk/rsc`     | ESM and React server |
| `@jambudipa/ai-effect/solid`   | `@ai-sdk/solid`   | ESM and CommonJS     |
| `@jambudipa/ai-effect/svelte`  | `@ai-sdk/svelte`  | Svelte               |
| `@jambudipa/ai-effect/vue`     | `@ai-sdk/vue`     | ESM                  |

### Integrations

See the [API contracts](integrations.md).

| Wrapper import                                 | Pinned SDK entry                  | Runtime                     |
| ---------------------------------------------- | --------------------------------- | --------------------------- |
| `@jambudipa/ai-effect/code-mode`               | `@ai-sdk/code-mode`               | ESM                         |
| `@jambudipa/ai-effect/devtools`                | `@ai-sdk/devtools`                | ESM                         |
| `@jambudipa/ai-effect/durable-agent`           | `@ai-sdk/durable-agent`           | ESM and CommonJS            |
| `@jambudipa/ai-effect/harness`                 | `@ai-sdk/harness`                 | ESM                         |
| `@jambudipa/ai-effect/harness/agent`           | `@ai-sdk/harness/agent`           | ESM                         |
| `@jambudipa/ai-effect/harness/bridge`          | `@ai-sdk/harness/bridge`          | ESM                         |
| `@jambudipa/ai-effect/harness/utils`           | `@ai-sdk/harness/utils`           | ESM                         |
| `@jambudipa/ai-effect/harness-acp`             | `@ai-sdk/harness-acp`             | ESM                         |
| `@jambudipa/ai-effect/harness-claude-code`     | `@ai-sdk/harness-claude-code`     | ESM                         |
| `@jambudipa/ai-effect/harness-cline`           | `@ai-sdk/harness-cline`           | ESM                         |
| `@jambudipa/ai-effect/harness-codex`           | `@ai-sdk/harness-codex`           | ESM                         |
| `@jambudipa/ai-effect/harness-cursor`          | `@ai-sdk/harness-cursor`          | ESM                         |
| `@jambudipa/ai-effect/harness-deepagents`      | `@ai-sdk/harness-deepagents`      | ESM                         |
| `@jambudipa/ai-effect/harness-fx`              | `@ai-sdk/harness-fx`              | ESM                         |
| `@jambudipa/ai-effect/harness-github-copilot`  | `@ai-sdk/harness-github-copilot`  | ESM                         |
| `@jambudipa/ai-effect/harness-grok-build`      | `@ai-sdk/harness-grok-build`      | ESM                         |
| `@jambudipa/ai-effect/harness-opencode`        | `@ai-sdk/harness-opencode`        | ESM                         |
| `@jambudipa/ai-effect/harness-pi`              | `@ai-sdk/harness-pi`              | ESM                         |
| `@jambudipa/ai-effect/langchain`               | `@ai-sdk/langchain`               | ESM                         |
| `@jambudipa/ai-effect/llamaindex`              | `@ai-sdk/llamaindex`              | ESM                         |
| `@jambudipa/ai-effect/mcp`                     | `@ai-sdk/mcp`                     | ESM                         |
| `@jambudipa/ai-effect/mcp/mcp-stdio`           | `@ai-sdk/mcp/mcp-stdio`           | ESM                         |
| `@jambudipa/ai-effect/otel`                    | `@ai-sdk/otel`                    | ESM                         |
| `@jambudipa/ai-effect/policy-opa`              | `@ai-sdk/policy-opa`              | ESM                         |
| `@jambudipa/ai-effect/sandbox-just-bash`       | `@ai-sdk/sandbox-just-bash`       | ESM                         |
| `@jambudipa/ai-effect/sandbox-vercel`          | `@ai-sdk/sandbox-vercel`          | ESM                         |
| `@jambudipa/ai-effect/swarm`                   | `@ai-sdk/swarm`                   | ESM and CommonJS            |
| `@jambudipa/ai-effect/test-server`             | `@ai-sdk/test-server`             | ESM                         |
| `@jambudipa/ai-effect/test-server/with-vitest` | `@ai-sdk/test-server/with-vitest` | ESM                         |
| `@jambudipa/ai-effect/tool-bash`               | `@ai-sdk/tool-bash`               | ESM                         |
| `@jambudipa/ai-effect/tool-web-fetch`          | `@ai-sdk/tool-web-fetch`          | ESM                         |
| `@jambudipa/ai-effect/tools`                   | `@ai-sdk/tools`                   | ESM                         |
| `@jambudipa/ai-effect/tui`                     | `@ai-sdk/tui`                     | ESM                         |
| `@jambudipa/ai-effect/typesafe-ai`             | `@ai-sdk/typesafe-ai`             | ESM                         |
| `@jambudipa/ai-effect/ui-utils`                | `@ai-sdk/ui-utils`                | ESM and CommonJS            |
| `@jambudipa/ai-effect/ui-utils/test`           | `@ai-sdk/ui-utils/test`           | ESM, CommonJS, and `module` |
| `@jambudipa/ai-effect/valibot`                 | `@ai-sdk/valibot`                 | ESM                         |
| `@jambudipa/ai-effect/workflow`                | `@ai-sdk/workflow`                | ESM                         |
| `@jambudipa/ai-effect/workflow/client`         | `@ai-sdk/workflow/client`         | ESM                         |
| `@jambudipa/ai-effect/workflow/video`          | `@ai-sdk/workflow/video`          | ESM                         |
| `@jambudipa/ai-effect/workflow-harness`        | `@ai-sdk/workflow-harness`        | ESM                         |
