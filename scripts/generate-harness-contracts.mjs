import { cp, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDirectory = path.join(
  root,
  'src/integrations/internal/harness-contracts',
);
const distDirectory = path.join(
  root,
  'dist/integrations/internal/harness-contracts',
);
if (process.argv.includes('--copy-to-dist')) {
  await cp(sourceDirectory, distDirectory, { recursive: true });
  process.exit(0);
}
const manifest = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);
const report = JSON.parse(
  await readFile(path.join(root, 'docs/sdk-surface.json'), 'utf8'),
);

const entries = report.paths.filter(({ upstream }) =>
  /^@ai-sdk\/(harness(?:$|-[^/]+$|\/utils$)|sandbox-just-bash$|sandbox-vercel$|workflow-harness$|tool-web-fetch$)/u.test(
    upstream,
  ),
);
const filenames = new Map(
  entries.map(({ upstream }) => [
    upstream,
    `${upstream.slice('@ai-sdk/'.length).replaceAll('/', '-')}.d.ts`,
  ]),
);
const rewriting = new Map([
  ...[...filenames].map(([pkg, filename]) => [
    pkg,
    `./${filename.replace(/\.d\.ts$/u, '.js')}`,
  ]),
  ['@ai-sdk/mcp', '../mcp-contract.js'],
]);

const printer = ts.createPrinter({ removeComments: true });
const licenseNames = new Map();

function normalize(filename, contents) {
  const source = ts.createSourceFile(
    filename,
    contents,
    ts.ScriptTarget.Latest,
    true,
  );
  const edits = [];
  const visit = (node) => {
    if (
      ts.isTypeReferenceNode(node) &&
      /(?:^|\.)ZodDiscriminatedUnion$/u.test(node.typeName.getText(source))
    ) {
      const args = node.typeArguments;
      if (args && args.length > 1) {
        const [options, discriminator] = args;
        if (
          args.length !== 2 ||
          !ts.isLiteralTypeNode(discriminator) ||
          !ts.isStringLiteral(discriminator.literal)
        ) {
          throw new Error(`Unexpected Zod union shape in ${filename}`);
        }
        const key = discriminator.getText(source);
        edits.push([
          options.end,
          node.end,
          `> & { def: { discriminator: ${key} }; _zod: { def: { discriminator: ${key} } } }`,
        ]);
      }
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

const source = new Map();
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

const check = process.argv.includes('--check');
if (!check) await mkdir(sourceDirectory, { recursive: true });
for (const [filename, content] of source) {
  const sourceFile = path.join(sourceDirectory, filename);
  if (check) {
    if ((await readFile(sourceFile, 'utf8')) !== content) {
      throw new Error(`Generated declaration contract is stale: ${filename}`);
    }
  } else {
    await writeFile(sourceFile, content);
  }
}
