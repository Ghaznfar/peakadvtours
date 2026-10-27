#!/usr/bin/env node
/**
 * Writes `public/content-stamp.json` — the newest `_updatedAt` in the Sanity
 * dataset at the moment of the build.
 *
 * The site is static (see README §How a publish reaches the live site), so
 * nothing on the live site reflects a publish until it is rebuilt. The deployed
 * copy of this file is how the scheduled half of `.github/workflows/deploy.yml`
 * answers "has anything been published since the last deploy?" without storing
 * state anywhere: it compares this stamp, served from the live site, against the
 * same query run fresh. Equal means nothing to do, and the workflow exits
 * without building.
 *
 * Drafts are excluded deliberately — the Studio autosaves on nearly every
 * keystroke, and a draft is not visible on the site, so letting drafts move the
 * stamp would rebuild the site continuously for nothing.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/** Newest published document. Keep identical to the workflow's own query. */
export const NEWEST_QUERY = '*[!(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt';

export async function newestContentAt() {
  if (!projectId) return null;
  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(NEWEST_QUERY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
  const { result } = await res.json();
  return typeof result === 'string' ? result : null;
}

const { writeFile, mkdir } = await import('node:fs/promises');

const contentUpdatedAt = await newestContentAt();
await mkdir('public', { recursive: true });
await writeFile(
  'public/content-stamp.json',
  JSON.stringify({ contentUpdatedAt, builtAt: new Date().toISOString() }, null, 2) + '\n',
);
console.log(`[content-stamp] contentUpdatedAt=${contentUpdatedAt ?? 'unset (Sanity not configured)'}`);
