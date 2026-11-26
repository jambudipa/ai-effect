import { copyFile } from 'node:fs/promises';
import manifest from '../package.json' with { type: 'json' };

/** Collect only the CommonJS declaration leaves from the conditional export tree. */
function declarationTargets(branch) {
  if (typeof branch === 'string')
    return branch.endsWith('.d.cts') ? [branch] : [];
  return Object.values(branch).flatMap(declarationTargets);
}

/** Deduplicate paths shared by more than one CommonJS condition. */
const files = new Set(
  Object.values(manifest.exports).flatMap(declarationTargets),
);
/** Resolve the emitted declarations relative to the package root. */
const project = new URL('..', import.meta.url);
await Promise.all(
  [...files].map((file) =>
    copyFile(
      new URL(`${file.slice(0, -'.d.cts'.length)}.d.ts`, project),
      new URL(file, project),
    ),
  ),
);
