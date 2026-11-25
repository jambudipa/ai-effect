import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: { check: { type: 'boolean' }, existing: { type: 'boolean' } },
});
assert.ok(
  !values.check || !values.existing,
  'The complete gate requires all source entries',
);

const root = new URL('..', import.meta.url);
const manifestUrl = new URL('package.json', root);
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
const baseline = JSON.parse(
  await readFile(new URL('docs/sdk-surface.json', root), 'utf8'),
);
const frameworks = new Set([
  'angular',
  'react',
  'rsc',
  'solid',
  'svelte',
  'vue',
]);
const integrations = new Set([
  'code-mode',
  'devtools',
  'durable-agent',
  'langchain',
  'llamaindex',
  'mcp',
  'otel',
  'policy-opa',
  'sandbox-just-bash',
  'sandbox-vercel',
  'swarm',
  'test-server',
  'tool-bash',
  'tool-web-fetch',
  'tools',
  'tui',
  'typesafe-ai',
  'ui-utils',
  'valibot',
  'workflow',
  'workflow-harness',
]);

function sourceEntry(path) {
  const name = path.wrapper.slice(2);
  const [packageName] = name.split('/');
  if (name === 'ai') return 'core';
  if (name === 'ai/test') return 'testing';
  if (name === 'ui-utils/test') return 'integrations/ui-utils-test';
  if (name === 'rsc') return 'frameworks/rsc-client';
  if (frameworks.has(packageName)) return `frameworks/${name}`;
  if (packageName === 'provider' || packageName === 'provider-utils')
    return `protocols/${name}`;
  if (integrations.has(packageName) || /^harness(?:-|$)/u.test(packageName))
    return `integrations/${name}`;
  return `providers/${name}`;
}

function esm(entry) {
  return {
    types: `./dist/${entry}.d.ts`,
    import: `./dist/${entry}.js`,
    default: `./dist/${entry}.js`,
  };
}

function conditions(path, entry) {
  const names = new Set(path.leaves.flatMap(({ conditions }) => conditions));
  if (names.has('react-server')) {
    return { 'react-server': esm('frameworks/rsc-server'), ...esm(entry) };
  }
  if (names.has('svelte')) {
    return { types: `./dist/${entry}.d.ts`, svelte: `./dist/${entry}.js` };
  }
  if (names.has('require')) {
    const esmEntry = esm(entry);
    return {
      import: esmEntry,
      ...(names.has('module') ? { module: esmEntry } : {}),
      require: {
        types: `./dist/${entry}.d.cts`,
        default: `./dist/${entry}.cjs`,
      },
    };
  }
  return esm(entry);
}

const exports = { '.': manifest.exports['.'] };
const missing = [];
for (const path of baseline.paths) {
  const entry = sourceEntry(path);
  const entries =
    path.wrapper === './rsc' ? [entry, 'frameworks/rsc-server'] : [entry];
  if (entries.some((name) => !existsSync(new URL(`src/${name}.ts`, root)))) {
    missing.push(path.upstream);
    continue;
  }
  exports[path.wrapper] = conditions(path, entry);
}
exports['./package.json'] = manifest.exports['./package.json'];

if (missing.length && !values.existing) {
  throw new Error(`Missing source entries for ${missing.join(', ')}`);
}
if (values.check) {
  assert.equal(
    JSON.stringify(manifest.exports),
    JSON.stringify(exports),
    'Run node scripts/sync-sdk-exports.mjs to restore the pinned export map',
  );
} else {
  await writeFile(
    manifestUrl,
    `${JSON.stringify({ ...manifest, exports }, null, 2)}\n`,
  );
}
console.log(
  `Mapped ${baseline.paths.length - missing.length}/${baseline.paths.length} SDK import paths`,
);
