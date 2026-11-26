---
title: '@jambudipa/ai-effect/provider-utils/test API'
doc-type: reference
sources: [src/protocols, src/internal, src/core-middleware.ts, package.json]
---

# @jambudipa/ai-effect/provider-utils/test API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/provider-utils/test`. Conditions: `types`.

## `convertArrayToAsyncIterable`

Provide finite fixture values in the given order as an Effect stream.

```text
convertArrayToAsyncIterable: <A>(values: A[]) => Stream.Stream<A, never, never>
```

## `convertArrayToReadableStream`

Feed an ordered finite array through the same Effect stream contract as adapted web
readers.

```text
convertArrayToReadableStream: <A>(values: A[]) => Stream.Stream<A, never, never>
```

## `convertAsyncIterableToArray`

Collect native or Effect fixture streams and classify native iterator failures.

```text
convertAsyncIterableToArray: <A>(source: AsyncIterable<A> | Stream.Stream<A, AiSdkError>) => Effect.Effect<A[], AiSdkError, never>
```

## `convertReadableStreamToArray`

Collect a native or Effect reader and release the native reader with the collection
scope.

```text
convertReadableStreamToArray: <A>(source: ReadableStream<A> | Stream.Stream<A, AiSdkError>) => Effect.Effect<A[], AiSdkError, never>
```

## `convertResponseStreamToArray`

Read a fixture response through the SDK collector and manage ownership of a native
response body.

```text
convertResponseStreamToArray: (response: Response) => Effect.Effect<string[], AiSdkError, never>
```

## `isNodeVersion`

Check the runtime Node major with the native version detector inside an Effect.

```text
isNodeVersion: (version: number) => Effect.Effect<boolean, AiSdkError, never>
```

## `isNodeVersionAtLeast`

Check a minimum Node version while preserving the SDK defaults for omitted components.

```text
isNodeVersionAtLeast: (major: number, minor?: number, patch?: number) => Effect.Effect<boolean, AiSdkError, never>
```

## `mockId`

Create a deterministic fixture ID generator whose successive reads run in Effect.

```text
mockId: (options?: Parameters<typeof sdk.mockId>[0]) => Effect.Effect<IdGenerator, AiSdkError, never>
```
