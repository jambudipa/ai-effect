/**
 * Canonical Effect ESLint configuration for the TypeScript guidance bundle.
 *
 * Import `effectLintConfig` into a project's flat ESLint config. It enables the
 * exact canonical Effect rule implementation in `effect-rules.mjs` for the passed
 * runtime TypeScript globs.
 */
import { effectRulesPlugin } from './effect-rules.mjs';

/**
 * Enables every locally supplied Effect rule. Consumers get one canonical
 * error policy instead of maintaining a partial rule list.
 */
export const enableAllEffectRules = () =>
  Object.fromEntries(
    Object.keys(effectRulesPlugin.rules).map((name) => [`effect/${name}`, 'error'])
  );

/**
 * Builds the flat-config entry for Effect TypeScript sources. Callers can
 * narrow `files`, but the plugin and full rule set must remain paired.
 */
export const effectLintConfig = (files = ['src/**/*.ts']) => ({
  files,
  plugins: { effect: effectRulesPlugin },
  rules: enableAllEffectRules(),
});
