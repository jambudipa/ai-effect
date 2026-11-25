import { copyFile } from 'node:fs/promises';

await Promise.all(
  ['ui-utils', 'ui-utils-test'].map((entry) => {
    const path = new URL(`../dist/integrations/${entry}`, import.meta.url);
    return copyFile(`${path.pathname}.d.ts`, `${path.pathname}.d.cts`);
  }),
);
