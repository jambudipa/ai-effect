import {
  convertToModelMessages as nativeConvertToModelMessages,
  safeValidateUIMessages as nativeSafeValidateUIMessages,
  type DataUIPart,
  type FilePart,
  type TextPart,
  type UIDataTypes,
  type UIMessage,
  type UITools,
} from 'ai';
import { Effect } from 'effect';
import { bindSchema, type FlexibleSchema } from '../core-schema.js';
import { invoke, type CallbackResult } from './chat-boundary.js';
import {
  openOperation,
  runRequest,
  sdkError,
  type AiSdkError,
} from './operation.js';
import { bindTools, type EffectTools, type ToolServices } from './tool.js';

export type MessageData<Message extends UIMessage> =
  Message extends UIMessage<unknown, infer Data> ? Data : UIDataTypes;
type MessageTools<Message extends UIMessage> =
  Message extends UIMessage<unknown, UIDataTypes, infer Tools>
    ? Tools
    : UITools;

export type UIDataPartSchemas<
  Data extends UIDataTypes = UIDataTypes,
  R = never,
> = { readonly [Name in keyof Data & string]?: FlexibleSchema<Data[Name], R> };

export type ValidateUIMessagesOptions<
  Message extends UIMessage = UIMessage,
  R = never,
> = {
  readonly messages: unknown;
  readonly metadataSchema?: FlexibleSchema<Message['metadata'], R>;
  readonly dataSchemas?: UIDataPartSchemas<MessageData<Message>, R>;
  readonly tools?: {
    readonly [Name in keyof MessageTools<Message> & string]?: {
      readonly inputSchema: FlexibleSchema<
        MessageTools<Message>[Name]['input'],
        R
      >;
      readonly outputSchema?: FlexibleSchema<
        MessageTools<Message>[Name]['output'],
        R
      >;
    };
  };
  readonly experimental_refineToolInput?: {
    readonly [Name in keyof MessageTools<Message> & string]?: (
      input: MessageTools<Message>[Name]['input'],
    ) => CallbackResult<MessageTools<Message>[Name]['input'], R>;
  };
};

export type SafeValidateUIMessagesResult<
  Message extends UIMessage = UIMessage,
> =
  | { readonly success: true; readonly data: Message[] }
  | { readonly success: false; readonly error: AiSdkError };

const fields = <Input, Output, E, R>(
  values: Readonly<Record<string, Input | undefined>>,
  bind: (value: Input) => Effect.Effect<Output, E, R>,
) =>
  Effect.forEach(
    Object.entries(values).filter(
      (entry): entry is [string, Input] => entry[1] !== undefined,
    ),
    ([key, value]) =>
      bind(value).pipe(Effect.map((native) => [key, native] as const)),
  ).pipe(Effect.map(Object.fromEntries));

/** Validate saved or submitted UI messages using the active Effect services. */
export const safeValidateUIMessages = <
  Message extends UIMessage = UIMessage,
  R = never,
>({
  messages,
  metadataSchema,
  dataSchemas,
  tools,
  experimental_refineToolInput,
}: ValidateUIMessagesOptions<Message, R>) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'safeValidateUIMessages';
      const owner = yield* openOperation<R>();
      const nativeMetadata = metadataSchema
        ? { metadataSchema: yield* bindSchema(metadataSchema, owner) }
        : {};
      const nativeData = dataSchemas
        ? {
            dataSchemas: yield* fields(dataSchemas, (schema) =>
              bindSchema(schema, owner),
            ),
          }
        : {};
      const nativeTools = tools
        ? {
            tools: yield* fields(tools, ({ inputSchema, outputSchema }) =>
              Effect.gen(function* () {
                const input = yield* bindSchema(inputSchema, owner);
                return outputSchema
                  ? {
                      inputSchema: input,
                      outputSchema: yield* bindSchema(outputSchema, owner),
                    }
                  : { inputSchema: input };
              }),
            ),
          }
        : {};
      const nativeRefinements = experimental_refineToolInput
        ? {
            experimental_refineToolInput: Object.fromEntries(
              Object.entries(experimental_refineToolInput).map(
                ([name, refine]) => [
                  name,
                  (input: never) =>
                    owner.runCallback(
                      invoke(`${operation}.refineToolInput`, () =>
                        refine(input),
                      ),
                    ),
                ],
              ),
            ),
          }
        : {};
      const options = {
        messages,
        ...nativeMetadata,
        ...nativeData,
        ...nativeTools,
        ...nativeRefinements,
      } as Parameters<typeof nativeSafeValidateUIMessages<Message>>[0];
      return yield* runRequest(operation, { abortSignal: owner.signal }, () =>
        nativeSafeValidateUIMessages<Message>(options),
      ).pipe(
        Effect.map((result): SafeValidateUIMessagesResult<Message> =>
          result.success
            ? result
            : { success: false, error: sdkError(operation, result.error) },
        ),
      );
    }),
  );

export const validateUIMessages = <
  Message extends UIMessage = UIMessage,
  R = never,
>(
  options: ValidateUIMessagesOptions<Message, R>,
) =>
  Effect.flatMap(safeValidateUIMessages(options), (result) =>
    result.success ? Effect.succeed(result.data) : Effect.fail(result.error),
  );

export const convertToModelMessages = <
  Message extends UIMessage = UIMessage,
  Tools extends EffectTools = {},
>(
  messages: Array<Omit<Message, 'id'>>,
  {
    tools,
    ...options
  }: {
    readonly tools?: Tools;
    readonly ignoreIncompleteToolCalls?: boolean;
    readonly convertDataPart?: (
      part: DataUIPart<MessageData<Message>>,
    ) => TextPart | FilePart | undefined;
  } = {},
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'convertToModelMessages';
      const owner = yield* openOperation<ToolServices<Tools>>();
      return yield* runRequest(operation, { abortSignal: owner.signal }, () =>
        nativeConvertToModelMessages<Message>(messages, {
          ...options,
          ...(tools ? { tools: bindTools(tools, owner) } : {}),
        }),
      );
    }),
  );
