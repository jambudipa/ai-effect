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

/** Use the SDK's tracing channel name when registering a diagnostics subscriber. */
export const AI_SDK_TELEMETRY_TRACING_CHANNEL =
  sdk.AI_SDK_TELEMETRY_TRACING_CHANNEL;
/** Supply the standard UI stream headers as an immutable snapshot. */
export const UI_MESSAGE_STREAM_HEADERS = Object.freeze({
  ...sdk.UI_MESSAGE_STREAM_HEADERS,
});

/** Represent an ID supplier as a lazy operation with a typed failure channel. */
export type IdGenerator = () => Effect.Effect<string, AiSdkError>;

/** Request a new SDK-generated ID on each execution of the effect. */
export const generateId: IdGenerator = () =>
  runSync('generateId', sdk.generateId);

/** Create a reusable generator whose options control the prefix, separator, and size. */
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

/** Normalize supported binary and text content for a base64 transport field. */
export const convertDataContentToBase64String = (content: sdk.DataContent) =>
  runSync('convertDataContentToBase64String', () =>
    sdk.convertDataContentToBase64String(content),
  );

/** Encode browser-selected files as data URLs for a UI message. */
export const convertFileListToFileUIParts = (files?: FileList) =>
  runRequest('convertFileListToFileUIParts', {}, () =>
    sdk.convertFileListToFileUIParts(files),
  );

/** Compare vectors by direction without including their magnitude in the result. */
export const cosineSimilarity = (left: number[], right: number[]) =>
  runSync('cosineSimilarity', () => sdk.cosineSimilarity(left, right));

/** Decode the text payload of a data URL and report malformed input as an SDK error. */
export const getTextFromDataUrl = (dataUrl: string) =>
  runSync('getTextFromDataUrl', () => sdk.getTextFromDataUrl(dataUrl));

/** Compare structured data with the SDK equality rules inside a lazy effect. */
export const isDeepEqualData = (left: unknown, right: unknown) =>
  runSync('isDeepEqualData', () => sdk.isDeepEqualData(left, right));

/** Parse an incomplete JSON response and preserve the SDK repair outcome for streaming callers. */
export const parsePartialJson = (jsonText?: string) =>
  runRequest('parsePartialJson', {}, () => sdk.parsePartialJson(jsonText));

/** Trim message context with the SDK's reasoning, tool, and empty-message rules. */
export const pruneMessages = (
  options: Parameters<typeof sdk.pruneMessages>[0],
) => runSync('pruneMessages', () => sdk.pruneMessages(options));

/** Express SDK timeout limits and infer tool names from the public tool set. */
export type TimeoutConfiguration<Tools extends EffectTools = EffectTools> =
  sdk.TimeoutConfiguration<BoundTools<Tools>>;

/** Return the overall limit in milliseconds, or `None` if it is unset. */
export const getTotalTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getTotalTimeoutMs', () =>
    Option.fromNullishOr(sdk.getTotalTimeoutMs(timeout)),
  );

/** Return the per-step limit in milliseconds, or `None` if it is unset. */
export const getStepTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getStepTimeoutMs', () =>
    Option.fromNullishOr(sdk.getStepTimeoutMs(timeout)),
  );

/** Return the time allowed before the first chunk, in milliseconds. */
export const getFirstChunkTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getFirstChunkTimeoutMs', () =>
    Option.fromNullishOr(sdk.getFirstChunkTimeoutMs(timeout)),
  );

/** Return the time allowed between chunks, in milliseconds. */
export const getChunkTimeoutMs = (timeout?: TimeoutConfiguration) =>
  runSync('getChunkTimeoutMs', () =>
    Option.fromNullishOr(sdk.getChunkTimeoutMs(timeout)),
  );

/** Look up the limit for a named tool in milliseconds and preserve absence as `None`. */
export const getToolTimeoutMs = <Tools extends EffectTools>(
  timeout: TimeoutConfiguration<Tools>,
  toolName: keyof Tools & string,
) =>
  runSync('getToolTimeoutMs', () =>
    Option.fromNullishOr(
      sdk.getToolTimeoutMs<BoundTools<Tools>>(timeout, toolName),
    ),
  );

/** Resolve the name used to render or dispatch a UI tool part. */
export const getToolName = (part: ToolUIPart<UITools> | DynamicToolUIPart) =>
  runSync('getToolName', () => sdk.getToolName(part));

/** Support both a type-encoded static name and a runtime-supplied dynamic name. */
export const getToolOrDynamicToolName = (
  part: ToolUIPart<UITools> | DynamicToolUIPart,
) =>
  runSync('getToolOrDynamicToolName', () => sdk.getToolOrDynamicToolName(part));

/** Retain the declared tool-name union when extracting a static tool's name. */
export const getStaticToolName = <Tools extends UITools>(
  part: ToolUIPart<Tools>,
) => runSync('getStaticToolName', () => sdk.getStaticToolName(part));

/** Check whether the last assistant message can resume after approval responses arrive. */
export const lastAssistantMessageIsCompleteWithApprovalResponses = (options: {
  messages: sdk.UIMessage[];
}) =>
  runSync('lastAssistantMessageIsCompleteWithApprovalResponses', () =>
    sdk.lastAssistantMessageIsCompleteWithApprovalResponses(options),
  );

/** Check whether the last assistant message has completed the UI tool-call round. */
export const lastAssistantMessageIsCompleteWithToolCalls = (options: {
  messages: sdk.UIMessage[];
}) =>
  runSync('lastAssistantMessageIsCompleteWithToolCalls', () =>
    sdk.lastAssistantMessageIsCompleteWithToolCalls(options),
  );

// These guards inspect message data synchronously so TypeScript can narrow it.
/** Distinguish provider-defined custom content before reading its payload. */
export const isCustomContentUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is CustomContentUIPart => part.type === 'custom';

/** Recognize application data parts by the SDK `data-` discriminator prefix. */
export const isDataUIPart = <Data extends UIDataTypes>(
  part: UIMessagePart<Data, UITools>,
): part is DataUIPart<Data> => part.type.startsWith('data-');

/** Recognize a tool whose name was supplied at runtime. */
export const isDynamicToolUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is DynamicToolUIPart => part.type === 'dynamic-tool';

/** Identify a file attachment before reading its media type and URL. */
export const isFileUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is FileUIPart => part.type === 'file';

/** Recognize a file that belongs to a reasoning step. */
export const isReasoningFileUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ReasoningFileUIPart => part.type === 'reasoning-file';

/** Recognize a reasoning text part before rendering it alongside the answer. */
export const isReasoningUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is ReasoningUIPart => part.type === 'reasoning';

/** Recognize statically registered tools by the `tool-` discriminator prefix. */
export const isStaticToolUIPart = <Tools extends UITools>(
  part: UIMessagePart<UIDataTypes, Tools>,
): part is ToolUIPart<Tools> => part.type.startsWith('tool-');

/** Select plain response text from the mixed UI message parts. */
export const isTextUIPart = (
  part: UIMessagePart<UIDataTypes, UITools>,
): part is TextUIPart => part.type === 'text';

/** Identify a tool execution failure before reading the error output fields. */
export const isToolOutputErrorUIPart = <Tools extends UITools>(
  part: UIMessagePart<UIDataTypes, Tools>,
): part is ToolOutputErrorUIPart<Tools> =>
  isToolUIPart(part) && part.state === 'output-error';

/** Accept both registered and runtime-discovered tools without inspecting their output state. */
export const isToolUIPart = <Tools extends UITools>(
  part: UIMessagePart<UIDataTypes, Tools>,
): part is ToolUIPart<Tools> | DynamicToolUIPart =>
  isStaticToolUIPart(part) || isDynamicToolUIPart(part);
