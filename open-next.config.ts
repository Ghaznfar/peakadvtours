import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * The ISR cache lives in Workers KV (binding `NEXT_INC_CACHE_KV`, declared in
 * `wrangler.jsonc`). Without it every request would re-render instead of
 * serving the prerendered output, and `/api/revalidate` would have nothing to
 * purge — the Sanity publish webhook depends on this binding existing.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
