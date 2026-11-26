import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import ts from 'typescript';
import {
  describeConstructorAdapter,
  describeSignatures,
} from './sdk-declaration-graph.mjs';
import { describeMemberAdapters } from './sdk-member-adapters.mjs';
import { describeNativeMembers } from './sdk-member-contracts.mjs';

/** Require an installed consumer and an output file for the member proof. */
const { values } = parseArgs({
  options: {
    fixture: { type: 'string' },
    output: { type: 'string' },
    context: { type: 'string', default: 'node-import' },
    entry: { type: 'string', multiple: true },
    'report-only': { type: 'boolean' },
  },
});
assert.ok(values.fixture && values.output, 'Pass --fixture and --output.');
/** Canonicalize the consumer path before comparing declaration origins. */
const fixture = realpathSync(values.fixture);
/** Locate the installed wrapper independently of the repository source. */
const wrapperRoot = realpathSync(
  join(fixture, 'node_modules/@jambudipa/ai-effect'),
);
/** Use Node ESM unless the caller requests another resolver context. */
const context = values.context;
/** Read the pinned runtime and declaration surface for the member comparison. */
const baseline = JSON.parse(
  readFileSync(new URL('../docs/sdk-surface.json', import.meta.url), 'utf8'),
);
assert.ok(
  Object.hasOwn(baseline.paths[0].resolvers, context),
  `Unknown resolution context ${context}`,
);
/** Validate explicit SDK paths against the inventory before creating the compiler program. */
const paths = values.entry
  ? values.entry.map((entry) => {
      const path = baseline.paths.find(({ upstream }) => upstream === entry);
      assert.ok(path, `Unknown SDK entry ${entry}`);
      return path;
    })
  : baseline.paths;

/** Use bundler resolution for Vite-style and Svelte entry points. */
const bundler = ['bundler-import', 'svelte'].includes(context);
/** Resolve require branches for CommonJS and the legacy module condition. */
const requireMode = ['node-require', 'legacy-module'].includes(context);
/** Set only the additional condition that the selected route requires. */
const condition = {
  'legacy-module': 'module',
  'react-server': 'react-server',
  svelte: 'svelte',
}[context];
/** Match the requested resolver while reading types from the installed consumer. */
const compilerOptions = {
  module: bundler ? ts.ModuleKind.Preserve : ts.ModuleKind.NodeNext,
  moduleResolution: bundler
    ? ts.ModuleResolutionKind.Bundler
    : ts.ModuleResolutionKind.NodeNext,
  customConditions: condition ? [condition] : [],
  target: ts.ScriptTarget.ES2022,
  strict: true,
  types: ['node'],
  typeRoots: [join(fixture, 'node_modules/@types')],
};
/** Give TypeScript the same import or require mode as the tested context. */
const mode = requireMode ? ts.ModuleKind.CommonJS : ts.ModuleKind.ESNext;
/** Use one compiler host for export resolution and symbol inspection. */
const host = ts.createCompilerHost(compilerOptions);
/** Anchor TypeScript resolution to a file format in the consumer directory. */
const probe = join(
  fixture,
  requireMode ? 'member-proof.cts' : 'member-proof.mts',
);
/** Pair each installed wrapper declaration with its selected SDK declaration and runtime names. */
const inputs = paths.map((path) => {
  const [sdkPackage] = path.upstream.match(/^(@[^/]+\/[^/]+|[^/]+)/u);
  const nested = join(wrapperRoot, 'node_modules', sdkPackage);
  const sdkRoot = existsSync(join(nested, 'package.json'))
    ? nested
    : join(fixture, 'node_modules', sdkPackage);
  const { runtime, types } = path.resolvers[context];
  const upstream = types ? realpathSync(join(sdkRoot, types)) : null;
  const wrapperImport = `@jambudipa/ai-effect${path.wrapper.slice(1)}`;
  const { resolvedModule } = ts.resolveModuleName(
    wrapperImport,
    probe,
    compilerOptions,
    host,
    undefined,
    undefined,
    mode,
  );
  assert.ok(resolvedModule, `Cannot resolve ${wrapperImport}`);
  const wrapper = realpathSync(resolvedModule.resolvedFileName);
  assert.ok(!relative(wrapperRoot, wrapper).startsWith('..'), wrapper);
  return {
    path,
    upstream,
    wrapper,
    runtimeTarget: runtime,
    actualTypes: path.targets[types],
    runtimeNames: path.targets[runtime]?.names ?? [],
  };
});

/** Load each declaration once so the proof can compare symbols in one type graph. */
const program = ts.createProgram(
  [
    ...new Set(
      inputs.flatMap(({ upstream, wrapper }) =>
        upstream ? [upstream, wrapper] : [wrapper],
      ),
    ),
  ],
  compilerOptions,
  host,
);
/** Resolve aliases and public members with the same checker used for the program. */
const checker = program.getTypeChecker();
/** Ignore documentation and formatting when hashing upstream declarations. */
const printer = ts.createPrinter({ removeComments: true });
/** Cache export maps for entries that share a declaration target. */
const modules = new Map();
/** Return the module's public symbols and validate its archive hash on first use. */
function exportsOf(file, archiveHash) {
  if (!file) return new Map();
  if (!modules.has(file)) {
    const source = program.getSourceFile(file);
    assert.ok(source, `Missing declaration file ${file}`);
    if (archiveHash) {
      const hash = createHash('sha256')
        .update(printer.printFile(source))
        .digest('hex');
      assert.equal(hash, archiveHash, `Archive declaration differs at ${file}`);
    }
    const namespace = checker.getSymbolAtLocation(source);
    assert.ok(namespace, `Missing declaration namespace at ${file}`);
    modules.set(
      file,
      new Map(
        checker
          .getExportsOfModule(namespace)
          .map((symbol) => [symbol.name, symbol]),
      ),
    );
  }
  return modules.get(file);
}

/** Trace aliases to unique declaration files relative to the installed fixture. */
function declarationOrigins(symbol) {
  if (!symbol) return [];
  const target =
    symbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  return [
    ...new Set(
      (target.getDeclarations() ?? []).map((node) =>
        relative(fixture, node.getSourceFile().fileName),
      ),
    ),
  ].sort();
}

/** Count checked exports and member outcomes independently of entry order. */
const counts = {
  paths: paths.length,
  exports: 0,
  absentExports: 0,
  staticMembers: 0,
  resultMembers: 0,
  callableResults: 0,
  externalMembers: 0,
  optionalNativeSlots: 0,
  unmatchedMembers: 0,
};
/** Record the matched wrapper exports and member adapters for every selected path. */
const entries = inputs.map(
  ({ path, upstream, wrapper, runtimeTarget, actualTypes, runtimeNames }) => {
    const nativeExports = exportsOf(upstream, actualTypes?.declarationHash);
    const wrapperExports = exportsOf(wrapper);
    const runtime = new Set(runtimeNames);
    const otherRuntimeNames = new Set(
      Object.entries(path.targets)
        .filter(
          ([target, info]) =>
            target !== runtimeTarget && info.format !== 'declaration',
        )
        .flatMap(([, info]) => info.names),
    );
    const declared = (actualTypes?.names ?? []).filter(
      (name) =>
        !runtimeTarget || !otherRuntimeNames.has(name) || runtime.has(name),
    );
    const exports = [...new Set([...declared, ...runtime])].sort();
    return {
      upstream: path.upstream,
      wrapper: path.wrapper,
      declaration: relative(wrapperRoot, wrapper),
      exports: exports.map((name) => {
        counts.exports++;
        const native = nativeExports.get(name);
        const adapter = wrapperExports.get(name);
        const origins = declarationOrigins(adapter);
        if (!adapter) counts.absentExports++;
        if (!runtime.has(name))
          return {
            name,
            kind: 'type',
            declarations: origins,
            present: Boolean(adapter),
          };
        const expected = native ? describeSignatures(checker, native) : null;
        const signatures = adapter
          ? describeSignatures(checker, adapter)
          : null;
        const construction =
          adapter && expected?.constructors
            ? describeConstructorAdapter(checker, adapter)
            : null;
        const members = native
          ? describeMemberAdapters(
              checker,
              adapter,
              describeNativeMembers(checker, native),
              {
                parameterlessConstructor: expected.parameterlessConstructor,
                upstreamPath: path.upstream,
              },
            )
          : { static: [], returns: [] };
        const results = members.returns.flatMap((root) => root.members);
        const callableResults = members.returns.filter(
          (root) => root.calls || root.constructors,
        );
        const namedMembers = [...members.static, ...results];
        counts.staticMembers += members.static.length;
        counts.resultMembers += results.length;
        counts.callableResults += callableResults.length;
        counts.externalMembers += namedMembers.filter(
          (member) => member.coverage === 'external-declaration',
        ).length;
        counts.optionalNativeSlots += namedMembers.filter(
          (member) => member.coverage === 'sdk-slot-unimplemented',
        ).length;
        counts.unmatchedMembers += namedMembers.filter(
          (member) => member.coverage === 'unmapped',
        ).length;
        counts.unmatchedMembers += callableResults.filter(
          (root) => !root.adapter,
        ).length;
        return {
          name,
          kind:
            expected?.calls || expected?.constructors || members.static.length
              ? 'operation'
              : 'data',
          present: Boolean(adapter),
          declarations: origins,
          expected,
          signatures,
          construction,
          members,
        };
      }),
    };
  },
);

writeFileSync(
  resolve(values.output),
  JSON.stringify(
    { inventoryRevision: baseline.inventoryRevision, context, counts, entries },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify(counts, null, 2));
if (
  !values['report-only'] &&
  (counts.absentExports || counts.unmatchedMembers)
) {
  process.exitCode = 1;
}
