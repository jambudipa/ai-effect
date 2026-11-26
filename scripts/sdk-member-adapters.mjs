import ts from 'typescript';
import { exportedValueType } from './sdk-declaration-graph.mjs';
import {
  memberProjection,
  nativeMemberUnavailable,
} from './sdk-member-projections.mjs';

const schemaProperties = new Set([
  'inputSchema',
  'outputSchema',
  'contextSchema',
  'lifecycleStateSchema',
]);
const dataGetters = new Set(['provider', 'modelId', 'maxImagesPerCall']);

function hasPromise(checker, type) {
  return type.isUnion()
    ? type.types.some((member) => hasPromise(checker, member))
    : Boolean(checker.getPromisedTypeOfPromise(type));
}

function isPrimitiveType(type) {
  if (type.isUnion()) return type.types.every(isPrimitiveType);
  return Boolean(
    type.flags &
    (ts.TypeFlags.StringLike |
      ts.TypeFlags.NumberLike |
      ts.TypeFlags.BooleanLike),
  );
}

function payloadOf(checker, type) {
  const promised = checker.getPromisedTypeOfPromise(type);
  if (promised) return { type: promised, step: 'await' };
  const effect = type.getProperty('~effect/Effect');
  if (!effect) return;
  const variance = checker.getTypeOfSymbol(effect).getProperty('_A');
  const output = variance
    ? checker.getTypeOfSymbol(variance).getCallSignatures()[0]?.getReturnType()
    : undefined;
  if (output) return { type: output, step: 'yield' };
}

function* receivers(checker, root, visited = new Set()) {
  if (visited.has(root.type)) return;
  visited.add(root.type);
  if (root.type.isUnion()) {
    for (const type of root.type.types) {
      yield* receivers(checker, { ...root, type }, visited);
    }
    return;
  }
  yield root;
  const payload = payloadOf(checker, root.type);
  if (payload) {
    yield* receivers(
      checker,
      { type: payload.type, route: [...root.route, payload.step] },
      visited,
    );
  }
}

function* publicMembers(checker, root, path) {
  if (!path.length) {
    yield* receivers(checker, root);
    return;
  }
  const [name, ...rest] = path;
  for (const { type, route } of receivers(checker, root)) {
    const symbol = type.getProperty(name);
    if (!symbol) continue;
    const declarations = symbol.getDeclarations() ?? [];
    const hidden = ts.ModifierFlags.Private | ts.ModifierFlags.Protected;
    if (
      declarations.some((node) => ts.getCombinedModifierFlags(node) & hidden)
    ) {
      continue;
    }
    const member = {
      type: checker.getNonNullableType(checker.getTypeOfSymbol(symbol)),
      route: [...route, name],
      accessor: declarations.some(ts.isGetAccessorDeclaration),
      optional: Boolean(symbol.flags & ts.SymbolFlags.Optional),
    };
    if (rest.length) yield* publicMembers(checker, member, rest);
    else yield member;
  }
}

function* returnReceivers(checker, value, kind, allowLazyConstructor) {
  for (const root of receivers(checker, value)) {
    const calls = root.type.getCallSignatures();
    const constructors = root.type.getConstructSignatures();
    const emit = (signatures, label, prefix = root.route) =>
      signatures.map((signature, index) => ({
        route: [...prefix, `${label}[${index}]`],
        type: signature.getReturnType(),
      }));
    if (kind === 'call') {
      yield* emit(calls, 'call');
      continue;
    }
    yield* emit(constructors, 'construct');
    const make = root.type.getProperty('make');
    if (make) {
      yield* emit(checker.getTypeOfSymbol(make).getCallSignatures(), 'call', [
        ...root.route,
        'make',
      ]);
    }
    yield* emit(calls, 'call');
    if (
      allowLazyConstructor &&
      root.route.at(-1) === 'yield' &&
      !calls.length &&
      !constructors.length &&
      !make
    ) {
      yield root;
    }
  }
}

function findAdapter(checker, roots, member) {
  for (const root of roots) {
    for (const actual of publicMembers(checker, root, member.path)) {
      const signatures = actual.type.getCallSignatures();
      const calls = signatures.length;
      const constructors = actual.type.getConstructSignatures().length;
      const effect = Boolean(actual.type.getProperty('~effect/Effect'));
      const lazyCall = signatures.some(
        (signature) =>
          !signature.getParameters().length &&
          payloadOf(checker, signature.getReturnType())?.step === 'yield',
      );
      const effectValue = effect && member.parameterless && member.calls === 1;
      const dataGetter =
        member.accessor &&
        !member.calls &&
        dataGetters.has(member.path.at(-1)) &&
        isPrimitiveType(actual.type);
      const schema =
        schemaProperties.has(member.path.at(-1)) &&
        [...receivers(checker, actual)].find(
          ({ type }) =>
            type.getProperty('validate') && type.getProperty('jsonSchema'),
        );
      if (calls < member.calls && !effectValue && !schema) continue;
      if (constructors < member.constructors) continue;
      if (!member.optional && actual.optional) continue;
      if (
        member.registration &&
        !signatures.some((signature) => {
          const [listeners] = signature.getParameters();
          return (
            listeners &&
            checker.getTypeOfSymbol(listeners).getProperty(member.registration)
          );
        })
      ) {
        continue;
      }
      if (
        member.kind === 'lazy' &&
        !(
          actual.accessor ||
          effect ||
          lazyCall ||
          schema ||
          dataGetter ||
          hasPromise(checker, actual.type)
        )
      ) {
        continue;
      }
      return {
        route: schema ? [...schema.route, 'validate'] : actual.route,
        calls,
        constructors,
        effect,
        accessor: actual.accessor,
        optional: actual.optional,
        ...(schema && { relation: 'schema-validation' }),
        ...(effectValue && { relation: 'effect-value' }),
        ...(dataGetter && { relation: 'data-getter' }),
      };
    }
  }
  return null;
}

/** Map SDK member names to public paths on the packed declaration. */
export function describeMemberAdapters(
  checker,
  wrapper,
  upstream,
  { parameterlessConstructor = false, upstreamPath },
) {
  const type = wrapper && exportedValueType(checker, wrapper);
  const value = type ? { route: [], type } : null;
  const exported = wrapper?.name;
  const map = (members, roots) =>
    members.map((expected) => {
      if (
        exported &&
        nativeMemberUnavailable(upstreamPath, exported, expected)
      ) {
        return {
          ...expected,
          coverage: 'sdk-slot-unimplemented',
          adapter: null,
        };
      }
      const direct = findAdapter(checker, roots, expected);
      if (direct)
        return {
          ...expected,
          coverage: direct.relation ?? 'named-adapter',
          adapter: direct,
        };
      const projection =
        exported && memberProjection(upstreamPath, exported, expected);
      const projected =
        projection &&
        findAdapter(checker, roots, { ...expected, ...projection });
      if (projected) {
        return {
          ...expected,
          coverage: projection.relation,
          adapter: projected,
          projection,
        };
      }
      const origins = expected.provenance ?? [];
      const external =
        origins.length > 0 &&
        !origins.some((name) => name === 'ai' || name.startsWith('@ai-sdk/'));
      return {
        ...expected,
        coverage: external ? 'external-declaration' : 'unmapped',
        adapter: null,
      };
    });
  const callRoots = value
    ? [...returnReceivers(checker, value, 'call', false)]
    : [];
  const constructRoots = value
    ? [
        ...returnReceivers(
          checker,
          value,
          'construct',
          parameterlessConstructor,
        ),
      ]
    : [];
  return {
    static: map(upstream.static, value ? [value] : []),
    returns: upstream.returns.map(({ members, ...root }) => {
      const roots = root.kind === 'construct' ? constructRoots : callRoots;
      return {
        ...root,
        ...((root.calls || root.constructors) && {
          adapter: findAdapter(checker, roots, {
            path: [],
            kind: 'callable',
            calls: root.calls,
            constructors: root.constructors,
          }),
        }),
        members: map(members, roots),
      };
    }),
  };
}
