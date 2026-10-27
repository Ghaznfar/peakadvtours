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
domain came from GoDaddy). The apex and `www` are Worker custom domains, which
Cloudflare wires up itself. `admin` is a CNAME to Netlify and must stay **DNS-only
(grey cloud)** — while proxied, Cloudflare terminates TLS with its own certificate
and Netlify cannot issue one.

### Rollback to Netlify

Netlify is kept as a one-click rollback. Two sites remain in the `ghaznfar` account:

| Site | ID | Serves |
|---|---|---|
| `peakadvtours` | `7051a08b-acf3-48ab-9f65-5f0231b46508` | the website — dormant, still builds |
| `peakadvtours-studio` | `721dcab8-4fe9-4ad3-b2c1-c93f9d502d8b` | **the Studio** — `admin.peakadvtours.com` (live) |

To fall back: remove the Worker custom domains, then recreate apex `A 75.2.60.5` and
the `www` CNAME, and `npx netlify-cli deploy --build --prod --site 7051a08b-...`.
The Studio is **not** part of this — it still runs on Netlify
(`npx sanity build` + `netlify deploy --dir dist`) and is unaffected by Worker deploys.

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

- **Editing UI:** Sanity Studio, deployed as a standalone app to Netlify:
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
3. Keep slugs **lowercase and hyphenated** — they are the public URL, and mixed
   case produces links that are easy to mistype into a 404.
4. Click **Publish**. The website renders only **published** documents, so a draft
   never appears on the site — but note the dataset is public, so drafts are still
   readable via the API and are not a safe place for confidential content. Editing
   and re-publishing updates the site **within seconds** — see the freshness chain
   below. A brand-new or re-slugged trip needs a **redeploy** — see the deploy
   gotcha above.
5. **Unpublish** to hide; **Delete** to remove. Trips are **drag-to-reorder** in the
   desk (writes `orderRank`, which the `TOURS_*` queries sort on, then title);
   reorder team members via the `order` field.

### How a publish reaches the live site (the freshness chain)

Four links, each of which has broken at least once:

1. **Sanity webhook** "Revalidate peakadvtours.com" (sanity.io → project → API →
   Webhooks) — a *document*-type hook, `rule.on = create/update/delete`,
   `includeDrafts: false`, POSTing to `https://peakadvtours.com/api/revalidate`
   with the shared secret in an `x-revalidate-secret` header. Drafts are excluded
   deliberately: the Studio autosaves constantly, and purging on every keystroke
   would re-render the whole site for content no visitor can see.
2. **`/api/revalidate`** checks the secret, ignores draft payloads as a second
   defence, then calls `revalidateTag('sanity')` + `revalidatePath('/', 'layout')`.
3. **The tag cache** (`NEXT_TAG_CACHE_KV`) records the purge, and the **DO queue**
   re-renders stale pages. Without these bindings the purge is a silent no-op.
4. **`sanityFetch`** (`sanity/client.ts`) tags every read `sanity` and keeps a 1-hour
   time window as a *backstop only* — freshness comes from the webhook.

Timing: typically a few seconds end to end. Workers KV is eventually consistent, so
a distant region can serve the old page for up to ~60s; if the webhook is ever
missed entirely, the 1-hour window catches it. Switching the tag cache to D1
(`d1-next-tag-cache`) removes the 60s window, but needs a Cloudflare token with D1
scope — the current one only has Workers KV.

**Debugging it:** `npx wrangler tail` and publish something. A healthy publish logs
`[revalidate] purged tag sanity and all paths`; a page then reports
`x-nextjs-cache: MISS` on the next hit and `HIT` after. A page stuck at
`x-nextjs-cache: STALE` means link 3 is broken.
`SANITY_REVALIDATE_SECRET=... scripts/smoke.sh` checks the whole chain.

### Incident: content frozen for 7 days (2026-10-27)

The client's image edits of 2026-10-25 never appeared. The Cloudflare migration had
configured only `incrementalCache` in `open-next.config.ts`, so `tagCache` and
`queue` both fell back to OpenNext's `"dummy"` no-ops: `/api/revalidate` returned
`200 ok` while purging nothing, and stale pages were served forever
(`FatalError: Dummy queue is not implemented` in the Worker logs). Separately, the
Sanity webhook did not exist at all — the project had zero hooks — so even a working
purge would never have been triggered. The site was pinned to whatever the
2026-10-20 build had prerendered. Both are fixed; the smoke script now fails if
either regresses.

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
