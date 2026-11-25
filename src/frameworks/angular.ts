import {
  Chat as NativeChat,
  Completion as NativeCompletion,
  StructuredObject as NativeStructuredObject,
} from '@ai-sdk/angular';
import { DestroyRef, inject } from '@angular/core';
import type { UIMessage } from 'ai';
import { HostChat, nativeChatOptions, type ChatInit } from './chat.js';
import { viewError, withLifetime } from './lifetime.js';
import {
  nativeCompletionOptions,
  nativeObjectOptions,
  nativeSchema,
  type CompletionOptions,
  type HostSchema,
  type DecodedSchema,
  type ObjectOptions,
} from './options.js';

export type { CompletionOptions } from './options.js';
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
    this.#native = new NativeCompletion<Body>(
      nativeCompletionOptions(this.#view, options),
    );
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
  readonly handleSubmit = (event?: { preventDefault?: () => void }) =>
    this.#view.command(
      'Completion.handleSubmit',
      () => this.#native.handleSubmit(event),
      this.#native.stop,
    );
  readonly stop = () => this.#view.action('Completion.stop', this.#native.stop);
}

export type StructuredObjectOptions<
  S extends HostSchema<unknown>,
  A = DecodedSchema<S>,
> = ObjectOptions<S, A>;

export class StructuredObject<
  S extends HostSchema<unknown>,
  A = DecodedSchema<S>,
  Input = unknown,
> {
  readonly #native: NativeStructuredObject<
    ReturnType<typeof nativeSchema<unknown>>,
    A,
    Input
  >;
  readonly #view = withLifetime(destroy, () => this.#native.stop());
  readonly options: StructuredObjectOptions<S, A>;

  constructor(options: StructuredObjectOptions<S, A>) {
    this.options = options;
    this.#native = new NativeStructuredObject(
      nativeObjectOptions(this.#view, options),
    );
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
