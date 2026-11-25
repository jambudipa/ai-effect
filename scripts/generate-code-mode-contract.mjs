import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const manifestPath = require.resolve('@ai-sdk/code-mode/package.json');
const packageDir = dirname(manifestPath);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const runManifestPath = createRequire(manifestPath).resolve('run/package.json');
const runManifest = JSON.parse(await readFile(runManifestPath, 'utf8'));
const parse = (filename, text) =>
  ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true);

const declarations = await readFile(
  resolve(packageDir, manifest.exports['.'].types),
  'utf8',
);
const archiveTypes = parse(
  'types.ts',
  await readFile(resolve(packageDir, 'src/types.ts'), 'utf8'),
);
const runTypes = parse(
  'run.d.ts',
  await readFile(
    resolve(dirname(runManifestPath), runManifest.exports['.'].types),
    'utf8',
  ),
);
const published = parse('code-mode.d.ts', declarations);

const missing = new Set([
  'CodeModePendingInterruption',
  'CodeModePendingResolution',
]);
const recovered = archiveTypes.statements.filter(
  (node) => ts.isInterfaceDeclaration(node) && missing.has(node.name.text),
);
if (recovered.length !== missing.size)
  throw new Error('CodeMode continuation interfaces changed.');

const runImport = published.statements.find(
  (node) =>
    ts.isImportDeclaration(node) &&
    node.moduleSpecifier.getText(published) === '"run"',
);
const setter = runTypes.statements.find(
  (node) =>
    ts.isVariableStatement(node) &&
    node.declarationList.declarations.length === 1 &&
    node.declarationList.declarations[0].name.getText(runTypes) ===
      'setMaxWorkers',
);
if (
  !runImport ||
  !setter ||
  !/\bsetMaxWorkers as experimental_setMaxWorkers\b/u.test(
    runImport.getText(published),
  )
) {
  throw new Error('CodeMode run worker-count declaration changed.');
}

const normalized =
  declarations.slice(0, runImport.getStart(published)) +
  setter
    .getText(runTypes)
    .replace(/\bsetMaxWorkers\b/u, 'experimental_setMaxWorkers') +
  declarations.slice(runImport.end) +
  '\n' +
  recovered
    .map((node) => node.getText(archiveTypes).replace(/^export /u, ''))
    .join('\n');
const printer = ts.createPrinter({ removeComments: true });
const target = new URL(
  '../src/integrations/internal/code-mode-contract.ts',
  import.meta.url,
);
const filepath = fileURLToPath(target);
const licenseTarget = new URL('./code-mode-contract.LICENSE', target);
const header = [
  `// Generated from @ai-sdk/code-mode@${manifest.version} and run@${runManifest.version}. Do not edit.`,
  '// SPDX-License-Identifier: Apache-2.0',
  '// See code-mode-contract.LICENSE for the original license.',
  '',
].join('\n');
const body = printer
  .printFile(parse(filepath, normalized))
  .replace(/^import /gmu, 'import type ');
const output = await format(header + body, {
  ...(await resolveConfig(filepath)),
  filepath,
});
const license = await readFile(resolve(packageDir, 'LICENSE'), 'utf8');

for (const [path, value] of [
  [target, output],
  [licenseTarget, license],
]) {
  if (process.argv.includes('--check')) {
    if ((await readFile(path, 'utf8')) !== value)
      throw new Error(`Generated contract is stale: ${path.pathname}`);
  } else {
    await writeFile(path, value);
  }
}
