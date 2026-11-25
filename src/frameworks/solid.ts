import * as sdk from '@ai-sdk/solid';
import { jsonSchema as sdkJsonSchema } from '@ai-sdk/ui-utils';
import { Effect, JsonSchema, Result, Schema } from 'effect';
import { getOwner, onCleanup, type Accessor } from 'solid-js';
import { viewError, withLifetime } from './lifetime.js';

export type {
  CreateMessage,
  Message,
  UseChatOptions,
  UseCompletionOptions,
} from '@ai-sdk/solid';

const cleanup = (release: () => void) => {
  if (getOwner()) onCleanup(release);
};

const read = <A>(value: A | Accessor<A>): A =>
  typeof value === 'function' ? (value as Accessor<A>)() : value;

export function useChat(options?: Parameters<typeof sdk.useChat>[0]) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.useChat(() => {
    const input = read(options) ?? {};
    return {
      ...input,
      fetch: view.fetch(input.fetch),
      onError: (cause) => {
        if (!view.signal.aborted) input.onError?.(viewError('useChat', cause)!);
      },
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
    setMessages: (...args: Parameters<typeof native.setMessages>) =>
      native.setMessages(...args),
    setData: (...args: Parameters<typeof native.setData>) =>
      native.setData(...args),
    handleInputChange: native.handleInputChange,
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

export type UseChatHelpers = ReturnType<typeof useChat>;

export function useCompletion(
  options?: Parameters<typeof sdk.useCompletion>[0],
) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.useCompletion(() => {
    const input = read(options) ?? {};
    return { ...input, fetch: view.fetch(input.fetch) };
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
    handleInputChange: native.handleInputChange,
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

export type UseCompletionHelpers = ReturnType<typeof useCompletion>;

type Decoder = Schema.ConstraintDecoder<unknown>;
export type Experimental_UseObjectOptions<
  Result,
  S extends Decoder = Schema.ConstraintDecoder<Result>,
> = Omit<sdk.Experimental_UseObjectOptions<Result>, 'schema'> & {
  readonly schema: S;
};

export function experimental_useObject<Result, Input = unknown>(
  options:
    | Experimental_UseObjectOptions<Result>
    | Accessor<Experimental_UseObjectOptions<Result>>,
) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.experimental_useObject<Result, Input>(() => {
    const input = read(options);
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

export type Experimental_UseObjectHelpers<Result, Input> = ReturnType<
  typeof experimental_useObject<Result, Input>
>;

export function useAssistant(options: Parameters<typeof sdk.useAssistant>[0]) {
  const view = withLifetime(cleanup, () => native.stop());
  const native = sdk.useAssistant(() => {
    const input = read(options);
    return {
      ...input,
      fetch: view.fetch(input.fetch),
      onError: (cause) => {
        if (!view.signal.aborted)
          input.onError?.(viewError('useAssistant', cause)!);
      },
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
    handleInputChange: native.handleInputChange,
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

export type UseAssistantHelpers = ReturnType<typeof useAssistant>;
