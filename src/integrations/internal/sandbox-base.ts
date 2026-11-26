import type {
  Experimental_SandboxProcess as NativeProcess,
  Experimental_SandboxSession as NativeSandbox,
  Experimental_SandboxSpawnOptions as SpawnOptions,
  Experimental_SandboxSpawnOptionsWithStdin as SpawnOptionsWithStdin,
  Experimental_SandboxSpawnOptionsWithoutStdin as SpawnOptionsWithoutStdin,
  Experimental_WritableSandboxProcess as NativeWritableProcess,
} from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import type { Scope as EffectScope } from 'effect/Scope';
import { runRequest } from '../../internal/operation.js';
import { ownStream } from './stream.js';

/** Allows caller cancellation to be combined with interruption of the Effect fiber. */
export type WithAbort = { readonly abortSignal?: AbortSignal };

/** Merge the caller's signal with fiber cancellation before invoking a native sandbox request. */
export const invoke =
  <Args extends WithAbort, A>(
    operation: string,
    native: (args: Args) => PromiseLike<A>,
  ) =>
  (args: Args) =>
    runRequest(operation, args, (abortSignal) =>
      native({ ...args, abortSignal }),
    );

/** Attach resource cleanup to the acquisition scope. Log tagged SDK failures during release. */
export const scopedResource = <A>(
  operation: string,
  options: WithAbort,
  acquire: (signal: AbortSignal) => PromiseLike<A>,
  release: (resource: A) => PromiseLike<void>,
) =>
  Effect.acquireRelease(
    runRequest(operation, options, acquire),
    (resource) =>
      runRequest(`${operation}.release`, {}, () => release(resource)).pipe(
        Effect.catchTag('AiSdkError', (error) =>
          Effect.logWarning('Sandbox resource release failed', error),
        ),
      ),
    { interruptible: true },
  );

/** Track native process identity without retaining dead wrapper instances. */
const processes = new WeakMap<object, NativeProcess>();

/** Keep both native output streams scoped and expose standard input only for writable processes. */
const wrapProcess = (native: NativeProcess | NativeWritableProcess) => {
  const process = {
    pid: native.pid,
    stdout: ownStream('SandboxProcess.stdout', native.stdout),
    stderr: ownStream('SandboxProcess.stderr', native.stderr),
    wait: runRequest('SandboxProcess.wait', {}, () => native.wait()),
    kill: runRequest('SandboxProcess.kill', {}, () => native.kill()),
    ...('stdin' in native && { stdin: native.stdin }),
  };
  processes.set(process, native);
  return process;
};

/** Scoped process operations and byte streams shared by both spawn modes. */
export type Process = ReturnType<typeof wrapProcess>;
/** Add the native input stream for callers that request a writable process. */
type WritableProcess = Process & { readonly stdin: WritableStream<Uint8Array> };

/** Look up a native process only when it originated from this adapter. */
export const unwrapProcess = (process: Process) => processes.get(process);

/** Preserve the native spawn modes while registering process termination as scope cleanup. */
const wrapSpawn = (native: NativeSandbox) => {
  function spawn(
    options: SpawnOptionsWithStdin,
  ): Effect.Effect<
    WritableProcess,
    import('../../internal/operation.js').AiSdkError,
    EffectScope
  >;
  function spawn(
    options: SpawnOptionsWithoutStdin,
  ): Effect.Effect<
    Process,
    import('../../internal/operation.js').AiSdkError,
    EffectScope
  >;
  function spawn(
    options: SpawnOptions,
  ): Effect.Effect<
    Process,
    import('../../internal/operation.js').AiSdkError,
    EffectScope
  >;
  function spawn(options: SpawnOptions) {
    return Effect.map(
      scopedResource(
        'Sandbox.spawn',
        options,
        (abortSignal) => native.spawn({ ...options, abortSignal }),
        (process) => process.kill(),
      ),
      wrapProcess,
    );
  }
  return spawn;
};

/** Resolve restricted and network session wrappers to their respective native sessions. */
const sessions = new WeakMap<SandboxSession, NativeSandbox>();
/** Register the native counterpart of an already constructed sandbox wrapper. */
export const registerSandbox = (
  sandbox: SandboxSession,
  native: NativeSandbox,
): void => {
  sessions.set(sandbox, native);
};

/** Return the native session for a registered handle. An unrelated object has no registration. */
export const unwrapSandbox = (sandbox: SandboxSession) => sessions.get(sandbox);

/** Adapt sandbox file and process operations while retaining the original scope and abort semantics. */
export const wrapSandbox = (native: NativeSandbox) => {
  const sandbox = {
    description: native.description,
    readFile: (options: Parameters<NativeSandbox['readFile']>[0]) =>
      invoke(
        'Sandbox.readFile',
        native.readFile.bind(native),
      )(options).pipe(
        Effect.flatMap((stream) =>
          stream
            ? ownStream('Sandbox.readFile', stream)
            : Effect.succeed(stream),
        ),
      ),
    readBinaryFile: invoke(
      'Sandbox.readBinaryFile',
      native.readBinaryFile.bind(native),
    ),
    readTextFile: invoke(
      'Sandbox.readTextFile',
      native.readTextFile.bind(native),
    ),
    writeFile: invoke('Sandbox.writeFile', native.writeFile.bind(native)),
    writeBinaryFile: invoke(
      'Sandbox.writeBinaryFile',
      native.writeBinaryFile.bind(native),
    ),
    writeTextFile: invoke(
      'Sandbox.writeTextFile',
      native.writeTextFile.bind(native),
    ),
    stat: invoke('Sandbox.stat', native.stat.bind(native)),
    listDirectory: invoke(
      'Sandbox.listDirectory',
      native.listDirectory.bind(native),
    ),
    deleteFile: invoke('Sandbox.deleteFile', native.deleteFile.bind(native)),
    spawn: wrapSpawn(native),
    run: invoke('Sandbox.run', native.run.bind(native)),
  };
  registerSandbox(sandbox, native);
  return sandbox;
};

/** Wrapped file and process operations available on both basic and network sandbox sessions. */
export type SandboxSession = ReturnType<typeof wrapSandbox>;
