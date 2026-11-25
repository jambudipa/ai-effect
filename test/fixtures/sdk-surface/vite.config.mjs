import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: { entry: 'host.mjs', formats: ['es'], fileName: 'host' },
    target: 'es2022',
    minify: true,
  },
});
