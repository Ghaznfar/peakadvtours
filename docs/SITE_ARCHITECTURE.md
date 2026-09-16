# SITE ARCHITECTURE

Information architecture, routes, page templates and per-page section breakdown. Derived from analysis of the reference site's UX patterns (structure only — no content copied).

## 1. Route map (Next.js App Router)

```
/                                  Home
/tours                             Tours category listing (category=tour)
/treks                             Treks category listing (category=trek)
/expeditions                       Expeditions category listing (category=expedition)
/trips                             Unified "Find your trip" index (all categories, filterable)
/trips/[slug]                      Trip detail (tour OR trek OR expedition)
/destinations                      Destinations overview
/destinations/[slug]               Destination detail (trips + guide content for a region)
/festivals                         Festival departures (a curated view / tag of trips)
/corporate-retreats                Corporate/group landing page
/customize                         Custom itinerary builder form
/about                             About / company story
/team                              Team (or merged into /about)
/blog                              Blog index (filter by category/tag)
/blog/[slug]                       Blog article (MDX)
/contact                           Contact + enquiry form + map + details
/booking-info                      Holiday info / terms-lite / how booking works
/terms                             Booking terms
/privacy                           Privacy policy
/sitemap                           Human sitemap page
/sitemap.xml                       Generated XML sitemap (route handler)
/robots.txt                        Generated (route handler)
/api/enquiry                       POST — enquiry/customize form handler (route handler)
/api/newsletter                    POST — newsletter signup (optional)
```

Notes:
- `/tours`, `/treks`, `/expeditions` are thin wrappers over the same `TripListing` template with a pre-applied category filter — matching the reference's separate category pages while reusing one template.
- `/trips` is the master filterable index (Type / Effort / Season / Sort), mirroring the homepage "Find your trip".
- `/festivals` and `/corporate-retreats` are **curated landing pages** built from tagged trips, not separate content types.

## 2. Global navigation

**Header (sticky):**
- Logo (config) → `/`
- Primary nav: Tours ▸, Treks ▸, Expeditions ▸, Destinations ▸, Customize, Blog, About, Contact
- Mega-menu on the category items: featured trips (image + title + short line + price) pulled from content, plus a "View all" link.
- Utility: phone (tel:), WhatsApp CTA button, social icons (config).
- Mobile: hamburger → full-screen drawer with accordion sub-menus.

**Footer (4–5 columns):**
1. Brand blurb + social icons
2. Explore (category + festival + corporate links)
3. Company (About, Blog, Booking info, Contact, Terms, Privacy, Sitemap)
4. Before you go (curated blog/guide links)
5. Head office (address, phone, email, hours) — all from `site.config.ts`
- Bottom bar: copyright, legal links, WhatsApp icon.

**Persistent:** floating WhatsApp button (bottom-right, all pages), and a sticky mobile bottom bar on trip pages ("Enquire" + "WhatsApp").

## 3. Page template breakdown

### 3.1 Home (`/`)
Sections in order:
1. **Hero carousel** — rotating slides (image + headline + subhead + CTA). Config-driven slides.
2. **Category cards** — Tours / Treks / Expeditions / Festivals: count + "from" price + link.
3. **Brand promise band** — one-line value prop + supporting text.
4. **Featured destinations** — horizontal scroll/grid of destination thumbnails.
5. **Find your trip** — filterable index (Type, Effort, Season, Sort) showing N of total, expandable. Reuses `TripFilter` + `TripCard`.
6. **Interactive trip map** — markers by trip, toggles by category. (Progressive enhancement; static fallback.)
7. **Customize CTA** — "your dates, your route" + Start itinerary + WhatsApp.
8. **Why book with us** — 6 value cards (trust props).
9. **Team teaser** — 4–5 members + link.
10. **Testimonials** — 3 review cards.
11. **Credentials / partners** — certification + exhibition logos (placeholder assets).
12. **Enquiry form** — full lead form + contact details.
13. Footer.

### 3.2 Trip listing (`/tours`, `/treks`, `/expeditions`, `/trips`)
1. Page hero (category title, intro, count, price range).
2. **Filter/sort bar** (Type — only on `/trips` —, Effort, Season, Sort). Filters are URL-synced (`?effort=moderate&season=summer&sort=price-asc`) for shareable/SEO-friendly state.
3. Responsive grid of `TripCard`s.
4. "Load more" or pagination.
5. Customize CTA band.
6. Footer.

### 3.3 Trip detail (`/trips/[slug]`) — the most important template
1. **Hero** — image/gallery, title, one-line meta (duration, start/end).
2. **Quick-facts strip** — duration, max altitude, difficulty, group size, season, accommodation, start/end city (icons + labels).
3. **Sticky sub-nav** (Overview · Itinerary · Dates · Included · FAQ) + sticky price/CTA on desktop.
4. **Overview** — narrative.
5. **Highlights** — 3–4 icon cards.
6. **Route map** — numbered waypoints (static image fallback → interactive).
7. **Departures & pricing table** — date, return, length, price, deposit, status; "private departure" note.
8. **Day-by-day itinerary** — accordion of days (title, altitude, hours, description, meals, accommodation).
9. **What's included / excluded** — two columns.
10. **Accommodation** — hotel-standard notes.
11. **Good to know** — practical guidance blocks.
12. **FAQ** — accordion (feeds FAQ structured data).
13. **Related trips** — 3 `TripCard`s (same category/destination).
14. **Booking box + enquiry form** — price, deposit, CTAs, form.
15. **Trust badges + payment methods**.
16. Footer.
- **Sticky mobile CTA bar**: "From $X · Enquire · WhatsApp".

### 3.4 Destination detail (`/destinations/[slug]`)
Hero → intro/guide content (MDX) → trips in this destination (`TripCard` grid) → best time to visit → related blog guides → enquiry CTA → footer.

### 3.5 Customize (`/customize`)
Multi-section single-page form (progressive, with a live "your trip so far" summary): Travellers → Group → Timing & start city → Trip type/regions/hotel standard/budget → notes → consent. WhatsApp alternative. See `DATA_MODEL.md` for field list.

### 3.6 Blog index (`/blog`) & article (`/blog/[slug]`)
Index: category filter chips + card grid (image, category, date, title, excerpt). Article: hero, meta, MDX body with headings/TOC, author, related posts, enquiry CTA, structured data (Article/BlogPosting).

### 3.7 Corporate retreats / Festivals
Landing template: hero → value props → curated `TripCard` grid (by tag) → group enquiry form → footer.

### 3.8 Contact (`/contact`)
Intro → contact details (config) → enquiry form → map/office → hours → social → footer.

### 3.9 About / Team
Story (MDX) → stats/credentials → team grid → testimonials → CTA.

### 3.10 Legal (`/terms`, `/privacy`, `/booking-info`)
Simple MDX prose template with TOC.

## 4. Rendering strategy

| Route | Strategy |
|---|---|
| `/`, category pages, `/about`, `/contact`, legal | **SSG** (static) |
| `/trips/[slug]`, `/destinations/[slug]`, `/blog/[slug]` | **SSG + `generateStaticParams`**, **ISR** revalidate (e.g., 3600s) so content edits publish without redeploy |
| Filter/sort on listings | **Client-side** over statically-embedded data (small dataset) with URL sync; no runtime API needed |
| `/api/enquiry`, `/api/newsletter` | **Route handlers** (dynamic) |
| `sitemap.xml`, `robots.txt` | Generated at build |

## 5. Responsive & breakpoints

Mobile-first. Tailwind breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.
- Nav collapses to drawer < `lg`.
- Trip grids: 1 col (mobile) → 2 (md) → 3 (lg).
- Quick-facts strip: 2-col grid (mobile) → single row (lg).
- Sticky desktop price box becomes bottom sticky bar on mobile.
- Tap targets ≥ 44px; no horizontal scroll; fluid type via `clamp()`.

## 6. Error & edge states
- `not-found.tsx` (custom 404 with search + popular trips), `error.tsx`, `loading.tsx` skeletons per segment.
- Empty filter results state ("No trips match — reset filters / start a custom trip").
- Form success/error states and inline validation.
