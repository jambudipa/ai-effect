const assert = require('node:assert/strict');
const { Effect } = require('effect');
const specifier = '@jambudipa/ai-effect/ui-utils';
const { formatDataStreamPart } = require(specifier);

assert.match(require.resolve(specifier), /dist\/integrations\/ui-utils\.cjs$/);
assert.equal(
  Effect.runSync(formatDataStreamPart('text', 'legacy')),
  '0:"legacy"\n',
);
const fixtures = require('@jambudipa/ai-effect/ui-utils/test');
assert.equal(typeof fixtures.mockFetchError, 'function');
assert(
  Effect.isEffect(
    fixtures.mockFetchError({ statusCode: 400, errorMessage: 'fixture' }),
  ),
);
