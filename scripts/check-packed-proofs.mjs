import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('..', import.meta.url));
const archive = process.argv[2];
if (!archive) throw new Error('Pass the path to the built npm tarball.');
const fixture = mkdtempSync(join(tmpdir(), 'ai-effect-packed-'));

function run(cwd, cmd, args, capture = false) {
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180_000,
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed`);
  return result.stdout;
}

function fileBytes(path) {
  return readdirSync(path, { withFileTypes: true }).reduce((total, file) => {
    const child = join(path, file.name);
    if (file.isDirectory()) return total + fileBytes(child);
    return file.isFile() ? total + statSync(child).size : total;
  }, 0);
}

try {
  cpSync(join(root, 'test/fixtures/sdk-surface'), fixture, { recursive: true });
  const metadata = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const hostPackages = [
    '@sveltejs/vite-plugin-svelte',
    '@types/node',
    'jsdom',
    'svelte',
    'typescript',
    'vite',
    'vitest',
  ];
  const dependencies = {
    [metadata.name]: `file:${resolve(archive)}`,
    effect: metadata.devDependencies.effect,
    ...Object.fromEntries(
      hostPackages.map((name) => [name, metadata.devDependencies[name]]),
    ),
    ...(process.env.AI_EFFECT_ZOD ? { zod: process.env.AI_EFFECT_ZOD } : {}),
  };
  writeFileSync(
    join(fixture, 'package.json'),
    JSON.stringify({ private: true, type: 'module', dependencies }, null, 2),
  );
  const start = performance.now();
  run(fixture, 'npm', [
    'install',
    '--strict-peer-deps',
    '--no-audit',
    '--no-fund',
  ]);
  const durationMs = Math.round(performance.now() - start);
  const lock = JSON.parse(
    readFileSync(join(fixture, 'package-lock.json'), 'utf8'),
  );
  const installed = Object.entries(lock.packages).filter(
    ([path]) => path && existsSync(join(fixture, path, 'package.json')),
  );
  const peers = Object.fromEntries(
    installed
      .filter(([path]) =>
        /\/node_modules\/(effect|svelte|vite|vitest|zod)$/.test(`/${path}`),
      )
      .map(([path, entry]) => [path, entry.version]),
  );
  const scope = join(fixture, 'node_modules');
  const tsc = join(scope, 'typescript/bin/tsc');
  const vite = join(scope, 'vite/bin/vite.js');
  run(fixture, process.execPath, [tsc, '-p', 'tsconfig.json']);
  run(fixture, process.execPath, ['.compiled/core.mjs']);
  run(fixture, process.execPath, ['legacy.cjs']);
  if (!existsSync(vite))
    throw new Error('Vite did not install for the Svelte fixture.');
  run(fixture, process.execPath, [vite, 'build']);
  run(fixture, process.execPath, ['--conditions=svelte', 'run-host.mjs']);
  const browserBytes = gzipSync(
    readFileSync(join(fixture, 'dist/host.js')),
  ).length;
  console.log(
    JSON.stringify(
      {
        node: process.version,
        platform: `${process.platform}-${process.arch}`,
        npm: run(fixture, 'npm', ['--version'], true).trim(),
        packageCount: installed.length,
        installBytes: fileBytes(scope),
        durationMs,
        peers,
        browserBytes,
      },
      null,
      2,
    ),
  );
} finally {
  if (process.env.AI_EFFECT_KEEP_FIXTURE) console.log(fixture);
  else rmSync(fixture, { recursive: true, force: true });
}
