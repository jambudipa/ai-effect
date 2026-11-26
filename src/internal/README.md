# Internal SDK adapters

This folder binds native AI SDK values to Effect and Stream operations. Start with
[`operation.ts`](operation.ts) for cancellation, callback ownership, and error conversion.
Use [`provider-model.ts`](provider-model.ts) when adapting a provider model or recovering the
native model for another SDK operation.

Keep native objects in their adapter's private registry. Public handles expose the protocol
identity and Effect operations. Keep generated SDK export lists in [`sdk-data/`](sdk-data/).
