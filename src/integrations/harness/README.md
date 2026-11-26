# Harness agent and bridge adapters

Start with [`agent.ts`](agent.ts) for agent construction, sessions, turns, and reporters. [`bridge.ts`](bridge.ts) adapts the bridge used by a harness process. [`utils.ts`](utils.ts) contains supporting channel, sandbox, and diagnostics operations.

Keep native session and bridge handles behind the wrapper. The owning scope closes acquired resources. Use the operation owner for Effect callbacks that the SDK calls after acquisition. The [parent harness entry point](../harness.ts) exposes adapter and sandbox contracts that these modules share.
