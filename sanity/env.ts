/**
 * Sanity environment configuration. All values come from env vars — never
 * hardcode a project id or token. See `.env.example` and README §CMS.
 *
 * `projectId` falls back to a syntactically-valid placeholder so the Studio
 * config and client can be imported at build time even before a real project
 * exists; `isSanityConfigured` is the real gate the data layer checks before
 * fetching (when false, the repository serves local seed data instead).
 */
// The Next.js app reads NEXT_PUBLIC_* ; the Sanity Studio (Vite) only exposes
// SANITY_STUDIO_* . Support both so one `.env.local` drives the site AND Studio.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '';
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  '2024-10-01';

/** True once a real Sanity project id is configured. */
export const isSanityConfigured = projectId.length > 0;

/** Safe project id for constructing the client/Studio without throwing. */
export const safeProjectId = isSanityConfigured ? projectId : 'placeholder';
