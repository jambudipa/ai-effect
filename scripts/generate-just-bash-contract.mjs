import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

/** Require the nested host version whose declarations the projection supports. */
const version = '2.14.5';
/** Find the exact declarations missing from the published just-bash archive. */
const recoveryDir = new URL(
  './sdk-contract-sources/just-bash/',
  import.meta.url,
);
/** Use recovered declarations for the two known omissions in the published archive. */
const recoveredFiles = new Set(['security/types.d.ts', 'transform/types.d.ts']);
/** Retain the upstream text and license comments in the projected declarations. */
const printer = ts.createPrinter();

/** Copy the sandbox's reachable types and remove private class fields that would block structural compatibility. */
export async function generateJustBashContract(
  wrapperRequire,
  outputDirectory,
) {
  const sandboxRequire = createRequire(
    wrapperRequire.resolve('@ai-sdk/sandbox-just-bash/package.json'),
  );
  const packageDirectory = path.resolve(
    path.dirname(sandboxRequire.resolve('just-bash')),
    '../..',
  );
  const manifest = JSON.parse(
    await readFile(path.join(packageDirectory, 'package.json'), 'utf8'),
  );
  if (manifest.name !== 'just-bash' || manifest.version !== version) {
    throw new Error(`Expected the pinned just-bash@${version} host.`);
  }

  const license = await readFile(
    path.join(packageDirectory, 'LICENSE'),
    'utf8',
  );
  const output = new Map([['just-bash/LICENSE', license]]);
  const declarations = new Set(['sandbox/Sandbox.d.ts']);
  for (const filename of declarations) {
    const sourceFile = recoveredFiles.has(filename)
      ? new URL(filename, recoveryDir)
      : path.join(packageDirectory, 'dist', filename);
    const source = ts.createSourceFile(
      filename,
      await readFile(sourceFile, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    const visitImport = (node) => {
      if (
        ts.isStringLiteral(node) &&
        node.text.startsWith('.') &&
        (((ts.isImportDeclaration(node.parent) ||
          ts.isExportDeclaration(node.parent)) &&
          node.parent.moduleSpecifier === node) ||
          (ts.isLiteralTypeNode(node.parent) &&
            ts.isImportTypeNode(node.parent.parent)))
      ) {
        const target = path.posix.join(
          path.posix.dirname(filename),
          node.text.replace(/\.js$/u, '.d.ts'),
        );
        if (target.startsWith('../') || !target.endsWith('.d.ts')) {
          throw new Error(
            `Unexpected declaration path ${node.text} in ${filename}.`,
          );
        }
        declarations.add(target);
      }
      node.forEachChild(visitImport);
    };
    visitImport(source);

    // Preserve the public class instance shape. A copied private field would
    // make the real Sandbox or Bash instance unassignable to the contract.
    const projection = ts.transform(source, [
      (context) => (root) => {
        const visitClass = (node) => {
          if (!ts.isClassDeclaration(node))
            return ts.visitEachChild(node, visitClass, context);
          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            node.members.filter(
              (member) =>
                ts.isConstructorDeclaration(member) ||
                !member.modifiers?.some(
                  (modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword,
                ),
            ),
          );
        };
        return ts.visitNode(root, visitClass);
      },
    ]);
    const declaration = printer.printFile(projection.transformed[0]);
    projection.dispose();

    const outputPath = `just-bash/${filename}`;
    const filepath = path.join(outputDirectory, outputPath);
    const header = `// Generated from just-bash@${version}. Do not edit.\n// Original license: just-bash/LICENSE.\n`;
    output.set(
      outputPath,
      await format(header + declaration, {
        ...(await resolveConfig(filepath)),
        filepath,
      }),
    );
  }
  return output;
}
