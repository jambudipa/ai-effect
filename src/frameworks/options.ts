import type { DeepPartial, FlexibleSchema, InferSchema } from 'ai';
import { Schema } from 'effect';
import type { AiSdkError } from '../internal/operation.js';
import { toSdkSchema } from '../internal/schema.js';
import { viewError, type ViewLifetime, type HostResult } from './lifetime.js';

type StandardSchema<A> = Extract<
  FlexibleSchema<A>,
  { readonly '~standard': unknown }
>;
export type HostSchema<A> = Schema.ConstraintDecoder<A> | StandardSchema<A>;
export type DecodedSchema<S> =
  S extends Schema.ConstraintDecoder<infer A> ? A : InferSchema<S>;

const isEffectSchema = <A>(
  input: HostSchema<A>,
): input is Schema.ConstraintDecoder<A> => Schema.isSchema(input);

export const nativeSchema = <A>(input: HostSchema<A>): FlexibleSchema<A> =>
  isEffectSchema(input) ? toSdkSchema(input) : input;

type FetchOptions = {
  readonly api?: string;
  readonly id?: string;
  readonly fetch?: typeof globalThis.fetch;
  readonly headers?: Record<string, string> | Headers;
  readonly credentials?: RequestCredentials;
  readonly onError?: (error: AiSdkError) => HostResult<void>;
};

export type CompletionOptions<Body extends object = object> = FetchOptions & {
  readonly initialCompletion?: string;
  readonly initialInput?: string;
  readonly onFinish?: (prompt: string, completion: string) => HostResult<void>;
  readonly body?: Body;
  readonly streamProtocol?: 'data' | 'text';
};

export const nativeCompletionOptions = <Body extends object>(
  view: ViewLifetime,
  options?: CompletionOptions<Body>,
) => {
  const { onFinish, onError, fetch, ...data } = options ?? {};
  return {
    ...data,
    fetch: view.fetch(fetch),
    ...(onFinish
      ? {
          onFinish: (prompt: string, completion: string) =>
            view.notify('Completion.onFinish', onFinish, prompt, completion),
        }
      : {}),
    ...(onError
      ? {
          onError: (cause: Error) =>
            view.notify(
              'Completion.onError',
              onError,
              viewError('Completion', cause)!,
            ),
        }
      : {}),
  };
};

export type ObjectOptions<S, A = DecodedSchema<S>> = FetchOptions & {
  readonly api: string;
  readonly schema: S;
  readonly initialValue?: DeepPartial<A>;
  readonly onFinish?: (event: {
    object: A | undefined;
    error: AiSdkError | undefined;
  }) => HostResult<void>;
};

export const nativeObjectOptions = <S extends HostSchema<unknown>, A>(
  view: ViewLifetime,
  options: ObjectOptions<S, A>,
) => {
  const { onFinish, onError, schema, fetch, ...data } = options;
  return {
    ...data,
    schema: nativeSchema(schema),
    fetch: view.fetch(fetch),
    ...(onFinish
      ? {
          onFinish: (event: {
            object: A | undefined;
            error: Error | undefined;
          }) => {
            if (!view.signal.aborted) {
              return view.callback('StructuredObject.onFinish', () =>
                onFinish({
                  ...event,
                  error: viewError('StructuredObject', event.error),
                }),
              );
            }
          },
        }
      : {}),
    ...(onError
      ? {
          onError: (cause: Error) =>
            view.notify(
              'StructuredObject.onError',
              onError,
              viewError('StructuredObject', cause)!,
            ),
        }
      : {}),
  };
};
