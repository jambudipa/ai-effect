---
title: Integration APIs
doc-type: index
---

# Integration APIs

Look up the contracts for tools, agents, telemetry, and external hosts. Follow the subfolders for the MCP transport, harness APIs, test fixtures, and Workflow.

## Folders

- [Harness support APIs](harness/README.md). Agent, bridge, and utility subpaths.
- [MCP transports](mcp/README.md). Standard I/O transport.
- [Test server bindings](test-server/README.md). Vitest bindings.
- [Workflow client and video APIs](workflow/README.md). Chat client and durable video.

## Entries

- [`@jambudipa/ai-effect/code-mode`](code-mode.md). Exports include `ApprovalDecision`, `CodeModeAbortedError`, `CodeModeApprovalInterrupt`.
- [`@jambudipa/ai-effect/devtools`](devtools.md). Exports include `devToolsMiddleware`, `DevToolsTelemetry`, `DevToolsTelemetryOptions`.
- [`@jambudipa/ai-effect/durable-agent`](durable-agent.md). Exports include `CompatibleLanguageModel`, `DownloadFunction`, `DurableAgent`.
- [`@jambudipa/ai-effect/harness-acp`](harness-acp.md). Exports include `ACPAnnotations`, `ACPAskUserQuestionsSettings`, `ACPAudioContent`.
- [`@jambudipa/ai-effect/harness-claude-code`](harness-claude-code.md). Exports include `claudeCode`, `ClaudeCodeAuthenticationMode`, `ClaudeCodeHarnessSettings`.
- [`@jambudipa/ai-effect/harness-cline`](harness-cline.md). Exports include `cline`, `ClineAuthenticationMode`, `ClineHarnessSettings`.
- [`@jambudipa/ai-effect/harness-codex`](harness-codex.md). Exports include `codex`, `CodexAuthenticationMode`, `CodexHarnessSettings`.
- [`@jambudipa/ai-effect/harness-cursor`](harness-cursor.md). Exports include `createCursor`, `cursor`, `CursorAuthenticationMode`.
- [`@jambudipa/ai-effect/harness-deepagents`](harness-deepagents.md). Exports include `createDeepAgents`, `deepAgents`, `DeepAgentsAuthenticationMode`.
- [`@jambudipa/ai-effect/harness-fx`](harness-fx.md). Exports include `createFx`, `fx`, `FxAuthenticationMode`.
- [`@jambudipa/ai-effect/harness-github-copilot`](harness-github-copilot.md). Exports include `createGitHubCopilot`, `githubCopilot`, `GitHubCopilotAuthenticationMode`.
- [`@jambudipa/ai-effect/harness-grok-build`](harness-grok-build.md). Exports include `createGrokBuild`, `grokBuild`, `GrokBuildAuthenticationMode`.
- [`@jambudipa/ai-effect/harness-opencode`](harness-opencode.md). Exports include `createOpenCode`, `JSONObject`, `openCode`.
- [`@jambudipa/ai-effect/harness-pi`](harness-pi.md). Exports include `createPi`, `pi`, `PiAuthenticationMode`.
- [`@jambudipa/ai-effect/harness`](harness.md). Exports include `commonTool`, `experimental_harnessV1BridgeUserMessageInboundSchema`, `Experimental_HarnessV1BridgeUserMessageResponse`.
- [`@jambudipa/ai-effect/langchain`](langchain.md). Exports include `convertModelMessages`, `LangSmithDeploymentTransport`, `LangSmithDeploymentTransportOptions`.
- [`@jambudipa/ai-effect/llamaindex`](llamaindex.md). Exports include `EngineResponse`, `StreamCallbacks`, `toUIMessageStream`.
- [`@jambudipa/ai-effect/mcp`](mcp.md). Exports include `auth`, `AuthorizationServerMismatchError`, `CallToolResult`.
- [`@jambudipa/ai-effect/otel`](otel.md). Exports include `EnrichSpan`, `formatInputMessages`, `formatModelMessages`.
- [`@jambudipa/ai-effect/policy-opa`](policy-opa.md). Exports include `DefaultOpaCapabilityInput`, `DefaultOpaInput`, `httpPolicyClient`.
- [`@jambudipa/ai-effect/sandbox-just-bash`](sandbox-just-bash.md). Exports include `createJustBashNetworkSandboxSession`, `createJustBashNetworkSandboxSessionFromNativeSandbox`, `createJustBashSandbox`.
- [`@jambudipa/ai-effect/sandbox-vercel`](sandbox-vercel.md). Exports include `createVercelNetworkSandboxSession`, `createVercelNetworkSandboxSessionFromNativeSandbox`, `createVercelSandbox`.
- [`@jambudipa/ai-effect/swarm`](swarm.md). Exports include `Agent`, `AgentFunctionTool`, `AgentHandoverTool`.
- [`@jambudipa/ai-effect/test-server`](test-server.md). Exports include `createTestServer`, `TestResponseController`, `UrlHandler`.
- [`@jambudipa/ai-effect/tool-bash`](tool-bash.md). Exports include `experimental_createBashTool`.
- [`@jambudipa/ai-effect/tool-web-fetch`](tool-web-fetch.md). Exports include `experimental_createWebFetchTool`.
- [`@jambudipa/ai-effect/tools`](tools.md). Public exports and conditions.
- [`@jambudipa/ai-effect/tui`](tui.md). Exports include `AgentTUIAgent`, `ResponseStatisticsMode`, `runAgentTUI`.
- [`@jambudipa/ai-effect/typesafe-ai`](typesafe-ai.md). Exports include `createTypeSafeAi`, `Experimental_TypeSafeAiDecisionModelId`, `Experimental_TypeSafeAiEvaluationModelId`.
- [`@jambudipa/ai-effect/ui-utils/test`](ui-utils-test.md). Exports include `mockFetchDataStream`, `mockFetchDataStreamWithGenerator`, `mockFetchError`.
- [`@jambudipa/ai-effect/ui-utils`](ui-utils.md). Exports include `asSchema`, `AssistantMessage`, `AssistantStatus`.
- [`@jambudipa/ai-effect/valibot`](valibot.md). Exports include `valibotSchema`.
- [`@jambudipa/ai-effect/workflow-harness`](workflow-harness.md). Exports include `createHarnessWorkflowState`, `finalizeHarnessWorkflow`, `HarnessWorkflowAgent`.
- [`@jambudipa/ai-effect/workflow`](workflow.md). Exports include `CompatibleLanguageModel`, `createModelCallToUIChunkTransform`, `DownloadFunction`.
