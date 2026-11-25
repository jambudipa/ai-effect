import * as sdk from 'ai';
import { Effect } from 'effect';
import { fromNativeSchema } from './core-schema.js';

export const assistantModelMessageSchema = fromNativeSchema(
  sdk.assistantModelMessageSchema,
);
export const modelMessageSchema = fromNativeSchema(sdk.modelMessageSchema);
export const systemModelMessageSchema = fromNativeSchema(
  sdk.systemModelMessageSchema,
);
export const toolModelMessageSchema = fromNativeSchema(
  sdk.toolModelMessageSchema,
);
export const userModelMessageSchema = fromNativeSchema(
  sdk.userModelMessageSchema,
);

export const uiMessageChunkSchema = () =>
  Effect.sync(() => fromNativeSchema(sdk.uiMessageChunkSchema));
