import { combineSignals } from './operation.js';

/** Guard both fetch acquisition and reads when a custom fetch ignores abort. */
export const guardedFetch =
  (
    lifetime: AbortSignal,
    fetcher?: typeof globalThis.fetch,
  ): typeof globalThis.fetch =>
  (input, init) => {
    const signal = combineSignals(lifetime, init?.signal ?? undefined);
    return (fetcher ?? globalThis.fetch)(input, { ...init, signal }).then(
      (response) => {
        if (signal.aborted) {
          void response.body?.cancel().catch(() => {});
          signal.throwIfAborted();
        }
        if (!response.body) return response;
        const body = response.body.pipeThrough(new TransformStream(), {
          signal,
        });
        const guarded = new Response(body, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
        Object.defineProperties(guarded, {
          url: { value: response.url },
          redirected: { value: response.redirected },
          type: { value: response.type },
        });
        return guarded;
      },
    );
  };
