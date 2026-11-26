import { expect, it } from '@effect/vitest';
import { Sandbox } from '@vercel/sandbox';
import { Effect } from 'effect';
import { vi } from 'vitest';
import { VercelSandboxProvider } from '../src/integrations/sandbox-vercel.js';

it.effect(
  'resumes a Vercel sandbox by session id and stops it on scope exit',
  () =>
    Effect.gen(function* () {
      const stop = vi.fn();
      const native = {
        name: 'fixture-sandbox',
        routes: [],
        currentSession: () => ({ cwd: '/fixture' }),
        stop,
      } as unknown as Sandbox;
      const lookup = yield* Effect.acquireRelease(
        Effect.sync(() => vi.spyOn(Sandbox, 'get').mockResolvedValue(native)),
        (spy) =>
          Effect.sync(() => {
            spy.mockRestore();
          }),
      );
      const provider = yield* VercelSandboxProvider.make({
        teamId: 'team_fixture',
        projectId: 'project_fixture',
        token: 'fixture-token',
      });
      const sandbox = yield* Effect.scoped(
        provider.resumeSession({ sessionId: 'local' }),
      );
      expect(sandbox.id).toBe('fixture-sandbox');
      expect(lookup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'ai-sdk-harness-session-local',
          signal: expect.any(AbortSignal),
        }),
      );
      expect(stop).toHaveBeenCalledTimes(1);
    }),
);
