'use client';

import * as rsc from '@jambudipa/ai-effect/rsc';

export default function Client({ value }) {
  if (
    typeof rsc.useStreamableValue !== 'function' ||
    'createStreamableValue' in rsc
  ) {
    throw new Error('Next.js did not select the packed client entry');
  }
  const [data] = rsc.useStreamableValue(value);
  return <output data-rsc-client="selected">{data}</output>;
}
