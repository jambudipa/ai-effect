import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual, parseArgs } from 'node:util';
import ts from 'typescript';
import { openArchives } from './sdk-archives.mjs';
import { describeSignatures } from './sdk-declaration-graph.mjs';

/** Resolve archive inventory and output paths independently of the shell directory. */
const project = fileURLToPath(new URL('..', import.meta.url));
/** Use exact upstream versions and integrity hashes from the repository inventory. */
const inventoryPath = join(project, '_bmad-output/sdk-upstream-inventory.json');
/** Write or compare the public export baseline at this path. */
const surfacePath = join(project, 'docs/sdk-surface.json');

/** Represent Node and bundler export resolution with explicit condition sets. */
const contexts = {
  'node-import': ['node', 'node-addons', 'import'],
  'node-require': ['node', 'node-addons', 'require', 'module-sync'],
  'bundler-import': ['browser', 'module', 'import'],
  'legacy-module': ['node', 'require', 'module'],
  svelte: ['browser', 'module', 'import', 'svelte'],
  'react-server': ['node', 'import', 'react-server'],
};

/** Flatten a conditional export map while preserving its order and condition ancestry. */
function targetLeaves(branch, conditions = []) {
  if (typeof branch === 'string') return [{ conditions, target: branch }];
  assert.ok(
    branch && typeof branch === 'object' && !Array.isArray(branch),
    'Unsupported export target',
  );
  return Object.entries(branch).flatMap(([condition, child]) =>
    targetLeaves(child, [...conditions, condition]),
  );
}

/** Return the first leaf whose ancestor conditions all match. */
function select(leaves, conditions) {
  return leaves.find((leaf) =>
    leaf.conditions.every(
      (condition) => condition === 'default' || conditions.includes(condition),
    ),
  );
}

/** Recognize ESM, CommonJS, and extension-neutral TypeScript declarations. */
function isDeclaration(target) {
  return /\.d\.[cm]?ts$/u.test(target);
}

/** Validate the archive's public paths and reject unreviewed implicit exports. */
function describePaths({ pin, root, manifest }) {
  if (!manifest.exports) {
    assert.ok(
      !manifest.main &&
        !manifest.module &&
        !manifest.types &&
        !manifest.typings &&
        !['index.js', 'index.json', 'index.node', 'index.d.ts'].some((file) =>
          existsSync(join(root, file)),
        ),
      `Review implicit exports for ${pin.name}`,
    );
  }
  const exports = manifest.exports ?? {};
  const publicPaths = Object.keys(exports).filter(
    (path) =>
      path !== './package.json' &&
      path !== './internal' &&
      !path.startsWith('./internal/'),
  );
  assert.deepEqual(
    publicPaths.toSorted(),
    pin.publicPaths.toSorted(),
    `Public paths for ${pin.name}`,
  );
  return publicPaths.toSorted().map((path) => {
    assert.ok(
      path === '.' || /^\.\/[\w/-]+$/u.test(path),
      `Unsupported export path ${pin.name} ${path}`,
    );
    const branches = exports[path];
    assert.deepEqual(
      branches,
      pin.exports[path],
      `Export targets for ${pin.name} ${path}`,
    );
    const leaves = targetLeaves(branches);
    const reached = new Set();
    const resolvers = Object.fromEntries(
      Object.entries(contexts).map(([context, flags]) => {
        const runtime = select(leaves, flags);
        const types = select(leaves, ['types', ...flags]);
        if (runtime) reached.add(runtime);
        if (types && isDeclaration(types.target)) reached.add(types);
        return [
          context,
          {
            runtime: runtime?.target ?? null,
            types: types && isDeclaration(types.target) ? types.target : null,
          },
        ];
      }),
    );
    const upstream = `${pin.name}${path.slice(1)}`;
    return {
      upstream,
      wrapper: `./${upstream.replace(/^@ai-sdk\//u, '')}`,
      root,
      type: manifest.type,
      manifestOrderDiffers: !isDeepStrictEqual(
        leaves,
        targetLeaves(pin.exports[path]),
      ),
      resolvers,
      leaves: leaves.map((leaf) => ({ ...leaf, reached: reached.has(leaf) })),
    };
  });
}

/** Accept names written as identifiers or string literals and reject unfamiliar syntax. */
function nameOf(node) {
  assert.ok(
    node && (ts.isIdentifier(node) || ts.isStringLiteral(node)),
    'Unsupported export name',
  );
  return node.text;
}

/** Read explicit ESM exports and require review when the SDK adds a star export. */
function esmNames(source) {
  const names = new Set();
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      assert.ok(
        statement.exportClause,
        `Review runtime star export in ${source.fileName}`,
      );
      if (ts.isNamespaceExport(statement.exportClause))
        names.add(nameOf(statement.exportClause.name));
      else
        for (const element of statement.exportClause.elements)
          names.add(nameOf(element.name));
    } else if (ts.isExportAssignment(statement)) {
      assert.ok(
        !statement.isExportEquals,
        `Unexpected export assignment in ${source.fileName}`,
      );
      names.add('default');
    } else if (
      ts
        .getModifiers(statement)
        ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (
        ts
          .getModifiers(statement)
          .some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)
      ) {
        names.add('default');
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations)
          names.add(nameOf(declaration.name));
      } else {
        assert.ok(
          statement.name,
          `Missing exported name in ${source.fileName}`,
        );
        names.add(nameOf(statement.name));
      }
    }
  }
  return [...names].sort();
}

/** Read CommonJS named export markers without executing the SDK module. */
function cjsNames(source) {
  const names = new Set();
  for (const statement of source.statements) {
    if (
      !ts.isExpressionStatement(statement) ||
      !ts.isBinaryExpression(statement.expression)
    )
      continue;
    const { left, operatorToken, right } = statement.expression;
    if (
      operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(left) &&
      left.expression.getText(source) === 'exports'
    )
      names.add(nameOf(left.name));
    // esbuild emits this unreachable assignment so Node can discover named exports.
    if (
      operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
      left.getText(source) === '0' &&
      ts.isParenthesizedExpression(right) &&
      ts.isBinaryExpression(right.expression) &&
      right.expression.left.getText(source) === 'module.exports' &&
      right.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isObjectLiteralExpression(right.expression.right)
    ) {
      for (const property of right.expression.right.properties)
        names.add(nameOf(property.name));
    }
  }
  assert.ok(names.size, `Review CommonJS export syntax in ${source.fileName}`);
  return [...names].sort();
}

/** Inspect TypeScript exports, callable signatures, and normalized declaration hashes. */
function describeDeclarations(files) {
  const options = {
    module: ts.ModuleKind.NodeNext,
    types: [],
    skipLibCheck: true,
  };
  const host = ts.createCompilerHost(options);
  // The one external declaration star export in the pins is @standard-schema/spec.
  // Resolve it from the locked tool install, because archives are opened in a temp directory.
  host.resolveModuleNameLiterals = (literals, file, _, opts) =>
    literals.map(({ text }) =>
      ts.resolveModuleName(
        text,
        text === '@standard-schema/spec'
          ? join(project, 'archive-probe.mts')
          : file,
        opts,
        host,
      ),
    );
  const program = ts.createProgram([...files.keys()], options, host);
  const checker = program.getTypeChecker();
  // The verified installed targets can resolve re-exports through the locked
  // dependency graph. The archives alone do not include transitive packages.
  const installed = ts.createProgram([...files.values()], options);
  const installedChecker = installed.getTypeChecker();
  const printer = ts.createPrinter({ removeComments: true });
  const hash = (text) => createHash('sha256').update(text).digest('hex');
  return new Map(
    [...files].map(([file, installedFile]) => {
      const source = program.getSourceFile(file);
      assert.ok(source, `Missing declaration ${file}`);
      for (const statement of source.statements) {
        if (ts.isExportDeclaration(statement) && !statement.exportClause) {
          assert.ok(
            checker.getSymbolAtLocation(statement.moduleSpecifier),
            `Unresolved declaration export in ${file}: ${statement.getText(source)}`,
          );
        }
      }
      const namespace = checker.getSymbolAtLocation(source);
      assert.ok(
        namespace,
        `Declaration does not have an export namespace: ${file}`,
      );
      const symbols = checker
        .getExportsOfModule(namespace)
        .sort((left, right) => (left.name < right.name ? -1 : 1));
      const signatures = Object.fromEntries(
        symbols.map((symbol) => {
          const original =
            symbol.flags & ts.SymbolFlags.Alias
              ? checker.getAliasedSymbol(symbol)
              : symbol;
          const declarations = original.declarations ?? symbol.declarations;
          return [
            symbol.name,
            hash(
              (declarations ?? [])
                .map((node) =>
                  printer.printNode(
                    ts.EmitHint.Unspecified,
                    node,
                    node.getSourceFile(),
                  ),
                )
                .join('\n'),
            ),
          ];
        }),
      );
      const installedNamespace = installedChecker.getSymbolAtLocation(
        installed.getSourceFile(installedFile),
      );
      assert.ok(
        installedNamespace,
        `Missing declaration module ${installedFile}`,
      );
      const operations = installedChecker
        .getExportsOfModule(installedNamespace)
        .map((symbol) => [
          symbol.name,
          describeSignatures(installedChecker, symbol),
        ])
        .sort(([left], [right]) => (left < right ? -1 : 1));
      const signatureTable = (kind) =>
        Object.fromEntries(
          operations
            .map(([name, operation]) => [name, operation[kind]])
            .filter(([, count]) => count > 0),
        );
      const calls = signatureTable('calls');
      const constructors = signatureTable('constructors');
      const parameterlessConstructors = operations
        .filter(([, operation]) => operation.parameterlessConstructor)
        .map(([name]) => name);
      return [
        file,
        {
          format: 'declaration',
          names: symbols.map(({ name }) => name),
          signatures,
          ...(Object.keys(calls).length ? { calls } : {}),
          ...(Object.keys(constructors).length ? { constructors } : {}),
          ...(parameterlessConstructors.length
            ? { parameterlessConstructors }
            : {}),
          declarationHash: hash(printer.printFile(source)),
        },
      ];
    }),
  );
}

/** Inspect each distinct leaf once and verify the installed declarations match the archive. */
async function describeTargets(paths) {
  const declarations = new Map();
  const names = new Map();
  for (const { root, type, leaves, upstream } of paths) {
    const packageName = upstream.match(/^(@[^/]+\/[^/]+|[^/]+)/u)[0];
    for (const { target } of leaves) {
      assert.match(
        target,
        /^\.\/[\w./-]+$/u,
        `Unsupported export target ${target}`,
      );
      assert.ok(
        !target.split('/').includes('..'),
        `Export target escapes package ${target}`,
      );
      const file = join(root, target);
      if (isDeclaration(target)) {
        if (declarations.has(file)) continue;
        const installed = join(project, 'node_modules', packageName, target);
        const [archivedBytes, installedBytes] = await Promise.all([
          readFile(file),
          readFile(installed),
        ]);
        assert.ok(
          archivedBytes.equals(installedBytes),
          `Installed declaration differs from the pinned archive: ${upstream} ${target}`,
        );
        declarations.set(file, installed);
      } else if (!names.has(file)) {
        const source = ts.createSourceFile(
          file,
          await readFile(file, 'utf8'),
          ts.ScriptTarget.Latest,
          false,
          ts.ScriptKind.JS,
        );
        assert.equal(
          source.parseDiagnostics.length,
          0,
          `Invalid JavaScript in ${file}`,
        );
        const esm =
          target.endsWith('.mjs') ||
          (target.endsWith('.js') && type === 'module');
        const exports = esm ? esmNames(source) : cjsNames(source);
        names.set(file, { format: esm ? 'esm' : 'cjs', names: exports });
      }
    }
  }
  for (const [file, description] of describeDeclarations(declarations)) {
    names.set(file, description);
  }
  return paths.map(({ root, type: _type, ...path }) => ({
    ...path,
    targets: Object.fromEntries(
      [...new Set(path.leaves.map(({ target }) => target))].map((target) => [
        target,
        names.get(join(root, target)),
      ]),
    ),
  }));
}

/** Build a deterministic public surface report from verified SDK archives. */
async function collect(inventory, archiveDirectory, cache) {
  const archives = await openArchives(
    inventory.packages,
    archiveDirectory,
    cache,
  );
  const paths = await describeTargets(archives.flatMap(describePaths));
  assert.equal(
    new Set(paths.map((path) => path.wrapper)).size,
    paths.length,
    'Duplicate wrapper import path',
  );
  const noImportPackages = archives
    .filter(({ pin }) => !pin.publicPaths.length)
    .map(({ pin, manifest }) => ({
      name: pin.name,
      reason: manifest.bin ? 'cli-only' : 'no-entry-point',
    }));
  const emptyPaths = paths
    .filter((path) =>
      Object.values(path.targets).every(({ names }) => !names.length),
    )
    .map(({ upstream }) => upstream);
  const leaves = paths.flatMap((path) => path.leaves);
  const targets = new Set(
    paths.flatMap(({ upstream, targets }) =>
      Object.keys(targets).map(
        (target) => `${upstream.match(/^(@[^/]+\/[^/]+|[^/]+)/u)[0]}:${target}`,
      ),
    ),
  );
  return {
    inventoryRevision: inventory.revision,
    counts: {
      packages: archives.length,
      publicPaths: paths.length,
      declaredLeaves: leaves.length,
      reachedLeaves: leaves.filter(({ reached }) => reached).length,
      shadowedLeaves: leaves.filter(({ reached }) => !reached).length,
      uniqueTargets: targets.size,
      emptyPaths: emptyPaths.length,
      noImportPackages: noImportPackages.length,
    },
    noImportPackages,
    emptyPaths,
    paths,
  };
}

/** Fail on path, export, declaration, or condition drift from the committed baseline. */
function compareBaseline(actual, expected) {
  const expectedPaths = new Map(
    expected.paths.map((path) => [path.upstream, path]),
  );
  for (const path of actual.paths) {
    const previous = expectedPaths.get(path.upstream);
    assert.ok(previous, `New SDK path ${path.upstream}`);
    for (const [target, exports] of Object.entries(path.targets)) {
      const old = previous.targets[target];
      assert.ok(old, `New target ${path.upstream}: ${target}`);
      const added = exports.names.filter((name) => !old.names.includes(name));
      const removed = old.names.filter((name) => !exports.names.includes(name));
      assert.ok(
        !added.length && !removed.length,
        [
          `${path.upstream} ${target} export drift`,
          `Added: ${added.join(', ') || 'none'}`,
          `Removed: ${removed.join(', ') || 'none'}`,
        ].join('\n'),
      );
      if (exports.format === 'declaration') {
        const changed = exports.names.filter(
          (name) => exports.signatures[name] !== old.signatures?.[name],
        );
        assert.ok(
          !changed.length,
          `${path.upstream} ${target} declaration drift: ${changed.join(', ')}`,
        );
        assert.equal(
          exports.declarationHash,
          old.declarationHash,
          `${path.upstream} ${target} declaration body changed`,
        );
        for (const kind of [
          'calls',
          'constructors',
          'parameterlessConstructors',
        ]) {
          assert.deepEqual(
            exports[kind],
            old[kind],
            `${path.upstream} ${target} ${kind} drift`,
          );
        }
      }
    }
    assert.deepEqual(path, previous, `Changed resolution for ${path.upstream}`);
    expectedPaths.delete(path.upstream);
  }
  assert.deepEqual([...expectedPaths.keys()], [], 'Removed SDK paths');
  assert.deepEqual(
    { ...actual, paths: [] },
    { ...expected, paths: [] },
    'Changed SDK baseline summary',
  );
}

/** Use explicit flags to write the baseline or select a reusable archive cache. */
const { values } = parseArgs({
  options: { write: { type: 'boolean' }, cache: { type: 'string' } },
});
/** Read the pin metadata that determines which archives to verify. */
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
/** Extract archives outside the source tree and remove them in the cleanup path. */
const scratch = await mkdtemp(join(tmpdir(), 'ai-effect-sdk-surface-'));
try {
  const baseline = await collect(
    inventory,
    scratch,
    values.cache ?? join(tmpdir(), 'ai-effect-sdk-archives'),
  );
  const computed = `${JSON.stringify(baseline, null, 2)}\n`;
  if (values.write) await writeFile(surfacePath, computed);
  else
    compareBaseline(baseline, JSON.parse(await readFile(surfacePath, 'utf8')));
  console.log(JSON.stringify(baseline.counts));
} finally {
  await rm(scratch, { recursive: true, force: true });
}
