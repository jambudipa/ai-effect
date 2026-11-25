import { createPi as nativeCreatePi } from '@ai-sdk/harness-pi';
import type {
  ExtensionAPI,
  ExtensionFactory,
} from '@earendil-works/pi-coding-agent';
import { expect, it } from '@effect/vitest';
import { Context, Effect, Ref } from 'effect';
import { expectTypeOf, vi } from 'vitest';
import {
  createPi,
  type PiHarnessExtensionFactory,
  type PiSessionStorage,
} from '../src/integrations/harness-pi.js';
import { unwrapSandbox } from '../src/integrations/internal/sandbox.js';
import { createJustBashNetworkSandboxSession } from '../src/integrations/sandbox-just-bash.js';
import { runRequest } from '../src/internal/operation.js';

vi.mock('@ai-sdk/harness-pi', { spy: true });

class Fixture extends Context.Service<Fixture, string>()(
  '@jambudipa/ai-effect/test/PiAdapter/Fixture',
) {}

it.effect(
  'binds Pi storage and extensions and preserves native extension identity',
  () =>
    Effect.gen(function* () {
      const api = {} as ExtensionAPI;
      const nativeExtension = vi.fn<ExtensionFactory>();
      const entry = {
        entryId: 'entry',
        version: 1,
        data: {
          id: 'entry',
          parentId: 'parent',
          timestamp: '',
          type: 'session_info',
        },
      } as const;
      const runExtension: PiHarnessExtensionFactory<unknown, Fixture> = (
        received,
        session,
      ) =>
        Effect.gen(function* () {
          expectTypeOf(received).toEqualTypeOf<ExtensionAPI>();
          expect(received).toBe(api);
          const value = yield* Fixture;
          expect(yield* session.instructions).toBe(value);
          yield* session.sandboxSession.writeTextFile({
            path: `${session.sessionWorkDir}/fixture.txt`,
            content: value,
          });
        });
      const entries = yield* Ref.make<readonly (typeof entry)[]>([]);
      const storage: PiSessionStorage<never, Fixture> = {
        append: ({ entry: saved }) =>
          Effect.flatMap(Fixture, (value) => {
            expect(saved).toEqual(entry);
            expect(value).toBe('local');
            return Ref.update(entries, (items) => [...items, entry]);
          }),
        appendMany: ({ entries: saved }) =>
          Effect.flatMap(Fixture, (value) => {
            expect(saved).toEqual([entry]);
            expect(value).toBe('local');
            return Ref.update(entries, (items) => [...items, entry]);
          }),
        read: () => Effect.andThen(Fixture, Ref.get(entries)),
      };
      const read = yield* Effect.scoped(
        Effect.gen(function* () {
          const sandbox = yield* createJustBashNetworkSandboxSession();
          const sandboxSession = unwrapSandbox(sandbox)!;
          yield* createPi({
            extensionFactories: [runExtension, nativeExtension],
            sessionStorage: storage,
          });
          const options = vi.mocked(nativeCreatePi).mock.lastCall?.[0];
          const nativeStorage = options?.sessionStorage!;
          yield* runRequest('PiAdapter.append', {}, () =>
            nativeStorage.append({ sessionId: 'local', entry }),
          );
          yield* runRequest('PiAdapter.appendMany', {}, () =>
            nativeStorage.appendMany!({ sessionId: 'local', entries: [entry] }),
          );
          expect(
            yield* runRequest('PiAdapter.read', {}, () =>
              nativeStorage.read({ sessionId: 'local', leafId: 'entry' }),
            ),
          ).toEqual([entry, entry]);
          for (const factory of options?.extensionFactories ?? []) {
            const started = factory(api, {
              sandboxSession,
              sessionWorkDir: '/tmp',
              instructions: () => 'local',
            });
            if (started)
              yield* runRequest('PiAdapter.extension', {}, () => started);
          }
          expect(nativeExtension.mock.calls[0]?.[0]).toBe(api);
          expect(
            yield* sandbox.readTextFile({ path: '/tmp/fixture.txt' }),
          ).toBe('local');
          return nativeStorage.read;
        }).pipe(Effect.provideService(Fixture, 'local')),
      );
      expect(
        (yield* Effect.exit(
          runRequest('PiAdapter.closedRead', {}, () =>
            read({ sessionId: 'local', leafId: 'entry' }),
          ),
        ))._tag,
      ).toBe('Failure');
    }),
);
