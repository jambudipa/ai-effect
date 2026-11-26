import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { basename, join } from 'node:path';
import { promisify } from 'node:util';

/** Run the tar extractor as a subprocess with a Promise result. */
const run = promisify(execFile);

/** Treat an absent cache entry as a miss and propagate other filesystem errors. */
async function readCachedArchive(path) {
  try {
    return await readFile(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  }
}

/** Reject cached or downloaded bytes that differ from the npm integrity pin. */
function verifyArchive(bytes, { name, version, integrity }) {
  const digest = createHash('sha512').update(bytes).digest('base64');
  assert.equal(
    `sha512-${digest}`,
    integrity,
    `Archive integrity for ${name}@${version}`,
  );
}

/** Use a digest-keyed cache and publish a verified download with an atomic rename. */
async function fetchArchive(pin, cache) {
  const digest = Buffer.from(
    pin.integrity.slice('sha512-'.length),
    'base64',
  ).toString('hex');
  const path = join(cache, `${digest}.tgz`);
  const cached = await readCachedArchive(path);
  if (cached) {
    verifyArchive(cached, pin);
    return cached;
  }

  const url = `https://registry.npmjs.org/${pin.name}/-/${basename(pin.name)}-${pin.version}.tgz`;
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  assert.ok(response.ok, `HTTP ${response.status} downloading ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  verifyArchive(bytes, pin);
  const staging = await mkdtemp(join(cache, '.download-'));
  try {
    const staged = join(staging, 'archive.tgz');
    await writeFile(staged, bytes);
    await rename(staged, path);
  } finally {
    await rm(staging, { force: true, recursive: true });
  }
  return bytes;
}

/** Open pinned npm archives in groups of eight and verify identity after extraction. */
export async function openArchives(pins, directory, cache) {
  await mkdir(cache, { recursive: true });
  const archives = [];
  for (let start = 0; start < pins.length; start += 8) {
    const group = await Promise.allSettled(
      pins.slice(start, start + 8).map(async (pin, offset) => {
        const target = join(directory, String(start + offset));
        const bytes = await fetchArchive(pin, cache);
        await mkdir(target);
        const tarball = join(target, 'archive.tgz');
        await writeFile(tarball, bytes);
        await run('tar', ['-xzf', tarball, '-C', target, 'package']);
        const root = join(target, 'package');
        const manifest = JSON.parse(
          await readFile(join(root, 'package.json'), 'utf8'),
        );
        assert.equal(manifest.name, pin.name, 'Archive package name');
        assert.equal(
          manifest.version,
          pin.version,
          `Archive version for ${pin.name}`,
        );
        return { pin, root, manifest };
      }),
    );
    for (const result of group) {
      if (result.status === 'rejected') throw result.reason;
      archives.push(result.value);
    }
  }
  return archives;
}
