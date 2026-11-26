import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const frameworkPackages = [
  '@ai-sdk/angular',
  '@ai-sdk/react',
  '@ai-sdk/rsc',
  '@ai-sdk/solid',
  '@ai-sdk/svelte',
  '@ai-sdk/vue',
  '@angular/core',
  'next',
  'react',
  'react-dom',
  'solid-js',
  'svelte',
  'vue',
];
const frameworkLoads = new Set();
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    const resolved = nextResolve(specifier, context);
    for (const dependency of frameworkPackages) {
      if (
        specifier === dependency ||
        specifier.startsWith(`${dependency}/`) ||
        resolved.url.includes(`/node_modules/${dependency}/`)
      ) {
        frameworkLoads.add(dependency);
      }
    }
    return resolved;
  },
});

try {
  const { Effect } = await import('effect');
  const { AiSdk } = await import('@jambudipa/ai-effect');
  const { generateText } = await import('@jambudipa/ai-effect/ai');
  const { createCerebras } = await import('@jambudipa/ai-effect/cerebras');
  const program = Effect.gen(function* () {
    const provider = yield* createCerebras({
      apiKey: 'core-isolation-fixture',
      fetch: async () =>
        Response.json({
          choices: [
            { message: { content: 'isolated core' }, finish_reason: 'stop' },
          ],
        }),
    });
    const model = yield* provider('gpt-oss-120b');
    const service = yield* AiSdk;
    const request = { model, prompt: 'Generate text' };
    const direct = yield* generateText(request);
    const fromService = yield* service.generateText(request);
    assert.equal(direct.text, 'isolated core');
    assert.equal(fromService.text, 'isolated core');
  });
  await Effect.runPromise(Effect.provide(program, AiSdk.layer));
  assert.deepEqual([...frameworkLoads], [], 'Core loaded framework packages');
  console.log('Core generated text with zero framework package loads.');
} finally {
  hooks.deregister();
}
