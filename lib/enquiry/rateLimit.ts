import 'server-only';

/**
 * Minimal in-memory sliding-window rate limiter (per key, e.g. IP). Enough to
 * blunt basic abuse of the enquiry endpoint with no external dependency.
 *
 * Caveat: memory is per server instance, so on serverless/multi-instance hosts
 * this is best-effort. For strict limits, swap this for a shared store (e.g.
 * Upstash Redis) behind the same `rateLimit()` signature.
 */
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    return { ok: false, retryAfterSeconds: Math.ceil((oldest + windowMs - now) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  return { ok: true, retryAfterSeconds: 0 };
}
