import * as sdk from 'ai';
import { Effect } from 'effect';
import { fromNativeSchema } from './core-schema.js';

/** Decode assistant history entries with the native message schema and Effect error handling. */
export const assistantModelMessageSchema = fromNativeSchema(
  sdk.assistantModelMessageSchema,
);
/** Validate the role-discriminated message union before sending history to a model. */
export const modelMessageSchema = fromNativeSchema(sdk.modelMessageSchema);
/** Validate instructions carried in the model protocol's `system` role. */
export const systemModelMessageSchema = fromNativeSchema(
  sdk.systemModelMessageSchema,
);
/** Validate tool results and correlate them with calls through their identifiers. */
export const toolModelMessageSchema = fromNativeSchema(
  sdk.toolModelMessageSchema,
);
/** Validate user prompts and their supported content parts for model input. */
export const userModelMessageSchema = fromNativeSchema(
  sdk.userModelMessageSchema,
);

/** Resolve the native UI chunk schema only when the caller runs this effect. */
export const uiMessageChunkSchema = () =>
  Effect.sync(() => fromNativeSchema(sdk.uiMessageChunkSchema));
