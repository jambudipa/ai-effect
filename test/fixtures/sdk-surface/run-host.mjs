import { JSDOM } from 'jsdom';
import { assert } from './shared.mjs';

assert(
  import.meta
    .resolve('@jambudipa/ai-effect/svelte')
    .endsWith('/dist/frameworks/svelte.js'),
  'the svelte condition selects the packed Svelte adapter',
);

const dom = new JSDOM('<main></main>', { url: 'http://localhost:5173' });
for (const key of [
  'window',
  'document',
  'Node',
  'Text',
  'Element',
  'HTMLElement',
  'Comment',
  'Event',
  'CustomEvent',
]) {
  globalThis[key] = dom.window[key];
}
try {
  const { verifyHost } = await import('./dist/host.js');
  await verifyHost(document.querySelector('main'));
} finally {
  dom.window.close();
}
