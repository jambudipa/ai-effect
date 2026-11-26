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
  /** Keep the SDK completion and its reactive state associated with this handle. */
  readonly #sdk: SdkCompletion<Body>;
  /**
   * Bind completion execution to the Svelte lifetime and stop the native request on
   * cleanup.
   */
  readonly #view = withLifetime(onDestroy, () => this.#sdk.stop());

  /**
   * Register completion cancellation with the current Svelte component and adapt native
   * options.
   */
  constructor(options?: CompletionOptions<NoInfer<Body>>) {
    this.#sdk = new SdkCompletion<Body>(
      nativeCompletionOptions(this.#view, options),
    );
  }

  /** Read current completion text as the host updates it. */
  get completion() {
    return this.#sdk.completion;
  }
  /** Replace the native displayed completion text without a request. */
  set completion(value: string) {
    this.#sdk.completion = value;
  }
  /** Read the current form input from the native completion state. */
  get input() {
    return this.#sdk.input;
  }
  /** Update native form input without starting generation. */
  set input(value: string) {
    this.#sdk.input = value;
  }
  /** Read the current completion failure through the shared `AiSdkError` wrapper. */
  get error() {
    return viewError('Completion.complete', this.#sdk.error);
  }
  /** Read the native request loading state. */
  get loading() {
    return this.#sdk.loading;
  }
  /** Stop the active completion through its view-bound Effect action. */
  readonly stop = () => this.#view.action('Completion.stop', this.#sdk.stop);
  /** Start a completion when the Effect runs. Interruption stops the native request. */
  readonly complete = (...args: Parameters<SdkCompletion<Body>['complete']>) =>
    this.#view.command(
      'Completion.complete',
      () => this.#sdk.complete(...args),
      this.#sdk.stop,
    );
  /**
   * Use the native form submit contract inside an Effect with interruptible completion.
   */
  readonly handleSubmit = (event?: { preventDefault?: () => void }) =>
    this.#view.command(
      'Completion.handleSubmit',
      () => this.#sdk.handleSubmit(event),
      this.#sdk.stop,
    );
}

/**
 * Configure the endpoint and output schema, with a final value type inferred from the
 * decoder.
 */
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
  /** Keep the SDK object controller that owns the partial result and current request. */
  readonly #sdk: SdkStructuredObject<
    ReturnType<typeof nativeSchema<unknown>>,
    Result,
    Input
  >;
  /**
   * Bind structured generation to the Svelte lifetime and stop the native request on
   * cleanup.
   */
  readonly #view = withLifetime(onDestroy, () => this.#sdk.stop());

  /** Adapt the schema and callbacks in the current Svelte component lifecycle. */
  constructor(options: StructuredObjectOptions<S, Result>) {
    this.#sdk = new SdkStructuredObject(
      nativeObjectOptions(this.#view, options),
    );
  }

  /** Read the current partial structured result during generation. */
  get object() {
    return this.#sdk.object;
  }
  /**
   * Read the current structured generation failure through the shared `AiSdkError`
   * wrapper.
   */
  get error() {
    return viewError('StructuredObject.submit', this.#sdk.error);
  }
  /** Read the native request loading state. */
  get loading() {
    return this.#sdk.loading;
  }
  /** Stop the active structured request through its view-bound Effect action. */
  readonly stop = () =>
    this.#view.action('StructuredObject.stop', this.#sdk.stop);
  /** Clear the current structured result through the native host action. */
  readonly clear = () =>
    this.#view.action('StructuredObject.clear', this.#sdk.clear);
  /**
   * Send the typed structured request when the Effect runs. Interruption stops the native
   * request.
   */
  readonly submit = (input: Input) =>
    this.#view.command(
      'StructuredObject.submit',
      () => this.#sdk.submit(input),
      this.#sdk.stop,
    );
}

/** @deprecated Use StructuredObject. */
export const Experimental_StructuredObject = StructuredObject;
/** Retain the legacy type name for the schema-aware `StructuredObject` controller. */
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
  /**
   * Bind chat to the current Svelte component so destruction disposes the native
   * conversation handle.
   */
  constructor(options: ChatInit<Message>) {
    const view = withLifetime(onDestroy, () => {
      void native.dispose().catch(() => {});
    });
    const native = new SdkChat<Message>(nativeChatOptions(options, view));
    super(native, view);
  }
}
