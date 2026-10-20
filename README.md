# PeakAdventure Tours

A professional travel/tourism website (tours, treks, expeditions, festivals + custom
trips) built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, with
content managed in **Sanity CMS** and hosted on **Netlify**.

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

`NEXT_PUBLIC_*` vars are **baked in at build time**, so `NEXT_PUBLIC_SITE_URL` must
be correct *before* a deploy — it drives every canonical tag, OG URL, JSON-LD block
and `sitemap.xml` entry. It is set on the Netlify site; `site.config.ts` falls back
to the production domain if it is ever missing.

## Deployment (Netlify)

Two Netlify sites, both in the `ghaznfar` account:

| Site | ID | Serves |
|---|---|---|
| `peakadvtours` | `7051a08b-acf3-48ab-9f65-5f0231b46508` | the website — `peakadvtours.com` + `www` alias |
| `peakadvtours-studio` | `721dcab8-4fe9-4ad3-b2c1-c93f9d502d8b` | the Studio — `admin.peakadvtours.com` |

**There is no Git connection — pushing to GitHub deploys nothing.** Every deploy is
a manual CLI upload (connecting the repo needs an OAuth step in the dashboard):

```bash
npx netlify-cli deploy --build --prod --site 7051a08b-acf3-48ab-9f65-5f0231b46508
```

DNS is managed in **Cloudflare** (nameservers `addilyn`/`dylan.ns.cloudflare.com`;
the domain came from GoDaddy). The apex is an `A` record to Netlify's load balancer
`75.2.60.5`; `www` and `admin` are CNAMEs. Records should be **DNS-only (grey
cloud)** — while proxied, Cloudflare terminates TLS with its own certificate and
Netlify cannot issue one.

### Deploy gotcha: new or renamed trips 404 until you redeploy

Each detail route sets `export const dynamicParams = false` (e.g.
`app/tours/[slug]/page.tsx`), so the set of valid URLs is **frozen at build time** by
`generateStaticParams`. A trip added or re-slugged in the Studio therefore 404s —
while the listing page, which is ISR with a 60s revalidate, happily links to it. If
the client reports a dead tour link, **redeploy first**. Removing `dynamicParams`
(plus a Sanity publish webhook) is the durable fix.

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
   and re-publishing updates the site (ISR revalidates within ~60s). A brand-new
   or re-slugged trip needs a **redeploy** — see the deploy gotcha above.
5. **Unpublish** to hide; **Delete** to remove. Trips are **drag-to-reorder** in the
   desk (writes `orderRank`, which the `TOURS_*` queries sort on, then title);
   reorder team members via the `order` field.

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
