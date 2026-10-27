import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * The site is built fully static and serves only prerendered output — no page
 * renders at request time. That is not a preference, it is what the Workers
 * Free plan allows: 10 ms of CPU per request, against ~25 ms to render one page
 * here. On 2026-10-27 the on-demand revalidation chain started working, pages
 * began expiring, every expired page tried to re-render and Cloudflare killed
 * them with `error code: 1102` (503) until the site was effectively down.
 *
 * So the three overrides that chain needed are deliberately gone:
 *
 * - `incrementalCache` reads prerendered pages straight from Workers static
 *   assets (`cdn-cgi/_next_cache/...`, written at build time). It is read-only
 *   by design — the matching OpenNext doc line is "should only be used for
 *   applications that do NOT want revalidation and ONLY want to serve
 *   prerendered data". Static assets are unmetered, so serving a page now costs
 *   no KV operation at all; the previous `kv-incremental-cache` spent ~61 KV
 *   writes on every deploy and read KV on every request, against a 1,000
 *   write/day free cap.
 * - `tagCache` is intentionally unset (OpenNext's no-op). Nothing revalidates,
 *   so there are no tags to track — and a working purge is precisely what took
 *   the site down.
 * - `queue` is intentionally unset for the same reason: its only job was the
 *   background re-render of a stale page, and a re-render cannot complete
 *   inside the CPU limit.
 *
 * Content therefore goes live on `npm run cf:build && npm run cf:deploy`, not
 * on publish. The KV namespaces and the Durable Object stay declared in
 * `wrangler.jsonc` but unused, so re-enabling the chain on a paid plan is a
 * config change rather than a re-provision. Re-enable all three together, never
 * one alone: a purge with no way to re-render is what broke the site.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
