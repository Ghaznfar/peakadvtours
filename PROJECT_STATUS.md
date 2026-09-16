# PROJECT STATUS

_Last updated: 2026-09-16_

## Current phase

**Homepage complete.** A full, production-ready marketing homepage is built on top of the foundation and verified: `typecheck`, `lint`, and `build` all pass; homepage renders all 20 required sections; the enquiry API works end-to-end. Ready to proceed to the trip detail/listing templates.

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

### Homepage (this phase)

- **Content model extended:** added `Destination`, `Testimonial`, `TeamMember`, `Credential`, `ValueProp`, `Stat` types + placeholder seed data + repository functions (`getDestinations`, `getTestimonials`, `getTeam`, `getValueProps`, `getStats`, `getCredentials`). Expanded seed trips to 8 (varied category/effort/season/price). Testimonials are gated on `consentGiven`.
- **Composites:** `DestinationCard`, `TestimonialCard`, `TeamCard` (initials-avatar fallback), `ValuePropCard`, `TripFilter` (interactive type/effort/season/sort client island), `EnquiryForm` (accessible client form: labels, `aria-invalid`, `aria-describedby`, error summary, honeypot, success/error states), shared `SectionHeading`, `DynamicIcon` registry.
- **Sections** (`components/sections/`): `Hero` (cinematic full-bleed LCP image + dual CTA + chips + trust strip), `CategoryCards` (live counts + "from" price), `FeaturedTrips`, `FindYourTrip`, `DestinationShowcase`, `WhyChooseUs`, `Stats`, `Team`, `Testimonials`, `Credentials`, `Enquiry` (contact details + WhatsApp + form). Global `AnnouncementBar` added to layout.
- **Homepage** (`app/page.tsx`): composes all 20 required sections, data fetched via the repository (`Promise.all`), category cards + form options derived from content. Static-prerendered.
- **API:** `POST /api/enquiry` stub — validates required fields + honeypot, returns `{ok:true}` / 422 (full Zod + email delivery deferred to forms phase).
- **Verification:** typecheck ✅ · lint ✅ · build ✅. Structural QA via rendered HTML: single `<h1>`, all 11 section landmarks present, viewport meta + `lang` set, mobile-first grids (all `grid-cols-1` → scale up), no fixed-width overflow offenders, mobile menu present. API tested (valid → ok, missing → 422, honeypot → ignored); 404/robots/sitemap correct.

## Next task

**Trip detail + listing templates** (`docs/IMPLEMENTATION_PHASES.md` Phase 3): trip-detail template (`/trips/[slug]`) with all sections + Trip/Offer/FAQ JSON-LD, and listing pages (`/tours`, `/treks`, `/expeditions`, `/trips`) with URL-synced filter/sort. Add Vitest + Playwright test setup (per CLAUDE.md §10) alongside.

## Known issues / follow-ups

- **Visual responsive QA pending:** browser tooling was unavailable this session, so desktop/tablet/mobile were verified structurally (HTML/semantics/overflow scan) rather than by screenshot. Recommend a visual pass at 375 / 768 / 1440px before launch.
- **Enquiry API is a stub:** no email/CRM delivery yet, no rate-limit/CAPTCHA — hardened in the forms phase.
- **`react-hooks/static-components`:** dynamic content icons must go through `DynamicIcon` (`createElement`), never `const X = resolveIcon(...)` then `<X/>` in render.

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
