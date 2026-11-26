---
title: How to restore an image model in a workflow step
doc-type: how-to
sources:
  [
    src/providers/openai-compatible.ts,
    src/protocols/provider-utils.ts,
    test/ProviderWorkflowHooks.test.ts,
  ]
---

# How to restore an image model in a workflow step

> **TL;DR:** Carry the model ID into the step. Supply fresh URL and header
> callbacks when you restore the model with `WORKFLOW_DESERIALIZE`.

Use this approach when a workflow step needs an OpenAI-compatible image model.
The native workflow serializer can omit function-valued configuration. Build
those callbacks in the step before you use the restored model.

1. Save the model ID and the public provider name with the workflow input.
   Read credentials from the step environment when you construct the headers.
2. Pass the model ID and callback configuration to the model's deserializer.

   ```js
   import assert from 'node:assert/strict';
   import { generateImage } from '@jambudipa/ai-effect/ai';
   import { OpenAICompatibleImageModel } from '@jambudipa/ai-effect/openai-compatible';
   import { WORKFLOW_DESERIALIZE } from '@jambudipa/ai-effect/provider-utils';
   import { Effect } from 'effect';

   const saved = { modelId: 'fixture-image', provider: 'workshop' };
   const baseURL = 'https://fixture.invalid/v1';
   const pixel =
     'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a+V0AAAAASUVORK5CYII=';

   const step = Effect.gen(function* () {
     const model = yield* OpenAICompatibleImageModel[WORKFLOW_DESERIALIZE]({
       modelId: saved.modelId,
       config: {
         provider: saved.provider,
         url: ({ path }) => baseURL + path,
         headers: () => ({ 'x-workflow-step': 'image' }),
         fetch: async (input, init) => {
           const request = new Request(input, init);
           assert.equal(request.url, `${baseURL}/images/generations`);
           assert.equal(request.headers.get('x-workflow-step'), 'image');
           return Response.json({ data: [{ b64_json: pixel }] });
         },
       },
     });
     const result = yield* generateImage({ model, prompt: 'A single pixel.' });
     return result.image.mediaType;
   });

   console.log(await Effect.runPromise(step));
   ```

3. Run the code with the fixture first. Check that it prints `image/png`.
   Use the actual base URL and fetch implementation in the deployed step.

If a restored model fails before `fetch` runs, check that the step supplies
the URL callback. See the [image model contract](../../reference/api/providers/openai-compatible.md#openaicompatibleimagemodel)
and the [Workflow integration](../../reference/api/integrations/workflow.md).
