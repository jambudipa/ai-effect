import { createACP as nativeCreateACP } from '@ai-sdk/harness-acp';
import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect } from 'effect';
import { vi } from 'vitest';
import { createACP } from '../src/integrations/harness-acp.js';

vi.mock('@ai-sdk/harness-acp', { spy: true });

class Hooks extends Context.Service<Hooks, string>()(
  '@jambudipa/ai-effect/test/ACPAdapter/Hooks',
) {}

it.effect('binds synchronous ACP hooks to the harness scope', () =>
  Effect.gen(function* () {
    const toolCall = { toolCallId: 'question', title: 'lookup' };
    const interrupted = yield* Deferred.make<boolean>();
    const nativeOptions = yield* Effect.scoped(
      Effect.gen(function* () {
        const harness = yield* createACP({
          harnessId: 'local-acp',
          source: { type: 'install-command', command: 'true' },
          executable: 'local-acp',
          modelMapping: { type: 'session-model', path: 'model' },
          credentialEnv: ['API_KEY'],
          credentialBrokering: () => Effect.as(Hooks, []),
          authenticationFiles: () =>
            Effect.map(Hooks, (content) => [{ path: '/auth', content }]),
          isMcpToolCall: (tool) =>
            tool.title === 'async'
              ? Effect.callback<boolean>(() =>
                  Effect.asVoid(Deferred.succeed(interrupted, true)),
                )
              : Effect.map(Hooks, (name) => tool.title === name),
          resolveHostToolCall: () =>
            Effect.map(Hooks, (toolName) => ({ toolName, input: {} })),
          askUserQuestions: {
            requestMethod: 'local/question',
            isNativeToolCall: ({ nativeToolCall }) =>
              Effect.map(Hooks, (name) => nativeToolCall.title === name),
            // ACP uses null to leave a request unhandled.
            // eslint-disable-next-line effect/no-null-use-option
            fromNativeRequest: () => Effect.as(Hooks, null),
            toNativeResponse: () => Hooks,
            matchesNativeRequest: () => Effect.as(Hooks, true),
          },
        });
        expect(harness.builtinTools.askUserQuestions).toBeDefined();
        const [options] = vi.mocked(nativeCreateACP).mock.lastCall!;
        expect(options.isMcpToolCall(toolCall)).toBe(true);
        expect(() =>
          options.isMcpToolCall({ ...toolCall, title: 'async' }),
        ).toThrow();
        yield* Deferred.await(interrupted);
        expect(
          options.resolveHostToolCall({
            toolCall,
            serverName: 'local',
            toolNames: [],
          }),
        ).toEqual({ toolName: 'lookup', input: {} });
        expect(options.credentialBrokering?.({ env: {} })).toEqual([]);
        expect(
          options.authenticationFiles?.({
            env: {},
            sandboxEnv: {},
            credentialBrokeringAvailable: true,
          }),
        ).toEqual([{ path: '/auth', content: 'lookup' }]);
        const questions = options.askUserQuestions!;
        expect(questions.isNativeToolCall?.({ nativeToolCall: toolCall })).toBe(
          true,
        );
        expect(questions.fromNativeRequest({ nativeRequest: {} })).toBeNull();
        expect(
          questions.matchesNativeRequest?.({
            previousNativeRequest: {},
            nativeRequest: {},
          }),
        ).toBe(true);
        expect(
          questions.toNativeResponse({
            nativeRequest: {},
            toolResult: {
              type: 'tool-result',
              toolCallId: 'question',
              toolName: 'askUserQuestions',
              output: { type: 'text', value: 'answer' },
            },
          }),
        ).toBe('lookup');
        return options;
      }).pipe(Effect.provideService(Hooks, 'lookup')),
    );
    expect(() => nativeOptions.isMcpToolCall(toolCall)).toThrow();
  }),
);
