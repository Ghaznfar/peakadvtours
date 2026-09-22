# PROJECT STATUS

_Last updated: 2026-09-22_

## Current phase

**Dark theme (this phase, branch `ui-premium-upgrade`, continues the visual upgrade).** Added a full light/dark theme system: CSS-variable tokens (`--background`/`--foreground`/`--card`/`--muted`/`--border`/`--ring`) that flip via a `.dark` class, a dependency-free `ThemeProvider`/`useTheme`/`ThemeToggle` (no next-themes or similar), a blocking inline script in `app/layout.tsx` for no-flash first paint, and `localStorage` persistence that respects OS preference until the user explicitly picks a theme. Applied dark styling across the header/footer/mobile-nav, all shared UI primitives (Button, Badge, Disclosure, Breadcrumbs, SectionHeading, Price), every card component, the enquiry form, and every institutional page. `typecheck`/`lint`/`build` all green; verified the compiled CSS actually contains the `.dark` rules and tokens. See "Dark theme" below for the full breakdown.

**Premium visual/animation upgrade (previous phase, same branch).** Audited the whole site's animation/perf state first (`docs/UI_ANIMATION_AUDIT.md`), got sign-off on a CSS + `IntersectionObserver`-only approach (no new animation library), then implemented: header scroll-state transition, fixed the mobile drawer's dead animation class, hero text entrance, scroll-reveal on every homepage card grid, a real gallery lightbox, and button micro-interactions. Removed one unused dependency (`styled-components`) and two unused image assets. See "UI/animation upgrade" below for the full breakdown and the audit doc for before/after reasoning.

Previous phase: **All nav/footer-linked pages now exist — no more 404s.** `/destinations`, `/about`, `/contact`, `/blog` (+ `/blog/[slug]`), `/terms`, `/privacy`, `/booking-info`, `/corporate-retreats` and a human-readable `/sitemap` are built with original placeholder content, following the existing `lib/content/` repository + Sanity-fallback pattern. **Live site currently reads from the client's configured Sanity project** (`eigm30ey`) — new local placeholder fallbacks only render when Sanity is unconfigured or empty of that content type. Real K2/Hunza/Skardu/Kalash/Karakoram trip + destination content has since been pushed directly into that Sanity project (see git history). Next: write Vitest/Playwright coverage for the new pages and the new `Reveal`/`Gallery`/`HeaderShell` components, then a real-content pass (testimonials/credentials/enquiry delivery still placeholder).

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

### Listing system (this phase)

- **Data model extended:** `Trip` gained `description`, `gallery`, `badge`; added 2 festival-tagged trips (10 total). New repo fn `getTripsByTag`.
- **Filter engine** (`lib/trips/filters.ts`): pure, framework-free `parseTripQuery` (validates + drops invalid values), `filterTrips`, `sortTrips`, `filterAndSortTrips`, `parsePage`, `serializeTripQuery`, `activeFilterCount`, `durationBucket`. Filters: type, difficulty, season, destination, duration bucket, search (q). Sorts: recommended, price ±, altitude, duration ±. **30 unit tests pass** (`node --experimental-strip-types`).
- **TourCard:** enhanced `TripCard` (now shows season + custom `badge`) and exported as `TourCard` alias — one reusable card for tours/treks/expeditions with image, category, title, description, duration, difficulty, season, altitude, from-price, badges, dual CTA.
- **Listing UI:** `TripFilterControls` (client, props-driven — no `useSearchParams`, no Suspense needed) writes filter state to the URL; `TripListingPage` (server) reads `searchParams`, filters/sorts/paginates **server-side**, renders results as crawlable HTML. Load-more via `?page=` (cumulative, shareable). Active-filter chips, clear-all, empty state, "no match" → custom-trip CTA.
- **Pages:** `/tours`, `/treks`, `/expeditions` (category-scoped), `/festivals` (tag-scoped, type filter on), `/trips` (all, type filter on), `/custom-trips` (landing page: how-it-works steps + reused enquiry form, reads `?trip=` for context). Each has SEO metadata + canonical (filtered variants canonicalize to base) + ItemList JSON-LD + breadcrumbs. Nav/footer/sitemap updated `/customize` → `/custom-trips`.
- **Architecture decision:** filtering moved from client-only (Phase 3 homepage `TripFilter`) to **server-side over static in-memory content** for the listing routes — better SEO (cards in HTML, filtered URLs SSR) while still "no runtime DB". Listing routes are now dynamic (ƒ).
- **Verification:** typecheck/lint/build ✅; HTTP matrix ✅ — base counts (tours 5, treks 3, expeditions 2, festivals 2, trips 10), server-side filtering by every facet, search, pagination (page1=6 + load-more → 10), empty state, invalid params → ignored (HTTP 200), controls present/locked per page, canonicals correct. Mobile controls are flex-wrap/stacked (mobile-first).

### Trip detail pages (this phase)

- **Route architecture:** one reusable template rendered through **category-scoped** dynamic routes `/tours/[slug]`, `/treks/[slug]`, `/expeditions/[slug]` (thin 12-line wrappers → shared `TripDetailPage`). Festivals are category `tour`, so they live under `/tours/[slug]`. `dynamicParams = false` + per-category `generateStaticParams` means unknown **and** cross-category slugs return real 404s. Detail links come from `tripPath(trip)` (`lib/trips/href.ts`) — card links + sitemap updated from `/trips/[slug]`.
- **Data model:** `Trip` gained `depositPercent`, `goodToKnow`, plus `description`/`gallery`/`badge` (Phase 4). Three trips fully detailed (tour/trek/expedition) + a detailed festival tour; remaining trips minimal — the template renders each section conditionally. `getRelatedTrips`, `getTripSlugsByCategory` added.
- **Components** (`components/detail/`): `TripDetail` (orchestrator) + `QuickFacts`, `BookingPanel` (sticky desktop aside), `Departures` (table), `Gallery`, `StickyMobileCta` (fixed bottom bar, `lg:hidden`), `TripDetailPage` (async loader). New `Disclosure` primitive (native `<details>` — accessible accordion, keyboard nav, zero JS) powers itinerary + FAQ. `Enquiry` section extended with prefill/context/heading props and reused on detail pages (DRY).
- **All 27 sections:** breadcrumb, hero image, title, location, category, duration, difficulty, max altitude, season, price, enquiry + WhatsApp CTAs, overview, highlights, itinerary, included/excluded, accommodation, departures, pricing, gallery, location panel, important info, FAQs, related trips, enquiry form, final CTA.
- **SEO:** dynamic `generateMetadata` (title/description/canonical/OG/Twitter, hero as social image); JSON-LD `TouristTrip` + `Offer` (omitted when price-on-request), `FAQPage`, `BreadcrumbList`. Single `<h1>` per page; `<h2>` per section.
- **Verification:** typecheck/lint/build ✅; SSG prerender (tours 5, treks 3, expeditions 2). HTTP matrix ✅ — tour/trek/expedition/festival + minimal-content pages render; itinerary/FAQ `<details>` accordions, included/excluded, departures, gallery, sticky panel/CTA present; JSON-LD (TouristTrip/Offer/FAQPage/Breadcrumb) + canonical + og:image present; price-on-request omits Offer; **404 guard** returns 404 for unknown and cross-category slugs; card links + sitemap now category-scoped.

### Enquiry/contact system (this phase)

- **Shared Zod schema** (`lib/enquiry/schema.ts`): all fields (name, email, phone, country, destination, start date, adults, children, hotel, budget, message, consent) + tracking (tripSlug/tripTitle/source) + anti-spam (honeypot `company`, `elapsedMs`). Validated on **both** client (RHF `zodResolver`) and server (route handler) — one source of truth.
- **Form** (`components/EnquiryForm`): React Hook Form + Zod; accessible (labels, `aria-invalid`, `aria-describedby`, focused error summary), loading + success + failure states, honeypot + time-trap, privacy notice + link. **Trip/source tracking**: auto-attaches the trip on detail pages (props) and reads `?source=`/`?trip=` from the URL as fallback (e.g. `/tours/x?source=enquiry`). Threaded through the `Enquiry` section on home (`source=home`), custom-trips (`custom-trips[:slug]`) and detail pages (`trip-detail:slug`).
- **API** (`app/api/enquiry/route.ts`): server-side Zod validation (422 + `fieldErrors`), honeypot + time-trap (silent 200), IP rate-limit (5/min → 429), malformed JSON (400). Returns typed JSON.
- **Delivery architecture** (`lib/enquiry/delivery.ts`, `server-only`): pluggable channels — `log` (always on, no setup), `email` (Resend REST, `RESEND_API_KEY`+`ENQUIRY_TO_EMAIL`), `webhook` (`ENQUIRY_WEBHOOK_URL` → CRM/WhatsApp/automation). DB channel is a documented drop-in. **No secrets reach the browser.** Simplest production-safe default = log; email/webhook enable via env with zero code change.
- **Verification:** typecheck/lint/build ✅; **16 schema unit tests** ✅; API HTTP matrix ✅ — valid→200+id, missing/invalid-email/invalid-phone/no-consent→422 (+fieldErrors), honeypot & time-trap→200 (discarded, not delivered), malformed→400, rate-limit→5×200 then 429; log channel captured leads with `Source:` tracked.

### Sanity CMS (this phase)

- **Packages:** `sanity@6.15.0`, `next-sanity@13.3.4`, `@sanity/vision@6.15.0`, `@sanity/image-url@2.1.1`.
- **Schemas** (`sanity/schemaTypes/`): documents `tour` (full: all quick-facts, itinerary, included/excluded, departures, faqs, gallery, SEO, relationships to destinations + related tours), `destination`, `category`, `testimonial` (consent-gated), `teamMember` (orderable), `blogPost` (portable text), `siteSettings` (singleton); shared objects `imageWithAlt`, `seo`, `priceType`, `itineraryDay`, `departure`, `highlight`, `infoBlock`, `faq`. Validation on required/important fields; grouped tour form + desk `structure` for a friendly editor UX.
- **Studio:** standalone (`npm run studio:dev` → :3333, `npm run studio:deploy` → `*.sanity.studio`) — **not embedded** (Sanity Studio + Next 16 Turbopack RSC don't co-build; `swr` react-server export clash). `sanity.config.ts` + `sanity.cli.ts`.
- **Data layer:** `lib/content/` split into `tours/destinations/categories/testimonials/team/blog/site/marketing`; each reads Sanity (`sanity/client.ts` + `sanity/queries.ts`, published perspective, ISR 60s) when `NEXT_PUBLIC_SANITY_PROJECT_ID` set, else **local seed fallback**. Public API preserved (`getAllTrips`, `getTripBySlug`, …) + new aliases (`getTours`, `getFeaturedTours`, `getDestinationBySlug`, `getTeamMembers`, `getBlogPosts`, `getSiteSettings`). **UI imports only from `@/lib/content`** — never `@/sanity/*`.
- **Images:** `cdn.sanity.io` allow-listed in `next.config`; GROQ projects `src`/`alt`/dimensions/`lqip` blur.
- **Env & secrets:** documented in `.env.example` + README; `NEXT_PUBLIC_SANITY_*` are public read-only; no tokens committed (`.env*.local` gitignored). `scripts/sanity-check.mjs` connection tester (`npm run sanity:check`).
- **Verification done here:** typecheck/lint/build/format ✅ (against installed Sanity packages); fallback rendering ✅ (home, `/tours` 5 cards, trek detail with itinerary, `next/image`); missing tour → 404 ✅; empty blog when unconfigured ✅.
- **Pending (needs client's Sanity project + env — manual):** live connection test, fetching from Sanity, draft-vs-published behavior, Sanity image rendering. Run `npm run sanity:check` and browse the site after setting env + adding CORS.

### Institutional pages (this phase)

- **Blog:** `lib/content/blog.data.ts` (3 original placeholder posts) + `blog.ts` updated to fall back to local seed when Sanity is unset, matching the `destinations`/`team` pattern. New `BlogCard` composite (`components/BlogCard/`). `/blog` (listing, empty-state aware) + `/blog/[slug]` (detail, `generateStaticParams`, 404 on unknown slug, `dangerouslySetInnerHTML` for the placeholder HTML body — same trust boundary as trip FAQs, not user input).
- **`/about`:** reuses existing `WhyChooseUs`, `Stats`, `Team`, `Credentials` sections (same data as homepage) + original story copy + closing `CtaBanner`.
- **`/contact`:** reuses the `Enquiry` section (`source="contact"`) — already has phone/email/hours/address/WhatsApp, so no new contact-details component was needed.
- **`/corporate-retreats`:** new landing page (footer-linked, not in original phase docs) — pitch + 3 feature cards + `Enquiry` (`source="corporate-retreats"`), same shape as `/custom-trips`.
- **`/terms`, `/privacy`, `/booking-info`:** original placeholder legal copy (clearly marked `PLACEHOLDER` where jurisdiction-specific input is required) +, on `/booking-info`, a 4-step how-it-works list and an FAQ `Disclosure` accordion with `FAQPage` JSON-LD (`faqSchema`, reused from trip detail).
- **`/sitemap`:** new human-readable sitemap page (distinct from `app/sitemap.ts`'s generated `/sitemap.xml`), grouped links across explore/destinations/company/legal/trips.
- **`app/sitemap.ts`:** added `/corporate-retreats` to the static route list and blog posts to the generated XML sitemap.
- **Verification:** `typecheck`/`lint`/`build` all clean; production server HTTP smoke-check — all 9 new routes return 200 with exactly one `<h1>`.
- **Not done in this phase:** Vitest/Playwright tests for the new pages (CLAUDE.md §10), visual QA, and populating the client's live Sanity project with real blog/team content (it currently has only test/placeholder documents, e.g. a destination titled "Destinations 2").

### UI / animation upgrade (this phase, branch `ui-premium-upgrade`)

- **Audit first, per the brief:** `docs/UI_ANIMATION_AUDIT.md` — read-only pass over the whole component tree before any edit. Found: no animation library installed, only 6 client components total (all correctly scoped), zero scroll-listener/`IntersectionObserver` code anywhere, reduced-motion already handled globally. Also found 3 concrete bugs/dead code: a `tailwindcss-animate` class on `MobileNav` that does nothing (plugin never installed), one unused hero image (~190KB) and one unused SVG, and an unused `styled-components` dependency.
- **Architecture decision (confirmed with the client before implementing):** no Framer Motion/GSAP — everything built with CSS `transform`/`opacity` transitions plus two small custom primitives, matching the codebase's existing "zero client JS unless genuinely interactive" convention.
- **New primitives:** `components/animation/Reveal/` (client, single `IntersectionObserver`, fade+translateY on enter, `prefers-reduced-motion`-aware, renders visible immediately if `IntersectionObserver` is unavailable) and `lib/hooks/useScrolled.ts` (passive scroll listener, one boolean).
- **Header:** new `components/layout/SiteHeader/HeaderShell.tsx` — thin client wrapper using `useScrolled`, so only the header's outer shell hydrates; nav/logo/dropdowns stay server-rendered. Transparent → solid background + shadow on scroll.
- **Mobile nav:** fixed the dead `animate-in` class; overlay and drawer now use real CSS `@keyframes` (`overlay-fade-in/out`, `drawer-slide-in/out` in `app/globals.css`) keyed off Radix's `data-state`, so both open *and* close animate.
- **Hero:** headline/CTA/chips/trust-strip now stagger in with a `fade-up` keyframe on load (pure CSS, no JS, no delay to interactivity — buttons are clickable immediately).
- **Scroll-reveal applied to:** `CategoryCards`, `FeaturedTrips`, `DestinationShowcase`, `WhyChooseUs`, `Stats`, `Team`, `Testimonials`, `Credentials` — each card/stat staggers in via `Reveal`, capped stagger (`i % N`) so a long grid doesn't have a multi-second cascade.
- **Gallery lightbox:** `components/detail/Gallery.tsx` rewritten as a client component — click any thumbnail to open a full-size Radix `Dialog` viewer with prev/next, arrow-key navigation, Escape-to-close, focus trap/return (all via Radix, same proven pattern as `MobileNav`).
- **Button micro-interactions:** shared `Button` component gets a subtle `active:scale-[0.97]` press effect (disabled under reduced motion), on top of its existing hover/focus states — applies everywhere in the app for free.
- **Testimonials decision:** kept as a calm static grid + scroll-reveal, not a carousel (confirmed with the client) — avoids the a11y overhead of pause/prev/next/swipe for content that already fits without scrolling.
- **Page transitions (Phase 12):** intentionally skipped. Next.js App Router doesn't have a lightweight built-in primitive for this without either heavier client routing wrappers or the still-experimental View Transitions API — not worth the risk/complexity for this stack right now.
- **Cleanup:** removed unused `styled-components` dependency; deleted `public/images/stock/hero-mountain-sunrise.jpg` and `public/images/hero.svg` (confirmed zero references first).
- **Verification:** `typecheck`/`lint`/`build` all clean; fresh production build smoke-tested (all routes 200, hero fade-up/header/Reveal classes confirmed present in rendered HTML).
- **Not verified in this phase:** the gallery lightbox specifically — none of the trip documents currently in the live Sanity dataset have a populated `gallery` array yet, so it renders (inert, no crash) but hasn't been visually exercised against real images. Also no Lighthouse/Core Web Vitals run yet, and no automated tests for the new components.

### Dark theme (this phase)

- **Tokens:** `app/globals.css` — `--background`, `--foreground`, `--card`, `--card-foreground`, `--card-elevated`, `--muted`, `--muted-foreground`, `--border`, `--ring`, defined in `:root` (light) and overridden under `:root.dark`. Exposed as Tailwind utilities (`bg-background`, `text-foreground`, etc.) via a `@theme inline` block, since their values must stay runtime-switchable rather than fixed at build time like the existing brand/accent scales. `@custom-variant dark (&:where(.dark, .dark *))` enables `dark:` variants throughout (Tailwind v4's manual-toggle recipe).
- **Palette:** deliberately not pure black — three surface levels (`background` #0a0d12 < `card` #10141a < `card-elevated` #161b22), a slightly navy-tinted charcoal echoing the brand navy rather than a flat gray/black. Brand blue and gold accents get lighter `dark:` shades where needed for contrast (e.g. `brand-400` instead of `brand-600`); gold accent needed no change (already reads well on dark).
- **Theme system:** `components/theme/ThemeProvider/` (context + `useTheme`) and `components/theme/ThemeToggle/` (sun/moon icon button) — both hand-rolled, no dependency added. A blocking inline script in `app/layout.tsx` (`THEME_INIT_SCRIPT`) sets the `.dark` class before hydration to avoid a flash; `suppressHydrationWarning` on `<html>` since that's an intentional client/server mismatch, not a bug.
- **Persistence:** `localStorage` once the user manually toggles; before that, live-tracks `prefers-color-scheme` via a `matchMedia` listener so an OS-level theme change is still respected until the user makes an explicit choice.
- **Toggle placement:** desktop — in `SiteHeader`'s utility actions row; mobile — inside `MobileNav`'s drawer header, next to the close button.
- **Applied across:** `SiteHeader`/`HeaderShell`, `MobileNav`, `SiteFooter`, `Button` (all variants), `Badge` (all tones), `Disclosure`, `Breadcrumbs`, `SectionHeading`, `Price`, `EnquiryForm` (inputs, checkbox, error/success states, all previously browser-default-white), every card component (`TripCard`, `BlogCard`, `DestinationCard`, `TestimonialCard`, `ValuePropCard`, `TeamCard`), `CategoryCards`, and every institutional page (`/about`, `/contact`, `/terms`, `/privacy`, `/booking-info`, `/corporate-retreats`, `/sitemap`, `/blog` + `/blog/[slug]`, `/destinations` + `/destinations/[slug]`, `/custom-trips`, `/not-found`) via a scripted batch pass over the common literal-color classes (`text-slate-*`, `border-slate-*`, `bg-white`, `bg-slate-50`, `text-brand-700/800`), then spot-checked for correctness.
- **Intentionally left unchanged:** `AnnouncementBar` and `CtaBanner` (already permanently dark/brand-colored bands, theme-agnostic by design), `Hero`/`HeroSlideshow` (already a dark-gradient-over-image treatment regardless of site theme — inherently "cinematic" already), `WhatsAppButton` (brand green works on both).
- **Verification:** `typecheck`/`lint`/clean `build` all pass; confirmed in the compiled CSS output that `.dark` rules and the new tokens are actually present; smoke-tested key routes at 200 with the theme-init script and toggle both present in the rendered HTML.
- **Not done in this phase:** no real browser check of the toggle's click behavior or system-preference live-switching (would need a browser, not just HTTP checks); no automated tests for `ThemeProvider`/`ThemeToggle`; no Lighthouse/contrast-ratio audit run against the dark palette specifically; `Gallery` lightbox backdrop was already dark by design so needed no change, but wasn't re-verified against real images in this pass either.

## Next task

**Testing pass:** add Vitest coverage for `BlogCard` + the blog repository functions, `ThemeProvider`/`ThemeToggle`, and Playwright coverage for the institutional pages (nav → page → form/FAQ interaction) and theme toggle (persistence across reload, system-preference respect), per CLAUDE.md §10. Then a real-content pass once the client supplies copy/photos/team bios.

## Known issues / follow-ups

- **No automated tests yet for the institutional pages** (`/about`, `/contact`, `/blog`, `/terms`, `/privacy`, `/booking-info`, `/corporate-retreats`, `/sitemap`) — verified via typecheck/lint/build + HTTP smoke-check only, same as prior phases before their test pass.
- **Legal pages (`/terms`, `/privacy`) contain original placeholder text with explicit `PLACEHOLDER` markers** for jurisdiction-specific clauses (cancellation scale, governing law, payment methods, cookie tools) — must be reviewed by a qualified lawyer before launch, not just filled in.
- **Visual responsive QA pending:** no browser tooling this session, so desktop/tablet/mobile were verified structurally (HTML/semantics/overflow scan + mobile-first classes) rather than by screenshot. Recommend a visual pass at 375 / 768 / 1440px before launch.
- **Enquiry delivery:** works out of the box via the log channel; to receive leads set `RESEND_API_KEY`+`ENQUIRY_TO_EMAIL` (email) and/or `ENQUIRY_WEBHOOK_URL` (CRM/WhatsApp) in the host env. Rate-limit is in-memory (per instance) — swap for Upstash/Redis for strict multi-instance limits. Optionally add a CAPTCHA (Turnstile) later.
- **React lint gotchas:** dynamic content icons must go through `DynamicIcon` (`createElement`), never `const X = resolveIcon(...)` then `<X/>`; never call `setState` synchronously inside a `useEffect` (`react-hooks/set-state-in-effect`) — adjust during render (guarded); avoid reading refs / calling impure fns (`Date.now`) inside functions passed to hooks in render (`react-hooks/refs`, `react-hooks/purity`) — use lazy state or scope-local disables.

## Known issues / open questions (for client)

- **CMS: DECIDED → Sanity.** ✅ Resolved. See "Decisions made" below. Content self-editing via Sanity Studio; no custom admin, no app DB, no app auth.
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
- **Content:** one `Trip` type with `category = tour|trek|expedition`; content behind `lib/content/` repository (CMS-swappable). All branding in `site.config.ts`.
- **CMS (decided 2026-09-17):** **Sanity**. Content management = **Sanity Studio** (embedded at `/studio`); website reads content via the **Sanity API/client** behind `lib/content/`. Explicitly: **no custom admin dashboard**, **no runtime application database** for CMS, **no application admin authentication** (auth/roles are Sanity's, managed in sanity.io). The repository falls back to local seed data when Sanity env vars are unset, so the site builds/runs without a live project. _Rationale: self-service editing for a non-technical client without building/securing bespoke auth + DB; hardened, audited editing UI out of the box._
- **Trip detail route:** unified `/trips/[slug]`; `/tours`, `/treks`, `/expeditions` are category-filtered views of one listing template.
- **Filtering:** client-side + URL-synced over static data; no runtime DB.
- **Scope:** lead-gen/enquiry site; no payments/accounts/live inventory in v1.
- **Quality gates:** WCAG 2.2 AA; LCP<2.5s/CLS<0.1/INP<200ms; Lighthouse ≥90 in CI.
- **Originality:** strict no-copy policy; all seed content is placeholder; no fabricated reviews/ratings. (See `CLAUDE.md §2`.)

## Deployment (Vercel) — fixed 2026-09-18

- **Root cause of stale live site:** the Vercel project (`peakadvtour`) was Git-connected to the **wrong repo** (`Ghaznfar/peakadvtour`, no "s") while all commits went to `Ghaznfar/peakadvtours`. No push ever reached the watched repo, so auto-deploy never fired — only 3 manual `vercel --prod` deploys existed total.
- **Fixed:** granted the Vercel GitHub App access to `peakadvtours` (github.com/settings/installations), then `vercel git connect` succeeded. Pushes to `main` now auto-deploy.
- **Also fixed:** Production had **zero environment variables** set (the dashboard's "upgrade to Pro" prompt had blocked adding them there). Added via CLI instead (`vercel env add … production`) — confirms it was a UI-only quirk, not a real plan limit: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SITE_URL` (= `https://peakadvtour.vercel.app`).
- **Manually redeployed** current `main` to production to apply the above immediately (logo, navy/gold rebrand, `/destinations` pages, real contact/social info).
- Real logo (`public/images/brand/logo.jpg`, also `app/icon.jpg` favicon) and site color tokens (`app/globals.css`) were rebranded to navy (#031623–#f0f9ff) + gold (#da950b–#fcba36), sampled directly from the logo's pixels.

## Pre-launch checklist (track later)

- [ ] All `PLACEHOLDER` values replaced (run placeholder scan) — now includes `/terms` and `/privacy` clauses
- [x] Real branding in `site.config.ts` (name, logo, colors, contact, socials)
- [x] No more 404s on nav/footer-linked pages (all built with placeholder content)
- [ ] Real trips/destinations/blog/team content + licensed images with alt text
- [ ] Real, consented testimonials + credentials
- [ ] Forms deliver to client inbox/CRM; spam protection live (RESEND_API_KEY/ENQUIRY_TO_EMAIL still unset)
- [ ] SEO: metadata, JSON-LD (real data), sitemap, robots, redirects
- [ ] Lighthouse ≥90 + axe clean on key templates
- [ ] Analytics + Search Console connected; domain/SSL configured
- [x] Vercel env vars set (Sanity + site URL) — production
- [x] Vercel Git auto-deploy connected to correct repo
