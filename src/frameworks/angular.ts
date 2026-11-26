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

/**
 * Register cleanup when Angular supplies a `DestroyRef`. A standalone handle can be
 * stopped explicitly.
 */
const destroy = (cleanup: () => void) => {
  // Angular permits a standalone signal outside of injection. In a view the
  // owner's DestroyRef tears down its SDK work.
  try {
    inject(DestroyRef, { optional: true })?.onDestroy(cleanup);
  } catch {
    // Outside an injection context the caller can stop the handle explicitly.
  }
};

/**
 * Bind chat commands to the Angular view lifecycle when created in an injection context.
 */
export class Chat<
  Message extends UIMessage = UIMessage,
> extends HostChat<Message> {
  /**
   * Bind the native chat and its cleanup to the Angular injection context when one is
   * active.
   */
  constructor(options: ChatInit<Message>) {
    const view = withLifetime(destroy, () => {
      void native.dispose().catch(() => {});
    });
    const native = new NativeChat<Message>(nativeChatOptions(options, view));
    super(native, view);
  }
}

/**
 * Keep completion state in the Angular host and expose generation and stop operations as
 * Effects.
 */
export class Completion<Body extends object = object> {
  /** Keep the native completion and its reactive state associated with this handle. */
  readonly #native: NativeCompletion<Body>;
  /**
   * Bind completion execution to the Angular lifetime and stop the native request on
   * cleanup.
   */
  readonly #view = withLifetime(destroy, () => this.#native.stop());

  /**
   * Adapt completion options and callbacks before constructing the native Angular
   * controller.
   */
  constructor(options?: CompletionOptions<NoInfer<Body>>) {
    this.#native = new NativeCompletion<Body>(
      nativeCompletionOptions(this.#view, options),
    );
  }

  /** Read the native ID used to identify completion state. */
  get id() {
    return this.#native.id;
  }
  /** Read the URL used for native completion requests. */
  get api() {
    return this.#native.api;
  }
  /** Read the selected SDK response protocol for completion requests. */
  get streamProtocol() {
    return this.#native.streamProtocol;
  }
  /** Read current completion text as the host updates it. */
  get completion() {
    return this.#native.completion;
  }
  /** Replace the native displayed completion text without a request. */
  set completion(value: string) {
    this.#native.completion = value;
  }
  /** Read the current form input from the native completion state. */
  get input() {
    return this.#native.input;
  }
  /** Update native form input without starting generation. */
  set input(value: string) {
    this.#native.input = value;
  }
  /** Read the current completion failure through the shared `AiSdkError` wrapper. */
  get error() {
    return viewError('Completion', this.#native.error);
  }
  /** Read the native request loading state. */
  get loading() {
    return this.#native.loading;
  }

  /** Start a completion when the Effect runs. Interruption stops the native request. */
  readonly complete = (
    ...args: Parameters<NativeCompletion<Body>['complete']>
  ) =>
    this.#view.command(
      'Completion.complete',
      () => this.#native.complete(...args),
      this.#native.stop,
    );
  /**
   * Use the native form submit contract inside an Effect with interruptible completion.
   */
  readonly handleSubmit = (event?: { preventDefault?: () => void }) =>
    this.#view.command(
      'Completion.handleSubmit',
      () => this.#native.handleSubmit(event),
      this.#native.stop,
    );
  /** Stop the active completion through its view-bound Effect action. */
  readonly stop = () => this.#view.action('Completion.stop', this.#native.stop);
}

/**
 * Configure the endpoint and output schema, with a final value type inferred from the
 * decoder.
 */
export type StructuredObjectOptions<
  S extends HostSchema<unknown>,
  A = DecodedSchema<S>,
> = ObjectOptions<S, A>;

/**
 * Keep structured generation in the Angular host and validate the final result through the
 * supplied schema.
 */
export class StructuredObject<
  S extends HostSchema<unknown>,
  A = DecodedSchema<S>,
  Input = unknown,
> {
  /**
   * Keep the native object controller that owns the partial result and current request.
   */
  readonly #native: NativeStructuredObject<
    ReturnType<typeof nativeSchema<unknown>>,
    A,
    Input
  >;
  /**
   * Bind structured generation to the Angular lifetime and stop the native request on
   * cleanup.
   */
  readonly #view = withLifetime(destroy, () => this.#native.stop());
  /** Keep the original structured generation options available to Angular consumers. */
  readonly options: StructuredObjectOptions<S, A>;

  /**
   * Bind the decoder and structured response callbacks to the Angular controller lifetime.
   */
  constructor(options: StructuredObjectOptions<S, A>) {
    this.options = options;
    this.#native = new NativeStructuredObject(
      nativeObjectOptions(this.#view, options),
    );
  }

  /** Read the native ID used to identify structured generation state. */
  get id() {
    return this.#native.id;
  }
  /** Read the current partial structured result during generation. */
  get object() {
    return this.#native.object;
  }
  /**
   * Read the current structured generation failure through the shared `AiSdkError`
   * wrapper.
   */
  get error() {
    return viewError('StructuredObject', this.#native.error);
  }
  /** Read the native request loading state. */
  get loading() {
    return this.#native.loading;
  }
  /** Stop the active structured request through its view-bound Effect action. */
  readonly stop = () =>
    this.#view.action('StructuredObject.stop', this.#native.stop);
  /**
   * Send the typed structured request when the Effect runs. Interruption stops the native
   * request.
   */
  readonly submit = (input: Input) =>
    this.#view.command(
      'StructuredObject.submit',
      () => this.#native.submit(input),
      this.#native.stop,
    );
}
