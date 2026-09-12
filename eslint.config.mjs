import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// Full rule set without the legacy eslint-config-next wrapper:
// - @next/eslint-plugin-next core-web-vitals (was already here)
// - react-hooks flat recommended (exhaustive-deps, rules-of-hooks)
// - typescript-eslint recommended (non-type-checked; no project service needed)
//
// NOT restored yet: eslint-plugin-react / jsx-a11y / import from
// eslint-config-next. Those only ship legacy configs (no flat entry point,
// no @eslint/eslintrc installed) and their peers cap at ESLint 9, while the
// repo runs ESLint 10. Revisit when upstream eslint-config-next ships a flat
// config with ESLint 10 support — then this file collapses back to a compat
// import and the two direct deps below can be dropped.
export default [
  {
    ignores: ['node_modules/**', '.next/**'],
  },
  nextPlugin.configs['core-web-vitals'],
  reactHooks.configs.flat.recommended,
  ...tseslint.configs.recommended,
];
