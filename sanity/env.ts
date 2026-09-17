/**
 * Sanity environment configuration. All values come from env vars — never
 * hardcode a project id or token. See `.env.example` and README §CMS.
 *
 * `projectId` falls back to a syntactically-valid placeholder so the Studio
 * config and client can be imported at build time even before a real project
 * exists; `isSanityConfigured` is the real gate the data layer checks before
 * fetching (when false, the repository serves local seed data instead).
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/** True once a real Sanity project id is configured. */
export const isSanityConfigured = projectId.length > 0;

/** Safe project id for constructing the client/Studio without throwing. */
export const safeProjectId = isSanityConfigured ? projectId : 'placeholder';
