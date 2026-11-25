import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    fixture: { type: 'string' },
    entry: { type: 'string', multiple: true },
  },
});
assert.ok(
  values.fixture,
  'Pass --fixture with the external consumer directory',
);
const fixture = await realpath(values.fixture);
const baseline = JSON.parse(
  await readFile(new URL('../docs/sdk-surface.json', import.meta.url), 'utf8'),
);
const paths = values.entry
  ? values.entry.map((entry) => {
      const path = baseline.paths.find(({ upstream }) => upstream === entry);
      assert.ok(path, `Unknown SDK entry ${entry}`);
      return path;
    })
  : baseline.paths;

function selectedTarget(branch, conditions) {
  if (typeof branch === 'string') return branch;
  for (const [condition, value] of Object.entries(branch ?? {})) {
    if (condition !== 'default' && !conditions.includes(condition)) continue;
    const target = selectedTarget(value, conditions);
    if (target) return target;
  }
  return null;
}

// Run each assertion inside Node with the consumer directory as its base URL.
// The inline program lives here so the consumer's files only import the wrapper.
const probe = String.raw`
import { readFileSync } from 'node:fs';
import { createRequire, findPackageJSON } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { cases, commonjs } = JSON.parse(readFileSync(0, 'utf8'));
const require = createRequire(import.meta.url);
const failures = [];

function checkAliases(wrapper, sdk, name, visited) {
  if (wrapper === null || sdk === null || typeof wrapper !== typeof sdk) return;
  if (typeof sdk !== 'object' && typeof sdk !== 'function') return;
  if (wrapper === sdk) {
    failures.push(name + ' exposes the same SDK object');
    return;
  }
  if (visited.has(wrapper)) return;
  visited.add(wrapper);
  for (const key of Object.keys(wrapper)) {
    if (!Object.hasOwn(sdk, key)) continue;
    const actual = Object.getOwnPropertyDescriptor(wrapper, key);
    const upstream = Object.getOwnPropertyDescriptor(sdk, key);
    if (actual && upstream && 'value' in actual && 'value' in upstream) {
      checkAliases(actual.value, upstream.value, name + '.' + key, visited);
    }
  }
}

let checked = 0;
for (const item of cases) {
  try {
    const resolveEntry = () => commonjs
      ? require.resolve(item.specifier)
      : fileURLToPath(import.meta.resolve(item.specifier));
    if (!item.expectedTarget) {
      try {
        resolveEntry();
        failures.push(item.specifier + ' resolves without an upstream runtime route');
      } catch (error) {
        if (error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
      }
      checked += 1;
      continue;
    }
    const file = resolveEntry();
    if (file !== item.expectedFile) {
      failures.push(item.specifier + ' resolved to ' + file + ', expected ' + item.expectedFile);
      continue;
    }
    const wrapper = commonjs ? require(item.specifier) : await import(item.specifier);
    const visited = new Set();
    const upstreamName = item.upstream.match(/^(@[^/]+\/[^/]+|[^/]+)/u)[0];
    const upstreamManifest = findPackageJSON(upstreamName, pathToFileURL(file));
    if (!upstreamManifest) throw new Error('Missing owned SDK dependency ' + upstreamName);
    const upstreamFile = resolve(dirname(upstreamManifest), item.upstreamTarget);
    const upstream = commonjs ? require(upstreamFile) : await import(pathToFileURL(upstreamFile));
    for (const name of item.names) {
      if (!Object.hasOwn(wrapper, name)) failures.push(item.specifier + ' missing runtime export ' + name);
      else if (!Object.hasOwn(upstream, name)) failures.push(item.upstream + ' archive signature did not match loaded export ' + name);
      else checkAliases(wrapper[name], upstream[name], item.specifier + ' ' + name, visited);
    }
    checked += 1;
  } catch (error) {
    failures.push(item.specifier + ' failed to execute (' + (error.code ?? error.name) + '): ' + error.message);
  }
}
console.log(JSON.stringify({ checked, failures }));
`;

const root = await realpath(
  resolve(fixture, 'node_modules/@jambudipa/ai-effect'),
);
const manifest = JSON.parse(
  await readFile(resolve(root, 'package.json'), 'utf8'),
);
const contexts = {
  'node-import': { mode: 'import' },
  'node-require': { mode: 'require' },
  'legacy-module': { mode: 'require', flag: 'module' },
  'react-server': { mode: 'import', flag: 'react-server' },
};

const failures = [];
for (const [context, { mode, flag }] of Object.entries(contexts)) {
  const cases = [];
  const conditions = ['node', 'node-addons', 'module-sync', mode];
  if (flag) conditions.push(flag);
  for (const path of paths) {
    if (
      flag &&
      !path.leaves.some(({ conditions }) => conditions.includes(flag))
    )
      continue;
    const upstreamTarget = path.resolvers[context].runtime;
    const branch = manifest.exports[path.wrapper];
    if (!branch) {
      failures.push(`${context}: Missing package export ${path.wrapper}`);
      continue;
    }
    const expectedTarget = selectedTarget(branch, conditions);
    if (Boolean(expectedTarget) !== Boolean(upstreamTarget)) {
      failures.push(
        `${context}: ${path.wrapper} runtime reachability differs from ${path.upstream}`,
      );
      continue;
    }
    cases.push({
      specifier: `${manifest.name}${path.wrapper.slice(1)}`,
      upstream: path.upstream,
      upstreamTarget,
      expectedTarget,
      expectedFile: expectedTarget && resolve(root, expectedTarget),
      names: path.targets[upstreamTarget]?.names ?? [],
    });
  }
  if (!cases.length) continue;
  const args = [
    ...(flag ? [`--conditions=${flag}`] : []),
    '--input-type=module',
    '--eval',
    probe,
  ];
  const result = spawnSync(process.execPath, args, {
    cwd: fixture,
    input: JSON.stringify({ cases, commonjs: mode === 'require' }),
    encoding: 'utf8',
    timeout: 120_000,
  });
  assert.equal(
    result.status,
    0,
    `${context}: ${result.stderr || result.error}`,
  );
  const { checked, failures: errors } = JSON.parse(
    result.stdout.trimEnd().split('\n').at(-1),
  );
  console.log(
    `${context}: executed ${checked} of ${cases.length} Node resolver cases`,
  );
  failures.push(...errors.map((error) => `${context}: ${error}`));
}
if (failures.length) {
  for (const error of failures) console.error(error);
  process.exitCode = 1;
}
