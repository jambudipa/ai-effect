---
title: Installation and compatibility
doc-type: reference
sources:
  [
    package.json,
    package-lock.json,
    .github/workflows/ci.yml,
    docs/sdk-surface.json,
  ]
---

# Installation and compatibility

> **TL;DR:** The package requires Effect 4.1.5 or a compatible v4 release. Node
> support follows the `engines` range. Install optional peers for the entries
> that use them.

```sh
npm install @jambudipa/ai-effect effect@^4.1.5
```

| Requirement      | Manifest range                               |
| ---------------- | -------------------------------------------- |
| Node.js          | `^22.19.0 \|\| ^24.0.0 \|\| >=26.0.0`        |
| Effect           | `^4.1.5`                                     |
| React, optional  | `^18 \|\| ~19.0.1 \|\| ~19.1.2 \|\| ^19.2.1` |
| Solid, optional  | `^1.7.7`                                     |
| Svelte, optional | `^5.31.0`                                    |
| Vitest, optional | `>=5 <6`                                     |
| Vue, optional    | `^3.3.4`                                     |

The wrapper installs pinned SDK packages as dependencies. UI and test entries
can also require their host libraries. For example, `react` uses React and
`test-server/with-vitest` uses Vitest.

The package exposes ESM entries and selected CommonJS entries. See the
[import paths](import-paths.md) for the condition on each subpath. The type
declarations follow the package export map for NodeNext and bundler resolution.

The Pi harness can expose a declaration issue when a strict NodeNext consumer
resolves `@earendil-works/pi-ai@1.6.1`. Its generated catalog declarations
omit the JSON import attribute. A runtime import and a strict declaration
check exercise different parts of that installation.
