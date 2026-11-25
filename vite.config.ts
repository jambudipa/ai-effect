import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: /^(ai|effect)(\/|$)/,
    },
    sourcemap: true,
    target: 'es2022',
    minify: false,
  },
});
