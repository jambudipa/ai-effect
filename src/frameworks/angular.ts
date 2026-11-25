import {
  Chat as NativeChat,
  Completion as NativeCompletion,
  StructuredObject as NativeStructuredObject,
  type CompletionOptions,
} from '@ai-sdk/angular';
import { DestroyRef, inject } from '@angular/core';
import type { UIMessage } from 'ai';
import { Schema } from 'effect';
import { toSdkSchema } from '../internal/schema.js';
import { HostChat, nativeChatOptions, type ChatInit } from './chat.js';
import { viewError, withLifetime } from './lifetime.js';

export type { CompletionOptions };
export type { ChatInit } from './chat.js';

const destroy = (cleanup: () => void) => {
  // Angular permits a standalone signal outside of injection. In a view the
  // owner's DestroyRef tears down its SDK work.
  try {
    inject(DestroyRef, { optional: true })?.onDestroy(cleanup);
  } catch {
    // Outside an injection context the caller can stop the handle explicitly.
  }
};

export class Chat<
  Message extends UIMessage = UIMessage,
> extends HostChat<Message> {
  constructor(options: ChatInit<Message>) {
    const view = withLifetime(destroy, () => {
      void native.dispose().catch(() => {});
    });
    const native = new NativeChat<Message>(nativeChatOptions(options, view));
    super(native, view);
  }
}

export class Completion<Body extends object = object> {
  readonly #native: NativeCompletion<Body>;
  readonly #view = withLifetime(destroy, () => this.#native.stop());

  constructor(options?: CompletionOptions<NoInfer<Body>>) {
    this.#native = new NativeCompletion<Body>({
      ...options,
      fetch: this.#view.fetch(options?.fetch),
      onFinish: (...args) => {
        if (!this.#view.signal.aborted) options?.onFinish?.(...args);
      },
      onError: (cause) => {
        if (!this.#view.signal.aborted)
          options?.onError?.(viewError('Completion', cause)!);
      },
    });
  }

  get id() {
    return this.#native.id;
  }
  get api() {
    return this.#native.api;
  }
  get streamProtocol() {
    return this.#native.streamProtocol;
  }
  get completion() {
    return this.#native.completion;
  }
  set completion(value: string) {
    this.#native.completion = value;
  }
  get input() {
    return this.#native.input;
  }
  set input(value: string) {
    this.#native.input = value;
  }
  get error() {
    return viewError('Completion', this.#native.error);
  }
  get loading() {
    return this.#native.loading;
  }

  readonly complete = (
    ...args: Parameters<NativeCompletion<Body>['complete']>
  ) =>
    this.#view.command(
      'Completion.complete',
      () => this.#native.complete(...args),
      this.#native.stop,
    );
  readonly handleSubmit = (
    ...args: Parameters<NativeCompletion<Body>['handleSubmit']>
  ) =>
    this.#view.command(
      'Completion.handleSubmit',
      () => this.#native.handleSubmit(...args),
      this.#native.stop,
    );
  readonly stop = () => this.#view.action('Completion.stop', this.#native.stop);
}

type Decoder = Schema.ConstraintDecoder<unknown>;
type NativeObjectOptions<A> = ConstructorParameters<
  typeof NativeStructuredObject<
    ReturnType<typeof toSdkSchema<unknown, never>>,
    A
  >
>[0];
export type StructuredObjectOptions<S extends Decoder, A = S['Type']> = Omit<
  NativeObjectOptions<A>,
  'schema'
> & { readonly schema: S };

export class StructuredObject<
  S extends Decoder,
  A = S['Type'],
  Input = unknown,
> {
  readonly #native: NativeStructuredObject<
    ReturnType<typeof toSdkSchema<unknown, never>>,
    A,
    Input
  >;
  readonly #view = withLifetime(destroy, () => this.#native.stop());
  readonly options: StructuredObjectOptions<S, A>;

  constructor(options: StructuredObjectOptions<S, A>) {
    this.options = options;
    this.#native = new NativeStructuredObject({
      ...options,
      schema: toSdkSchema(options.schema),
      fetch: this.#view.fetch(options.fetch),
      onFinish: (event) => {
        if (!this.#view.signal.aborted)
          return options.onFinish?.({
            ...event,
            error: viewError('StructuredObject', event.error),
          });
      },
      onError: (cause) => {
        if (!this.#view.signal.aborted)
          options.onError?.(viewError('StructuredObject', cause)!);
      },
    });
  }

  get id() {
    return this.#native.id;
  }
  get object() {
    return this.#native.object;
  }
  get error() {
    return viewError('StructuredObject', this.#native.error);
  }
  get loading() {
    return this.#native.loading;
  }
  readonly stop = () =>
    this.#view.action('StructuredObject.stop', this.#native.stop);
  readonly submit = (input: Input) =>
    this.#view.command(
      'StructuredObject.submit',
      () => this.#native.submit(input),
      this.#native.stop,
    );
}
