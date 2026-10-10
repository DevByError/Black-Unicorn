import tseslint from 'typescript-eslint';
import next from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'tests/**', 'scripts/**'] },
  ...next,
  ...tseslint.configs.strict.map((c) => ({ ...c, files: ['**/*.ts', '**/*.tsx'] })),
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Client state that depends on browser-only values (storage, matchMedia, the intro mode attribute) can only be read
      // after hydration, so it is set in an effect by design. Server HTML never renders a wrong value for it.
      'react-hooks/set-state-in-effect': 'off',
      // Plain <img> is used on purpose: images are pre-optimised at build time (static export) and need fetchPriority control.
      '@next/next/no-img-element': 'off',
    },
  },
];
export default config;
