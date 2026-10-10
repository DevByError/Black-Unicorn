import tseslint from 'typescript-eslint';
import next from 'eslint-config-next';

export default [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'tests/**'] },
  ...next,
  ...tseslint.configs.strict.map((c) => ({ ...c, files: ['**/*.ts', '**/*.tsx'] })),
  { rules: { 'no-console': ['error', { allow: ['warn', 'error'] }] } },
];
