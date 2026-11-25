import { defineConfig } from 'vite';

const legacyEntries = {
  'integrations/ui-utils': 'src/integrations/ui-utils.ts',
  'integrations/ui-utils-test': 'src/integrations/ui-utils-test.ts',
};

export default defineConfig(({ mode }) => {
  const commonJs = mode === 'legacy';
  return {
    build: {
      emptyOutDir: !commonJs,
      lib: {
        entry: commonJs
          ? legacyEntries
          : {
              ...legacyEntries,
              index: 'src/index.ts',
              core: 'src/core.ts',
              testing: 'src/testing.ts',
              'providers/cerebras': 'src/providers/cerebras.ts',
              'frameworks/svelte': 'src/frameworks/svelte.ts',
            },
        formats: [commonJs ? 'cjs' : 'es'],
        fileName: (format, entry) =>
          `${entry}.${format === 'cjs' ? 'cjs' : 'js'}`,
      },
      rolldownOptions: {
        external: /^(ai|@ai-sdk\/[^/]+|effect|svelte)(\/|$)/,
      },
      sourcemap: true,
      target: 'es2022',
      minify: false,
    },
  };
});
