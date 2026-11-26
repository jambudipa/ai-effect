import { jsonSchema, tool } from '@ai-sdk/provider-utils';
import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect, Option } from 'effect';
import { wrapTools } from '../src/integrations/internal/sdk-tool.js';
import {
  opaPolicy,
  optionalOpaPolicy,
  type PolicyClient,
  type PolicyDecisionEvent,
  shadow,
  wrapMcpTools,
} from '../src/integrations/policy-opa.js';

class Decision extends Context.Service<Decision, string>()(
  '@jambudipa/ai-effect/test/PolicyOpa/Decision',
) {}

const client: PolicyClient<Decision, never> = {
  evaluate: <_Input, Output>() =>
    Effect.map(Decision, (decision) => ({ decision }) as Output),
};

const tools = wrapTools('PolicyOpa.fixture', {
  local: tool({ inputSchema: jsonSchema({ type: 'object' }) }),
});

const input = (id: string) => ({
  toolCall: {
    type: 'tool-call' as const,
    toolName: 'local',
    toolCallId: id,
    input: {},
  },
  tools,
  toolsContext: {},
  runtimeContext: { local: true },
  messages: [],
});

it.effect(
  'evaluates the original OPA approval input through either callable path',
  () =>
    Effect.gen(function* () {
      const captured = yield* Deferred.make<PolicyDecisionEvent>();
      const decision = yield* opaPolicy({ client, path: 'fixture/decision' });
      expect(decision.evaluate).toBe(decision);
      expect(yield* decision(input('callable'))).toEqual({ type: 'denied' });
      expect(yield* decision.evaluate(input('alias'))).toEqual({
        type: 'denied',
      });

      const optional = yield* optionalOpaPolicy({
        client,
        path: 'fixture/decision',
      });
      const present = Option.getOrThrow(optional);
      expect(yield* present(input('present'))).toEqual({ type: 'denied' });
      expect(yield* optionalOpaPolicy({ path: 'fixture/decision' })).toEqual(
        Option.none(),
      );

      const observed = yield* shadow(decision, {
        onDecision: (event) =>
          Deferred.succeed(captured, event).pipe(Effect.asVoid),
      });
      expect(yield* observed(input('shadow'))).toEqual({ type: 'approved' });
      expect(yield* Deferred.await(captured)).toMatchObject({
        toolCall: { toolCallId: 'shadow' },
        decision: { type: 'denied' },
        enforced: false,
      });
    }).pipe(Effect.provideService(Decision, 'deny')),
);

it.effect(
  'applies the pinned MCP fallback through the callable toolApproval',
  () =>
    Effect.gen(function* () {
      const decision = yield* opaPolicy({ client, path: 'fixture/decision' });
      const wrapped = yield* wrapMcpTools(tools, decision, {
        default: 'denied',
      });
      expect(wrapped.tools).toBe(tools);
      expect(wrapped.toolApproval.evaluate).toBe(wrapped.toolApproval);
      expect(yield* wrapped.toolApproval(input('fallback'))).toBe('denied');
    }).pipe(Effect.provideService(Decision, 'not-applicable')),
);
