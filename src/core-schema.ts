import type { JSONSchema7, JSONValue } from '@ai-sdk/provider';
import * as sdk from '@ai-sdk/provider-utils';
import { Effect, Option, Schema as EffectSchema } from 'effect';
import type { Scope } from 'effect/Scope';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import { lazyValue } from './internal/provider-model.js';
import { toSdkSchema } from './internal/schema.js';

/** Represent the native SDK schema after the Effect adapter binds it. */
type Native<A> = ReturnType<typeof sdk.jsonSchema<A>>;
/** Own the lifetime and Effect dependencies of schema callbacks. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Resolve a native schema using an operation owner's callback runtime. */
type Binding<A, R> = (owner: Owner<R>) => Native<A>;
/** Accept externally constructed SDK-compatible schemas. */
type ExternalSchema<A> = Exclude<
  sdk.FlexibleSchema<A>,
  Native<A> | ReturnType<typeof sdk.lazySchema<A>>
>;

/** Preserve the SDK distinction between successful validation and a validation rejection. */
export type ValidationResult<A> = sdk.ValidationResult<A>;
/** Resolve a schema lazily with access to its required Effect services. */
export type LazySchema<A, R = never> = Effect.Effect<
  Schema<A, R>,
  AiSdkError,
  R
>;
/** Accept native, Effect, Standard Schema, and effectful schema inputs at one boundary. */
export type FlexibleSchema<A, R = never> =
  | Schema<A, R>
  | EffectSchema.ConstraintDecoder<A, R>
  | ExternalSchema<A>
  | LazySchema<A, R>;

/** A schema whose conversion and validation run through Effect. */
export interface Schema<A, R = never> {
  /** Render the provider-facing JSON Schema document under an owned operation scope. */
  readonly jsonSchema: Effect.Effect<JSONSchema7, AiSdkError, R>;
  /** Validate an unknown input and carry the SDK's validation result separately from runtime failures. */
  readonly validate: (
    value: unknown,
  ) => Effect.Effect<ValidationResult<A>, AiSdkError, R>;
}

/** Associate public schema handles with native factories without exposing the SDK binding. */
const schemaBindings = new WeakMap<object, unknown>();

/** Create public validation operations and store the factory used by SDK calls. */
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

/** Adapt an SDK-compatible schema without evaluating it during registration. */
export const fromNativeSchema = <A>(value: sdk.FlexibleSchema<A>): Schema<A> =>
  registerSchema(() => sdk.asSchema(value));

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

/** Normalize supported input forms to a lazily resolved public schema. */
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

/** Validate unknown input in the same Effect context as JSON Schema generation. */
export type ValidateFunction<A, R = never> = (
  value: unknown,
) => Effect.Effect<ValidationResult<A>, unknown, R>;
/** Accept a JSON Schema document or a computation resolved only when the SDK requests it. */
type SchemaDocument<R> =
  | JSONSchema7
  | Effect.Effect<JSONSchema7, unknown, R>
  | (() => JSONSchema7 | Effect.Effect<JSONSchema7, unknown, R>);

/** Register a lazy JSON Schema document and an optional Effect validation callback. */
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

/** Create a reusable cached schema resolution effect without running its constructor immediately. */
export const lazySchema = <A, R>(create: () => LazySchema<A, R>) =>
  Effect.cached(Effect.suspend(create));

/** Wrap a Zod definition with its native conversion options and defer the SDK callback. */
export const zodSchema = <A>(
  schema: Parameters<typeof sdk.zodSchema<A>>[0],
  options?: Parameters<typeof sdk.zodSchema<A>>[1],
): Effect.Effect<Schema<A>> =>
  Effect.sync(() => registerSchema(() => sdk.zodSchema(schema, options)));

/** Carry raw JSON text for the overload without schema validation. */
type ParseOptions = { readonly text: string };
/** Carry both source text and the schema that validates or transforms the parsed value. */
type TypedParseOptions<A, R> = ParseOptions & {
  readonly schema: FlexibleSchema<A, R>;
};

/** Bind the schema to an operation scope and map native rejection to `AiSdkError`. */
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

/** Parse JSON text and fail the effect if the SDK rejects it. */
export function parseJSON(
  options: ParseOptions,
): Effect.Effect<JSONValue, AiSdkError>;
/** Parse JSON text and validate or transform it with the supplied schema. */
export function parseJSON<A, R = never>(
  options: TypedParseOptions<A, R>,
): Effect.Effect<A, AiSdkError, Exclude<R, Scope>>;
export function parseJSON<A, R>(
  options: ParseOptions | TypedParseOptions<A, R>,
): Effect.Effect<A | JSONValue, AiSdkError, Exclude<R, Scope>> {
  // The diagnostic compares the overload's R with the implementation's R.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return 'schema' in options
    ? withSchema('parseJSON', options.schema, (schema) =>
        sdk.parseJSON({ ...options, schema }),
      )
    : runRequest('parseJSON', {}, () => sdk.parseJSON(options));
}

/** Preserve raw input when available and expose the final value or redacted parse failure. */
export type ParseResult<A> =
  | { readonly success: true; readonly value: A; readonly rawValue: unknown }
  | {
      readonly success: false;
      readonly error: AiSdkError;
      readonly rawValue?: unknown;
    };

/** Replace native details on failure with `AiSdkError` while keeping the result discriminator. */
const normalizeResult = <A>(
  operation: string,
  result: sdk.ParseResult<A>,
): ParseResult<A> =>
  result.success
    ? result
    : { ...result, error: sdkError(operation, result.error) };

/** Parse JSON text and report parse rejection in the result value. */
export function safeParseJSON(
  options: ParseOptions,
): Effect.Effect<ParseResult<JSONValue>, AiSdkError>;
/** Parse and validate JSON while keeping parse or validation rejection in the result value. */
export function safeParseJSON<A, R = never>(
  options: TypedParseOptions<A, R>,
): Effect.Effect<ParseResult<A>, AiSdkError, Exclude<R, Scope>>;
export function safeParseJSON<A, R>(
  options: ParseOptions | TypedParseOptions<A, R>,
): Effect.Effect<ParseResult<A | JSONValue>, AiSdkError, Exclude<R, Scope>> {
  const operation = 'safeParseJSON';
  // The diagnostic compares the overload's R with the implementation's R.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return 'schema' in options
    ? withSchema(operation, options.schema, (schema) =>
        sdk.safeParseJSON({ ...options, schema }),
      ).pipe(Effect.map((result) => normalizeResult(operation, result)))
    : runRequest(operation, {}, () => sdk.safeParseJSON(options)).pipe(
        Effect.map((result) => normalizeResult(operation, result)),
      );
}

/** Carry the input, schema, and optional path context for SDK validation. */
type ValidationOptions<A, R> = {
  readonly value: unknown;
  readonly schema: FlexibleSchema<A, R>;
  readonly context?: NonNullable<
    Parameters<typeof sdk.validateTypes<A>>[0]['context']
  >;
};

/** Validate unknown data and fail the effect when the SDK rejects it. */
export const validateTypes = <A, R = never>(options: ValidationOptions<A, R>) =>
  withSchema('validateTypes', options.schema, (schema) =>
    sdk.validateTypes({ ...options, schema }),
  );

/** Validate unknown data and represent schema rejection as a result value. */
export const safeValidateTypes = <A, R = never>(
  options: ValidationOptions<A, R>,
) =>
  withSchema('safeValidateTypes', options.schema, (schema) =>
    sdk.safeValidateTypes({ ...options, schema }),
  ).pipe(Effect.map((result) => normalizeResult('safeValidateTypes', result)));

/** Run the SDK's protected JSON parser and map parser errors to `AiSdkError`. */
export const secureJsonParse = (
  text: string,
): Effect.Effect<unknown, AiSdkError> =>
  runSync('secureJsonParse', () => sdk.secureJsonParse(text));

/** Validate one provider's named option set and represent a missing entry as `None`. */
export const parseProviderOptions = <A, R = never>(
  options: Omit<Parameters<typeof sdk.parseProviderOptions<A>>[0], 'schema'> & {
    schema: FlexibleSchema<A, R>;
  },
) =>
  withSchema('parseProviderOptions', options.schema, (schema) =>
    sdk.parseProviderOptions({ ...options, schema }),
  ).pipe(Effect.map(Option.fromNullishOr));
