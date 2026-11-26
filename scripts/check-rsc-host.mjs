import { spawn, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { installConsumer, readConsumerLock } from './consumer-install.mjs';

/** Accept the archive to install in the independent Next.js application. */
const tarball = process.argv[2];
if (!tarball) throw new Error('Pass the built npm tarball.');
/** Use the caller's fixture directory only when its lockfile matches the archive. */
const existing = process.env.AI_EFFECT_FIXTURE_DIR;
/** Keep the Next.js build and installed hosts away from the repository dependencies. */
const fixture = existing
  ? resolve(existing)
  : mkdtempSync(join(tmpdir(), 'ai-effect-rsc-'));
/** Start the Next.js binary installed by the fixture's own dependency graph. */
const next = join(fixture, 'node_modules/next/dist/bin/next');
/** Make the fixture independent of the Next.js telemetry service. */
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };

/** Run a bounded build from the fixture directory and propagate child errors. */
function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: fixture,
    env,
    stdio: 'inherit',
    timeout: 240_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} failed.`);
}

/** Wait up to 30 seconds for the loopback server or fail when the process exits. */
async function responseFrom(port, child) {
  const limit = Date.now() + 30_000;
  while (Date.now() < limit && child.exitCode === null) {
    try {
      return await fetch(`http://127.0.0.1:${port}`, {
        signal: AbortSignal.timeout(3_000),
      });
    } catch {
      await setTimeout(200);
    }
  }
  throw new Error('The Next.js fixture did not respond.');
}

/** Retain the server process so the cleanup can stop it after success or failure. */
let child;
try {
  cpSync(new URL('../test/fixtures/rsc-host', import.meta.url), fixture, {
    recursive: true,
  });
  if (existing) readConsumerLock(fixture, tarball);
  else
    installConsumer(fixture, tarball, {
      effect: '4.1.5',
      next: '16.4.6',
      react: '19.3.1',
      'react-dom': '19.3.1',
    });
  run(process.execPath, [next, 'build', '--webpack']);

  const listener = createServer();
  await new Promise((ready) => listener.listen(0, '127.0.0.1', ready));
  const { port } = listener.address();
  await new Promise((close) => listener.close(close));

  child = spawn(
    process.execPath,
    [next, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: fixture,
      env,
      stdio: 'inherit',
    },
  );
  const response = await responseFrom(port, child);
  const html = await response.text();
  if (
    !response.ok ||
    !html.includes('data-rsc-server="selected"') ||
    !html.includes('<output data-rsc-client="selected">server value</output>')
  ) {
    throw new Error(
      `The packed RSC branches did not render the fixture. Status ${response.status}.`,
    );
  }
  console.log(
    'Next.js resolved and rendered the packed server and client branches.',
  );
} finally {
  child?.kill('SIGTERM');
  if (existing || process.env.AI_EFFECT_KEEP_FIXTURE) console.log(fixture);
  else rmSync(fixture, { recursive: true, force: true });
}
