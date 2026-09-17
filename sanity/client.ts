import { createClient } from 'next-sanity';
import { apiVersion, dataset, safeProjectId } from './env';

/**
 * Read-only Sanity client for the website. Uses the CDN and the `published`
 * perspective, so only published documents are served to visitors (drafts stay
 * in the Studio). No token is used for public reads — nothing secret ships to
 * the browser. Constructed with a safe placeholder id when unconfigured; the
 * data layer only calls it when `isSanityConfigured` is true.
 */
export const client = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/** Typed fetch helper with ISR revalidation. */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidate = 60,
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate },
  });
}
