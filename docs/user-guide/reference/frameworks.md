---
title: Framework adapters
doc-type: reference
sources: [src/frameworks, package.json, docs/sdk-surface.json]
---

# Framework adapters

> **TL;DR:** Framework entries expose host-specific state and UI components.
> The wrapper adapts asynchronous UI commands to Effects and keeps the host's
> state model.

| Entry under `@jambudipa/ai-effect` | Public features                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `angular`                          | `Chat`, `Completion`, and `StructuredObject` signal adapters.                                                  |
| `react`                            | `Chat`, `useChat`, `useCompletion`, `useObject`, experimental realtime, and MCP app rendering.                 |
| `solid`                            | Chat, completion, assistant, and experimental structured-data hooks.                                           |
| `svelte`                           | `Chat`, `Completion`, `StructuredObject`, and `createAIContext` under the `svelte` condition.                  |
| `vue`                              | `Chat` and chat, completion, and structured-data composables.                                                  |
| `rsc`                              | Client-side state hooks and stream readers, with a `react-server` route for server stream and state factories. |

The RSC server route exports `createAI`, `createStreamableUI`,
`createStreamableValue`, `getAIState`, `getMutableAIState`, and `streamUI`.
The default route exports `readStreamableValue`, `useAIState`, `useActions`,
`useStreamableValue`, `useSyncUIState`, and `useUIState`.

State such as messages and status follows the host API. A command such as
React's `sendMessage` returns an Effect. Its lifetime belongs to the host
binding. Exact peer ranges are in [Installation and compatibility](installation.md).
See [How to render a React chat](../how-to/frameworks/render-a-react-chat.md) for a client
component.
