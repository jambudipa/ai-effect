import ts from 'typescript';
import { exportedValueType } from './sdk-declaration-graph.mjs';
import {
  memberProjection,
  nativeMemberUnavailable,
  resultProjection,
} from './sdk-member-projections.mjs';

/** Recognize SDK schema slots that can project to either adapter schema representation. */
const schemaProperties = new Set([
  'inputSchema',
  'outputSchema',
  'contextSchema',
  'lifecycleStateSchema',
]);
/** Allow three native getters to project to plain values on wrapped handles. */
const dataGetters = new Set(['provider', 'modelId', 'maxImagesPerCall']);

/** Recognize promised operations in any branch of a signature's result. */
function hasPromise(checker, type) {
  return type.isUnion()
    ? type.types.some((member) => hasPromise(checker, member))
    : Boolean(checker.getPromisedTypeOfPromise(type));
}

/** Allow data getters to become primitive values across all union branches. */
function isPrimitiveType(type) {
  if (type.isUnion()) return type.types.every(isPrimitiveType);
  return Boolean(
    type.flags &
    (ts.TypeFlags.StringLike |
      ts.TypeFlags.NumberLike |
      ts.TypeFlags.BooleanLike),
  );
}

/** Identify the result type and route step for a Promise or Effect. */
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

/** Enumerate the receiver and its awaited or yielded payloads without revisiting types. */
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
      { ...root, type: payload.type, route: [...root.route, payload.step] },
      visited,
    );
  }
}

/** Follow public member paths through resolved values and preserve optionality. */
function* publicMembers(checker, root, path, symbolKey) {
  if (!path.length) {
    yield* receivers(checker, root);
    return;
  }
  const [name, ...rest] = path;
  for (const { type, route, optional } of receivers(checker, root)) {
    const symbol =
      !rest.length && symbolKey
        ? type
            .getProperties()
            .find((property) => property.escapedName === symbolKey)
        : type.getProperty(name);
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
      optional: optional || Boolean(symbol.flags & ts.SymbolFlags.Optional),
    };
    if (rest.length) yield* publicMembers(checker, member, rest, symbolKey);
    else yield member;
  }
}

/** Find constructor and call result routes, including `make` and lazy Effects. */
function* returnReceivers(checker, value, kind, allowLazyConstructor) {
  for (const root of receivers(checker, value)) {
    const calls = root.type.getCallSignatures();
    const constructors = root.type.getConstructSignatures();
    const emit = (signatures, label, prefix = root.route) =>
      signatures.map((signature, index) => ({
        route: [...prefix, `${label}[${index}]`],
        type: signature.getReturnType(),
        input: signature.getParameters()[0],
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

/** Inspect union branches separately when they expose different adapter forms. */
function* alternatives(type) {
  if (type.isUnion()) {
    for (const member of type.types) yield* alternatives(member);
  } else yield type;
}

/** Match public candidates only on receiver types with an expected brand. */
function* memberCandidates(checker, roots, member) {
  for (const root of roots) {
    const receiversToCheck = member.receiverBrand
      ? receivers(checker, root)
      : [root];
    for (const receiver of receiversToCheck) {
      if (
        member.receiverBrand &&
        !receiver.type.getProperty(member.receiverBrand)
      ) {
        continue;
      }
      for (const actual of publicMembers(
        checker,
        receiver,
        member.path,
        member.symbolKey,
      )) {
        for (const type of alternatives(actual.type)) yield { ...actual, type };
      }
    }
  }
}

/** Verify that the wrapper returns the generic first input unchanged or extends it. */
function retainedInput(checker, roots, path) {
  for (const root of roots) {
    if (!root.input) continue;
    const input = checker.getTypeOfSymbol(root.input);
    if (!(input.flags & ts.TypeFlags.TypeParameter)) continue;
    for (const { route, type } of receivers(checker, root)) {
      if (
        type === input ||
        (type.isIntersection() && type.types.includes(input))
      ) {
        return { route: [...route, ...path], input: 0 };
      }
    }
  }
  return null;
}

/** Match a native member against the wrapper's call counts, brands, and Effect shape. */
function findAdapter(checker, roots, member) {
  if (member.retainedInput) return retainedInput(checker, roots, member.path);
  for (const actual of memberCandidates(checker, roots, member)) {
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
    const schema = schemaProperties.has(member.path.at(-1))
      ? [...receivers(checker, actual)].find(
          ({ type }) =>
            (type.getProperty('validate') && type.getProperty('jsonSchema')) ||
            type.getProperty('~effect/Schema/Schema'),
        )
      : undefined;
    if (calls < member.calls && !effectValue && !schema) continue;
    if (constructors < member.constructors) continue;
    if (!member.optional && actual.optional) continue;
    if (
      member.resultBrand &&
      !signatures.some((signature) =>
        signature.getReturnType().getProperty(member.resultBrand),
      )
    )
      continue;
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
      route: schema?.type.getProperty('validate')
        ? [...schema.route, 'validate']
        : (schema?.route ?? actual.route),
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
      const { symbolKey, ...record } = expected;
      if (
        exported &&
        nativeMemberUnavailable(upstreamPath, exported, expected)
      ) {
        return {
          ...record,
          coverage: 'sdk-slot-unimplemented',
          adapter: null,
        };
      }
      const direct = findAdapter(checker, roots, expected);
      if (direct)
        return {
          ...record,
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
          ...record,
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
        ...record,
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
          adapter: matchingResult(checker, roots, root, upstreamPath, exported),
        }),
        members: map(members, roots),
      };
    }),
  };
}

/** Try the direct callable result route before consulting an explicit projection. */
function matchingResult(checker, roots, root, upstreamPath, exported) {
  const expected = {
    ...root,
    path: [],
    kind: 'callable',
  };
  const direct = findAdapter(checker, roots, expected);
  if (direct) return direct;
  const projection = resultProjection(upstreamPath, exported, root);
  if (!projection) return null;
  const adapter = findAdapter(checker, roots, { ...expected, ...projection });
  return adapter && { ...adapter, relation: projection.relation };
}
