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

/** How many times a failed read is retried before giving up. */
const MAX_ATTEMPTS = 5;
/** Backoff between attempts: 0.5s, 1.5s, 4.5s, 13.5s. */
const BASE_DELAY_MS = 500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Typed fetch helper with ISR revalidation and a bounded retry.
 *
 * The retry is not defensive padding — `next build` prerenders across 10
 * workers, which opens a burst of connections to `apicdn.sanity.io` at once,
 * and some of them hit `UND_ERR_CONNECT_TIMEOUT` (10s). A single failure fails
 * the whole build, so a green deploy depended on the network behaving for the
 * length of one prerender pass. Three attempts with a short backoff turns that
 * from a coin flip into a non-event.
 *
 * Deliberately retries everything rather than inspecting the error: a GROQ read
 * is idempotent, so a wasted retry on a genuine error costs ~1.2s once, while
 * a missed retry on a transient one costs the deploy.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidate = 60,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await client.fetch<T>(query, params, { next: { revalidate } });
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `[sanity] fetch failed (attempt ${attempt}/${MAX_ATTEMPTS}), retrying:`,
          error instanceof Error ? error.message : error,
        );
        await wait(BASE_DELAY_MS * 3 ** (attempt - 1));
      }
    }
  }

  throw lastError;
}
