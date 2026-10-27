import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { CACHE_TAG } from '@/sanity/client';

/**
 * On-demand revalidation, called by the Sanity webhook "Revalidate
 * peakadvtours.com" whenever a document is published or deleted.
 *
 * This is what lets `sanityFetch` use a long (1h) time-based window without
 * editors waiting an hour to see their work: the timer is only a backstop, and
 * publishing purges the cache immediately. See README §Content management.
 *
 * Auth is a shared secret in the `x-revalidate-secret` header, matched against
 * `SANITY_REVALIDATE_SECRET`. If that env var is unset the route refuses every
 * request rather than defaulting open — an unauthenticated purge endpoint is a
 * free way for anyone to drive up Worker invocations.
 */

/**
 * Drafts must never trigger a purge: the Studio autosaves on nearly every
 * keystroke, so purging on them would re-render the whole site continuously for
 * content no visitor can see. The webhook is configured `includeDrafts: false`,
 * which is the real defence; this is a cheap second one in case the hook is
 * ever recreated without that flag. A draft `_id` is prefixed `drafts.` —
 * checked both on a document payload (`_id`) and on the id lists a
 * transaction-type hook would send. A body with neither is treated as "purge",
 * so a hand-triggered `curl` with no payload still works.
 */
function isDraftsOnly(payload: unknown): boolean {
  const body = payload as {
    _id?: string;
    ids?: { created?: string[]; updated?: string[]; deleted?: string[]; all?: string[] };
  } | null;

  if (typeof body?._id === 'string') return body._id.startsWith('drafts.');

  const ids = body?.ids;
  if (!ids) return false;

  const all = ids.all ?? [...(ids.created ?? []), ...(ids.updated ?? []), ...(ids.deleted ?? [])];
  return all.length > 0 && all.every((id) => id.startsWith('drafts.'));
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error('[revalidate] SANITY_REVALIDATE_SECRET is not set; refusing.');
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  if (isDraftsOnly(payload)) {
    console.log('[revalidate] draft-only change; skipping purge');
    return NextResponse.json({ ok: true, skipped: 'draft' });
  }

  // Next 16 requires a cacheLife profile; `{ expire: 0 }` means "stale now".
  // The tag covers every `sanityFetch`; the path sweep also catches route-level
  // output that isn't a tagged fetch, such as `sitemap.xml`.
  revalidateTag(CACHE_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  console.log('[revalidate] purged tag', CACHE_TAG, 'and all paths');

  return NextResponse.json({ ok: true, revalidated: CACHE_TAG, at: Date.now() });
}
