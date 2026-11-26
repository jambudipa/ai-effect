---
title: Package and host resolution
doc-type: explanation
sources:
  [
    package.json,
    docs/sdk-surface.json,
    scripts/sync-sdk-exports.mjs,
    scripts/check-sdk-declarations.mjs,
    scripts/check-sdk-runtime.mjs,
    vite.config.ts,
  ]
---

# Package and host resolution

> **TL;DR:** The package provides a separate import for each SDK entry. Export
> conditions select the correct runtime and declarations for Node, bundlers,
> and supported UI hosts.

The wrapper owns its exact SDK dependencies. A consumer imports wrapper types
and operations through the wrapper so its runtime and declarations come from
the same set of versions. The export map also lets a consumer import one
provider or protocol without importing a UI entry at the same time.

Package exports contain ordered conditions. TypeScript and the runtime can
choose different targets for the same specifier. For example, the `rsc` entry
has a React server route and a default client route. The Svelte entry has a
`svelte` runtime route. The manifest supplies CommonJS files only for entries
with a corresponding require route.

Host libraries such as React remain peer dependencies where the manifest
declares them. The host renderer and the wrapper then use the consumer's
installed peer. The rest of the package can run with Effect and without an
installed UI host.

The package checks compare an installed npm archive against the pinned SDK
inventory in each supported resolution context. A local source import could
otherwise succeed even when the published archive lacks the selected target.

See [Installation and compatibility](../reference/installation.md) and
[Import paths](../reference/import-paths.md).
