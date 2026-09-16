# PROJECT STATUS

_Last updated: 2026-09-16_

## Current phase

**Foundation complete (plan Phases 0–2).** Production-quality app foundation is built and verified: `npm install`, `typecheck`, `lint`, and `build` all pass green. Ready to proceed to Phase 3 (trip system) on approval.

## Completed work

### Planning (approved)

- Reference site analyzed (structure/UX/IA only — no content copied).
- Authored planning docs in `docs/` (`PROJECT_PLAN`, `SITE_ARCHITECTURE`, `COMPONENT_ARCHITECTURE`, `DATA_MODEL`, `SEO_PLAN`, `IMPLEMENTATION_PHASES`), plus `CLAUDE.md` and this file.

### Foundation (this phase)

- **Tooling:** Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4 + ESLint (flat config) + Prettier (+ tailwind plugin). `.gitignore`, git initialised.
- **Design system** (`app/globals.css`): brand/accent/WhatsApp color tokens, fluid typography scale (`.text-display/-h1/-h2/-h3/-lead`), spacing via `Section`, standard Tailwind breakpoints, global focus-visible ring, `prefers-reduced-motion` handling.
- **Config/data layer:** `site.config.ts` (all client branding/contact/nav/social — single source), `types/site.ts`, `types/content.ts`, `lib/content/` repository (CMS seam) with placeholder seed trips, `lib/utils/` (`cn`, `format`, `whatsapp`), `lib/seo/` (`metadata` factory + `JsonLd` with Organization/WebSite schema).
- **UI primitives** (`components/ui/`, one folder each + index): `Container`, `Section`, `Button` (cva variants incl. whatsapp, `asChild`), `Badge`, `OptimizedImage` (next/image wrapper), `Price`, `Breadcrumbs` (+ BreadcrumbList JSON-LD), `CtaBanner`, local `SocialIcons`.
- **Composite:** `TripCard` (reusable tour/trek/expedition card) + `TripCardSkeleton`.
- **Layout:** `SiteHeader` (sticky; CSS-only accessible desktop dropdowns → zero JS), `MobileNav` (client drawer via Radix Dialog — focus trap/Escape/return), `SiteFooter` (config-driven), floating `WhatsAppButton`, `RootLayout` (fonts via next/font, skip link, JSON-LD).
- **Routes/SEO:** placeholder home (`/`), `loading.tsx`, `error.tsx`, `not-found.tsx` (404), generated `sitemap.ts` + `robots.ts`, root metadata architecture.
- **Verification:** typecheck ✅ · lint ✅ · build ✅ (static prerender OK).

## Next task

**Phase 3 — Trip system** (`docs/IMPLEMENTATION_PHASES.md`): finalize `Trip` content in `content/trips/*`, build trip-detail template (`/trips/[slug]`) with all sections + Trip/Offer/FAQ JSON-LD, and listing pages (`/tours`, `/treks`, `/expeditions`, `/trips`) with URL-synced filter/sort. Add Vitest + Playwright test setup (per CLAUDE.md §10) alongside.

## Known issues / open questions (for client)

- **CMS now or later?** v1 ships file-based content behind a repository interface; recommend migrating to **Sanity** when self-service editing is needed. Confirm preference.
- **Currency & locale:** single default currency (config); multi-currency and i18n are post-v1. Confirm default currency.
- **Map:** interactive MapLibre explorer is the riskiest UI; static fallback ships first. Confirm it's wanted for v1.
- **Form delivery:** default is Resend email + optional CRM webhook. Need client's inbox/CRM + spam-protection (Turnstile) keys.
- **Real assets:** need client logo, brand colors/fonts, photography (licensed/original), real contact details, real testimonials (with consent), real credentials.
- **Payments:** explicitly out of scope for v1 (enquiry-first). Confirm.

## Decisions made

- **Framework:** Next.js **16** (App Router, Turbopack) + React 19 + TypeScript. _`next@latest` resolved to 16; App Router APIs used here are unchanged from the planned 15. Rationale: SSG/ISR SEO + performance + image optimization._
- **Styling:** Tailwind v4 (CSS-first `@theme` tokens, no config file) + Radix for accessible primitives (Dialog for mobile nav).
- **Social icons:** lucide-react v1 dropped trademarked brand icons, so social glyphs are local inline SVGs in `components/ui/icons/SocialIcons.tsx` (client swaps at handoff).
- **Placeholder images:** first-party placeholder SVG rendered through `next/image` via `dangerouslyAllowSVG` + a locked-down image CSP; removed once real raster photography is supplied.
- **Desktop nav:** pure-CSS dropdowns (open on hover + keyboard focus) keep `SiteHeader` a server component with zero client JS; only the mobile drawer hydrates.
- **Content:** one `Trip` type with `category = tour|trek|expedition`; file-based content behind `lib/content/` repository (CMS-swappable). All branding in `site.config.ts`.
- **Trip detail route:** unified `/trips/[slug]`; `/tours`, `/treks`, `/expeditions` are category-filtered views of one listing template.
- **Filtering:** client-side + URL-synced over static data; no runtime DB.
- **Scope:** lead-gen/enquiry site; no payments/accounts/live inventory in v1.
- **Quality gates:** WCAG 2.2 AA; LCP<2.5s/CLS<0.1/INP<200ms; Lighthouse ≥90 in CI.
- **Originality:** strict no-copy policy; all seed content is placeholder; no fabricated reviews/ratings. (See `CLAUDE.md §2`.)

## Pre-launch checklist (track later)

- [ ] All `PLACEHOLDER` values replaced (run placeholder scan)
- [ ] Real branding in `site.config.ts` (name, logo, colors, contact, socials)
- [ ] Real trips/destinations/blog content + licensed images with alt text
- [ ] Real, consented testimonials + credentials
- [ ] Forms deliver to client inbox/CRM; spam protection live
- [ ] SEO: metadata, JSON-LD (real data), sitemap, robots, redirects
- [ ] Lighthouse ≥90 + axe clean on key templates
- [ ] Analytics + Search Console connected; domain/SSL configured
