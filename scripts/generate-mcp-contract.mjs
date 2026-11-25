import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const manifestFile = require.resolve('@ai-sdk/mcp/package.json');
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
const declaration = resolve(dirname(manifestFile), manifest.exports['.'].types);
const upstream = await readFile(declaration, 'utf8');
const source = ts.createSourceFile(
  'mcp.d.ts',
  upstream,
  ts.ScriptTarget.Latest,
  true,
);
const control = source.statements
  .filter(ts.isVariableStatement)
  .flatMap(({ declarationList }) => [...declarationList.declarations])
  .find(({ name }) => name.getText(source) === 'MCPEventControlSchema');

if (!control?.type || !ts.isTypeReferenceNode(control.type)) {
  throw new Error('The MCP event-control schema declaration changed.');
}

const union = control.type.typeArguments?.[0];
if (
  !union ||
  !ts.isTypeReferenceNode(union) ||
  union.typeName.getText(source) !== 'z.ZodDiscriminatedUnion'
) {
  throw new Error(
    'The MCP event-control schema is no longer a discriminated union.',
  );
}
const [options, discriminator] = union.typeArguments ?? [];
if (!options || discriminator?.getText(source) !== '"type"') {
  throw new Error('The MCP event-control schema discriminator changed.');
}

// Zod 3.25.76 exposes the same v4 union options with one type argument.
// The additional argument in current Zod names the discriminator but does
// not change the union's inferred shape.
const normalized =
  upstream.slice(0, options.end) + upstream.slice(discriminator.end);
const parsed = ts.createSourceFile(
  'mcp-contract.ts',
  normalized,
  ts.ScriptTarget.Latest,
  true,
);
const printer = ts.createPrinter({ removeComments: true });
const header = [
  `// Generated from @ai-sdk/mcp@${manifest.version}. Do not edit by hand.`,
  '// SPDX-License-Identifier: Apache-2.0',
  '// See mcp-contract.LICENSE for the upstream license.',
  '// The runtime SDK remains the authority for protocol behavior.',
  '',
].join('\n');
const contractPath = fileURLToPath(
  new URL('../src/integrations/internal/mcp-contract.ts', import.meta.url),
);
const contract = printer
  .printFile(parsed)
  .replace(/^import /gmu, 'import type ');
const body = await format(header + contract, {
  parser: 'typescript',
  singleQuote: true,
  trailingComma: 'all',
});
if (process.argv.includes('--check')) {
  if ((await readFile(contractPath, 'utf8')) !== body) {
    throw new Error('The checked-in MCP declaration contract is stale.');
  }
} else {
  await writeFile(contractPath, body);
}
