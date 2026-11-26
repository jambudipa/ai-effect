import { jsonSchema, type JSONSchema7 } from 'ai';
import { Effect, JsonSchema, Result, Schema } from 'effect';
import type { openOperation } from './operation.js';

/** Keep the decoder's Effect requirements available when native validation invokes it. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Convert an Effect schema to the native SDK format and bind validation to the optional operation owner. */
export const toSdkSchema = <A, R>(
  schema: Schema.ConstraintDecoder<A, R>,
  owner?: Owner<R>,
) =>
  jsonSchema<A>(
    () => {
      const { schema: root, definitions } = JsonSchema.toDocumentDraft07(
        Schema.toJsonSchemaDocument(schema),
      );
      return { ...root, definitions } as JSONSchema7;
    },
    {
      validate: (input) => {
        const decode = Effect.result(
          Schema.decodeUnknownEffect(schema)(input),
        ).pipe(
          Effect.map(
            Result.match({
              onSuccess: (value) => ({ success: true as const, value }),
              onFailure: (error) => ({ success: false as const, error }),
            }),
          ),
        );
        if (owner) return owner.runCallback(decode);
        // This branch is used by the output factories, which accept schemas
        // with no decoding services.
        return Effect.runPromise(
          decode as Effect.Effect<Effect.Success<typeof decode>>,
        );
      },
    },
  );
