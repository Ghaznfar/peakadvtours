import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Flat ESLint config. eslint-config-next (v16+) exports ready-made flat config
 * arrays, so we spread them directly.
 */
const eslintConfig = [
  // Build output only. `.open-next` (the Cloudflare Worker bundle) and
  // `.netlify`/`dist` (the previous host's output, kept for rollback) are
  // generated, and linting them buried real findings under ~29k reports.
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.netlify/**',
      'dist/**',
      'node_modules/**',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
