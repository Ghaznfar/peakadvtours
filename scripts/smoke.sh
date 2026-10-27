#!/usr/bin/env bash
# Smoke test the deployed surface. Usage:
#   scripts/smoke.sh                          # against production
#   scripts/smoke.sh http://127.0.0.1:8788    # against `npm run cf:preview`
#
# Exits non-zero if anything fails, so it can gate a deploy.
set -uo pipefail
BASE="${1:-https://peakadvtours.com}"
FAILED=0

check() { # path  expected-status  label
  local code
  code=$(curl -s -o /tmp/smoke.out -w "%{http_code}" --max-time 30 "$BASE$1")
  if [ "$code" = "$2" ]; then printf '  ok   %-34s %s\n' "$1" "$code"
  else printf '  FAIL %-34s got %s, want %s\n' "$1" "$code" "$2"; FAILED=1; fi
}

post() { # path  body  expected-status  label
  local code
  code=$(curl -s -o /tmp/smoke.out -w "%{http_code}" --max-time 30 -X POST \
    -H 'content-type: application/json' -d "$2" "$BASE$1")
  if [ "$code" = "$3" ]; then printf '  ok   %-34s %s\n' "POST $1" "$code"
  else printf '  FAIL %-34s got %s, want %s\n' "POST $1" "$code" "$3"; FAILED=1; fi
}

echo "smoke: $BASE"
echo "pages:"
for p in / /tours /treks /expeditions /trips /blog /about /contact /custom-trips; do check "$p" 200; done
echo "detail + seo:"
for p in /tours/gilgit-baltistan-tour /tours/hunza-valley-tour /treks/k2-base-camp-trek /sitemap.xml /robots.txt; do check "$p" 200; done
echo "negative:"
check /this-should-not-exist 404
check /tours/this-trip-does-not-exist 404
echo "api (rejection paths — never send real mail from a smoke test):"
post /api/enquiry '{}' 422
post /api/revalidate '{}' 401

echo "headers:"
hdr=$(curl -s "$BASE/" | grep -o '/_next/static/[^"]*\.js' | head -1)
if [ -n "$hdr" ]; then
  cc=$(curl -sI "$BASE$hdr" | tr -d '\r' | awk -F': ' 'tolower($1)=="cache-control"{print $2}')
  case "$cc" in *immutable*) printf '  ok   %-34s %s\n' "/_next/static immutable" "$cc";;
    *) printf '  FAIL %-34s %s\n' "/_next/static immutable" "${cc:-none}"; FAILED=1;; esac
fi

# Content freshness. This is the check that would have caught the 2026-10-27
# incident: `/api/revalidate` answered 200 while the OpenNext tag cache and
# queue were both the no-op "dummy" implementations, so a publish purged
# nothing and every page served `x-nextjs-cache: STALE` forever. A 200 from the
# endpoint proves nothing on its own — only the cache state does.
#
# Needs the real secret, so it is skipped unless SANITY_REVALIDATE_SECRET is in
# the environment: `SANITY_REVALIDATE_SECRET=$(grep ... .env.local) scripts/smoke.sh`.
# It does purge the production cache, which is harmless (pages re-render on the
# next hit) but means this is a pre/post-deploy check, not something to loop.
echo "freshness:"
if [ -z "${SANITY_REVALIDATE_SECRET:-}" ]; then
  printf '  skip %-34s %s\n' "revalidate round-trip" "SANITY_REVALIDATE_SECRET unset"
else
  probe=/tours/hunza-valley-tour
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -X POST \
    -H "x-revalidate-secret: $SANITY_REVALIDATE_SECRET" -d '{}' "$BASE/api/revalidate")
  if [ "$code" = "200" ]; then printf '  ok   %-34s %s\n' "POST /api/revalidate (auth)" "$code"
  else printf '  FAIL %-34s got %s, want 200\n' "POST /api/revalidate (auth)" "$code"; FAILED=1; fi

  # A purge must leave the page re-rendering (MISS/HIT), never pinned at STALE.
  state=""
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    state=$(curl -sI --max-time 30 "$BASE$probe" | tr -d '\r' \
      | awk -F': ' 'tolower($1)=="x-nextjs-cache"{print $2}')
    [ "$state" != "STALE" ] && break
    sleep 6
  done
  case "$state" in
    HIT|MISS) printf '  ok   %-34s %s\n' "$probe regenerated" "$state";;
    "")       printf '  FAIL %-34s no x-nextjs-cache header\n' "$probe regenerated"; FAILED=1;;
    *)        printf '  FAIL %-34s stuck at %s (dummy tagCache/queue?)\n' "$probe regenerated" "$state"; FAILED=1;;
  esac

  # A draft edit must be ignored, or Studio autosave would purge continuously.
  skipped=$(curl -s --max-time 30 -X POST -H "x-revalidate-secret: $SANITY_REVALIDATE_SECRET" \
    -d '{"_id":"drafts.smoke","_type":"tour"}' "$BASE/api/revalidate")
  case "$skipped" in *'"skipped":"draft"'*) printf '  ok   %-34s %s\n' "draft change ignored" "skipped";;
    *) printf '  FAIL %-34s %s\n' "draft change ignored" "$skipped"; FAILED=1;; esac
fi

[ "$FAILED" = 0 ] && echo "PASS" || echo "FAIL"
exit "$FAILED"
