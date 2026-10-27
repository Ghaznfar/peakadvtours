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

# Static mode (since 2026-10-27). The site serves ONLY prerendered output: the
# Workers Free plan allows 10 ms of CPU per request, a page render here costs
# ~25 ms, and anything that renders at request time is killed with `error code:
# 1102` (503). That is what took the site down once the revalidation chain
# started working and cached pages began to expire. These checks catch a slide
# back into rendering at request time.
echo "static mode:"

# 1. Pages must come from the prerendered cache. MISS or STALE means the Worker
#    rendered (or tried to), which is the failure mode, not a warm-up.
for p in / /tours/hunza-valley-tour /treks /custom-trips; do
  state=$(curl -sI --max-time 30 "$BASE$p" | tr -d '\r' \
    | awk -F': ' 'tolower($1)=="x-nextjs-cache"{print $2}')
  case "$state" in
    HIT) printf '  ok   %-34s %s\n' "$p prerendered" "$state";;
    "")  printf '  FAIL %-34s no x-nextjs-cache header\n' "$p prerendered"; FAILED=1;;
    *)   printf '  FAIL %-34s %s — rendering at request time\n' "$p prerendered" "$state"; FAILED=1;;
  esac
done

# 2. Nothing may expire: an expiring page becomes a render, and a render is a 503.
cc=$(curl -sI --max-time 30 "$BASE/" | tr -d '\r' | awk -F': ' 'tolower($1)=="cache-control"{print $2}')
case "$cc" in
  *s-maxage=31536000*) printf '  ok   %-34s %s\n' "/ never expires" "$cc";;
  *) printf '  FAIL %-34s %s\n' "/ never expires" "${cc:-none}"; FAILED=1;;
esac

# 3. Every URL the sitemap advertises must resolve. This is what catches a slug
#    that cannot survive a round trip through a URL: `hunza valley` and
#    `northern- areas- trekking` both 404ed while every other check passed.
echo "sitemap sweep:"
bad=0; n=0
while read -r loc; do
  n=$((n+1))
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$loc")
  [ "$code" = "200" ] || { printf '  FAIL %-34s %s\n' "$loc" "$code"; bad=$((bad+1)); FAILED=1; }
done < <(curl -s --max-time 30 "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g')
[ "$bad" = 0 ] && printf '  ok   %-34s %s urls\n' "all sitemap urls 200" "$n"

# 4. The purge must stay disabled. Re-enabling `revalidateTag`/`revalidatePath`
#    without a plan that can actually re-render a page is precisely what broke
#    the site: the purge works, the re-render then 503s. Needs the real secret,
#    so it is skipped unless SANITY_REVALIDATE_SECRET is in the environment.
echo "purge disabled:"
if [ -z "${SANITY_REVALIDATE_SECRET:-}" ]; then
  printf '  skip %-34s %s\n' "revalidate is a no-op" "SANITY_REVALIDATE_SECRET unset"
else
  body=$(curl -s --max-time 30 -X POST -H "x-revalidate-secret: $SANITY_REVALIDATE_SECRET" \
    -d '{}' "$BASE/api/revalidate")
  case "$body" in
    *'"purged":false'*) printf '  ok   %-34s %s\n' "revalidate is a no-op" "purged:false";;
    *) printf '  FAIL %-34s %s\n' "revalidate is a no-op" "$body"; FAILED=1;;
  esac

  # A draft edit must still be ignored, or Studio autosave would hammer the endpoint.
  skipped=$(curl -s --max-time 30 -X POST -H "x-revalidate-secret: $SANITY_REVALIDATE_SECRET" \
    -d '{"_id":"drafts.smoke","_type":"tour"}' "$BASE/api/revalidate")
  case "$skipped" in *'"skipped":"draft"'*) printf '  ok   %-34s %s\n' "draft change ignored" "skipped";;
    *) printf '  FAIL %-34s %s\n' "draft change ignored" "$skipped"; FAILED=1;; esac
fi

[ "$FAILED" = 0 ] && echo "PASS" || echo "FAIL"
exit "$FAILED"
