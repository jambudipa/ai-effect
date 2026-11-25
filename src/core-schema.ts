import type { JSONSchema7, JSONValue } from '@ai-sdk/provider';
import * as sdk from '@ai-sdk/provider-utils';
import { Effect, Option, Schema as EffectSchema } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import { lazyValue } from './internal/provider-model.js';
import { toSdkSchema } from './internal/schema.js';

type Native<A> = ReturnType<typeof sdk.jsonSchema<A>>;
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type Binding<A, R> = (owner: Owner<R>) => Native<A>;
type ExternalSchema<A> = Exclude<
  sdk.FlexibleSchema<A>,
  Native<A> | ReturnType<typeof sdk.lazySchema<A>>
>;

export type ValidationResult<A> = sdk.ValidationResult<A>;
export type LazySchema<A, R = never> = Effect.Effect<
  Schema<A, R>,
  AiSdkError,
  R
>;
export type FlexibleSchema<A, R = never> =
  | Schema<A, R>
  | EffectSchema.ConstraintDecoder<A, R>
  | ExternalSchema<A>
  | LazySchema<A, R>;

/** A schema whose conversion and validation run through Effect. */
export interface Schema<A, R = never> {
  readonly jsonSchema: Effect.Effect<JSONSchema7, AiSdkError, R>;
  readonly validate: (
    value: unknown,
  ) => Effect.Effect<ValidationResult<A>, AiSdkError, R>;
}

const schemaBindings = new WeakMap<object, unknown>();

function registerSchema<A, R>(binding: Binding<A, R>): Schema<A, R> {
  const schema: Schema<A, R> = {
    jsonSchema: Effect.scoped(
      Effect.gen(function* () {
        const owner = yield* openOperation<R>();
        return yield* lazyValue(
          'schema.jsonSchema',
          () => binding(owner).jsonSchema,
        );
      }),
    ),
    validate: (value) =>
      Effect.scoped(
        Effect.gen(function* () {
          const owner = yield* openOperation<R>();
          return yield* lazyValue('schema.validate', () => {
            const native = binding(owner);
            return (
              native.validate?.(value) ?? {
                success: true as const,
                value: value as A,
              }
            );
          });
        }),
      ),
  };
  schemaBindings.set(schema, binding);
  return schema;
}

/** Resolve only inside the scope of the SDK operation that uses the schema. */
export const bindSchema = <A, R>(
  input: FlexibleSchema<A, R>,
  owner: Owner<R>,
) =>
  Effect.flatMap(asSchema(input), (schema) =>
    runSync('bindSchema', () => {
      const bind = schemaBindings.get(schema) as Binding<A, R>;
      return bind(owner);
    }),
  );

export const asSchema = <A, R = never>(
  input?: FlexibleSchema<A, R>,
): LazySchema<A, R> => {
  if (Effect.isEffect(input)) return input as LazySchema<A, R>;
  if (EffectSchema.isSchema(input)) {
    return Effect.succeed(
      registerSchema<A, R>((owner) =>
        toSdkSchema(input as EffectSchema.ConstraintDecoder<A, R>, owner),
      ),
    );
  }
  if (input && schemaBindings.has(input))
    return Effect.succeed(input as Schema<A, R>);
  return Effect.succeed(
    registerSchema<A, R>(() =>
      sdk.asSchema(input as ExternalSchema<A> | undefined),
    ),
  );
};

export type ValidateFunction<A, R = never> = (
  value: unknown,
) => Effect.Effect<ValidationResult<A>, unknown, R>;
type SchemaDocument<R> =
  | JSONSchema7
  | Effect.Effect<JSONSchema7, unknown, R>
  | (() => JSONSchema7 | Effect.Effect<JSONSchema7, unknown, R>);

export const jsonSchema = <A = unknown, R = never>(
  document: SchemaDocument<R>,
  options?: { readonly validate?: ValidateFunction<A, R> },
): Effect.Effect<Schema<A, R>> =>
  Effect.sync(() =>
    registerSchema<A, R>((owner) => {
      const validate = options?.validate;
      return sdk.jsonSchema<A>(
        () =>
          owner.runCallback(
            Effect.suspend(() => {
              const value =
                typeof document === 'function' ? document() : document;
              return Effect.isEffect(value) ? value : Effect.succeed(value);
            }),
          ),
        validate
          ? {
              validate: (value) =>
                owner.runCallback(Effect.suspend(() => validate(value))),
            }
          : {},
      );
    }),
  );

export const lazySchema = <A, R>(create: () => LazySchema<A, R>) =>
  Effect.cached(Effect.suspend(create));

export const zodSchema = <A>(
  schema: Parameters<typeof sdk.zodSchema<A>>[0],
  options?: Parameters<typeof sdk.zodSchema<A>>[1],
): Effect.Effect<Schema<A>> =>
  Effect.sync(() => registerSchema(() => sdk.zodSchema(schema, options)));

type ParseOptions = { readonly text: string };
type TypedParseOptions<A, R> = ParseOptions & {
  readonly schema: FlexibleSchema<A, R>;
};

function withSchema<A, R, Out>(
  operation: string,
  schema: FlexibleSchema<A, R>,
  use: (native: Native<A>) => PromiseLike<Out>,
) {
  return Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const native = yield* bindSchema(schema, owner);
      return yield* runRequest(operation, { abortSignal: owner.signal }, () =>
        use(native),
      );
    }),
  );
}

export function parseJSON(
  options: ParseOptions,
): Effect.Effect<JSONValue, AiSdkError>;
export function parseJSON<A, R = never>(
  options: TypedParseOptions<A, R>,
): Effect.Effect<A, AiSdkError, R>;
export function parseJSON<A, R>(
  options: ParseOptions | TypedParseOptions<A, R>,
) {
  return 'schema' in options
    ? withSchema('parseJSON', options.schema, (schema) =>
        sdk.parseJSON({ ...options, schema }),
      )
    : runRequest('parseJSON', {}, () => sdk.parseJSON(options));
}

export type ParseResult<A> =
  | { readonly success: true; readonly value: A; readonly rawValue: unknown }
  | {
      readonly success: false;
      readonly error: AiSdkError;
      readonly rawValue?: unknown;
    };

const normalizeResult = <A>(
  operation: string,
  result: sdk.ParseResult<A>,
): ParseResult<A> =>
  result.success
    ? result
    : { ...result, error: sdkError(operation, result.error) };

export function safeParseJSON(
  options: ParseOptions,
): Effect.Effect<ParseResult<JSONValue>, AiSdkError>;
export function safeParseJSON<A, R = never>(
  options: TypedParseOptions<A, R>,
): Effect.Effect<ParseResult<A>, AiSdkError, R>;
export function safeParseJSON<A, R>(
  options: ParseOptions | TypedParseOptions<A, R>,
) {
  const operation = 'safeParseJSON';
  return 'schema' in options
    ? withSchema(operation, options.schema, (schema) =>
        sdk.safeParseJSON({ ...options, schema }),
      ).pipe(Effect.map((result) => normalizeResult(operation, result)))
    : runRequest(operation, {}, () => sdk.safeParseJSON(options)).pipe(
        Effect.map((result) => normalizeResult(operation, result)),
      );
}

type ValidationOptions<A, R> = {
  readonly value: unknown;
  readonly schema: FlexibleSchema<A, R>;
  readonly context?: NonNullable<
    Parameters<typeof sdk.validateTypes<A>>[0]['context']
  >;
};

export const validateTypes = <A, R = never>(options: ValidationOptions<A, R>) =>
  withSchema('validateTypes', options.schema, (schema) =>
    sdk.validateTypes({ ...options, schema }),
  );

export const safeValidateTypes = <A, R = never>(
  options: ValidationOptions<A, R>,
) =>
  withSchema('safeValidateTypes', options.schema, (schema) =>
    sdk.safeValidateTypes({ ...options, schema }),
  ).pipe(Effect.map((result) => normalizeResult('safeValidateTypes', result)));

export const secureJsonParse = (
  text: string,
): Effect.Effect<unknown, AiSdkError> =>
  runSync('secureJsonParse', () => sdk.secureJsonParse(text));

export const parseProviderOptions = <A, R = never>(
  options: Omit<Parameters<typeof sdk.parseProviderOptions<A>>[0], 'schema'> & {
    schema: FlexibleSchema<A, R>;
  },
) =>
  withSchema('parseProviderOptions', options.schema, (schema) =>
    sdk.parseProviderOptions({ ...options, schema }),
  ).pipe(Effect.map(Option.fromNullishOr));
