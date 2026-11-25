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

type Options<Native, Api> = {
  [K in keyof Native]: K extends 'api' ? Api : Native[K];
};

type FilesProvider = {
  readonly files?: (() => Effect.Effect<FilesV4Handle, AiSdkError>) | undefined;
};
type SkillsProvider = {
  readonly skills?:
    (() => Effect.Effect<SkillsV4Handle, AiSdkError>) | undefined;
};

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

type NativeDownload = ReturnType<typeof sdk.createDownload>;
type DownloadRequests = Parameters<NativeDownload>[0];
type DownloadResults = Awaited<ReturnType<NativeDownload>>;
type DownloadRequest = {
  readonly url: URL;
  readonly abortSignal?: AbortSignal;
};
type DownloadResult = NonNullable<DownloadResults[number]>;

interface Download {
  (request: DownloadRequest): Effect.Effect<DownloadResult, AiSdkError>;
  (requests: DownloadRequests): Effect.Effect<DownloadResults, AiSdkError>;
}

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

export const createDownload = (options?: {
  readonly maxBytes?: number;
  readonly fetch?: typeof globalThis.fetch;
}) =>
  runSync('createDownload', () => wrapDownload(sdk.createDownload(options)));
