---
title: Verify the package
doc-type: contributing
sources:
  [
    package.json,
    .github/workflows/ci.yml,
    .github/workflows/release.yml,
    scripts,
  ]
---

# Verify the package

> **TL;DR:** Run the repository checks and verify the packed package in a
> separate consumer. The consumer checks compare runtime and declaration
> routes against pinned SDK archives.

1. Install repository dependencies with `npm ci` on Node.js 24.
2. Run the local checks.

   ```sh
   npm run format:check
   npm run lint
   npm run typecheck
   npm test
   npm run docs:audit
   ```

3. Compare the SDK surface and export map with their tracked baselines.

   ```sh
   node scripts/check-sdk-surface.mjs
   node scripts/sync-sdk-exports.mjs --check
   ```

4. Build the package and inspect the archive file list.

   ```sh
   npm run build
   npm pack --dry-run --ignore-scripts
   ```

The [CI workflow](../../../.github/workflows/ci.yml) runs the generated-contract
checks and exercises the archive in separate Node and Next.js consumers. See
the [script guide](../../../scripts/README.md) for check inputs and the
[development standards](../../README.md) for repository conventions.
