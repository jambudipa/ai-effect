import { copyFile } from 'node:fs/promises';
import manifest from '../package.json' with { type: 'json' };

function declarationTargets(branch) {
  if (typeof branch === 'string')
    return branch.endsWith('.d.cts') ? [branch] : [];
  return Object.values(branch).flatMap(declarationTargets);
}

const files = new Set(
  Object.values(manifest.exports).flatMap(declarationTargets),
);
const project = new URL('..', import.meta.url);
await Promise.all(
  [...files].map((file) =>
    copyFile(
      new URL(`${file.slice(0, -'.d.cts'.length)}.d.ts`, project),
      new URL(file, project),
    ),
  ),
);
