import {
  Chat as SdkChat,
  Completion as SdkCompletion,
  StructuredObject as SdkStructuredObject,
  createAIContext as sdkCreateAIContext,
  type CompletionOptions as SdkCompletionOptions,
} from '@ai-sdk/svelte';
import type { DeepPartial, UIMessage } from 'ai';
import { Effect, Schema } from 'effect';
import { onDestroy } from 'svelte';
import { guardedFetch } from '../internal/fetch.js';
import {
  abortable,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import { toSdkSchema } from '../internal/schema.js';
import { HostChat, nativeChatOptions, type ChatInit } from './chat.js';
import { withLifetime } from './lifetime.js';

export type { CreateUIMessage, UIMessage } from 'ai';
export type { ChatInit } from './chat.js';

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
export class Chat<
  Message extends UIMessage = UIMessage,
> extends HostChat<Message> {
  constructor(options: ChatInit<Message>) {
    const view = withLifetime(onDestroy, () => {
      void native.dispose().catch(() => {});
    });
    const native = new SdkChat<Message>(nativeChatOptions(options, view));
    super(native, view);
  }
}
