import parser from '@typescript-eslint/parser';
import { effectLintConfig } from './eslint/effect-eslint-config.mjs';

const files = ['src/**/*.ts', 'test/**/*.ts'];

export default [
  { files, languageOptions: { parser } },
  effectLintConfig(files),
  {
    files: ['test/AiSdk.test.ts'],
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
];
