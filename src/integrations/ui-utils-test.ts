import * as sdk from '@ai-sdk/ui-utils/test';
import { Effect } from 'effect';
import { runRequest, runSync } from '../internal/operation.js';

export const mockFetchTextStream = (
  ...args: Parameters<typeof sdk.mockFetchTextStream>
) =>
  runSync('legacy.mockFetchTextStream', () => sdk.mockFetchTextStream(...args));

export const mockFetchDataStream = (
  ...args: Parameters<typeof sdk.mockFetchDataStream>
) =>
  runSync('legacy.mockFetchDataStream', () =>
    sdk.mockFetchDataStream(...args),
  ).pipe(
    Effect.map(({ requestBody }) => ({
      requestBody: runRequest(
        'legacy.mockFetchDataStream.requestBody',
        {},
        () => requestBody,
      ),
    })),
  );

export const mockFetchDataStreamWithGenerator = (
  ...args: Parameters<typeof sdk.mockFetchDataStreamWithGenerator>
) =>
  runSync('legacy.mockFetchDataStreamWithGenerator', () =>
    sdk.mockFetchDataStreamWithGenerator(...args),
  ).pipe(
    Effect.map(({ requestBody }) => ({
      requestBody: runRequest(
        'legacy.mockFetchDataStreamWithGenerator.requestBody',
        {},
        () => requestBody,
      ),
    })),
  );

export const mockFetchError = (
  ...args: Parameters<typeof sdk.mockFetchError>
) => runSync('legacy.mockFetchError', () => sdk.mockFetchError(...args));
