# Package tests

Run `npm test` for runtime tests, `npm run typecheck` for the contracts in
`*.types.ts`, and `npm run lint` for Effect lint rules. Start with
[AiSdk.test.ts](AiSdk.test.ts) for the service and with the matching provider or
integration test for its adapter. Use fake SDK implementations, mock models,
or local HTTP servers to keep tests independent of credentials.

The [SDK surface fixture](fixtures/sdk-surface/README.md) and the
[Next.js fixture](fixtures/rsc-host/README.md) verify an installed npm archive.
