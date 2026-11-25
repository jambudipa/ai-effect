import type {
  HarnessV1NetworkSandboxSession as NativeNetworkSandbox,
  HarnessV1SandboxProvider as NativeProvider,
  HarnessV1SandboxTemplate as NativeTemplate,
} from '@ai-sdk/harness';
import type {
  Experimental_SandboxProcess as NativeProcess,
  Experimental_SandboxSession as NativeSandbox,
  Experimental_SandboxSpawnOptions as SpawnOptions,
  Experimental_SandboxSpawnOptionsWithStdin as SpawnOptionsWithStdin,
  Experimental_SandboxSpawnOptionsWithoutStdin as SpawnOptionsWithoutStdin,
  Experimental_WritableSandboxProcess as NativeWritableProcess,
} from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
} from '../../internal/operation.js';
import { ownStream } from './stream.js';

type WithAbort = { readonly abortSignal?: AbortSignal };

export const invoke =
  <Args extends WithAbort, A>(
    operation: string,
    native: (args: Args) => PromiseLike<A>,
  ) =>
  (args: Args) =>
    runRequest(operation, args, (abortSignal) =>
      native({ ...args, abortSignal }),
    );

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

const wrapProcess = (native: NativeProcess | NativeWritableProcess) => ({
  pid: native.pid,
  stdout: ownStream('SandboxProcess.stdout', native.stdout),
  stderr: ownStream('SandboxProcess.stderr', native.stderr),
  wait: runRequest('SandboxProcess.wait', {}, () => native.wait()),
  kill: runRequest('SandboxProcess.kill', {}, () => native.kill()),
  ...('stdin' in native && { stdin: native.stdin }),
});

type Process = ReturnType<typeof wrapProcess>;
type WritableProcess = Process & { readonly stdin: WritableStream<Uint8Array> };

const wrapSpawn = (native: NativeSandbox) => {
  function spawn(
    options: SpawnOptionsWithStdin,
  ): Effect.Effect<
    WritableProcess,
    import('../../internal/operation.js').AiSdkError,
    import('effect').Scope.Scope
  >;
  function spawn(
    options: SpawnOptionsWithoutStdin,
  ): Effect.Effect<
    Process,
    import('../../internal/operation.js').AiSdkError,
    import('effect').Scope.Scope
  >;
  function spawn(
    options: SpawnOptions,
  ): Effect.Effect<
    Process,
    import('../../internal/operation.js').AiSdkError,
    import('effect').Scope.Scope
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

const sessions = new WeakMap<SandboxSession, NativeSandbox>();
const networkSessions = new WeakMap<
  NetworkSandboxSession,
  NativeNetworkSandbox
>();

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
  sessions.set(sandbox, native);
  return sandbox;
};

export type SandboxSession = ReturnType<typeof wrapSandbox>;

export const wrapNetworkSandbox = (native: NativeNetworkSandbox) => {
  const getPortEndpoint = (
    options: Parameters<NativeNetworkSandbox['getPortEndpoint']>[0],
  ) =>
    runRequest('Sandbox.getPortEndpoint', {}, () =>
      native.getPortEndpoint(options),
    );

  const getPortUrl = (
    options: Parameters<NativeNetworkSandbox['getPortUrl']>[0],
  ) => runRequest('Sandbox.getPortUrl', {}, () => native.getPortUrl(options));

  const wrapOptional = <A>(
    name: string,
    method: ((input: A) => PromiseLike<void>) | undefined,
  ) =>
    method &&
    ((input: A) => runRequest(name, {}, () => method.call(native, input)));

  const setPorts = native.setPorts?.bind(native);

  const sandbox = {
    ...wrapSandbox(native),
    id: native.id,
    defaultWorkingDirectory: native.defaultWorkingDirectory,
    ports: native.ports,
    getPortEndpoint,
    getPortUrl,
    stop: runRequest('Sandbox.stop', {}, () => native.stop()),
    destroy: runRequest('Sandbox.destroy', {}, () => native.destroy()),
    setNetworkPolicy: wrapOptional(
      'Sandbox.setNetworkPolicy',
      native.setNetworkPolicy,
    ),
    setRequestTransformations: wrapOptional(
      'Sandbox.setRequestTransformations',
      native.setRequestTransformations,
    ),
    addRequestTransformations: wrapOptional(
      'Sandbox.addRequestTransformations',
      native.addRequestTransformations,
    ),
    ...(setPorts && {
      setPorts: (ports: ReadonlyArray<number>, options: WithAbort = {}) =>
        runRequest('Sandbox.setPorts', options, (abortSignal) =>
          setPorts(ports, { ...options, abortSignal }),
        ),
    }),
    restricted: runSync('Sandbox.restricted', () =>
      wrapSandbox(native.restricted()),
    ),
  };

  networkSessions.set(sandbox, native);
  return sandbox;
};

export type NetworkSandboxSession = ReturnType<typeof wrapNetworkSandbox>;

export const unwrapSandbox = (
  session: SandboxSession,
): NativeSandbox | undefined =>
  networkSessions.get(session as NetworkSandboxSession) ??
  sessions.get(session);

type NativeProviderCreateOptions = NonNullable<
  Parameters<NativeProvider['createSession']>[0]
>;
type NativeProviderResumeOptions = Parameters<
  NonNullable<NativeProvider['resumeSession']>
>[0];

export type SandboxProviderCreateOptions<R = never, E = never> = Omit<
  NativeProviderCreateOptions,
  'onFirstCreate'
> & {
  readonly onFirstCreate?: (
    session: SandboxSession,
    options: WithAbort,
  ) => Effect.Effect<void, E, R>;
};

export const wrapSandboxProvider = (native: NativeProvider) => {
  const resumeSession = native.resumeSession?.bind(native);
  return {
    specificationVersion: native.specificationVersion,
    providerId: native.providerId,
    createSession: <R = never, E = never>(
      options: SandboxProviderCreateOptions<R, E> = {},
    ) =>
      Effect.gen(function* () {
        const { onFirstCreate, ...rest } = options;
        const owner = yield* openOperation<R>(options.abortSignal);
        const session = yield* scopedResource(
          'SandboxProvider.createSession',
          { abortSignal: owner.signal },
          (abortSignal) =>
            native.createSession({
              ...rest,
              abortSignal,
              ...(onFirstCreate && {
                onFirstCreate: (session, opts) =>
                  owner.runCallback(
                    onFirstCreate(wrapSandbox(session), opts),
                    opts.abortSignal,
                  ),
              }),
            }),
          (session) => session.destroy(),
        );
        return wrapNetworkSandbox(session);
      }),
    ...(resumeSession && {
      resumeSession: (options: NativeProviderResumeOptions) =>
        Effect.map(
          scopedResource(
            'SandboxProvider.resumeSession',
            options,
            (abortSignal) => resumeSession({ ...options, abortSignal }),
            (session) => session.stop(),
          ),
          wrapNetworkSandbox,
        ),
    }),
  };
};

export type SandboxTemplate<R = never, E = never> = {
  readonly identity: string;
  readonly prepare: (
    options: WithAbort & { session: SandboxSession },
  ) => Effect.Effect<void, E, R>;
};

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

export const bindTemplate = <R, E>(
  template: SandboxTemplate<R, E>,
  owner: Owner<R>,
): NativeTemplate => ({
  identity: template.identity,
  prepare: ({ session, abortSignal }) =>
    owner.runCallback(
      template.prepare({
        session: wrapSandbox(session),
        ...(abortSignal && { abortSignal }),
      }),
      abortSignal,
    ),
});
