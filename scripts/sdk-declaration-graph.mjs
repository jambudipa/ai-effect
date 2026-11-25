import ts from 'typescript';

function sourcePath(declaration) {
  return declaration.getSourceFile().fileName.replaceAll('\\', '/');
}

function hasSdkOrigin(declaration) {
  const path = sourcePath(declaration);
  return (
    /\/node_modules\/(?:ai|@ai-sdk\/[^/]+)\//u.test(path) ||
    path.endsWith('/integrations/internal/mcp-contract.d.ts') ||
    /\/integrations\/internal\/harness-contracts\/.*\.d\.ts$/u.test(path)
  );
}

function hasWrapperOrigin(declaration) {
  return sourcePath(declaration).includes(
    '/node_modules/@jambudipa/ai-effect/',
  );
}

function isTypeOnly(symbol) {
  return symbol.declarations?.some(
    (node) =>
      ts.isExportSpecifier(node) &&
      (node.isTypeOnly || node.parent.parent.isTypeOnly),
  );
}

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
export function findSdkOperations(
  checker,
  publicSymbols,
  publicTypes = [],
  visited = new Set(),
) {
  const operations = [];

  function report(path, declaration) {
    operations.push({ path, source: sourcePath(declaration) });
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
    if (visited.has(type)) return;
    visited.add(type);
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
    // Container arguments are public. The internals of Effect, the host, and
    // TypeScript libraries belong to those packages and can refer to themselves.
    const foreign =
      origins.length &&
      !origins.some((decl) => hasSdkOrigin(decl) || hasWrapperOrigin(decl));
    for (const arg of typeArguments(checker, type)) {
      // A resolved mapped wrapper type can use an SDK type as input to its
      // computation. Its members below are the public result of that mapping.
      if (foreign || arg.isTypeParameter()) visitType(arg, path);
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
      !/\/node_modules\/@jambudipa\/ai-effect\//u.test(
        file.fileName.replaceAll('\\', '/'),
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
