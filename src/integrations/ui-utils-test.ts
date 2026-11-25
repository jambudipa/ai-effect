import { Effect } from 'effect';
import { runRequest, runSync } from '../internal/operation.js';

type SDK = typeof import('@ai-sdk/ui-utils/test');
const load = runRequest(
  'legacy.loadTestUtilities',
  {},
  () => import('@ai-sdk/ui-utils/test'),
);

export const mockFetchTextStream = (
  ...args: Parameters<SDK['mockFetchTextStream']>
) =>
  load.pipe(
    Effect.flatMap((sdk) =>
      runSync('legacy.mockFetchTextStream', () =>
        sdk.mockFetchTextStream(...args),
      ),
    ),
  );

export const mockFetchDataStream = (
  ...args: Parameters<SDK['mockFetchDataStream']>
) =>
  load.pipe(
    Effect.flatMap((sdk) =>
      runSync('legacy.mockFetchDataStream', () =>
        sdk.mockFetchDataStream(...args),
      ),
    ),
    Effect.map(({ requestBody }) => ({
      requestBody: runRequest(
        'legacy.mockFetchDataStream.requestBody',
        {},
        () => requestBody,
      ),
    })),
  );

export const mockFetchDataStreamWithGenerator = (
  ...args: Parameters<SDK['mockFetchDataStreamWithGenerator']>
) =>
  load.pipe(
    Effect.flatMap((sdk) =>
      runSync('legacy.mockFetchDataStreamWithGenerator', () =>
        sdk.mockFetchDataStreamWithGenerator(...args),
      ),
    ),
    Effect.map(({ requestBody }) => ({
      requestBody: runRequest(
        'legacy.mockFetchDataStreamWithGenerator.requestBody',
        {},
        () => requestBody,
      ),
    })),
  );

export const mockFetchError = (...args: Parameters<SDK['mockFetchError']>) =>
  load.pipe(
    Effect.flatMap((sdk) =>
      runSync('legacy.mockFetchError', () => sdk.mockFetchError(...args)),
    ),
  );
