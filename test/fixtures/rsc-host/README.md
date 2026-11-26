# Next.js consumer fixture

This fixture installs the packed package in a separate Next.js application.
[check-rsc-host.mjs](../../../scripts/check-rsc-host.mjs) builds the application,
starts a local server, and checks that both conditional RSC entries render
the value. Keep wrapper imports in the application at the public package path.
