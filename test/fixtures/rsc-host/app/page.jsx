import * as rsc from '@jambudipa/ai-effect/rsc';
import { Effect } from 'effect';
import Client from './client.jsx';

export const dynamic = 'force-dynamic';

export default async function Page() {
  if (
    typeof rsc.createStreamableValue !== 'function' ||
    'useStreamableValue' in rsc
  ) {
    throw new Error('Next.js did not select the packed react-server entry');
  }
  const value = await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const handle = yield* rsc.createStreamableValue('initial');
        yield* handle.done('server value');
        return handle.value;
      }),
    ),
  );
  return (
    <section data-rsc-server="selected">
      <Client value={value} />
    </section>
  );
}
