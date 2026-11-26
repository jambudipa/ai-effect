# Vitest HTTP fixtures

[`with-vitest.ts`](with-vitest.ts) installs suite hooks around the [HTTP fixture](../test-server.ts). It starts one scoped fixture for the suite, resets routes before each test, and disposes its runtime after the suite.

Keep Vitest-specific lifecycle handling here. Keep response controllers, route conversion, and call inspection in the parent integration so other test runners can manage their own scopes.
