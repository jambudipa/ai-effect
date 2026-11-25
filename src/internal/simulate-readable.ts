import { simulateReadableStream as simulate } from 'ai';
import { runSync } from './operation.js';

/** Create a test Web Stream from a list of chunks. */
export const simulateReadableStream = <A>(
  options: Omit<Parameters<typeof simulate<A>>[0], '_internal'>,
) => runSync('simulateReadableStream', () => simulate(options));
