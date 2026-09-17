# PeakAdventure Tours

A professional travel/tourism website (tours, treks, expeditions, festivals + custom
trips) built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**, with
content managed in **Sanity CMS**.

> All brand names, copy, prices, images and contact details in the repo are
> **placeholders** — replace before launch. See `CLAUDE.md` for standards and rules.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

The site runs **without Sanity** out of the box — the content layer falls back to
local seed data when Sanity env vars are unset. Add Sanity to enable self-service
editing.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run format` | Prettier |
| `npm run studio:dev` | Run Sanity Studio standalone (also embedded at `/studio`) |
| `npm run studio:deploy` | Deploy Studio to `*.sanity.studio` (optional) |

## Environment variables

Documented in `.env.example`. Never commit real values — `.env*.local` is gitignored.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | for CMS | Sanity project id (public, read-only) |
| `NEXT_PUBLIC_SANITY_DATASET` | for CMS | Dataset (default `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | for CMS | API date (default `2024-10-01`) |
| `SANITY_API_READ_TOKEN` | optional | Secret token, only if enabling draft preview |
| `NEXT_PUBLIC_SITE_URL` | prod | Canonical/OG/sitemap base URL |
| `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` | optional | Email enquiries (Resend) |
| `ENQUIRY_FROM_EMAIL` | optional | From address for enquiry emails |
| `ENQUIRY_WEBHOOK_URL` | optional | CRM / WhatsApp automation webhook |

## Content management (Sanity)

- **Editing UI:** Sanity Studio, run as a standalone app:
  - **Local:** `npm run studio:dev` → <http://localhost:3333>
  - **Hosted (recommended for the client):** `npm run studio:deploy` →
    `https://<your-project>.sanity.studio` (a URL editors bookmark).
  Editors sign in with their sanity.io account — **auth and roles are managed in
  Sanity**; the app has no custom login, admin dashboard, or database.
  _(The Studio is intentionally not embedded in the Next app: Sanity Studio and
  Next 16's Turbopack RSC build don't co-exist cleanly, and a standalone/hosted
  Studio is the simpler, well-supported option.)_
- **Schemas:** `sanity/schemaTypes/` — `tour`, `destination`, `category`,
  `testimonial`, `teamMember`, `blogPost`, `siteSettings`, plus shared objects.
- **Studio config:** `sanity.config.ts` (Studio) and `sanity.cli.ts` (CLI).

### One-time Sanity setup (manual)

1. Create a project at <https://sanity.io> (or `npx sanity login` then `npx sanity init --env`).
2. Put the project id + dataset in `.env.local` (see above).
3. Add your site URL(s) as **CORS origins** so the website can read content
   (sanity.io → project → API → CORS origins). The Studio's own origins
   (`http://localhost:3333` and `*.sanity.studio`) are handled automatically.
4. Run `npm run studio:dev` (or `npm run studio:deploy`) and sign in. Create content.

### How to create / edit / publish a tour

1. Open the Studio (`npm run studio:dev` → localhost:3333, or your hosted
   `*.sanity.studio`) → **Tours / Treks / Expeditions** → **Create**.
2. Fill in the fields (grouped: Main, Details, Itinerary & pricing, Media, SEO).
   Set the **category**, add **destinations** (references), a **hero image** (with
   alt text), price, itinerary, etc.
3. Click **Publish**. The website reads only **published** documents, so drafts
   stay private. Editing a published doc and re-publishing updates the site
   (ISR revalidates within ~60s).
4. **Unpublish** to hide; **Delete** to remove. Reorder team members via the
   `order` field; tours order by *featured* then title (or your sort).

## Architecture

- **Frontend never talks to Sanity directly.** UI/pages import typed functions
  from `lib/content/` (the repository seam): `getTours`, `getTourBySlug`,
  `getFeaturedTours`, `getDestinations`, `getDestinationBySlug`, `getTestimonials`,
  `getTeamMembers`, `getBlogPosts`, `getSiteSettings`, etc. (plus back-compat
  aliases `getAllTrips`, `getTripBySlug`, …).
- Those modules read from Sanity (`sanity/client.ts` + `sanity/queries.ts`) when
  configured, else return local seed data (`lib/content/*.data.ts`).
- Images use `next/image` against Sanity's CDN (`cdn.sanity.io`, allow-listed in
  `next.config.ts`) with `lqip` blur placeholders.

See `docs/` for the full plan, data model, SEO and phases; track progress in
`PROJECT_STATUS.md`.
