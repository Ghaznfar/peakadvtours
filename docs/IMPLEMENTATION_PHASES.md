# IMPLEMENTATION PHASES

Phased build plan with scope, deliverables and **estimated complexity** per phase. Complexity scale: **S** (small/low), **M** (medium), **L** (large/high), **XL** (very high). Estimates assume one experienced full-stack Next.js developer; ranges are working-day guides, not commitments.

> Each phase ends with: typecheck clean, tests passing, Lighthouse spot-check, and a PROJECT_STATUS update. No phase begins until the previous is reviewed.

---

## Phase 0 — Foundation & tooling
**Complexity: S–M · ~2–4 days**

- Next.js 15 + TS + Tailwind v4 + ESLint/Prettier + Vitest/Playwright + Lighthouse CI.
- Design tokens (color, type scale, spacing, radius, shadows), theme (light/dark ready), global CSS reset.
- `site.config.ts` scaffold with placeholders; `types/content.ts`; `lib/content/` repository interface (returns typed mock/seed data).
- Base layout: `RootLayout`, fonts (self-hosted, subset), skip-link, `Container/Section/Grid`.
- CI: lint + typecheck + test + build + Lighthouse budget.

**Deliverable:** deployable empty shell on Vercel with tokens + config + content interface.

---

## Phase 1 — Design system & primitives
**Complexity: M · ~3–5 days**

- Build all `components/ui/` primitives (Button, Badge, Card, Accordion, Tabs, Dialog/Drawer, form fields, Price, Rating, Breadcrumbs, Prose, Skeleton, Icon).
- Variants via `cva`; a11y wiring (Radix) + tests for each interactive primitive.
- A `/dev/kitchen-sink` (or Storybook, optional) page showcasing every primitive.

**Deliverable:** documented, tested primitive library.

---

## Phase 2 — Global shell & navigation
**Complexity: M · ~3–5 days**

- `SiteHeader` (sticky, utility bar, socials, phone/WhatsApp), `MegaMenu`, mobile `Drawer` with accordion.
- `SiteFooter` (multi-column, config-driven).
- Floating `WhatsAppButton`; sticky mobile CTA scaffold.
- All nav/footer content sourced from `siteConfig`.
- 404/error/loading templates.

**Deliverable:** every page frames correctly on mobile + desktop; nav fully keyboard-accessible.

---

## Phase 3 — Trip system (core value)
**Complexity: L–XL · ~6–10 days**

- Content: `Trip` schema finalized + 6–10 seed trips across all three categories (placeholder data).
- Composites: `TripCard`(+compact), `TripQuickFacts`, `PriceBox`, `ItineraryDay`, `DeparturesTable`, `Included/ExcludedList`, `HighlightCard`, `Faq`, `RelatedTrips`, `Gallery`.
- **Trip detail template** (`/trips/[slug]`) with all sections + sticky sub-nav + sticky mobile CTA + JSON-LD (Trip/Product/Offer/FAQ/Breadcrumb) + `generateStaticParams` + ISR.
- **Listing template** + `/tours`, `/treks`, `/expeditions`, `/trips` with `TripFilterBar` + sort, URL-synced client filtering, empty state.

**Deliverable:** fully working trip browse → filter → detail flow. **Highest-risk, highest-value phase.**

---

## Phase 4 — Homepage & destinations
**Complexity: L · ~5–8 days**

- Home sections: `HeroCarousel`, `CategoryCards` (computed counts/prices), `BrandPromise`, `FeaturedDestinations`, `FindYourTrip` (reuses Phase 3 filter), `CustomizeCTA`, `WhyBookWithUs`, `TeamSection`, `TestimonialsSection`, `CredentialsSection`, `EnquirySection`.
- `TripMapExplorer` / `RouteMap` (MapLibre client island + static fallback). *Map = the trickiest sub-item; ship static fallback first.*
- Destinations overview + `/destinations/[slug]` (hub page: guide MDX + trips + related blog).

**Deliverable:** complete, content-driven homepage + destination hubs.

---

## Phase 5 — Forms & lead capture
**Complexity: M–L · ~4–6 days**

- `EnquiryForm` (RHF + Zod) with `context` prop (trip/contact/corporate) + prefill.
- `CustomizeForm` multi-section with live "your trip so far" summary.
- `/api/enquiry` route handler: Zod validate + honeypot + rate-limit + Turnstile + Resend email + optional CRM webhook; success/error UX.
- Contact page, Customize page, Corporate/Festivals landing pages.
- Newsletter (optional, flagged).

**Deliverable:** all lead funnels working end-to-end with spam protection and a11y-correct validation.

---

## Phase 6 — Blog & content pages
**Complexity: M · ~3–5 days**

- MDX pipeline (frontmatter, TOC, code/callout components, reading time).
- `/blog` index (category chips + `BlogCard` grid) + `/blog/[slug]` (Article JSON-LD, related posts, CTA).
- About/Team, legal pages (terms/privacy/booking-info), human sitemap.

**Deliverable:** publishable content system + institutional pages.

---

## Phase 7 — SEO, performance, a11y hardening
**Complexity: M–L · ~4–6 days**

- `generateMetadata` factories site-wide, canonical/OG/Twitter, all JSON-LD, `sitemap.xml` + `robots.txt` + RSS + OG image generation.
- Performance pass: image audit, JS budget, font/loading, CLS fixes; hit CWV targets.
- Accessibility audit (axe + manual keyboard/screen-reader); fix to WCAG 2.2 AA.
- Content validation script + placeholder scanner.

**Deliverable:** green Lighthouse (≥90 all categories) on key templates; a11y report; valid structured data.

---

## Phase 8 — Content handoff, QA & launch
**Complexity: M · ~3–5 days**

- Client content-editing guide (how to add a trip, swap images, change branding via `site.config.ts`, add a blog post).
- (Optional) Sanity CMS migration if client needs self-service editing — implement repository against Sanity.
- Cross-browser/device QA, analytics + Search Console, redirects, final launch checklist, domain/SSL.

**Deliverable:** launch-ready site + documented handoff.

---

## Complexity summary

| Phase | Focus | Complexity | Rough days |
|---|---|---|---|
| 0 | Foundation & tooling | S–M | 2–4 |
| 1 | Design system / primitives | M | 3–5 |
| 2 | Global shell & nav | M | 3–5 |
| 3 | **Trip system** | **L–XL** | 6–10 |
| 4 | Home & destinations | L | 5–8 |
| 5 | Forms & lead capture | M–L | 4–6 |
| 6 | Blog & content pages | M | 3–5 |
| 7 | SEO / perf / a11y | M–L | 4–6 |
| 8 | Handoff & launch | M | 3–5 |
| | **Total** | | **~33–54 days** |

Optional add-ons (post-v1): Sanity CMS (M–L), multi-language i18n (L), online payments/deposits (L–XL), live availability (XL).

## Critical path & sequencing notes
- Phases 0→1→2 are strictly sequential (foundation).
- **Phase 3 is the backbone** — do not parallelize it away; the trip data model and `TripCard`/detail template are reused by Home (4), forms (5) and SEO (7).
- Map explorer (Phase 4) is the single riskiest UI item — always ship the static fallback first, enhance later.
- SEO/perf/a11y (Phase 7) is partly continuous (bake in from Phase 1) and partly a dedicated hardening pass.
