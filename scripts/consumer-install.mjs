import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

function packedDependency(archive) {
  const path = resolve(archive);
  const manifest = JSON.parse(
    execFileSync('tar', ['-xOzf', path, 'package/package.json'], {
      encoding: 'utf8',
    }),
  );
  const integrity = `sha512-${createHash('sha512').update(readFileSync(path)).digest('base64')}`;
  return { manifest, resolved: `file:${path}`, integrity };
}

export function readConsumerLock(fixture, archive) {
  const { manifest, integrity } = packedDependency(archive);
  const lock = JSON.parse(
    readFileSync(join(fixture, 'package-lock.json'), 'utf8'),
  );
  assert.equal(
    lock.packages[`node_modules/${manifest.name}`]?.integrity,
    integrity,
  );
  const { packages: inventory } = JSON.parse(
    readFileSync(
      new URL('../_bmad-output/sdk-upstream-inventory.json', import.meta.url),
      'utf8',
    ),
  );
  const direct = lock.packages[''].dependencies;
  for (const { name, version, integrity, publicPaths } of inventory) {
    assert.ok(
      !Object.hasOwn(direct, name),
      `Consumer declares SDK dependency ${name}`,
    );
    if (publicPaths.length === 0) continue;
    assert.equal(
      manifest.dependencies[name],
      version,
      `Tarball does not own ${name}@${version}`,
    );
    const path = `node_modules/${name}`;
    const resolved =
      lock.packages[`node_modules/${manifest.name}/${path}`] ??
      lock.packages[path];
    assert.equal(
      resolved?.version,
      version,
      `Consumer version differs for ${name}`,
    );
    assert.equal(
      resolved?.integrity,
      integrity,
      `Consumer archive differs for ${name}`,
    );
  }
  return lock;
}

export function installConsumer(fixture, archive, dependencies) {
  const { manifest, resolved, integrity } = packedDependency(archive);
  const root = {
    name: 'ai-effect-consumer',
    private: true,
    type: 'module',
    dependencies: { [manifest.name]: resolved, ...dependencies },
  };
  const lock = JSON.parse(
    readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'),
  );
  lock.name = root.name;
  delete lock.version;
  lock.packages[''] = { name: root.name, dependencies: root.dependencies };
  const { version, license, engines, peerDependencies, peerDependenciesMeta } =
    manifest;
  lock.packages[`node_modules/${manifest.name}`] = {
    version,
    resolved,
    integrity,
    license,
    engines,
    dependencies: manifest.dependencies,
    peerDependencies,
    peerDependenciesMeta,
  };
  writeFileSync(join(fixture, 'package.json'), JSON.stringify(root, null, 2));
  writeFileSync(
    join(fixture, 'package-lock.json'),
    JSON.stringify(lock, null, 2),
  );

  // Let npm prune the repository-only packages and resolve the consumer peers.
  const flags = [
    '--strict-peer-deps',
    '--engine-strict',
    '--ignore-scripts',
    '--prefer-offline',
    '--no-audit',
    '--no-fund',
  ];
  const start = performance.now();
  for (const args of [['install', '--package-lock-only'], ['ci']]) {
    execFileSync('npm', [...args, ...flags], {
      cwd: fixture,
      stdio: 'inherit',
      timeout: 240_000,
    });
  }
  const durationMs = Math.round(performance.now() - start);
  return { durationMs, lock: readConsumerLock(fixture, archive) };
}
