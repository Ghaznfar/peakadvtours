# PeakAdventure Tours

A professional travel/tourism website (tours, treks, expeditions, festivals + custom
trips) built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, with
content managed in **Sanity CMS** and hosted on **Cloudflare Workers**.

| | |
|---|---|
| **Live site** | <https://peakadvtours.com> (`www` 301s to the apex) |
| **Studio (editors)** | <https://admin.peakadvtours.com> |
| **Content** | Sanity project `eigm30ey`, dataset `production` (public) |

> Copy, prices, photography and contact details are the **client's real content**.
> Two things are still hardcoded placeholders: `lib/content/marketing.ts`
> (`getValueProps`, `getStats`, `getCredentials`) is not modelled in Sanity at all,
> so the "Why choose us" props, stats band and credentials row are local data
> regardless of the CMS. See `CLAUDE.md` for standards and rules.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

The site runs **without Sanity** out of the box — the content layer falls back to
local seed data when the Sanity env vars are unset. Note the asymmetry: with a
*configured but empty* dataset the content modules correctly render **empty**,
not seed data.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run format` | Prettier |
| `npm run sanity:check` | Connection smoke test — counts docs per type (no token needed) |
| `npm run studio:dev` | Run Sanity Studio standalone → <http://localhost:3333> |
| `npm run studio:deploy` | Deploy Studio to `*.sanity.studio` (unused — the Studio is hosted on Netlify) |
| `npm run cf:build` | Build the Cloudflare Worker bundle into `.open-next/` |
| `npm run cf:deploy` | Upload `.open-next/` to Cloudflare — **does not build**, see below |
| `npm run cf:preview` | Run the built Worker locally → <http://127.0.0.1:8788> |
| `scripts/smoke.sh` | Smoke-test the deployed site (pages, SEO, API, cache freshness) |

## Environment variables

Documented in `.env.example`. Never commit real values — `.env*.local` is gitignored.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | for CMS | Sanity project id (public, read-only) |
| `NEXT_PUBLIC_SANITY_DATASET` | for CMS | Dataset (default `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | for CMS | API date (default `2024-10-01`) |
| `SANITY_API_READ_TOKEN` | optional | Secret token, only if enabling draft preview |
| `NEXT_PUBLIC_SITE_URL` | **prod** | Canonical/OG/sitemap base URL |
| `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` | prod | Email enquiries (Resend) |
| `ENQUIRY_FROM_EMAIL` | optional | From address for enquiry emails |
| `ENQUIRY_WEBHOOK_URL` | optional | CRM / WhatsApp automation webhook |
| `SANITY_REVALIDATE_SECRET` | **prod** | Shared secret for the Sanity publish webhook → `/api/revalidate` |

`NEXT_PUBLIC_*` vars are **baked in at build time**, so `NEXT_PUBLIC_SITE_URL` must
be correct *before* a deploy — it drives every canonical tag, OG URL, JSON-LD block
and `sitemap.xml` entry. It comes from `.env.local` at build time (the Worker is
built locally, so there is no dashboard env var to set); `site.config.ts` falls back
to the production domain if it is ever missing.

The runtime secrets — `SANITY_REVALIDATE_SECRET`, `RESEND_API_KEY`,
`ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` — are set as **Worker secrets**
(`npx wrangler secret put NAME`; list them with `npx wrangler secret list`).
`SANITY_REVALIDATE_SECRET` must match the `x-revalidate-secret` header on the Sanity
webhook, or every purge is rejected with a `401`.

Note the overlap: Next also bakes whatever is in `.env` / `.env.local` into the build
output (`.open-next/server-functions/default/.env`), so these values exist in **two**
places. Rotating one means updating `.env.local`, rebuilding, *and*
`wrangler secret put` — changing only one side leaves a stale copy in play.

## Deployment (Cloudflare Workers)

The site runs as a single Cloudflare Worker (`peakadvtours`) built by
[OpenNext](https://opennext.js.org/cloudflare), in account
`1cdc5693f54a64683933f428940903b3`. Custom domains: `peakadvtours.com`, `www`, and
`cf.peakadvtours.com` as a staging hostname. Moved here from Netlify on 2026-10-20,
because Netlify's free plan bills 15 credits per production deploy against a
300-credit monthly allowance; Cloudflare's free plan has no per-deploy cost.

**There is no Git connection — pushing to GitHub deploys nothing.** Deploying is two
commands, and both are required:

```bash
export CLOUDFLARE_API_TOKEN=$(cat ~/.cf-token)
npm run cf:build     # rebuild .open-next/ — easy to forget, see gotcha below
npm run cf:deploy    # populate the KV cache + wrangler deploy
SANITY_REVALIDATE_SECRET=... scripts/smoke.sh   # verify
```

### Deploy gotcha: `cf:deploy` does not build

`opennextjs-cloudflare deploy` only uploads whatever is already in `.open-next/`.
Running it alone ships a **stale bundle** — which is how the 2026-10-27 incident
below survived its first attempted fix. Always `cf:build` first; the deploy output
names the bindings it uploaded, so check them against the table below.

### Worker bindings

All three are load-bearing for content freshness; see `open-next.config.ts`.

| Binding | Resource | Purpose |
|---|---|---|
| `NEXT_INC_CACHE_KV` | KV `9c20a6ba...` | ISR cache — the prerendered pages |
| `NEXT_TAG_CACHE_KV` | KV `49efa9bb...` | Cache-tag revalidation times — makes `/api/revalidate` effective |
| `NEXT_CACHE_DO_QUEUE` | Durable Object `DOQueueHandler` | Background re-render of stale pages |
| `ASSETS` | Workers Assets | `.open-next/assets` (static files) |

If any override is left out of `open-next.config.ts`, OpenNext silently substitutes a
`"dummy"` no-op rather than failing — the trap described below. `public/_headers`
restores immutable caching for `/_next/static/*`.

### DNS

Managed in **Cloudflare** (nameservers `addilyn`/`dylan.ns.cloudflare.com`; the
domain came from GoDaddy). The apex, `www` and `admin` are all **Worker custom
domains**, which Cloudflare wires up itself — `admin` resolves to an `AAAA 100::`
proxy placeholder and is served by the `peakadvtours-studio` Worker, not by Netlify.
(It was a DNS-only CNAME to Netlify at migration time; moving it onto a Worker is
why a `netlify deploy` of the Studio now changes nothing visitors can see.)

### Rollback to Netlify

Netlify is kept as a one-click rollback. Two sites remain in the `ghaznfar` account:

| Site | ID | Serves |
|---|---|---|
| `peakadvtours` | `7051a08b-acf3-48ab-9f65-5f0231b46508` | the website — dormant, still builds |
| `peakadvtours-studio` | `721dcab8-4fe9-4ad3-b2c1-c93f9d502d8b` | the Studio — **dormant fallback only**, nothing points at it |

To fall back: remove the Worker custom domains, then recreate apex `A 75.2.60.5` and
the `www` CNAME, and `npx netlify-cli deploy --build --prod --site 7051a08b-...`.

**The Studio is on Cloudflare too** — an assets-only Worker (`wrangler.studio.jsonc`,
no `main`, SPA fallback), deployed with `npm run studio:deploy:cf`. Deploying it to
Netlify has no effect on `admin.peakadvtours.com`; the Netlify Studio site is only a
fallback for a full retreat from Cloudflare.

### Deploy gotcha: new or renamed trips 404 until you redeploy

Each detail route sets `export const dynamicParams = false` (e.g.
`app/tours/[slug]/page.tsx`), so the set of valid URLs is **frozen at build time** by
`generateStaticParams`. A trip added or re-slugged in the Studio therefore 404s —
while the listing page, which revalidates on publish, happily links to it. If the
client reports a dead tour link, **redeploy first** (`cf:build` + `cf:deploy`).

This is the one content change the publish webhook below **cannot** fix: edits to an
existing trip go live in seconds, but a *new or re-slugged* trip needs a deploy.
Removing `dynamicParams = false` from the four detail routes is the durable fix.

## Content management (Sanity)

- **Editing UI:** Sanity Studio, deployed as a standalone assets-only Cloudflare
  Worker (`npm run studio:build && npm run studio:deploy:cf`):
  - **Live:** <https://admin.peakadvtours.com> — the URL editors bookmark
  - **Local:** `npm run studio:dev` → <http://localhost:3333>
  Editors sign in with their sanity.io account — **auth and roles are managed in
  Sanity**; the app has no custom login, admin dashboard, or database.
  _(The Studio is intentionally not embedded in the Next app: Sanity Studio and
  Next 16's Turbopack RSC build don't co-exist cleanly, and a standalone/hosted
  Studio is the simpler, well-supported option.)_
- **Schemas:** `sanity/schemaTypes/` — `tour`, `destination`, `category`,
  `testimonial`, `teamMember`, `blogPost`, `siteSettings`, plus shared objects.
- **Studio config:** `sanity.config.ts` (Studio) and `sanity.cli.ts` (CLI).
- **Plan:** the project is on Sanity's **Free** plan. Comments, scheduled drafts,
  AI Assist, private datasets and the Editor/Contributor roles are unavailable;
  only Administrator and Viewer roles exist. The dataset is **public**, so treat
  anything stored in it as world-readable.

### One-time Sanity setup (manual)

1. Create a project at <https://sanity.io> (or `npx sanity login` then `npx sanity init --env`).
2. Put the project id + dataset in `.env.local` (see above).
3. Add the **Studio's** origins as **CORS origins** (sanity.io → project → API →
   CORS origins): `https://admin.peakadvtours.com` with credentials allowed.
   `http://localhost:3333` is handled automatically. The website itself does *not*
   need a CORS entry — it reads server-side, not from the browser.
4. Run `npm run studio:dev` and sign in. Create content.

### How to create / edit / publish a tour

1. Open the Studio (<https://admin.peakadvtours.com>, or `npm run studio:dev`) →
   **Tours / Treks / Expeditions** → **Create**.
2. Fill in the fields (grouped: Main, Details, Itinerary & pricing, Media, SEO).
   Set the **category**, add **destinations** (references), a **hero image** (with
   alt text), price, itinerary, etc.
3. Slugs must be **lowercase, hyphenated, no spaces** — they are the public URL.
   This is now enforced by validation (`sanity/schemaTypes/slug.ts`) and cannot be
   published otherwise: `hunza valley` and `northern- areas- trekking` both shipped
   as permanent 404s, because the build writes a file with a literal space and the
   browser asks for `%20`.
4. Click **Publish**. The website renders only **published** documents, so a draft
   never appears on the site — but note the dataset is public, so drafts are still
   readable via the API and are not a safe place for confidential content.
   **Publishing does not put the change live by itself.** The site is built static
   (see below); every content change — edits, new trips, re-slugs — reaches
   visitors on the next `npm run cf:build && npm run cf:deploy`.
5. **Unpublish** to hide; **Delete** to remove. Trips are **drag-to-reorder** in the
   desk (writes `orderRank`, which the `TOURS_*` queries sort on, then title);
   reorder team members via the `order` field.

### How a publish reaches the live site

**By being rebuilt.** The site is fully static: every page is prerendered at build
time and served from Workers static assets, and nothing is rendered at request
time. So the flow is:

1. Editor publishes in the Studio.
2. Somebody runs `npm run cf:build && npm run cf:deploy` (~1 min).
3. The new content is live everywhere at once.

That is not a simplification of a richer setup — it is the only thing the hosting
plan allows. **Workers Free gives a Worker 10 ms of CPU per request; rendering one
page here costs ~25 ms.** Any page that renders at request time is killed with
`error code: 1102` (503). Serving an already-rendered page is cheap; producing one
is not possible. Hence:

- `sanityFetch` caches reads with `revalidate: false` — nothing ever goes stale, so
  nothing ever needs re-rendering.
- `open-next.config.ts` uses the **static-assets** incremental cache (read-only),
  with `tagCache` and `queue` deliberately unset. Serving a page costs zero KV
  operations.
- `/api/revalidate` still exists and still answers 200 to the Sanity webhook, but
  **purges nothing** — it reports `{"purged": false, "mode": "static"}`.
- No route may read `searchParams` (that makes it dynamic). Listing pages take the
  URL query in the browser instead, via `TripResultsFromUrl`.

**Re-enabling on-demand publishing** needs the Workers **Paid** plan ($5/mo, raises
the CPU limit to 30 s). Then restore all three together — `kv-incremental-cache`,
`kvNextTagCache`, `doQueue` in `open-next.config.ts`, a finite `revalidate` in
`sanity/client.ts`, and the two purge calls in `/api/revalidate`. **Never restore
the purge alone:** a purge marks pages stale, and a stale page that cannot be
re-rendered is a 503. That is exactly how the site went down.

**Watch the build cache.** Because `revalidate: false` never expires, `next build`
will happily reuse last week's Sanity responses and still report success. `npm run
cf:build` deletes `.next/cache/fetch-cache` first for that reason — build with the
npm script, never bare `opennextjs-cloudflare build`.

**Debugging it:** `scripts/smoke.sh` is the gate — it checks every page is served
`x-nextjs-cache: HIT`, that `/` never expires, that all 58 sitemap URLs resolve, and
that the purge is still disabled. `npx wrangler tail --format json` shows `cpuTime`
and `outcome` per request; `"outcome":"exceededCpu"` is the signature of this whole
class of failure.

### Incident: content frozen for 7 days (2026-10-27)

The client's image edits of 2026-10-25 never appeared. The Cloudflare migration had
configured only `incrementalCache` in `open-next.config.ts`, so `tagCache` and
`queue` both fell back to OpenNext's `"dummy"` no-ops: `/api/revalidate` returned
`200 ok` while purging nothing, and stale pages were served forever
(`FatalError: Dummy queue is not implemented` in the Worker logs). Separately, the
Sanity webhook did not exist at all — the project had zero hooks — so even a working
purge would never have been triggered. The site was pinned to whatever the
2026-10-20 build had prerendered. Both were fixed on 2026-10-27 — which caused the
next incident the same morning.

### Incident: site down, 503 on every un-cached page (2026-10-27)

Within an hour of the freshness chain being repaired, pages started returning
`error code: 1102`. The chain was working: the cache entries from the 09:47 deploy
reached their 1-hour expiry, each expired page tried to re-render, and
`"outcome":"exceededCpu"` (25 ms against the free plan's 10 ms) killed every one.
`/`, `/about`, `/contact`, `/blog`, `/treks`, `/destinations` and `/sitemap.xml`
were down or hanging; only pages still inside their cache window answered. Nothing
was misconfigured — the site had simply never rendered a page in production before,
because for the previous week every page was a frozen cache HIT.

Fixed by removing request-time rendering altogether: static everywhere, purge
disabled, listing pages reading the URL query client-side. The smoke test now fails
on `x-nextjs-cache: MISS`/`STALE`, which is the early warning for it.

## Architecture

- **Frontend never talks to Sanity directly.** UI/pages import typed functions
  from `lib/content/` (the repository seam): `getTours`, `getTourBySlug`,
  `getFeaturedTours`, `getDestinations`, `getDestinationBySlug`, `getTestimonials`,
  `getTeamMembers`, `getBlogPosts`, `getSiteSettings`, etc. (plus back-compat
  aliases `getAllTrips`, `getTripBySlug`, …).
- Those modules read from Sanity (`sanity/client.ts` + `sanity/queries.ts`) when
  configured, else return local seed data (`lib/content/*.data.ts`).
- `sanityFetch` retries with backoff — `next build` prerenders across 10 workers
  and a single transient connection timeout would otherwise fail the whole build.
- Images use `next/image` against Sanity's CDN (`cdn.sanity.io`, allow-listed in
  `next.config.ts`) with `lqip` blur placeholders.
- Enquiries post to `app/api/enquiry/route.ts` → `lib/enquiry/delivery.ts`.
  **`{"ok":true}` is not proof of delivery** — the always-on log channel makes the
  response succeed even when Resend rejects the mail. Verify in the function logs
  or the Resend dashboard.

See `docs/` for the full plan, data model, SEO and phases; track progress in
`PROJECT_STATUS.md`.
