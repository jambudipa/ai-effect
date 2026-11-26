import * as sdk from '@ai-sdk/tui';
import type { ModelMessage, TextStreamPart, ToolSet } from 'ai';
import { Effect, type Scope, Stream } from 'effect';
import {
  type ChatTransport,
  unwrapChatTransport,
} from '../internal/chat-transport.js';
import { openOperation, runRequest, sdkError } from '../internal/operation.js';
import {
  bindTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import { type SandboxSession, unwrapSandbox } from './internal/sandbox.js';

export type {
  ResponseStatisticsMode,
  TerminalPartDisplayMode,
} from '@ai-sdk/tui';

/** Input supplied to a terminal-host agent during native stream execution. */
interface AgentCall {
  /** Current conversation history forwarded to the agent for this call. */
  readonly prompt: ModelMessage[];
  /** Cancellation signal supplied by the terminal host for the active call. */
  readonly abortSignal?: AbortSignal;
  /** Wrapped sandbox supplied only when the terminal host has one configured. */
  readonly experimental_sandbox?: SandboxSession;
}

/** Minimal Effect agent contract accepted by the native terminal host adapter. */
export interface AgentTUIAgent<
  T extends EffectTools = {},
  E = never,
  R = never,
> {
  /** Tool set exposed to the terminal host after binding its execution services. */
  readonly tools: T;
  /** Produce a scoped stream of model events for the terminal host to render. */
  readonly stream: (
    input: AgentCall,
  ) => Effect.Effect<
    { readonly fullStream: Stream.Stream<TextStreamPart<ToolSet>, E, R> },
    E,
    R | Scope.Scope
  >;
}

/** Preserve terminal rendering options and adapt only the agent, transport, and sandbox handles. */
type NativeOptions = Omit<
  sdk.RunAgentTUIOptions,
  'agent' | 'transport' | 'sandbox'
>;

/** Select either a streaming Effect agent and optional sandbox or a registered chat transport. */
export type RunAgentTUIOptions<
  T extends EffectTools = {},
  E = never,
  R = never,
> = NativeOptions &
  (
    | {
        readonly transport: ChatTransport;
        readonly agent?: never;
        readonly sandbox?: never;
      }
    | {
        readonly agent: AgentTUIAgent<T, E, R>;
        readonly sandbox?: SandboxSession;
        readonly transport?: never;
      }
  );

/** Start the native terminal host with an Effect agent or transport. */
export const runAgentTUI = <T extends EffectTools = {}, E = never, R = never>(
  options: RunAgentTUIOptions<T, E, R>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'TUI.runAgentTUI';
      const { agent, transport, sandbox, ...settings } = options;
      if (transport) {
        const native = unwrapChatTransport(transport);
        if (!native) {
          return yield* Effect.fail(
            sdkError(operation, 'Invalid chat transport'),
          );
        }
        return yield* runRequest(operation, {}, () =>
          sdk.runAgentTUI({ ...settings, transport: native }),
        );
      }
      const owner = yield* openOperation<R | ToolServices<T> | Scope.Scope>();
      const nativeSandbox = sandbox && unwrapSandbox(sandbox);
      if (sandbox && !nativeSandbox) {
        return yield* Effect.fail(
          sdkError(operation, 'Invalid sandbox session'),
        );
      }
      type NativeAgent = sdk.AgentTUIAgent;
      type NativeCall = Parameters<NativeAgent['stream']>[0];
      // The pinned terminal runner reads only tools and stream.fullStream.
      const bridge = {
        tools: bindTools(agent.tools, owner),
        stream: ({ prompt, abortSignal }: NativeCall) =>
          owner.runCallback(
            Effect.gen(function* () {
              const result = yield* agent.stream({
                prompt: prompt as ModelMessage[],
                ...(abortSignal && { abortSignal }),
                ...(sandbox && { experimental_sandbox: sandbox }),
              });
              return {
                fullStream: yield* Stream.toReadableStreamEffect(
                  result.fullStream,
                ),
              };
            }),
            abortSignal,
          ),
      } as unknown as NativeAgent;
      return yield* runRequest(operation, { abortSignal: owner.signal }, () =>
        sdk.runAgentTUI({
          ...settings,
          agent: bridge,
          ...(nativeSandbox && { sandbox: nativeSandbox }),
        }),
      );
    }),
  );
