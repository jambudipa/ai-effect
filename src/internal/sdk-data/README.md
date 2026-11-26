# Generated SDK data exports

These modules re-export native SDK types that the package can preserve without a runtime
adapter. Start with [`core.ts`](core.ts) to see the core type export list. Hand-written wrappers
bind runtime calls outside this folder.

Regenerate these files with
[`scripts/generate-sdk-data-types.mjs`](../../../scripts/generate-sdk-data-types.mjs). Keep the
source output byte-identical to the generator output. Put any folder documentation here.
