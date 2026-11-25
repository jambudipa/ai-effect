import * as sdk from 'ai';
import type {
  CustomContentUIPart,
  DataUIPart,
  DynamicToolUIPart,
  FileUIPart,
  ReasoningFileUIPart,
  ReasoningUIPart,
  TextUIPart,
  ToolOutputErrorUIPart,
  ToolUIPart,
  UIDataTypes,
  UIMessagePart,
  UITools,
} from 'ai';
import { Effect, Option } from 'effect';
import { runRequest, runSync, type AiSdkError } from './internal/operation.js';
import type { BoundTools, EffectTools } from './internal/tool.js';

export const AI_SDK_TELEMETRY_TRACING_CHANNEL =
  sdk.AI_SDK_TELEMETRY_TRACING_CHANNEL;
export const UI_MESSAGE_STREAM_HEADERS = Object.freeze({
  ...sdk.UI_MESSAGE_STREAM_HEADERS,
});

export type IdGenerator = () => Effect.Effect<string, AiSdkError>;

export const generateId: IdGenerator = () =>
  runSync('generateId', sdk.generateId);

export const createIdGenerator = (
  options?: Parameters<typeof sdk.createIdGenerator>[0],
) =>
  runSync('createIdGenerator', () => sdk.createIdGenerator(options)).pipe(
    Effect.map(
      (generate): IdGenerator =>
        () =>
          runSync('IdGenerator', generate),
    ),
  );

export const convertDataContentToBase64String = (content: sdk.DataContent) =>
  runSync('convertDataContentToBase64String', () =>
    sdk.convertDataContentToBase64String(content),
  );

export const convertFileListToFileUIParts = (files?: FileList) =>
  runRequest('convertFileListToFileUIParts', {}, () =>
    sdk.convertFileListToFileUIParts(files),
  );

export const cosineSimilarity = (left: number[], right: number[]) =>
  runSync('cosineSimilarity', () => sdk.cosineSimilarity(left, right));

export const getTextFromDataUrl = (dataUrl: string) =>
  runSync('getTextFromDataUrl', () => sdk.getTextFromDataUrl(dataUrl));

export const isDeepEqualData = (left: unknown, right: unknown) =>
  runSync('isDeepEqualData', () => sdk.isDeepEqualData(left, right));

export const parsePartialJson = (jsonText?: string) =>
  runRequest('parsePartialJson', {}, () => sdk.parsePartialJson(jsonText));

export const pruneMessages = (
  options: Parameters<typeof sdk.pruneMessages>[0],
) => runSync('pruneMessages', () => sdk.pruneMessages(options));

export type TimeoutConfiguration<Tools extends EffectTools = EffectTools> =
  sdk.TimeoutConfiguration<BoundTools<Tools>>;

export const getTotalTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getTotalTimeoutMs', () =>
    Option.fromNullishOr(sdk.getTotalTimeoutMs(timeout)),
  );

export const getStepTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getStepTimeoutMs', () =>
    Option.fromNullishOr(sdk.getStepTimeoutMs(timeout)),
  );

export const getFirstChunkTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getFirstChunkTimeoutMs', () =>
    Option.fromNullishOr(sdk.getFirstChunkTimeoutMs(timeout)),
  );

export const getChunkTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getChunkTimeoutMs', () =>
    Option.fromNullishOr(sdk.getChunkTimeoutMs(timeout)),
  );

export const getToolTimeoutMs = <Tools extends EffectTools>(
  timeout: TimeoutConfiguration<Tools>,
  toolName: keyof Tools & string,
) =>
  runSync('getToolTimeoutMs', () =>
    Option.fromNullishOr(
      sdk.getToolTimeoutMs<BoundTools<Tools>>(timeout, toolName),
    ),
  );

export const getToolName = (part: ToolUIPart<UITools> | DynamicToolUIPart) =>
  runSync('getToolName', () => sdk.getToolName(part));

export const getToolOrDynamicToolName = (
  part: ToolUIPart<UITools> | DynamicToolUIPart,
) =>
  runSync('getToolOrDynamicToolName', () => sdk.getToolOrDynamicToolName(part));

export const getStaticToolName = <Tools extends UITools>(
  part: ToolUIPart<Tools>,
) => runSync('getStaticToolName', () => sdk.getStaticToolName(part));

export const lastAssistantMessageIsCompleteWithApprovalResponses = (options: {
  messages: sdk.UIMessage[];
}) =>
  runSync('lastAssistantMessageIsCompleteWithApprovalResponses', () =>
    sdk.lastAssistantMessageIsCompleteWithApprovalResponses(options),
  );

export const lastAssistantMessageIsCompleteWithToolCalls = (options: {
  messages: sdk.UIMessage[];
}) =>
  runSync('lastAssistantMessageIsCompleteWithToolCalls', () =>
    sdk.lastAssistantMessageIsCompleteWithToolCalls(options),
  );

// These guards inspect message data synchronously so TypeScript can narrow it.
export const isCustomContentUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is CustomContentUIPart => part.type === 'custom';

export const isDataUIPart = <Data extends UIDataTypes>(
  part: UIMessagePart<Data, UITools>,
): part is DataUIPart<Data> => part.type.startsWith('data-');

export const isDynamicToolUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is DynamicToolUIPart => part.type === 'dynamic-tool';

export const isFileUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is FileUIPart => part.type === 'file';

export const isReasoningFileUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ReasoningFileUIPart => part.type === 'reasoning-file';

export const isReasoningUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ReasoningUIPart => part.type === 'reasoning';

export const isStaticToolUIPart = <Tools extends UITools>(
  part: UIMessagePart<UIDataTypes, Tools>,
): part is ToolUIPart<Tools> => part.type.startsWith('tool-');

export const isTextUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is TextUIPart => part.type === 'text';

export const isToolOutputErrorUIPart = <Tools extends UITools>(
  part: UIMessagePart<UIDataTypes, Tools>,
): part is ToolOutputErrorUIPart<Tools> =>
  isToolUIPart(part) && part.state === 'output-error';

export const isToolUIPart = <Tools extends UITools>(
  part: UIMessagePart<UIDataTypes, Tools>,
): part is ToolUIPart<Tools> | DynamicToolUIPart =>
  isStaticToolUIPart(part) || isDynamicToolUIPart(part);
