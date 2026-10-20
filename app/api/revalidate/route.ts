import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { CACHE_TAG } from '@/sanity/client';

/**
 * On-demand revalidation, called by a Sanity webhook whenever a document is
 * published, updated or deleted.
 *
 * This is what lets `sanityFetch` use a long (1h) time-based window without
 * editors waiting an hour to see their work: the timer is only a backstop, and
 * publishing purges the cache immediately. See README §Content management.
 *
 * Auth is a shared secret in the `x-revalidate-secret` header, matched against
 * `SANITY_REVALIDATE_SECRET`. If that env var is unset the route refuses every
 * request rather than defaulting open — an unauthenticated purge endpoint is a
 * free way for anyone to drive up function invocations.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error('[revalidate] SANITY_REVALIDATE_SECRET is not set; refusing.');
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Next 16 requires a cacheLife profile; `{ expire: 0 }` means "stale now".
  // The tag covers every `sanityFetch`; the path sweep also catches route-level
  // output that isn't a tagged fetch, such as `sitemap.xml`.
  revalidateTag(CACHE_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  console.log('[revalidate] purged tag', CACHE_TAG, 'and all paths');

  return NextResponse.json({ ok: true, revalidated: CACHE_TAG, at: Date.now() });
}
