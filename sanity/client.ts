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

/** Cache tag every Sanity read is filed under, so one call can purge them all. */
export const CACHE_TAG = 'sanity';

/**
 * Typed fetch helper with a bounded retry. Reads are cached indefinitely
 * (`revalidate: false`), which makes every page that uses them fully static.
 *
 * This is deliberate and load-bearing, not a performance tweak: the Workers
 * Free plan allows 10 ms of CPU per request, and rendering one page here costs
 * ~25 ms. Any page that has to render at request time is killed mid-flight and
 * Cloudflare returns `error code: 1102` (503) — which is exactly what took the
 * site down on 2026-10-27 once on-demand revalidation started working and
 * cached pages began expiring. With `revalidate: false` nothing ever expires,
 * so every request is served from the cache populated at deploy time and no
 * render ever happens in production.
 *
 * The consequence: publishing in Sanity no longer puts content live on its own.
 * Content ships with `npm run cf:build && npm run cf:deploy`. See
 * `app/api/revalidate/route.ts`, which is now a no-op for the same reason.
 *
 * `revalidate: false` also means `next build`'s own fetch cache never expires,
 * so a rebuild would happily re-emit last week's content and look successful —
 * it did exactly that once, re-prerendering two slugs that had just been fixed
 * in Sanity. `npm run cf:build` therefore deletes `.next/cache/fetch-cache`
 * first. Build from `npm run cf:build`, never bare `opennextjs-cloudflare
 * build`, or the deploy can ship stale content.
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
  revalidate: number | false = false,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await client.fetch<T>(query, params, { next: { revalidate, tags: [CACHE_TAG] } });
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
