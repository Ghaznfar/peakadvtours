import { NextResponse } from 'next/server';

/**
 * On-demand revalidation, called by the Sanity webhook "Revalidate
 * peakadvtours.com" whenever a document is published or deleted.
 *
 * DISABLED on 2026-10-27, and it must stay that way while the site is on the
 * Workers Free plan. The purge worked exactly as intended — which is what broke
 * the site: it marked pages stale, stale pages re-render at request time, and a
 * render costs ~25 ms CPU against a 10 ms limit, so every purged page started
 * answering `error code: 1102` (503). Nothing here was wrong; the plan cannot
 * render pages at all.
 *
 * So the whole site is now static (`sanityFetch` caches indefinitely) and
 * content ships by rebuilding: `npm run cf:build && npm run cf:deploy`.
 *
 * The endpoint is kept alive and still answers 200 so the Sanity webhook does
 * not start failing and alerting; it simply purges nothing. Re-enable the two
 * purge calls below only together with a plan that allows real CPU (Workers
 * Paid), never on its own.
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
    console.log('[revalidate] draft-only change; skipping');
    return NextResponse.json({ ok: true, skipped: 'draft' });
  }

  // Intentionally no `revalidateTag` / `revalidatePath` here — see the note at
  // the top of this file. Purging marks pages stale, and a stale page cannot be
  // re-rendered within the free plan's 10 ms CPU limit, so the purge would take
  // the page down rather than refresh it.
  console.log('[revalidate] static mode: acknowledged, nothing purged');

  return NextResponse.json({
    ok: true,
    mode: 'static',
    purged: false,
    note: 'Site is statically built; publish goes live on the next cf:build + cf:deploy.',
    at: Date.now(),
  });
}
