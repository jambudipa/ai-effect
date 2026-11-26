import {
  experimental_generateVideo as sdkGenerateVideo,
  type WorkflowGenerateVideoOptions as NativeOptions,
} from '@ai-sdk/workflow/video';
import { Effect } from 'effect';
import { runRequest, sdkError } from '../../internal/operation.js';
import {
  type VideoModelV4,
  unwrapVideoModel,
} from '../../internal/provider-model.js';

export type { WorkflowGenerateVideoResult } from '@ai-sdk/workflow/video';

/** Select a workflow model ID or a video model created by an ai-effect provider. */
export type WorkflowGenerateVideoOptions = Omit<NativeOptions, 'model'> & {
  readonly model: Extract<NativeOptions['model'], string> | VideoModelV4;
};

/** Generate a durable video inside a Workflow host. */
export const experimental_generateVideo = (
  options: WorkflowGenerateVideoOptions,
) =>
  Effect.gen(function* () {
    const { model, ...rest } = options;
    const native = typeof model === 'string' ? model : unwrapVideoModel(model);
    if (!native) {
      return yield* Effect.fail(
        sdkError('Workflow.generateVideo', 'Invalid video model'),
      );
    }
    return yield* runRequest('Workflow.generateVideo', {}, () =>
      sdkGenerateVideo({ ...rest, model: native }),
    );
  });
