import { createRequire } from 'node:module';
import { Effect } from 'effect';
import { afterEach, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const path = '@jambudipa/ai-effect/ui-utils/test';

afterEach(() => vi.restoreAllMocks());

for (const [loader, load] of [
  ['CommonJS', () => require(path)],
  ['ESM', () => import(path)],
]) {
  it(`runs the legacy fetch fixture through ${loader}`, async () => {
    const { mockFetchError } = await load();
    await Effect.runPromise(
      mockFetchError({ statusCode: 418, errorMessage: 'fixture' }),
    );
    const response = await fetch('https://fixture.invalid');
    expect(response.status).toBe(418);
  });
}
