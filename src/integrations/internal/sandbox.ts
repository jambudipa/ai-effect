import type {
  HarnessV1NetworkSandboxSession as NativeNetworkSandbox,
  HarnessV1SandboxProvider as NativeProvider,
  HarnessV1SandboxTemplate as NativeTemplate,
} from './harness-contracts/harness.js';
import { Effect } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
} from '../../internal/operation.js';
import {
  registerSandbox,
  scopedResource,
  type SandboxSession,
  type WithAbort,
  wrapSandbox,
} from './sandbox-base.js';

export {
  invoke,
  type Process,
  type SandboxSession,
  scopedResource,
  unwrapProcess,
  unwrapSandbox,
  wrapSandbox,
} from './sandbox-base.js';

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

  registerSandbox(sandbox, native);
  return sandbox;
};

export type NetworkSandboxSession = ReturnType<typeof wrapNetworkSandbox>;

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

const providers = new WeakMap<object, NativeProvider>();

export const unwrapSandboxProvider = (provider: object) =>
  providers.get(provider);

export const wrapSandboxProvider = (native: NativeProvider) => {
  const resumeSession = native.resumeSession?.bind(native);
  const provider = {
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
  providers.set(provider, native);
  return provider;
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
