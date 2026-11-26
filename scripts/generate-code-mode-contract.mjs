import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

if (process.argv.includes('--copy-to-dist')) {
  const name = 'integrations/internal/code-mode-contract.LICENSE';
  await copyFile(
    new URL(`../src/${name}`, import.meta.url),
    new URL(`../dist/${name}`, import.meta.url),
  );
  process.exit(0);
}

/** Resolve code-mode from the installed wrapper dependencies. */
const require = createRequire(import.meta.url);
/** Locate the manifest for the installed code-mode pin. */
const manifestPath = require.resolve('@ai-sdk/code-mode/package.json');
/** Resolve upstream source and license paths from the installed package root. */
const packageDir = dirname(manifestPath);
/** Read the version and declaration route from the installed code-mode manifest. */
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
/** Resolve `run` from code-mode so nested and hoisted installations both work. */
const runManifestPath = createRequire(manifestPath).resolve('run/package.json');
/** Record the `run` version and declaration route used by the projection. */
const runManifest = JSON.parse(await readFile(runManifestPath, 'utf8'));
/** Parse a source file with positions that support targeted text edits. */
const parse = (filename, text) =>
  ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true);

/** Read the public declaration entry selected by the upstream package. */
const declarations = await readFile(
  resolve(packageDir, manifest.exports['.'].types),
  'utf8',
);
/** Read the published source interfaces that the bundled declaration omits. */
const archiveTypes = parse(
  'types.ts',
  await readFile(resolve(packageDir, 'src/types.ts'), 'utf8'),
);
/** Read the `run` declaration that supplies the worker configuration signature. */
const runTypes = parse(
  'run.d.ts',
  await readFile(
    resolve(dirname(runManifestPath), runManifest.exports['.'].types),
    'utf8',
  ),
);
/** Find the published import to replace while preserving all other declarations. */
const published = parse('code-mode.d.ts', declarations);

/** Recover only the two continuation interfaces referenced by the public contract. */
const missing = new Set([
  'CodeModePendingInterruption',
  'CodeModePendingResolution',
]);
/** Keep the original interface fields from the pinned package's source. */
const recovered = archiveTypes.statements.filter(
  (node) => ts.isInterfaceDeclaration(node) && missing.has(node.name.text),
);
if (recovered.length !== missing.size)
  throw new Error('CodeMode continuation interfaces changed.');

/** Locate the dependency import before substituting the equivalent local type. */
const runImport = published.statements.find(
  (node) =>
    ts.isImportDeclaration(node) &&
    node.moduleSpecifier.getText(published) === '"run"',
);
/** Recover the worker-count setter signature from the pinned `run` version. */
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

/** Keep the public setter name and append the private continuation interfaces. */
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
/** Remove upstream comments so generated output tracks the type contract. */
const printer = ts.createPrinter({ removeComments: true });
/** Resolve the internal type projection from the wrapper's source directory. */
const target = new URL(
  '../src/integrations/internal/code-mode-contract.ts',
  import.meta.url,
);
/** Select the repository formatting configuration for the target file. */
const filepath = fileURLToPath(target);
/** Keep the original upstream license next to the generated projection. */
const licenseTarget = new URL('./code-mode-contract.LICENSE', target);
/** Record the exact upstream versions and license in the generated file. */
const header = [
  `// Generated from @ai-sdk/code-mode@${manifest.version} and run@${runManifest.version}. Do not edit.`,
  '// SPDX-License-Identifier: Apache-2.0',
  '// See code-mode-contract.LICENSE for the original license.',
  '',
].join('\n');
/** Emit type-only dependencies so the projection cannot import the SDK at runtime. */
const body = printer
  .printFile(parse(filepath, normalized))
  .replace(/^import /gmu, 'import type ');
/** Format the declaration projection with the target file's repository settings. */
const output = await format(header + body, {
  ...(await resolveConfig(filepath)),
  filepath,
});
/** Copy the original license bytes from the exact code-mode package. */
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
