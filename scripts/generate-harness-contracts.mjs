import { cp, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';
import { generateJustBashContract } from './generate-just-bash-contract.mjs';
import { zodDiscriminatorEdit } from './zod-discriminator-edits.mjs';

/** Resolve the harness SDKs from the wrapper's dependency installation. */
const require = createRequire(import.meta.url);
/** Find the manifest and SDK surface report relative to this script. */
const root = fileURLToPath(new URL('..', import.meta.url));
/** Store source declaration projections and their upstream licenses together. */
const sourceDirectory = path.join(
  root,
  'src/integrations/internal/harness-contracts',
);
/** Keep the same relative type paths after the build copies the contracts. */
const distDirectory = path.join(
  root,
  'dist/integrations/internal/harness-contracts',
);
if (process.argv.includes('--copy-to-dist')) {
  await cp(sourceDirectory, distDirectory, { recursive: true });
  process.exit(0);
}
/** Read the expected package pins before opening installed declarations. */
const manifest = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);
/** Read the exact public type targets selected for the pinned SDK versions. */
const report = JSON.parse(
  await readFile(path.join(root, 'docs/sdk-surface.json'), 'utf8'),
);

/** Limit this projection to harness packages and their sandbox, workflow, and web fetch contracts. */
const entries = report.paths.filter(({ upstream }) =>
  /^@ai-sdk\/(harness(?:$|-[^/]+$|\/utils$)|sandbox-just-bash$|sandbox-vercel$|workflow-harness$|tool-web-fetch$)/u.test(
    upstream,
  ),
);
/** Give each entry its own declaration filename, including SDK subpaths. */
const filenames = new Map(
  entries.map(({ upstream }) => [
    upstream,
    `${upstream.slice('@ai-sdk/'.length).replaceAll('/', '-')}.d.ts`,
  ]),
);
/** Redirect cross-contract type imports to the portable local projection. */
const rewriting = new Map([
  ...[...filenames].map(([pkg, filename]) => [
    pkg,
    `./${filename.replace(/\.d\.ts$/u, '.js')}`,
  ]),
  ['@ai-sdk/mcp', '../mcp-contract.js'],
  ['just-bash', './just-bash/sandbox/Sandbox.js'],
]);

/** Remove upstream comments so generated output follows the type contract. */
const printer = ts.createPrinter({ removeComments: true });
/** Reuse a license filename when pinned packages have identical license text. */
const licenseNames = new Map();

/** Keep declaration links local and normalize the Zod and callback boundary types. */
function normalize(filename, contents) {
  const source = ts.createSourceFile(
    filename,
    contents,
    ts.ScriptTarget.Latest,
    true,
  );
  const edits = [];
  const visit = (node) => {
    const edit = zodDiscriminatorEdit(node, source);
    if (edit) edits.push(edit);
    if (
      filename === 'harness.d.ts' &&
      ts.isTypeAliasDeclaration(node) &&
      node.name.text === 'HarnessV1MintBridgeTokenCallback'
    ) {
      edits.push([
        node.type.getStart(source),
        node.type.end,
        "import('../../harness.js').HarnessV1MintBridgeTokenCallback",
      ]);
    }
    const parent = node.parent;
    if (
      ts.isStringLiteral(node) &&
      ((ts.isImportDeclaration(parent) && parent.moduleSpecifier === node) ||
        (ts.isExportDeclaration(parent) && parent.moduleSpecifier === node) ||
        (ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent)))
    ) {
      const local = rewriting.get(node.text);
      if (local)
        edits.push([node.getStart(source), node.end, JSON.stringify(local)]);
    }
    node.forEachChild(visit);
  };
  visit(source);
  const normalized = edits
    .sort((left, right) => right[0] - left[0])
    .reduce(
      (text, [start, end, replacement]) =>
        text.slice(0, start) + replacement + text.slice(end),
      contents,
    );
  const parsed = ts.createSourceFile(
    filename,
    normalized,
    ts.ScriptTarget.Latest,
    true,
  );
  return printer.printFile(parsed);
}

/** Seed the output map with the transitive just-bash sandbox declarations. */
const source = await generateJustBashContract(require, sourceDirectory);
for (const entry of entries) {
  const parts = entry.upstream.split('/');
  const name = parts.slice(0, 2).join('/');
  const installedManifest = require.resolve(`${name}/package.json`);
  const directory = path.dirname(installedManifest);
  const dependency = JSON.parse(await readFile(installedManifest, 'utf8'));
  if (dependency.version !== manifest.dependencies[name]) {
    throw new Error(
      `Installed ${name}@${dependency.version} differs from the wrapper dependency.`,
    );
  }
  const target = entry.resolvers['node-import'].types;
  const filename = filenames.get(entry.upstream);
  const upstream = await readFile(path.join(directory, target), 'utf8');
  const license = await readFile(path.join(directory, 'LICENSE'), 'utf8');
  let licenseName = licenseNames.get(license);
  if (!licenseName) {
    licenseName = `${name.slice('@ai-sdk/'.length)}.LICENSE`;
    licenseNames.set(license, licenseName);
    source.set(licenseName, license);
  }
  const header = [
    `// Generated from ${entry.upstream} in ${name}@${dependency.version}. Do not edit.`,
    `// Original license: ${licenseName}.`,
    '// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.',
    '',
  ].join('\n');
  const filepath = path.join(sourceDirectory, filename);
  const settings = await resolveConfig(filepath);
  source.set(
    filename,
    await format(header + normalize(filename, upstream), {
      ...settings,
      filepath,
    }),
  );
}

/** Compare all output bytes with the checked-in contracts during CI. */
const check = process.argv.includes('--check');
for (const [filename, content] of source) {
  const sourceFile = path.join(sourceDirectory, filename);
  if (check) {
    if ((await readFile(sourceFile, 'utf8')) !== content) {
      throw new Error(`Generated declaration contract is stale: ${filename}`);
    }
  } else {
    await mkdir(path.dirname(sourceFile), { recursive: true });
    await writeFile(sourceFile, content);
  }
}
