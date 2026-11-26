import * as sdk from '@ai-sdk/solid';
import { jsonSchema as sdkJsonSchema } from '@ai-sdk/ui-utils';
import { Effect, JsonSchema, Result, Schema } from 'effect';
import { getOwner, onCleanup, type Accessor } from 'solid-js';
import type {
  Message,
  UseAssistantOptions,
  UseChatOptions as LegacyChatOptions,
  UseCompletionOptions,
} from '../integrations/ui-utils.js';
import {
  viewError,
  withLifetime,
  type ViewLifetime,
  type HostResult,
} from './lifetime.js';

export type {
  CreateMessage,
  Message,
  UseCompletionOptions,
} from '../integrations/ui-utils.js';

/** Keep native chat settings with Effect-capable lifecycle and response callbacks. */
export type UseChatOptions = LegacyChatOptions & {
  readonly maxSteps?: number;
  readonly experimental_prepareRequestBody?: (
    data: Parameters<
      NonNullable<sdk.UseChatOptions['experimental_prepareRequestBody']>
    >[0],
  ) => unknown;
};

// The pinned Solid hooks return functions. The SDK type also includes JSX
// bindings that apply when callers supply event handlers to Solid.
/** Retain the native event input handler accepted by the Solid host. */
type InputChangeHandler = Extract<
  ReturnType<typeof sdk.useChat>['handleInputChange'],
  (...args: never[]) => void
>;

/** Register native release only when a Solid owner is available. */
const cleanup = (release: () => void) => {
  if (getOwner()) onCleanup(release);
};

/** Evaluate reactive option accessors when the SDK needs the current configuration. */
const read = <A>(value: A | Accessor<A>): A =>
  typeof value === 'function' ? (value as Accessor<A>)() : value;

/** Bridge the optional response observer into the owning view callback runtime. */
const responseCallback = (
  view: ViewLifetime,
  handler?: (response: Response) => HostResult<void>,
) =>
  handler
    ? {
        onResponse: (response: Response) =>
          view.callback('onResponse', () => handler(response)),
      }
    : {};

/**
 * Provide Solid chat state and Effect commands, with active requests stopped when the
 * owner releases the view.
 */
export function useChat(options?: UseChatOptions | Accessor<UseChatOptions>) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.useChat(() => {
    const { onError, onFinish, onResponse, onToolCall, ...input } =
      read(options) ?? {};
    return {
      ...input,
      fetch: view.fetch(input.fetch),
      ...responseCallback(view, onResponse),
      ...(onToolCall
        ? {
            onToolCall: (
              call: Parameters<NonNullable<LegacyChatOptions['onToolCall']>>[0],
            ) => view.callback('useChat.onToolCall', () => onToolCall(call)),
          }
        : {}),
      onError: (cause) =>
        view.notify('useChat.onError', onError, viewError('useChat', cause)!),
      onFinish: (...args) => view.notify('useChat.onFinish', onFinish, ...args),
    };
  });
  return {
    id: native.id,
    messages: () => native.messages(),
    error: () => viewError('useChat', native.error()),
    input: () => native.input(),
    data: () => native.data(),
    status: () => native.status(),
    isLoading: () => native.isLoading(),
    setInput: native.setInput,
    setMessages: (messages: Message[] | ((previous: Message[]) => Message[])) =>
      native.setMessages(messages),
    setData: (...args: Parameters<typeof native.setData>) =>
      native.setData(...args),
    handleInputChange: native.handleInputChange as InputChangeHandler,
    fetch: view.fetch(native.fetch),
    append: (...args: Parameters<typeof native.append>) =>
      view.command('useChat.append', () => native.append(...args), native.stop),
    reload: (...args: Parameters<typeof native.reload>) =>
      view.command('useChat.reload', () => native.reload(...args), native.stop),
    stop: () => view.action('useChat.stop', native.stop),
    handleSubmit: (...args: Parameters<typeof native.handleSubmit>) =>
      view.command(
        'useChat.handleSubmit',
        () => native.handleSubmit(...args),
        native.stop,
      ),
    addToolResult: (...args: Parameters<typeof native.addToolResult>) =>
      view.action('useChat.addToolResult', () => native.addToolResult(...args)),
  };
}

/** Expose Solid accessors for chat state and scoped Effects for requests. */
export type UseChatHelpers = ReturnType<typeof useChat>;

/**
 * Keep native completion signals and run completion requests through the owning view
 * lifetime.
 */
export function useCompletion(
  options?: UseCompletionOptions | Accessor<UseCompletionOptions>,
) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.useCompletion(() => {
    const { onFinish, onResponse, onError, ...input } = read(options) ?? {};
    return {
      ...input,
      fetch: view.fetch(input.fetch),
      ...responseCallback(view, onResponse),
      onError: (cause) =>
        view.notify(
          'useCompletion.onError',
          onError,
          viewError('useCompletion', cause)!,
        ),
      onFinish: (...args) =>
        view.notify('useCompletion.onFinish', onFinish, ...args),
    };
  });
  const complete = (...args: Parameters<typeof native.complete>) =>
    view.command(
      'useCompletion.complete',
      () => native.complete(...args),
      native.stop,
    );
  return {
    completion: () => native.completion(),
    error: () => viewError('useCompletion', native.error()),
    input: () => native.input(),
    data: () => native.data(),
    isLoading: () => native.isLoading(),
    setInput: native.setInput,
    setCompletion: (...args: Parameters<typeof native.setCompletion>) =>
      native.setCompletion(...args),
    handleInputChange: native.handleInputChange as InputChangeHandler,
    fetch: view.fetch(native.fetch),
    complete,
    handleSubmit: (event?: { preventDefault?: () => void }) =>
      Effect.suspend(() => {
        event?.preventDefault?.();
        const input = native.input();
        return input ? Effect.asVoid(complete(input)) : Effect.void;
      }),
    stop: () => view.action('useCompletion.stop', native.stop),
  };
}

/** Expose Solid text and input accessors with Effect completion controls. */
export type UseCompletionHelpers = ReturnType<typeof useCompletion>;

/**
 * Accept an Effect decoder whose schema can be converted to the native Solid hook format.
 */
type Decoder = Schema.ConstraintDecoder<unknown>;
/**
 * Supply the endpoint, Effect schema, and callback settings for Solid structured
 * generation.
 */
export type Experimental_UseObjectOptions<
  Result,
  S extends Decoder = Schema.ConstraintDecoder<Result>,
> = {
  readonly api: string;
  readonly schema: S;
  readonly id?: string;
  readonly initialValue?: Exclude<
    sdk.Experimental_UseObjectOptions<Result>['initialValue'],
    undefined
  >;
  readonly fetch?: typeof globalThis.fetch;
  readonly onFinish?: (event: {
    object: Result | undefined;
    error: ReturnType<typeof viewError>;
  }) => HostResult<void>;
  readonly onError?: NonNullable<UseAssistantOptions['onError']>;
  readonly headers?: Record<string, string> | Headers;
  readonly credentials?: RequestCredentials;
};

/**
 * Stream structured results into Solid accessors and validate with the supplied Effect
 * decoder.
 */
export function experimental_useObject<Result, Input = unknown>(
  options:
    | Experimental_UseObjectOptions<Result>
    | Accessor<Experimental_UseObjectOptions<Result>>,
) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.experimental_useObject<Result, Input>(() => {
    const { onFinish, onError, ...input } = read(options);
    const { schema, definitions } = JsonSchema.toDocumentDraft07(
      Schema.toJsonSchemaDocument(input.schema),
    );
    const validate = Schema.decodeUnknownResult(input.schema);
    return {
      ...input,
      schema: sdkJsonSchema<Result>(
        { ...schema, definitions },
        {
          validate: (input) =>
            Result.match(validate(input), {
              onSuccess: (value) => ({ success: true, value }),
              onFailure: (error) => ({ success: false, error }),
            }),
        },
      ),
      fetch: view.fetch(input.fetch),
      onError: (cause) =>
        view.notify(
          'useObject.onError',
          onError,
          viewError('useObject', cause)!,
        ),
      onFinish: ({ object, error }) =>
        view.notify('useObject.onFinish', onFinish, {
          object,
          error: viewError('useObject', error),
        }),
    };
  });
  return {
    object: () => native.object(),
    error: () => viewError('useObject', native.error()),
    isLoading: () => native.isLoading(),
    submit: (input: Input) =>
      view.command('useObject.submit', () => native.submit(input), native.stop),
    stop: () => view.action('useObject.stop', native.stop),
  };
}

/**
 * Retain the structured result and request types on Solid accessors and Effect commands.
 */
export type Experimental_UseObjectHelpers<Result, Input> = ReturnType<
  typeof experimental_useObject<Result, Input>
>;

/**
 * Expose native assistant thread state and view-owned message commands with interruption
 * handling.
 */
export function useAssistant(
  options: UseAssistantOptions | Accessor<UseAssistantOptions>,
) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.useAssistant(() => {
    const { onError, ...input } = read(options);
    return {
      ...input,
      fetch: view.fetch(input.fetch),
      onError: (cause) =>
        view.notify(
          'useAssistant.onError',
          onError,
          viewError('useAssistant', cause)!,
        ),
    };
  });
  return {
    messages: native.messages,
    input: () => native.input(),
    threadId: () => native.threadId(),
    status: () => native.status(),
    error: () => viewError('useAssistant', native.error()),
    setInput: native.setInput,
    setMessages: native.setMessages,
    setThreadId: (...args: Parameters<typeof native.setThreadId>) =>
      native.setThreadId(...args),
    handleInputChange: native.handleInputChange as InputChangeHandler,
    append: (...args: Parameters<typeof native.append>) =>
      view.command(
        'useAssistant.append',
        () => native.append(...args),
        native.stop,
      ),
    submitMessage: (...args: Parameters<typeof native.submitMessage>) =>
      view.command(
        'useAssistant.submitMessage',
        () => native.submitMessage(...args),
        native.stop,
      ),
    stop: () => view.action('useAssistant.stop', native.stop),
  };
}

/** Expose the Solid assistant thread accessors and Effect request controls. */
export type UseAssistantHelpers = ReturnType<typeof useAssistant>;
