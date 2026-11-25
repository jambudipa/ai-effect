import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';
import manifest from './package.json' with { type: 'json' };

function targets(branch: unknown): string[] {
  if (typeof branch === 'string') return [branch];
  if (!branch || typeof branch !== 'object') return [];
  return Object.values(branch).flatMap(targets);
}

const entryFiles = [
  ...new Set(Object.values(manifest.exports).flatMap(targets)),
];

const externals = new Set([
  ...builtinModules,
  ...Object.keys(manifest.dependencies),
  ...Object.keys(manifest.peerDependencies),
]);

function isExternal(id: string) {
  if (id.startsWith('node:')) return true;
  const segments = id.split('/');
  const root = segments.slice(0, id.startsWith('@') ? 2 : 1).join('/');
  return externals.has(root);
}

export default defineConfig(({ mode }) => {
  const commonJs = mode === 'legacy';
  const suffix = commonJs ? '.cjs' : '.js';
  const entry = Object.fromEntries(
    entryFiles
      .filter((file) => file.endsWith(suffix))
      .map((file) => {
        const name = file.slice('./dist/'.length, -suffix.length);
        return [name, `src/${name}.ts`];
      }),
  );
  return {
    build: {
      emptyOutDir: !commonJs,
      lib: {
        entry,
        formats: [commonJs ? 'cjs' : 'es'],
        fileName: (format, entry) =>
          `${entry}.${format === 'cjs' ? 'cjs' : 'js'}`,
      },
      rolldownOptions: {
        external: isExternal,
        output: {
          banner: (chunk) =>
            /\/frameworks\/(?:react|rsc-client)\.ts$/u.test(
              chunk.facadeModuleId ?? '',
            )
              ? "'use client';"
              : '',
        },
      },
      sourcemap: true,
      target: 'es2022',
      minify: false,
    },
  };
});
