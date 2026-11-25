import {
  Chat as SdkChat,
  Completion as SdkCompletion,
  StructuredObject as SdkStructuredObject,
  createAIContext as sdkCreateAIContext,
} from '@ai-sdk/svelte';
import type { UIMessage } from 'ai';
import { onDestroy } from 'svelte';
import { HostChat, nativeChatOptions, type ChatInit } from './chat.js';
import { viewError, withLifetime } from './lifetime.js';
import {
  nativeCompletionOptions,
  nativeObjectOptions,
  nativeSchema,
  type CompletionOptions,
  type DecodedSchema,
  type HostSchema,
  type ObjectOptions,
} from './options.js';

export type { CreateUIMessage, UIMessage } from 'ai';
export type { ChatInit } from './chat.js';
export type { CompletionOptions } from './options.js';

/** Create the AI SDK stores for the current component and its children. */
export function createAIContext(): void {
  sdkCreateAIContext();
}

/** Bind a completion to the current Svelte component. */
export class Completion<Body extends object = object> {
  readonly #sdk: SdkCompletion<Body>;
  readonly #view = withLifetime(onDestroy, () => this.#sdk.stop());

  constructor(options?: CompletionOptions<NoInfer<Body>>) {
    this.#sdk = new SdkCompletion<Body>(
      nativeCompletionOptions(this.#view, options),
    );
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
    return viewError('Completion.complete', this.#sdk.error);
  }
  get loading() {
    return this.#sdk.loading;
  }
  readonly stop = () => this.#view.action('Completion.stop', this.#sdk.stop);
  readonly complete = (...args: Parameters<SdkCompletion<Body>['complete']>) =>
    this.#view.command(
      'Completion.complete',
      () => this.#sdk.complete(...args),
      this.#sdk.stop,
    );
  readonly handleSubmit = (event?: { preventDefault?: () => void }) =>
    this.#view.command(
      'Completion.handleSubmit',
      () => this.#sdk.handleSubmit(event),
      this.#sdk.stop,
    );
}

export type StructuredObjectOptions<
  S extends HostSchema<unknown>,
  A = DecodedSchema<S>,
> = ObjectOptions<S, A>;

/** Bind a structured object to the current Svelte component. */
export class StructuredObject<
  S extends HostSchema<unknown>,
  Result = DecodedSchema<S>,
  Input = unknown,
> {
  readonly #sdk: SdkStructuredObject<
    ReturnType<typeof nativeSchema<unknown>>,
    Result,
    Input
  >;
  readonly #view = withLifetime(onDestroy, () => this.#sdk.stop());

  constructor(options: StructuredObjectOptions<S, Result>) {
    this.#sdk = new SdkStructuredObject(
      nativeObjectOptions(this.#view, options),
    );
  }

  get object() {
    return this.#sdk.object;
  }
  get error() {
    return viewError('StructuredObject.submit', this.#sdk.error);
  }
  get loading() {
    return this.#sdk.loading;
  }
  readonly stop = () =>
    this.#view.action('StructuredObject.stop', this.#sdk.stop);
  readonly clear = () =>
    this.#view.action('StructuredObject.clear', this.#sdk.clear);
  readonly submit = (input: Input) =>
    this.#view.command(
      'StructuredObject.submit',
      () => this.#sdk.submit(input),
      this.#sdk.stop,
    );
}

/** @deprecated Use StructuredObject. */
export const Experimental_StructuredObject = StructuredObject;
export type Experimental_StructuredObject<
  S extends HostSchema<unknown>,
  R = DecodedSchema<S>,
  I = unknown,
> = StructuredObject<S, R, I>;
/** @deprecated Use StructuredObjectOptions. */
export type Experimental_StructuredObjectOptions<
  S extends HostSchema<unknown>,
  R = DecodedSchema<S>,
> = StructuredObjectOptions<S, R>;

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
