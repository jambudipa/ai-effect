# Packed SDK surface fixture

[check-packed-proofs.mjs](../../../scripts/check-packed-proofs.mjs) copies this
fixture into a fresh consumer. [core.mts](core.mts) checks the core types.
[host.mjs](host.mjs) exercises host packages, and [legacy.cjs](legacy.cjs) checks
CommonJS entries. Keep the consumer independent of the source tree. The proof
checks that the archive owns the pinned SDK dependencies in the consumer lockfile.
