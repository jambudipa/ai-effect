import assert from 'node:assert/strict';
import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
import { FireworksImageModel } from '@jambudipa/ai-effect/fireworks';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@jambudipa/ai-effect/provider-utils';
import { Experimental_ExtractionLanguageModel } from '@jambudipa/ai-effect/provider-utils/experimental-extraction';
import { Effect } from 'effect';

await Effect.runPromise(
  Effect.gen(function* () {
    const image = yield* FireworksImageModel(
      'accounts/fireworks/models/flux-1-dev-fp8',
      { provider: 'fixture', baseURL: 'https://workflow-fixture.invalid' },
    );
    const data = yield* FireworksImageModel[WORKFLOW_SERIALIZE](image);
    const { baseURL, provider } = data.config;
    assert.ok(typeof baseURL === 'string');
    assert.ok(typeof provider === 'string');
    const restored = yield* FireworksImageModel[WORKFLOW_DESERIALIZE]({
      modelId: data.modelId,
      config: { ...data.config, baseURL, provider },
    });
    assert.equal(yield* restored.maxImagesPerCall, 1);

    const model = yield* MockLanguageModelV4();
    const extract = Experimental_ExtractionLanguageModel;
    const original = yield* extract({ model });
    const saved = yield* extract[WORKFLOW_SERIALIZE](original);
    const revived = yield* extract[WORKFLOW_DESERIALIZE](saved);
    const repeated = yield* extract[WORKFLOW_SERIALIZE](revived);
    assert.equal(repeated.model, model);
    assert.equal(repeated.maxFieldsPerCall, Infinity);
  }),
);

console.log(
  'Packed Workflow hooks revived the Fireworks and extraction models.',
);
