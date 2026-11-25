import {
  Chat as SdkChat,
  Completion as SdkCompletion,
  StructuredObject as SdkStructuredObject,
  createAIContext as sdkCreateAIContext,
  type CompletionOptions as SdkCompletionOptions,
} from '@ai-sdk/svelte';
import type { ChatInit, DeepPartial, UIMessage } from 'ai';
import { Effect, Schema } from 'effect';
import { onDestroy } from 'svelte';
import {
  abortable,
  combineSignals,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import { toSdkSchema } from '../internal/schema.js';

export type { CreateUIMessage, UIMessage } from 'ai';

/** Create the AI SDK stores for the current component and its children. */
export function createAIContext(): void {
  sdkCreateAIContext();
}

const viewLifetime = (dispose: () => void) => {
  const owner = new AbortController();
  onDestroy(() => {
    owner.abort();
    dispose();
  });
  return owner.signal;
};

const command =
  (lifetime: AbortSignal, stop: () => void) =>
  <A>(operation: string, request: () => PromiseLike<A>) =>
    abortable(
      operation,
      lifetime,
      runRequest(operation, {}, request).pipe(
        Effect.onInterrupt(() => Effect.sync(stop)),
      ),
    );

const guardedFetch =
  (
    lifetime: AbortSignal,
    fetcher: typeof globalThis.fetch = globalThis.fetch,
  ) =>
  (input: RequestInfo | URL, init?: RequestInit) => {
    const signal = combineSignals(lifetime, init?.signal ?? undefined);
    return fetcher(input, { ...init, signal }).then((response) => {
      if (signal.aborted) {
        void response.body?.cancel().catch(() => {});
        signal.throwIfAborted();
      }
      if (!response.body) return response;
      // The caller may provide a fetch implementation that ignores the signal.
      // A guarded pipe also stops a response that has already begun streaming.
      const body = response.body.pipeThrough(new TransformStream(), { signal });
      return new Response(body, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      });
    });
  };

export type CompletionOptions<Body extends object = object> =
  SdkCompletionOptions<Body>;

/** Bind a completion to the current Svelte component. */
export class Completion<Body extends object = object> {
  readonly #sdk: SdkCompletion<Body>;
  readonly #lifetime: AbortSignal;

  constructor(options?: CompletionOptions<NoInfer<Body>>) {
    this.#lifetime = viewLifetime(() => this.#sdk.stop());
    const lifetime = this.#lifetime;
    this.#sdk = new SdkCompletion<Body>({
      ...options,
      fetch: guardedFetch(lifetime, options?.fetch),
      onFinish: (...args) => {
        if (!lifetime.aborted) return options?.onFinish?.(...args);
      },
      onError: (error) => {
        if (!lifetime.aborted)
          options?.onError?.(sdkError('Completion.complete', error));
      },
    });
  }

  get completion() {
    return this.#sdk.completion;
  }
  set completion(value: string) {
    this.#sdk.completion = value;
  }
  get input() {
    return this.#sdk.input;
  }
  set input(value: string) {
    this.#sdk.input = value;
  }
  get error() {
    const error = this.#sdk.error;
    return error ? sdkError('Completion.complete', error) : undefined;
  }
  get loading() {
    return this.#sdk.loading;
  }
  readonly stop = () => runSync('Completion.stop', () => this.#sdk.stop());
  readonly complete = (...args: Parameters<SdkCompletion<Body>['complete']>) =>
    command(this.#lifetime, () => this.#sdk.stop())('Completion.complete', () =>
      this.#sdk.complete(...args),
    );
  readonly handleSubmit = (
    ...args: Parameters<SdkCompletion<Body>['handleSubmit']>
  ) =>
    command(this.#lifetime, () => this.#sdk.stop())(
      'Completion.handleSubmit',
      () => this.#sdk.handleSubmit(...args),
    );
}

export type StructuredObjectOptions<
  Decoder extends Schema.ConstraintDecoder<unknown>,
  Result = Decoder['Type'],
> = {
  readonly api: string;
  readonly schema: Decoder;
  readonly id?: string;
  readonly initialValue?: DeepPartial<Result>;
  readonly fetch?: typeof globalThis.fetch;
  readonly onFinish?: (event: {
    object: Result | undefined;
    error: Error | undefined;
  }) => Promise<void> | void;
  readonly onError?: (error: Error) => void;
  readonly headers?: Record<string, string> | Headers;
  readonly credentials?: RequestCredentials;
};

/** Bind a structured object to the current Svelte component. */
export class StructuredObject<
  Decoder extends Schema.ConstraintDecoder<unknown>,
  Result = Decoder['Type'],
  Input = unknown,
> {
  readonly #sdk: SdkStructuredObject<
    ReturnType<typeof toSdkSchema<Decoder['Type'], never>>,
    Result,
    Input
  >;
  readonly #lifetime: AbortSignal;

  constructor(options: StructuredObjectOptions<Decoder, Result>) {
    this.#lifetime = viewLifetime(() => this.#sdk.stop());
    const lifetime = this.#lifetime;
    this.#sdk = new SdkStructuredObject({
      ...options,
      schema: toSdkSchema(options.schema),
      fetch: guardedFetch(lifetime, options.fetch),
      onFinish: ({ object, error }) => {
        if (!lifetime.aborted) {
          return options.onFinish?.({
            object,
            error: error
              ? sdkError('StructuredObject.submit', error)
              : undefined,
          });
        }
      },
      onError: (error) => {
        if (!lifetime.aborted)
          options.onError?.(sdkError('StructuredObject.submit', error));
      },
    });
  }

  get object() {
    return this.#sdk.object;
  }
  get error() {
    const error = this.#sdk.error;
    return error ? sdkError('StructuredObject.submit', error) : undefined;
  }
  get loading() {
    return this.#sdk.loading;
  }
  readonly stop = () =>
    runSync('StructuredObject.stop', () => this.#sdk.stop());
  readonly clear = () =>
    runSync('StructuredObject.clear', () => this.#sdk.clear());
  readonly submit = (input: Input) =>
    command(this.#lifetime, () => this.#sdk.stop())(
      'StructuredObject.submit',
      () => this.#sdk.submit(input),
    );
}

/** @deprecated Use StructuredObject. */
export const Experimental_StructuredObject = StructuredObject;
export type Experimental_StructuredObject<
  Decoder extends Schema.ConstraintDecoder<unknown>,
  Result = Decoder['Type'],
  Input = unknown,
> = StructuredObject<Decoder, Result, Input>;
/** @deprecated Use StructuredObjectOptions. */
export type Experimental_StructuredObjectOptions<
  Decoder extends Schema.ConstraintDecoder<unknown>,
  Result = Decoder['Type'],
> = StructuredObjectOptions<Decoder, Result>;

/** Bind a chat to the current Svelte component. */
export class Chat<Message extends UIMessage = UIMessage> {
  readonly #sdk: SdkChat<Message>;
  readonly #lifetime: AbortSignal;

  constructor(init: ChatInit<Message>) {
    this.#lifetime = viewLifetime(() => {
      void this.#sdk.dispose().catch(() => {});
    });
    const lifetime = this.#lifetime;
    this.#sdk = new SdkChat({
      ...init,
      onError: (error) => {
        if (!lifetime.aborted) init.onError?.(sdkError('Chat', error));
      },
      onToolCall: (event) => {
        if (!lifetime.aborted) return init.onToolCall?.(event);
      },
      onData: (event) => {
        if (!lifetime.aborted) return init.onData?.(event);
      },
      onFinish: (event) => {
        if (!lifetime.aborted) return init.onFinish?.(event);
      },
      sendAutomaticallyWhen: (options) =>
        !lifetime.aborted && (init.sendAutomaticallyWhen?.(options) ?? false),
    });
  }

  get id() {
    return this.#sdk.id;
  }
  get status() {
    return this.#sdk.status;
  }
  get error() {
    const error = this.#sdk.error;
    return error ? sdkError('Chat', error) : undefined;
  }
  get messages() {
    return this.#sdk.messages;
  }
  set messages(messages: Message[]) {
    this.#sdk.messages = messages;
  }
  get lastMessage() {
    return this.#sdk.lastMessage;
  }
  get experimental_queuedMessages() {
    return this.#sdk.experimental_queuedMessages;
  }

  #request<A>(name: string, request: () => PromiseLike<A>) {
    return command(this.#lifetime, () => {
      void this.#sdk.stop().catch(() => {});
    })(name, request);
  }

  readonly generateId = () =>
    runSync('Chat.generateId', () => this.#sdk.generateId());
  readonly experimental_removeQueuedMessage = (
    ...args: Parameters<SdkChat<Message>['experimental_removeQueuedMessage']>
  ) =>
    runSync('Chat.experimental_removeQueuedMessage', () =>
      this.#sdk.experimental_removeQueuedMessage(...args),
    );
  readonly experimental_sendQueuedMessageNow = (
    ...args: Parameters<SdkChat<Message>['experimental_sendQueuedMessageNow']>
  ) =>
    this.#request('Chat.experimental_sendQueuedMessageNow', () =>
      this.#sdk.experimental_sendQueuedMessageNow(...args),
    );
  readonly sendMessage = (
    ...args: Parameters<SdkChat<Message>['sendMessage']>
  ) => this.#request('Chat.sendMessage', () => this.#sdk.sendMessage(...args));
  readonly regenerate = (...args: Parameters<SdkChat<Message>['regenerate']>) =>
    this.#request('Chat.regenerate', () => this.#sdk.regenerate(...args));
  readonly resumeStream = (
    ...args: Parameters<SdkChat<Message>['resumeStream']>
  ) =>
    this.#request('Chat.resumeStream', () => this.#sdk.resumeStream(...args));
  readonly clearError = () =>
    runSync('Chat.clearError', () => this.#sdk.clearError());
  readonly addToolApprovalResponse = (
    ...args: Parameters<SdkChat<Message>['addToolApprovalResponse']>
  ) =>
    this.#request('Chat.addToolApprovalResponse', () =>
      Promise.resolve(this.#sdk.addToolApprovalResponse(...args)),
    );
  readonly addToolOutput = (
    ...args: Parameters<SdkChat<Message>['addToolOutput']>
  ) =>
    this.#request('Chat.addToolOutput', () =>
      Promise.resolve(this.#sdk.addToolOutput(...args)),
    );
  readonly addToolResult = this.addToolOutput;
  readonly stop = () => runRequest('Chat.stop', {}, () => this.#sdk.stop());
  readonly dispose = () =>
    runRequest('Chat.dispose', {}, () => this.#sdk.dispose());
}
