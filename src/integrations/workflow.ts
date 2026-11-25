import * as sdk from '@ai-sdk/workflow';
import type { UIMessageChunk } from 'ai';
import { Effect, Stream } from 'effect';
import { runSync, sdkError } from '../internal/operation.js';

export { Output } from '../internal/output.js';
export { WorkflowChatTransport } from './workflow/client.js';
export type {
  ReconnectToStreamOptions,
  SendMessagesOptions,
  WorkflowChatTransportOptions,
} from './workflow/client.js';

export type {
  GenerationSettings,
  ModelCallStreamPart,
  ProviderOptions,
  WorkflowAgentTimeoutConfiguration,
  WorkflowAgentToolExecutionEndEvent,
  WorkflowAgentToolExecutionStartEvent,
  WorkflowToolApprovalSecret,
} from '@ai-sdk/workflow';

export const toUIMessageChunk = (
  ...args: Parameters<typeof sdk.toUIMessageChunk>
) => runSync('Workflow.toUIMessageChunk', () => sdk.toUIMessageChunk(...args));

export const createModelCallToUIChunkTransform = (
  ...args: Parameters<typeof sdk.createModelCallToUIChunkTransform>
) =>
  runSync('Workflow.createModelCallToUIChunkTransform', () =>
    sdk.createModelCallToUIChunkTransform(...args),
  );

/** Normalize UI chunk order using the workflow protocol. */
export const normalizeUIMessageStreamParts = <E = never, R = never>(
  input: Stream.Stream<UIMessageChunk, E, R> | AsyncIterable<UIMessageChunk>,
) =>
  Stream.unwrap(
    Effect.gen(function* () {
      const source =
        Stream.TypeId in input
          ? yield* Stream.toAsyncIterableEffect(input)
          : input;
      const operation = 'Workflow.normalizeUIMessageStreamParts';
      const chunks = yield* runSync(operation, () =>
        sdk.normalizeUIMessageStreamParts(source),
      );
      return Stream.fromAsyncIterable(chunks, (cause) =>
        sdkError(operation, cause),
      );
    }),
  );
