const assert = require('node:assert/strict');
const { Effect } = require('effect');
const specifier = '@jambudipa/ai-effect/ui-utils';
const { formatDataStreamPart } = require(specifier);

assert.match(require.resolve(specifier), /dist\/integrations\/ui-utils\.cjs$/);
assert.equal(
  Effect.runSync(formatDataStreamPart('text', 'legacy')),
  '0:"legacy"\n',
);
