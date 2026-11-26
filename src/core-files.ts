import * as sdk from 'ai';
import { Effect } from 'effect';
import {
  combineSignals,
  runRequest,
  runSync,
  sdkError,
} from './internal/operation.js';
import type { AiSdkError } from './internal/operation.js';
import { unwrapFiles, unwrapSkills } from './internal/provider-resource.js';
import type {
  FilesV4Handle,
  SkillsV4Handle,
} from './internal/provider-resource.js';

/** Substitute the Effect resource handle for the SDK API field and preserve all upload options. */
type Options<Native, Api> = {
  [K in keyof Native]: K extends 'api' ? Api : Native[K];
};

/** Allow a provider to resolve its registered file handle at call time. */
type FilesProvider = {
  readonly files?: (() => Effect.Effect<FilesV4Handle, AiSdkError>) | undefined;
};
/** Allow a provider to resolve its registered skill handle at call time. */
type SkillsProvider = {
  readonly skills?:
    (() => Effect.Effect<SkillsV4Handle, AiSdkError>) | undefined;
};

/** Resolve a registered file API and propagate interruption to the native upload request. */
export const uploadFile = (
  options: Options<
    Parameters<typeof sdk.uploadFile>[0],
    FilesV4Handle | FilesProvider
  >,
) =>
  Effect.gen(function* () {
    let handle: FilesV4Handle | undefined;
    if ('uploadFile' in options.api) handle = options.api;
    else if (options.api.files) handle = yield* options.api.files();
    const api = handle && unwrapFiles(handle);
    if (!api)
      return yield* Effect.fail(
        sdkError('uploadFile', 'The provider has no registered file API.'),
      );

    return yield* runRequest('uploadFile', options, (abortSignal) =>
      sdk.uploadFile({ ...options, api, abortSignal }),
    );
  });

/** Resolve the provider skill API and fail with `AiSdkError` when it is unavailable. */
export const uploadSkill = (
  options: Options<
    Parameters<typeof sdk.uploadSkill>[0],
    SkillsV4Handle | SkillsProvider
  >,
) =>
  Effect.gen(function* () {
    let handle: SkillsV4Handle | undefined;
    if ('uploadSkill' in options.api) handle = options.api;
    else if (options.api.skills) handle = yield* options.api.skills();
    const api = handle && unwrapSkills(handle);
    if (!api)
      return yield* Effect.fail(
        sdkError('uploadSkill', 'The provider has no registered skill API.'),
      );

    return yield* runRequest('uploadSkill', {}, () =>
      sdk.uploadSkill({ ...options, api }),
    );
  });

/** Track the installed SDK download callable, including its overloads. */
type NativeDownload = ReturnType<typeof sdk.createDownload>;
/** Retain the native request array and per-request abort signals. */
type DownloadRequests = Parameters<NativeDownload>[0];
/** Retain positional results, including SDK entries without a downloaded file. */
type DownloadResults = Awaited<ReturnType<NativeDownload>>;
/** Carry a parsed URL and a caller signal for a single download. */
type DownloadRequest = {
  readonly url: URL;
  readonly abortSignal?: AbortSignal;
};
/** Use the SDK's non-null result for the single-request overload. */
type DownloadResult = NonNullable<DownloadResults[number]>;

/** Offer lazy single and batch downloads without exposing native promises. */
interface Download {
  (request: DownloadRequest): Effect.Effect<DownloadResult, AiSdkError>;
  (requests: DownloadRequests): Effect.Effect<DownloadResults, AiSdkError>;
}

/** Combine interruption with the caller signals and preserve the native overload behavior. */
const wrapDownload = (native: NativeDownload): Download => {
  function request(
    item: DownloadRequest,
  ): Effect.Effect<DownloadResult, AiSdkError>;
  function request(
    item: DownloadRequests,
  ): Effect.Effect<DownloadResults, AiSdkError>;
  function request(item: DownloadRequest | DownloadRequests) {
    if (!Array.isArray(item))
      return runRequest('download', item, (abortSignal) =>
        native({ ...item, abortSignal }),
      );

    return runRequest('download', {}, (signal) =>
      native(
        item.map((request) => ({
          ...request,
          abortSignal: combineSignals(signal, request.abortSignal),
        })),
      ),
    );
  }
  return request;
};

/** Create a reusable downloader with an optional byte limit and custom fetch implementation. */
export const createDownload = (options?: {
  readonly maxBytes?: number;
  readonly fetch?: typeof globalThis.fetch;
}) =>
  runSync('createDownload', () => wrapDownload(sdk.createDownload(options)));
