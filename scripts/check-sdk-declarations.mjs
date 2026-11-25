import assert from 'node:assert/strict';
import { realpathSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import ts from 'typescript';
import {
  findPrivateSdkImports,
  findSdkOperations,
} from './sdk-declaration-graph.mjs';

const { values } = parseArgs({
  options: {
    fixture: { type: 'string' },
    entry: { type: 'string', multiple: true },
    context: { type: 'string', multiple: true },
    'operations-only': { type: 'boolean' },
  },
});
assert.ok(
  values.fixture,
  'Pass --fixture with the external consumer directory',
);
const fixture = resolve(values.fixture);
const packageRoot = join(fixture, 'node_modules/@jambudipa/ai-effect');
const manifest = JSON.parse(
  await readFile(join(packageRoot, 'package.json'), 'utf8'),
);
const baseline = JSON.parse(
  await readFile(new URL('../docs/sdk-surface.json', import.meta.url), 'utf8'),
);
const publicSdkPaths = new Set(baseline.paths.map(({ upstream }) => upstream));
const paths = values.entry
  ? values.entry.map((entry) => {
      const path = baseline.paths.find(({ upstream }) => upstream === entry);
      assert.ok(path, `Unknown SDK entry ${entry}`);
      return path;
    })
  : baseline.paths;

const contexts = {
  'node-import': { mode: ts.ModuleKind.ESNext },
  'node-require': { mode: ts.ModuleKind.CommonJS },
  'bundler-import': { mode: ts.ModuleKind.ESNext, bundler: true },
  'legacy-module': { mode: ts.ModuleKind.CommonJS, flags: ['module'] },
  svelte: { mode: ts.ModuleKind.ESNext, bundler: true, flags: ['svelte'] },
  'react-server': { mode: ts.ModuleKind.ESNext, flags: ['react-server'] },
};

function declarationTarget(branch, conditions) {
  if (typeof branch === 'string') return branch;
  for (const [condition, value] of Object.entries(branch ?? {})) {
    if (condition !== 'default' && !conditions.includes(condition)) continue;
    const target = declarationTarget(value, conditions);
    if (target) return target;
  }
  return undefined;
}

function resolveDeclarations(context, options, mode) {
  const host = ts.createCompilerHost(options);
  const conditions = [
    'types',
    mode === ts.ModuleKind.CommonJS ? 'require' : 'import',
    ...(options.moduleResolution === ts.ModuleResolutionKind.NodeNext
      ? ['node']
      : []),
    ...(options.customConditions ?? []),
  ];
  const probe = join(
    fixture,
    mode === ts.ModuleKind.CommonJS ? 'probe.cts' : 'probe.mts',
  );
  const files = paths.map((path) => {
    const specifier = `@jambudipa/ai-effect${path.wrapper.slice(1)}`;
    const { resolvedModule } = ts.resolveModuleName(
      specifier,
      probe,
      options,
      host,
      undefined,
      undefined,
      mode,
    );
    assert.ok(resolvedModule, `${context}: cannot resolve ${specifier}`);
    const file = resolvedModule.resolvedFileName;
    assert.match(
      file,
      /\.d\.[cm]?ts$/u,
      `${context}: ${specifier} must resolve declarations`,
    );
    const target = declarationTarget(
      manifest.exports[path.wrapper],
      conditions,
    );
    assert.ok(target, `${context}: ${specifier} has no declaration target`);
    assert.equal(
      realpathSync(file),
      realpathSync(join(packageRoot, target)),
      `${context}: ${specifier} selected the wrong declaration target`,
    );
    return { path, file };
  });
  return { files, host };
}

function inspect(context, { mode, bundler, flags }) {
  const options = {
    module: bundler ? ts.ModuleKind.Preserve : ts.ModuleKind.NodeNext,
    moduleResolution: bundler
      ? ts.ModuleResolutionKind.Bundler
      : ts.ModuleResolutionKind.NodeNext,
    customConditions: flags,
    target: ts.ScriptTarget.ES2022,
    strict: true,
    skipLibCheck: false,
    types: ['node'],
    typeRoots: [join(fixture, 'node_modules/@types')],
  };
  const { files, host } = resolveDeclarations(context, options, mode);
  const program = ts.createProgram(
    [...new Set(files.map(({ file }) => file))],
    options,
    host,
  );
  const checker = program.getTypeChecker();
  const checkedTypes = new Set();
  const failures = findPrivateSdkImports(program, publicSdkPaths).map(
    ({ source, specifier }) =>
      `Private SDK declaration import ${specifier} in ${source}`,
  );
  for (const { path, file } of files) {
    const namespace = checker.getSymbolAtLocation(program.getSourceFile(file));
    assert.ok(
      namespace,
      `${context}: ${path.wrapper} does not resolve to a module`,
    );
    const symbols = checker.getExportsOfModule(namespace);
    if (!values['operations-only']) {
      const names = new Set(symbols.map(({ name }) => name));
      const target = path.resolvers[context].types;
      const runtime = path.resolvers[context].runtime;
      const runtimeNames = new Set(path.targets[runtime]?.names ?? []);
      const otherRuntimeNames = new Set(
        Object.entries(path.targets)
          .filter(
            ([file, target]) =>
              target.format !== 'declaration' && file !== runtime,
          )
          .flatMap(([, target]) => target.names),
      );
      for (const name of path.targets[target]?.names ?? []) {
        // Shared upstream declarations can describe operations exclusive to another branch.
        if (runtime && otherRuntimeNames.has(name) && !runtimeNames.has(name))
          continue;
        if (!names.has(name))
          failures.push(`${path.wrapper} is missing type export ${name}`);
      }
    }
    for (const operation of findSdkOperations(
      checker,
      symbols,
      [],
      checkedTypes,
    )) {
      failures.push(
        `${path.wrapper} leaks SDK operation ${operation.path} from ${operation.source}`,
      );
    }
  }
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length) {
    failures.push(ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
  }
  return failures.map((failure) => `${context}: ${failure}`);
}

const selectedContexts = values.context ?? Object.keys(contexts);
const failures = [];
for (const context of selectedContexts) {
  assert.ok(Object.hasOwn(contexts, context), `Unknown context ${context}`);
  const errors = inspect(context, contexts[context]);
  failures.push(...errors);
  for (const error of errors) console.error(error);
  console.log(`${context}: checked ${paths.length} packed declaration paths`);
}
if (failures.length) {
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${paths.length} packed SDK declaration paths under ${selectedContexts.length} resolution contexts`,
  );
}
