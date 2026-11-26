import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import ts from 'typescript';

/** Resolve the MCP SDK from the wrapper's own dependencies. */
const require = createRequire(import.meta.url);
/** Locate the exact installed MCP package before selecting its types. */
const manifestFile = require.resolve('@ai-sdk/mcp/package.json');
/** Read the package version and public declaration route. */
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
/** Resolve the public declaration entry relative to the installed package root. */
const declaration = resolve(dirname(manifestFile), manifest.exports['.'].types);
/** Keep the original declaration text for the targeted discriminator edit. */
const upstream = await readFile(declaration, 'utf8');
/** Parse the SDK declarations so the Zod edit can use compiler node offsets. */
const source = ts.createSourceFile(
  'mcp.d.ts',
  upstream,
  ts.ScriptTarget.Latest,
  true,
);
/** Locate the control-message schema whose Zod union uses two type arguments. */
const control = source.statements
  .filter(ts.isVariableStatement)
  .flatMap(({ declarationList }) => [...declarationList.declarations])
  .find(({ name }) => name.getText(source) === 'MCPEventControlSchema');

if (!control?.type || !ts.isTypeReferenceNode(control.type)) {
  throw new Error('The MCP event-control schema declaration changed.');
}

/** Verify that the selected schema contains the expected discriminated union. */
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
/** Keep the union options and confirm the argument removed names the `type` discriminator. */
const [options, discriminator] = union.typeArguments ?? [];
if (!options || discriminator?.getText(source) !== '"type"') {
  throw new Error('The MCP event-control schema discriminator changed.');
}

// Zod 3.25.76 exposes the same v4 union options with one type argument.
// The additional argument in current Zod names the discriminator but does
// not change the union's inferred shape.
/** Drop the second Zod argument while preserving the union's variant types. */
const normalized =
  upstream.slice(0, options.end) + upstream.slice(discriminator.end);
/** Parse the edited declarations under their emitted TypeScript filename. */
const parsed = ts.createSourceFile(
  'mcp-contract.ts',
  normalized,
  ts.ScriptTarget.Latest,
  true,
);
/** Remove upstream comments before formatting the generated type contract. */
const printer = ts.createPrinter({ removeComments: true });
/** Record provenance and point readers to the original license. */
const header = [
  `// Generated from @ai-sdk/mcp@${manifest.version}. Do not edit by hand.`,
  '// SPDX-License-Identifier: Apache-2.0',
  '// See mcp-contract.LICENSE for the upstream license.',
  '// The runtime SDK remains the authority for protocol behavior.',
  '',
].join('\n');
/** Resolve the generated MCP contract in the source tree. */
const contractPath = fileURLToPath(
  new URL('../src/integrations/internal/mcp-contract.ts', import.meta.url),
);
/** Use type-only imports so the contract does not load the native MCP client. */
const contract = printer
  .printFile(parsed)
  .replace(/^import /gmu, 'import type ');
/** Format the projected contract before byte comparison or writing. */
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
