import ts from 'typescript';

/** Recognize the last dependency boundary in nested installations. */
const dependencyDirectory = '/node_modules/';
/** Treat declarations shipped inside the wrapper as a separate origin. */
const wrapperDirectory = '@jambudipa/ai-effect/';

/** Normalize separators before comparing compiler source paths across platforms. */
function sourcePath(declaration) {
  return declaration.getSourceFile().fileName.replaceAll('\\', '/');
}

/** Identify the innermost installed dependency that owns a declaration. */
function dependencyPath(path) {
  const start = path.lastIndexOf(dependencyDirectory);
  return start < 0 ? '' : path.slice(start + dependencyDirectory.length);
}

/** Include copied upstream contracts and exclude host-owned just-bash shapes. */
function hasSdkOrigin(declaration) {
  const path = sourcePath(declaration);
  if (path.includes('/harness-contracts/just-bash/')) return false;
  const dependency = dependencyPath(path);
  if (/^(?:ai|@ai-sdk\/[^/]+)\//u.test(dependency)) return true;
  if (dependency && !dependency.startsWith(wrapperDirectory)) return false;
  return (
    path.endsWith('/integrations/internal/mcp-contract.d.ts') ||
    path.endsWith('/integrations/internal/code-mode-contract.d.ts') ||
    /\/(?:integrations\/internal\/harness-contracts|internal\/provider-contracts)\/.*\.d\.ts$/u.test(
      path,
    )
  );
}

/** Recognize the installed wrapper's declarations except host-owned just-bash types. */
function hasWrapperOrigin(declaration) {
  const path = sourcePath(declaration);
  return (
    dependencyPath(path).startsWith(wrapperDirectory) &&
    !path.includes('/harness-contracts/just-bash/')
  );
}

/** Preserve type-only export semantics even when the aliased symbol has a value. */
function isTypeOnly(symbol) {
  return symbol.declarations?.some(
    (node) =>
      ts.isExportSpecifier(node) &&
      (node.isTypeOnly || node.parent.parent.isTypeOnly),
  );
}

/** Traverse both alias arguments and the compiler's resolved reference arguments. */
function typeArguments(checker, type) {
  const args = type.aliasTypeArguments ?? [];
  if (
    type.flags & ts.TypeFlags.Object &&
    type.objectFlags & ts.ObjectFlags.Reference
  ) {
    return [...args, ...checker.getTypeArguments(type)];
  }
  return args;
}

/** Report raw SDK calls, constructors, methods, and getters in the public types. */
export function exportedValueType(checker, exported) {
  const symbol =
    exported.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(exported)
      : exported;
  if (!(symbol.flags & ts.SymbolFlags.Value) || isTypeOnly(exported)) return;
  return checker.getTypeOfSymbol(symbol);
}

/** Record call and construct signature counts and detect a lone zero-argument constructor. */
export function describeSignatures(checker, exported) {
  const type = exportedValueType(checker, exported);
  const constructors = type?.getConstructSignatures() ?? [];
  return {
    calls: type?.getCallSignatures().length ?? 0,
    constructors: constructors.length,
    parameterlessConstructor:
      constructors.length === 1 && constructors[0].getParameters().length === 0,
  };
}

/** Recognize the two supported factory projections for a native constructor. */
export function describeConstructorAdapter(checker, exported) {
  const type = exportedValueType(checker, exported);
  const factory = type?.getProperty('make');
  return {
    factory: factory
      ? checker.getTypeOfSymbol(factory).getCallSignatures().length
      : 0,
    effect: Boolean(type?.getProperty('~effect/Effect')),
  };
}

/** Locate the deserializer input even when the compiler assigns the symbol a numeric suffix. */
const workflowDeserializeInput =
  /^[^.]+\.__@WORKFLOW_DESERIALIZE@\d+\(input\)(?=$|\.)/u;
/** Allow caller-owned callbacks only along the listed paths of a restored workflow config. */
const workflowConfigurationCallbacks = new Set([
  'config._internal.currentDate',
  'config.convertUsage',
  'config.errorStructure.errorToMessage',
  'config.errorStructure.isRetryable',
  'config.fetch',
  'config.generateId',
  'config.headers',
  'config.mapReasoning',
  'config.metadataExtractor.createStreamExtractor',
  'config.metadataExtractor.extractMetadata',
  'config.supportedUrls',
  'config.transformRequestBody',
  'config.url',
  'config.webSocket',
]);

/** Identify callback paths relative to the deserializer's input parameter. */
function isWorkflowCallback(path, input) {
  return (
    input && workflowConfigurationCallbacks.has(path.slice(input[0].length + 1))
  );
}

/** Walk public type graphs for native SDK calls and distinguish caller-owned workflow callbacks. */
export function findSdkOperations(
  checker,
  publicSymbols,
  publicTypes = [],
  visited = new Set(),
) {
  const operations = [];
  // A callback type can also occur in an exported result. Check both routes.
  const visitedWorkflowInput = new Set();
  const visitedWorkflowCallbacks = new Set();

  function report(path, declaration) {
    const input = path.match(workflowDeserializeInput);
    const callerOwned = Boolean(
      isWorkflowCallback(path, input) && !ts.isGetAccessor(declaration),
    );
    operations.push({ path, source: sourcePath(declaration), callerOwned });
  }

  function visitSymbol(symbol, path) {
    if (
      symbol.declarations?.some((d) => ts.isGetAccessor(d) && hasSdkOrigin(d))
    ) {
      report(
        path,
        symbol.declarations.find((d) => ts.isGetAccessor(d) && hasSdkOrigin(d)),
      );
    }
    visitType(checker.getTypeOfSymbol(symbol), path);
  }

  function visitType(type, path) {
    const input = path.match(workflowDeserializeInput);
    const seen = !input
      ? visited
      : isWorkflowCallback(path, input)
        ? visitedWorkflowCallbacks
        : visitedWorkflowInput;
    if (seen.has(type)) return;
    seen.add(type);
    if (type.isUnionOrIntersection()) {
      for (const member of type.types) visitType(member, path);
      return;
    }
    if (type.isTypeParameter()) {
      const constraint = checker.getBaseConstraintOfType(type);
      const defaultType = checker.getDefaultFromTypeParameter(type);
      if (constraint) visitType(constraint, `${path} constraint`);
      if (defaultType) visitType(defaultType, `${path} default`);
      return;
    }
    if (type.flags & ts.TypeFlags.Conditional) {
      const { trueType, falseType } = type.root.node;
      visitType(checker.getTypeFromTypeNode(trueType), `${path} true branch`);
      visitType(checker.getTypeFromTypeNode(falseType), `${path} false branch`);
    }
    if (!(type.flags & ts.TypeFlags.Object)) return;

    const origins = type.getSymbol()?.declarations ?? [];
    const mapped = Boolean(type.objectFlags & ts.ObjectFlags.Mapped);
    // Container arguments are public. The internals of Effect, the host, and
    // TypeScript libraries belong to those packages and can refer to themselves.
    const foreign =
      !mapped &&
      origins.length &&
      !origins.some((decl) => hasSdkOrigin(decl) || hasWrapperOrigin(decl));
    for (const arg of typeArguments(checker, type)) {
      // A resolved mapped wrapper type can use an SDK type as input to its
      // computation. Its members below are the public result of that mapping.
      if (foreign || (!mapped && arg.isTypeParameter())) visitType(arg, path);
    }
    if (foreign) return;

    for (const kind of [ts.SignatureKind.Call, ts.SignatureKind.Construct]) {
      for (const signature of checker.getSignaturesOfType(type, kind)) {
        const declaration = signature.getDeclaration();
        if (declaration && hasSdkOrigin(declaration)) {
          report(path, declaration);
          continue;
        }
        for (const parameter of signature.getTypeParameters() ?? []) {
          visitType(parameter, `${path}<${parameter.symbol.name}>`);
        }
        for (const argument of signature.getParameters()) {
          visitSymbol(argument, `${path}(${argument.name})`);
        }
        visitType(
          checker.getReturnTypeOfSignature(signature),
          `${path} return`,
        );
      }
    }
    for (const member of checker.getPropertiesOfType(type)) {
      if (member.name !== 'prototype')
        visitSymbol(member, `${path}.${member.name}`);
    }
    for (const index of checker.getIndexInfosOfType(type))
      visitType(index.type, `${path}[…]`);
  }

  for (const { type, path } of publicTypes) visitType(type, path);
  for (const exported of publicSymbols) {
    const symbol =
      exported.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exported)
        : exported;
    if (symbol.flags & ts.SymbolFlags.Value && !isTypeOnly(exported))
      visitSymbol(symbol, exported.name);
    if (symbol.flags & ts.SymbolFlags.Type)
      visitType(checker.getDeclaredTypeOfSymbol(symbol), exported.name);
    if (symbol.flags & ts.SymbolFlags.NamespaceModule) {
      for (const member of checker.getExportsOfModule(symbol))
        visitSymbol(member, `${exported.name}.${member.name}`);
    }
  }
  return operations;
}

/** Find imports of SDK declaration paths that are outside the pinned public surface. */
export function findPrivateSdkImports(program, publicPaths) {
  const privateImports = [];
  for (const file of program.getSourceFiles()) {
    if (
      !dependencyPath(file.fileName.replaceAll('\\', '/')).startsWith(
        wrapperDirectory,
      )
    )
      continue;
    function visit(node) {
      const moduleSpecifier =
        ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)
          ? node.argument.literal
          : node.moduleSpecifier;
      if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
        const specifier = moduleSpecifier.text;
        if (
          /^(?:ai(?:\/|$)|@ai-sdk\/)/u.test(specifier) &&
          !publicPaths.has(specifier)
        ) {
          privateImports.push({ source: file.fileName, specifier });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
  return privateImports;
}
