import type {
  Experimental_BatchV4,
  Experimental_BatchV4ModelIds,
  FilesV4,
  SkillsV4,
} from '@ai-sdk/provider';
import { Effect } from 'effect';
import { runRequest } from './operation.js';
import { readMethod, requestMethod } from './provider-model.js';

/** Keep native file APIs private while their public handles remain in use. */
const nativeFiles = new WeakMap<object, FilesV4>();
/** Keep native skill APIs private while their public handles remain in use. */
const nativeSkills = new WeakMap<object, SkillsV4>();
/** Expose file operations and keep optional methods absent when the provider lacks them. */
export const wrapFiles = (files: FilesV4) => {
  const getFileMetadata = files.getFileMetadata?.bind(files);
  const downloadFile = files.downloadFile?.bind(files);
  const deleteFile = files.deleteFile?.bind(files);
  const wrapped = {
    specificationVersion: files.specificationVersion,
    provider: files.provider,
    uploadFile: requestMethod(
      'FilesV4.uploadFile',
      files.uploadFile.bind(files),
    ),
    getFileMetadata: !getFileMetadata
      ? getFileMetadata
      : requestMethod('FilesV4.getFileMetadata', getFileMetadata),
    downloadFile: !downloadFile
      ? downloadFile
      : (options: Parameters<typeof downloadFile>[0]) =>
          readMethod(
            'FilesV4.downloadFile',
            downloadFile,
            ({ content, ...metadata }) => [content, metadata],
          )(options).pipe(
            Effect.map(({ metadata, stream }) => ({
              ...metadata,
              content: stream,
            })),
          ),
    deleteFile: !deleteFile
      ? deleteFile
      : requestMethod('FilesV4.deleteFile', deleteFile),
  };
  nativeFiles.set(wrapped, files);
  return wrapped;
};

/** Expose skill upload through Effect and register the corresponding native API. */
export const wrapSkills = (skills: SkillsV4) => {
  const wrapped = {
    specificationVersion: skills.specificationVersion,
    provider: skills.provider,
    uploadSkill: (options: Parameters<typeof skills.uploadSkill>[0]) =>
      runRequest('SkillsV4.uploadSkill', {}, () => skills.uploadSkill(options)),
  };
  nativeSkills.set(wrapped, skills);
  return wrapped;
};

/** Use a registered file API for direct provider file operations and SDK adapters. */
export type FilesV4Handle = ReturnType<typeof wrapFiles>;
/** Use a registered skill API for SDK skill uploads. */
export type SkillsV4Handle = ReturnType<typeof wrapSkills>;

/** Recover a previously registered native provider file API. */
export const unwrapFiles = (files: FilesV4Handle) => nativeFiles.get(files);
/** Recover a previously registered native provider skill API. */
export const unwrapSkills = (skills: SkillsV4Handle) =>
  nativeSkills.get(skills);

/** Track the native batch APIs used by registered public handles. */
const nativeBatches = new WeakMap<object, Experimental_BatchV4>();
/** Adapt provider batch operations and preserve capability-specific model IDs. */
export const wrapBatch = <ModelIds extends Experimental_BatchV4ModelIds>(
  batch: Experimental_BatchV4<ModelIds>,
) => {
  const cancel = batch.doCancelBatch?.bind(batch);
  const list = batch.doListBatches?.bind(batch);
  const wrapped = {
    specificationVersion: batch.specificationVersion,
    provider: batch.provider,
    supportedUrls: runRequest('BatchV4.supportedUrls', {}, () =>
      Promise.resolve(batch.supportedUrls),
    ),
    doStartBatch: requestMethod(
      'BatchV4.doStartBatch',
      batch.doStartBatch.bind(batch),
    ),
    doGetBatchStatus: requestMethod(
      'BatchV4.doGetBatchStatus',
      batch.doGetBatchStatus.bind(batch),
    ),
    doGetBatchResults: (
      options: Parameters<typeof batch.doGetBatchResults>[0],
    ) =>
      readMethod(
        'BatchV4.doGetBatchResults',
        batch.doGetBatchResults.bind(batch),
        (stream) => [stream, {}],
      )(options).pipe(Effect.map(({ stream }) => stream)),
    doCancelBatch: !cancel
      ? cancel
      : requestMethod('BatchV4.doCancelBatch', cancel),
    doListBatches: !list ? list : requestMethod('BatchV4.doListBatches', list),
  };
  nativeBatches.set(wrapped, batch);
  return wrapped;
};

/** Use a registered batch API while retaining its provider-specific model IDs. */
export type BatchV4<
  ModelIds extends Experimental_BatchV4ModelIds = Experimental_BatchV4ModelIds,
> = ReturnType<typeof wrapBatch<ModelIds>>;

/** Recover the native batch API for a previously registered handle. */
export const unwrapBatch = <ModelIds extends Experimental_BatchV4ModelIds>(
  batch: object,
): Experimental_BatchV4<ModelIds> | undefined =>
  nativeBatches.get(batch) as Experimental_BatchV4<ModelIds> | undefined;
