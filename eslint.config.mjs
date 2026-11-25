import parser from '@typescript-eslint/parser';
import { effectLintConfig } from './eslint/effect-eslint-config.mjs';

const files = ['src/**/*.ts', 'test/**/*.ts'];

export default [
  { files, languageOptions: { parser } },
  effectLintConfig(files),
  {
    files: ['src/core.ts'],
    rules: {
      // The private SDK conversion runs inside Effect.try or Effect.tryPromise.
      'effect/no-throw-use-effect': 'off',
    },
  },
  {
    files: [
      'src/frameworks/svelte.ts',
      'src/internal/language-model.ts',
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
    files: ['src/frameworks/svelte.ts'],
    rules: {
      // Svelte bindings and SDK callbacks use undefined to represent absence.
      'effect/no-undefined-use-option': 'off',
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
];
