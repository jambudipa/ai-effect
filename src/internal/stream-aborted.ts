import { Schema } from 'effect';

/** The SDK reported an abort event on a text stream. */
export class AiSdkStreamAborted extends Schema.TaggedError<AiSdkStreamAborted>()(
  'AiSdkStreamAborted',
  { reason: Schema.optionalKey(Schema.String) },
) {}
