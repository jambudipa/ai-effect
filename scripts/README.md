# Build and package checks

[check-sdk-surface.mjs](check-sdk-surface.mjs) recomputes the public SDK surface
from pinned npm archives. [sync-sdk-exports.mjs](sync-sdk-exports.mjs) maps that
surface to source files and builds the manifest export map. The generator scripts
derive declaration contracts from the installed pins. Their `--check` modes
compare the result with the committed files.

[check-packed-proofs.mjs](check-packed-proofs.mjs) installs the exact tarball
in an isolated consumer. The runtime, declaration, and member scripts use that
consumer to check the selected exports. [check-rsc-host.mjs](check-rsc-host.mjs)
uses a separate Next.js consumer for server and client resolution.

Run `npm run docs:audit` to check declaration comments and folder guides. See
the [root maintenance rules](../README.md#keep-the-documentation-current) for
the files the audit covers.
