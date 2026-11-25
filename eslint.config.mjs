import parser from '@typescript-eslint/parser';
import { effectLintConfig } from './eslint/effect-eslint-config.mjs';

const files = ['src/**/*.ts', 'test/**/*.ts'];

export default [
  { files, languageOptions: { parser } },
  effectLintConfig(files),
  {
    files: ['src/integrations/internal/harness-contracts/**/*.d.ts'],
    rules: {
      // These declarations mirror the pinned SDK signatures at the compatibility boundary.
      'effect/no-zod-use-schema': 'off',
      'effect/no-class-extends-error': 'off',
    },
  },
  {
    files: ['src/integrations/internal/{code-mode,mcp}-contract.ts'],
    rules: {
      // The archive generator copies the native declaration contract only.
      'effect/no-zod-use-schema': 'off',
      'effect/no-class-extends-error': 'off',
    },
  },
  {
    files: ['src/core.ts'],
    rules: {
      // The private SDK conversion runs inside Effect.try or Effect.tryPromise.
      'effect/no-throw-use-effect': 'off',
    },
  },
  {
    files: [
      'src/frameworks/lifetime.ts',
      'src/frameworks/react.ts',
      'src/internal/language-model.ts',
      'src/internal/provider-realtime.ts',
      'src/internal/text-stream.ts',
      'src/providers/cerebras.ts',
    ],
    rules: {
      // Normalize native sync-or-promise SDK callbacks inside the Effect bridge.
      'effect/no-promise-resolve-reject': 'off',
    },
  },
  {
    files: ['src/internal/language-model.ts'],
    rules: {
      // Dispose a stream that resolves after its interrupted promise waiter.
      'effect/no-promise-then-catch': 'off',
    },
  },
  {
    files: [
      'src/internal/provider-model.ts',
      'src/internal/provider-resource.ts',
    ],
    rules: {
      // Native callbacks normalize PromiseLike values and own late stream results.
      'effect/no-promise-then-catch': 'off',
      'effect/no-promise-resolve-reject': 'off',
      // SDK model interfaces use undefined to represent optional methods.
      'effect/no-undefined-use-option': 'off',
    },
  },
  {
    files: [
      'src/frameworks/chat.ts',
      'src/frameworks/lifetime.ts',
      'src/frameworks/react.ts',
      'src/frameworks/rsc-client.ts',
      'src/frameworks/svelte.ts',
      'src/internal/fetch.ts',
    ],
    rules: {
      // Host bindings and SDK callbacks use undefined to represent absence.
      'effect/no-undefined-use-option': 'off',
    },
  },
  {
    files: ['src/frameworks/angular.ts'],
    rules: {
      // Angular throws from inject when the caller creates a standalone signal.
      'effect/no-try-catch-use-effect': 'off',
    },
  },
  {
    files: ['src/frameworks/chat.ts', 'src/frameworks/react.ts'],
    rules: {
      // Host constructors and hooks run synchronously and reject invalid handles.
      'effect/no-throw-use-effect': 'off',
    },
  },
  {
    files: ['src/internal/provider-tool.ts'],
    rules: {
      // The synchronous native SDK bridge returns the failure to its Effect caller.
      'effect/no-throw-use-effect': 'off',
    },
  },
  {
    files: ['src/frameworks/react.ts'],
    rules: {
      // React cleanup uses a synchronous callback to stop native commands.
      'effect/no-promise-then-catch': 'off',
    },
  },
  {
    files: ['test/AiSdk.test.ts', 'test/Surface.test.ts'],
    rules: {
      // SDK provider mocks use native Promise callbacks, Error causes, and
      // undefined usage fields. Their callbacks signal readiness to the test.
      'effect/no-promise-constructor': 'off',
      'effect/no-promise-resolve-reject': 'off',
      'effect/no-error-constructor': 'off',
      'effect/no-undefined-use-option': 'off',
      'effect/no-effect-runsync-unguarded': 'off',
    },
  },
  {
    files: ['test/Surface.test.ts'],
    rules: {
      // The local HTTP server uses the provider wire format and records ordered events.
      'effect/no-json-stringify-use-schema': 'off',
      'effect/no-array-mutation-use-chunk': 'off',
    },
  },
  {
    files: ['test/CoreOutput.test.ts'],
    rules: {
      // These cases verify the public input contract for external Zod schemas.
      'effect/no-zod-use-schema': 'off',
    },
  },
];
