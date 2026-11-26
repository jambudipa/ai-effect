import ts from 'typescript';

const hidden = ts.ModifierFlags.Private | ts.ModifierFlags.Protected;
const traversableFlags =
  ts.TypeFlags.Object | ts.TypeFlags.Intersection | ts.TypeFlags.TypeParameter;
const packages = '/node_modules/';

function alternatives(type) {
  return type.isUnion() ? type.types : [type];
}

function awaited(checker, type) {
  if (!alternatives(type).some((branch) => branch.getProperty('then'))) {
    return type;
  }
  return checker.getAwaitedType(type) ?? type;
}

function publicDeclaration(node) {
  return (
    !(ts.getCombinedModifierFlags(node) & hidden) &&
    !(node.name && ts.isPrivateIdentifier(node.name))
  );
}

function publicSignatures(signatures) {
  return signatures.filter((signature) => {
    const declaration = signature.getDeclaration();
    return !declaration || publicDeclaration(declaration);
  });
}

function signatureCounts(type) {
  let calls = 0;
  let constructors = 0;
  let parameterless = true;
  for (const branch of alternatives(type)) {
    const callable = publicSignatures(branch.getCallSignatures());
    const constructible = publicSignatures(branch.getConstructSignatures());
    calls = Math.max(calls, callable.length);
    constructors = Math.max(constructors, constructible.length);
    const signatures = [...callable, ...constructible];
    if (signatures.length) {
      parameterless &&=
        signatures.length === 1 && signatures[0].getParameters().length === 0;
    }
  }
  return {
    calls,
    constructors,
    parameterless: calls + constructors === 1 && parameterless,
  };
}

function memberName(member, declarations) {
  if (!member.name.startsWith('__@')) return member.name;
  const computed = declarations.find(
    (node) => node.name && ts.isComputedPropertyName(node.name),
  );
  return computed?.name.getText();
}

function inherits(type, declarations) {
  const owners = type.getSymbol()?.getDeclarations() ?? [];
  const declared = owners.some(
    (owner) => ts.isClassLike(owner) || ts.isInterfaceDeclaration(owner),
  );
  return (
    declared &&
    declarations.length > 0 &&
    declarations.every((node) => !owners.includes(node.parent))
  );
}

function declarationOwner(node) {
  const source = node.getSourceFile();
  if (source.hasNoDefaultLib) return 'typescript-lib';
  const path = source.fileName.replaceAll('\\', '/');
  const start = path.lastIndexOf(packages);
  if (start < 0) return;
  const packagePath = path.slice(start + packages.length);
  if (/^typescript\/lib\/lib(?:\.[^/]+)?\.d\.ts$/u.test(packagePath)) {
    return 'typescript-lib';
  }
  const [name, scoped] = packagePath.split('/');
  return name.startsWith('@') ? `${name}/${scoped}` : name;
}

function combineOwners(previous, next) {
  return [...new Set([...previous, ...next])].sort();
}

function canRecurse(type) {
  const declarations = type.getSymbol()?.getDeclarations() ?? [];
  return declarations.every((node) => {
    const owner = declarationOwner(node);
    return (
      !owner ||
      owner === 'ai' ||
      owner === '@jambudipa/ai-effect' ||
      owner.startsWith('@ai-sdk/')
    );
  });
}

function mergeAlternatives(branches) {
  const result = new Map();
  for (const branch of branches) {
    for (const member of branch) {
      const key = JSON.stringify(member.path);
      const existing = result.get(key);
      if (!existing) {
        result.set(key, { member, count: 1 });
        continue;
      }
      const previous = existing.member;
      existing.count++;
      existing.member = {
        ...previous,
        kind: previous.kind === 'lazy' ? 'lazy' : member.kind,
        calls: Math.max(previous.calls, member.calls),
        constructors: Math.max(previous.constructors, member.constructors),
        parameterless: previous.parameterless && member.parameterless,
        optional: previous.optional || member.optional,
        inherited: previous.inherited && member.inherited,
        accessor: previous.accessor || member.accessor,
        provenance: combineOwners(previous.provenance, member.provenance),
      };
    }
  }
  return [...result.values()].map(({ member, count }) => ({
    ...member,
    optional: member.optional || count < branches.length,
  }));
}

/** Describe public callable and lazy members of a type using relative paths. */
export function describeTypeMembers(checker, type, { recursive = false } = {}) {
  function visit(value, path, ancestors) {
    if (value.isUnion()) {
      return mergeAlternatives(
        value.types.map((branch) => visit(branch, path, ancestors)),
      );
    }
    if (!(value.flags & traversableFlags)) return [];
    const identity = value.getSymbol() ?? value;
    if (ancestors.has(identity)) return [];
    const seen = new Set([...ancestors, identity]);
    const descend = recursive && canRecurse(value);
    const records = [];
    for (const member of checker.getPropertiesOfType(value)) {
      if (member.flags & ts.SymbolFlags.Prototype) continue;
      const declared = member.getDeclarations() ?? [];
      const declarations = declared.filter(publicDeclaration);
      if (declared.length && !declarations.length) continue;
      const name = memberName(member, declarations);
      if (!name) continue;

      const childPath = [...path, name];
      const optional = Boolean(member.flags & ts.SymbolFlags.Optional);
      const inherited = inherits(value, declarations);
      const accessor = declarations.some(ts.isGetAccessorDeclaration);
      const memberType = checker.getTypeOfSymbol(member);
      const branches = alternatives(memberType);
      const resolved = awaited(checker, memberType);
      const lazy = accessor || resolved !== memberType;
      const counts = signatureCounts(resolved);

      if (lazy || counts.calls || counts.constructors) {
        records.push({
          path: childPath,
          kind: lazy ? 'lazy' : 'callable',
          ...counts,
          optional,
          inherited,
          accessor,
          provenance: combineOwners(
            [],
            declarations.map(declarationOwner).filter(Boolean),
          ),
        });
      } else if (descend) {
        const children = mergeAlternatives(
          branches.map((branch) => visit(branch, childPath, seen)),
        );
        for (const child of children) {
          records.push({
            ...child,
            optional: optional || child.optional,
            inherited: inherited || child.inherited,
          });
        }
      }
    }
    return records;
  }

  return visit(type, [], new Set());
}

/** Describe a native export and each of its call and constructor results. */
export function describeNativeMembers(checker, exported) {
  const typeOnly = exported
    .getDeclarations()
    ?.some(
      (node) =>
        ts.isExportSpecifier(node) &&
        (node.isTypeOnly || node.parent.parent.isTypeOnly),
    );
  const symbol =
    exported.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(exported)
      : exported;
  if (typeOnly || !(symbol.flags & ts.SymbolFlags.Value)) {
    return { static: [], returns: [] };
  }

  const type = checker.getTypeOfSymbol(symbol);
  const returns = [];
  for (const [kind, signatures] of [
    ['call', type.getCallSignatures()],
    ['construct', type.getConstructSignatures()],
  ]) {
    for (const [index, signature] of publicSignatures(signatures).entries()) {
      const result = awaited(
        checker,
        checker.getReturnTypeOfSignature(signature),
      );
      returns.push({
        name: `${kind}[${index}]`,
        kind,
        index,
        ...signatureCounts(result),
        members: describeTypeMembers(checker, result),
      });
    }
  }
  return {
    static: describeTypeMembers(checker, type, { recursive: true }),
    returns,
  };
}
