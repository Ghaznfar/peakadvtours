# SEO PLAN

Technical + on-page + structured-data strategy. Travel sites live and die on organic search for destination and trip queries, so SEO is a first-class requirement, not an afterthought.

## 1. Technical foundations

- **Rendering:** SSG/ISR → fully-rendered HTML for crawlers, fast TTFB.
- **URLs:** clean, lowercase, hyphenated, stable. Category-scoped where it aids intent (`/trips/[slug]`, `/destinations/[slug]`, `/blog/[slug]`). Avoid query-string-only content.
- **Canonicals:** every page emits a self-referential `<link rel="canonical">`; filtered listing URLs (`/trips?effort=…`) canonicalize to the base listing to avoid duplicate-content dilution (or `noindex` the deep filter combos while keeping them crawlable/shareable).
- **Sitemaps:** generated `sitemap.xml` (route handler) from the content layer, split if >50k URLs; include `lastmod` from `updatedAt`. Human `/sitemap` page too.
- **robots.txt:** generated; allow crawl, point to sitemap, disallow `/api/`.
- **Pagination:** listing "load more" keeps content in initial HTML; if true pagination is added, use crawlable `?page=` links.
- **404/410:** proper status codes; helpful custom 404.
- **Redirects:** `next.config` redirect map for any renamed slugs (client will rename trips year to year — keep a redirects table).
- **Trailing slash + www/non-www:** enforce one canonical host + scheme (301).
- **hreflang:** not in v1 (single locale), but metadata factory leaves a hook for it.

## 2. Metadata (per template)

Use Next.js `generateMetadata` factories (`lib/seo/`), fed by the content `Seo` block with sensible fallbacks:

| Template | Title pattern | Description source |
|---|---|---|
| Home | `{siteName} — {tagline}` | config |
| Category | `{Category} {year} \| {siteName}` | category.intro |
| Trip detail | `{title} — {durationDays} days \| {siteName}` | trip.summary |
| Destination | `{name} Travel Guide & Tours \| {siteName}` | destination.intro |
| Blog post | `{title} \| {siteName} Blog` | post.excerpt |
| Contact/About | descriptive | config |

Each also sets: canonical, Open Graph (title/description/image/type), Twitter card (`summary_large_image`), `og:image` (per-trip hero or generated OG image via `opengraph-image.tsx`).

## 3. Structured data (JSON-LD) — high priority

Emit via `<JsonLd>` server components:

| Type | Where | Key fields |
|---|---|---|
| `Organization` / `TravelAgency` | site-wide (root) | name, logo, url, contactPoint, address, sameAs (socials) |
| `WebSite` + `SearchAction` | root | site search box eligibility |
| `BreadcrumbList` | all deep pages | crawl + rich result |
| `Product` **or** `TouristTrip` / `Trip` | trip detail | name, image, description, `offers` (price, priceCurrency, availability), `itinerary` |
| `Offer` / `AggregateOffer` | trip detail | price, currency, validFrom, availability |
| `FAQPage` | trip detail + guides with FAQs | question/answer pairs |
| `TouristDestination` / `Place` | destination pages | name, geo, image |
| `Article` / `BlogPosting` | blog posts | headline, author, datePublished, image |
| `Review` / `AggregateRating` | testimonials (only real, consented) | rating, author — **never fabricate reviews** |

> **Integrity rule:** only mark up ratings/reviews that are genuine and consented. Fake `AggregateRating` is a policy violation and manual-action risk.

## 4. On-page SEO

- Exactly one `<h1>` per page; logical `h2/h3` outline.
- Descriptive, keyword-aware but human titles; meta descriptions 140–160 chars.
- Internal linking: trips ↔ destinations ↔ blog guides ("Before you go"); related trips; breadcrumb links.
- Image `alt` on every image (enforced by content validation).
- Semantic HTML5 landmarks (`header/nav/main/article/section/aside/footer`).
- Descriptive anchor text (no "click here").
- Content depth: destination + guide pages target informational intent ("best time to visit", "is X safe", "packing list") that feeds the funnel.

## 5. Performance = SEO (Core Web Vitals)

Targets (mobile, 4G, mid-range device):
- **LCP < 2.5s** — hero via `next/image priority`, preload hero, no render-blocking.
- **CLS < 0.1** — width/height on all media, reserved space for embeds/ads, font `size-adjust`/`display:swap`.
- **INP < 200ms** — minimal client JS, code-split islands, defer non-critical.
- JS budget per route < ~120KB gzip; fonts subset + self-hosted.
- Enforced in CI via **Lighthouse CI** budgets (fail PR on regression).

## 6. Image SEO & optimization

- `next/image` everywhere → AVIF/WebP, responsive `srcset`, lazy (except LCP), blur placeholder.
- Descriptive filenames + alt; captions/credits where relevant.
- Serve from image CDN (Vercel/Cloudflare) with long cache TTL + content hashing.

## 7. Local & entity SEO

- `TravelAgency` + `PostalAddress` + `geo` from config.
- Google Business Profile link, consistent NAP (name/address/phone) across footer, contact, JSON-LD.
- Social profile `sameAs` links.

## 8. Content architecture for ranking

- **Hub-and-spoke:** Destination hub pages link to their trips + related guides; guides link back to trips → topical authority.
- Evergreen blog categories: Guides, Routes/Conditions, Trekking & Altitude, Planning (visas/packing/connectivity), News.
- Seasonal/year updates (e.g., "2026-27") — keep stable slugs + `updatedAt`; use redirects when renaming.

## 9. Measurement

- Search Console + sitemap submission; Analytics (consent-gated).
- Track: enquiry conversions, WhatsApp clicks, phone clicks (as goals/events).
- Rich-results + CWV monitoring; broken-link + orphan-page checks in CI.

## 10. Launch SEO checklist (excerpt)
- [ ] Canonicals + robots + sitemap valid
- [ ] All titles/descriptions unique & within length
- [ ] JSON-LD validates (Rich Results Test) with real data only
- [ ] Every image has alt; no layout shift
- [ ] Lighthouse ≥ 90 (Perf/SEO/Best Practices/A11y) on key templates
- [ ] Redirects for any legacy/renamed URLs
- [ ] No `noindex` left on production pages
