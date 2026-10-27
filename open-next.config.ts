import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import kvNextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * All three overrides are load-bearing for content freshness. Leaving any of
 * them unset silently falls back to OpenNext's `"dummy"` implementation, which
 * is a no-op — the failure mode that froze the site on the 2026-10-20 build:
 * `/api/revalidate` answered 200 while purging nothing, and stale pages were
 * served as `x-nextjs-cache: STALE` forever. Do not remove one without
 * replacing it.
 *
 * - `incrementalCache` (KV `NEXT_INC_CACHE_KV`) stores the prerendered output.
 *   Without it every request re-renders.
 * - `tagCache` (KV `NEXT_TAG_CACHE_KV`) records tag revalidation times. This is
 *   what makes `revalidateTag(CACHE_TAG)` in `/api/revalidate` mean anything;
 *   the dummy version's `writeTags()` discards the write and `isStale()` always
 *   says "fresh". KV rather than D1 because the deploy credentials only carry
 *   Workers KV scope; KV is eventually consistent, so a publish lands in up to
 *   ~60s rather than instantly. Switch to `d1-next-tag-cache` for strong
 *   consistency if the token ever gains D1 scope.
 * - `queue` (Durable Object `NEXT_CACHE_DO_QUEUE`) runs the background
 *   re-render for a stale page. The dummy version throws, which is why even the
 *   1-hour time-based backstop in `sanityFetch` never fired.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: kvNextTagCache,
  queue: doQueue,
});
