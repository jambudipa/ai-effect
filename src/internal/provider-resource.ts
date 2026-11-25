import type {
  Experimental_BatchV4,
  Experimental_BatchV4ModelIds,
  FilesV4,
  SkillsV4,
} from '@ai-sdk/provider';
import { Effect } from 'effect';
import { runRequest } from './operation.js';
import { readMethod, requestMethod } from './provider-model.js';

export const wrapFiles = (files: FilesV4) => {
  const getFileMetadata = files.getFileMetadata?.bind(files);
  const downloadFile = files.downloadFile?.bind(files);
  const deleteFile = files.deleteFile?.bind(files);
  return {
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
};

export const wrapSkills = (skills: SkillsV4) => ({
  specificationVersion: skills.specificationVersion,
  provider: skills.provider,
  uploadSkill: (options: Parameters<typeof skills.uploadSkill>[0]) =>
    runRequest('SkillsV4.uploadSkill', {}, () => skills.uploadSkill(options)),
});

export const wrapBatch = <ModelIds extends Experimental_BatchV4ModelIds>(
  batch: Experimental_BatchV4<ModelIds>,
) => {
  const cancel = batch.doCancelBatch?.bind(batch);
  const list = batch.doListBatches?.bind(batch);
  return {
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
};
