# CLAUDE.md

Guidance for any Claude (or human) working in this repository. Read this first, then `docs/`.

## 1. Project purpose

A professional travel & tourism website for a tour operator selling **tours, treks and expeditions** plus custom itineraries. It is a **lead-generation + content site** (enquiry forms + WhatsApp), not an online-payment checkout. The UX/IA is **inspired by** a reference operator site; **all branding, copy, images, prices and contact data are original, placeholder, and client-replaceable**.

Read the full plan in:
`docs/PROJECT_PLAN.md`, `docs/SITE_ARCHITECTURE.md`, `docs/COMPONENT_ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/SEO_PLAN.md`, `docs/IMPLEMENTATION_PHASES.md`. Track state in `PROJECT_STATUS.md`.

## 2. Content originality rules (MANDATORY — never violate)

- **Do NOT copy** from the reference site or any third party: no brand names, logos, taglines, proprietary marketing copy, testimonials/reviews, team bios, photographs, pricing, itineraries verbatim, or contact details.
- Use the reference **only** for structure, layout, IA and interaction patterns.
- All seed/sample content must be **clearly fictional placeholders** (e.g. "PeakAdventure Tours", `hello@example.com`, `PLACEHOLDER`).
- **Never fabricate reviews, ratings, credentials or certifications** as if real — and never emit `Review`/`AggregateRating` JSON-LD for content that isn't a genuine, consented review.
- Images must be original, client-supplied, or properly licensed (with attribution where required). No hotlinking or scraping third-party images.
- If asked to "make it look like [reference]", replicate **layout/behavior**, not their **assets/text**.

## 3. Coding standards

- **TypeScript strict**; no `any`, no non-null `!` abuse, no unchecked `as`. Explicit prop interfaces.
- **Server Components by default**; `"use client"` only for interactivity (filters, carousel, accordion, forms, map, mobile nav). Keep client bundles small.
- Tailwind for styling + shared design tokens; component variants via `cva`. No inline magic numbers — use tokens/scale.
- No hardcoded brand/contact/currency/social values in components — read from `site.config.ts`.
- No content hardcoded in components — fetch via `lib/content/` repository functions only.
- Pure, presentational components don't import the content layer; pages (containers) do the fetching and pass typed props down.
- Small, composable functions; early returns; handle loading/empty/error states.
- Format with Prettier; pass ESLint before commit. Keep imports ordered and absolute (`@/…`).

## 4. Architecture rules

- Layers: `primitives → composites → sections → templates(pages)`. Dependencies point downward only.
- Data access isolated in `lib/content/` (repository pattern). **CMS is Sanity** (decided 2026-09-17): the repository reads from Sanity when configured, else local seed data. **UI/pages import ONLY from `@/lib/content`** — never from `@/sanity/*` or GROQ queries directly. Content management is Sanity Studio (`/studio`); no custom admin, no app DB, no app auth. See `DATA_MODEL.md`.
- Rendering: SSG/ISR for content pages (`generateStaticParams` + `revalidate`); route handlers for forms/sitemap/robots. See `SITE_ARCHITECTURE.md §4`.
- Filter/sort state is **client-side + URL-synced** (`?effort=…&sort=…`), operating over statically-embedded data — no runtime DB.
- One `Trip` content type with `category: tour|trek|expedition`; do not create three parallel templates.
- Forms use one shared Zod schema (client RHF + server route handler validate the same shape).

## 5. Component rules

- One component per folder: `Name/Name.tsx` + `Name.test.tsx` + `index.ts`.
- Typed `interface NameProps`; no implicit any; document non-obvious props.
- Every interactive component: keyboard support, ARIA, focus management, and a test.
- Reuse primitives; do not re-implement buttons/inputs/cards. Prefer Radix for menus/dialogs/accordions/tabs.
- `TripCard` and `EnquiryForm` are context-configurable and must stay category/context-agnostic.
- Respect `prefers-reduced-motion` in all animation.

## 6. Naming conventions

- Components/types: `PascalCase`. Hooks: `useCamelCase`. Utils/vars: `camelCase`. Constants: `SCREAMING_SNAKE_CASE`.
- Files match the export. Folders `kebab-case` for routes, `PascalCase` for component dirs.
- Content slugs: lowercase-hyphenated, stable across seasons (add redirects if renamed).
- Booleans read as predicates (`isFeatured`, `hasDepartures`).

## 7. Responsive requirements

- Mobile-first; Tailwind breakpoints `sm/md/lg/xl/2xl`.
- Nav → drawer below `lg`. Trip grids 1→2→3 cols. No horizontal page scroll; wide tables/maps scroll inside their own container.
- Tap targets ≥ 44px; fluid type via `clamp()`; test at 320px, 375px, 768px, 1024px, 1440px.
- Sticky desktop price box → sticky bottom CTA bar on mobile.

## 8. SEO requirements (see `SEO_PLAN.md`)

- Exactly one `<h1>`/page; semantic landmarks; descriptive alt on every image; descriptive anchor text.
- `generateMetadata` per template: unique title + 140–160-char description + canonical + OG + Twitter.
- JSON-LD: Organization/TravelAgency, WebSite, BreadcrumbList, Trip/Product+Offer, FAQPage, TouristDestination, Article — **real data only**.
- Generated `sitemap.xml`, `robots.txt`, RSS. Clean stable URLs. Redirects for renamed slugs.
- Internal linking hub-and-spoke (destination ↔ trips ↔ guides).

## 9. Accessibility requirements

- Target **WCAG 2.2 AA**. Test with axe + keyboard + screen reader.
- Visible focus, logical order, Escape closes overlays, focus trap + return in dialogs/drawers.
- Labels + `aria-describedby` + `aria-invalid` on all form fields; error summary on submit.
- Color contrast ≥ 4.5:1 (text) / 3:1 (large/UI). Don't rely on color alone.
- Carousel: controls, pause, no autoplay-only meaning, reduced-motion aware. Decorative icons `aria-hidden`.

## 10. Testing requirements

- **Unit** (Vitest + Testing Library): primitives, composites, utils, content repository, Zod schemas.
- **E2E** (Playwright): browse→filter→trip detail, enquiry submit (happy + validation + spam), customize form, mobile nav.
- **A11y**: axe-core in component + e2e tests; zero serious/critical violations.
- **Perf**: Lighthouse CI budgets in CI; fail on regression.
- **Content**: `scripts/validate-content.ts` (schema + alt-text + placeholder scan) runs in CI.
- Don't merge with failing typecheck/lint/tests. Add/adjust tests with every behavioral change.

## 11. Instructions for future Claude sessions

1. Read `PROJECT_STATUS.md` for current phase, next task, known issues, decisions.
2. Follow `docs/IMPLEMENTATION_PHASES.md` order; don't skip ahead — Phase 3 (trip system) is the backbone others depend on.
3. Keep everything content/config-driven; never hardcode brand or copy.
4. When adding a component, follow §5 (folder + test + a11y) and register it where relevant (nav/sections).
5. After meaningful work: run typecheck/lint/tests, then **update `PROJECT_STATUS.md`** (completed work, next task, new decisions, issues).
6. Uphold §2 originality rules at all times — flag, don't copy.
7. Do not introduce online payments, accounts, or a runtime DB without an explicit decision recorded in PROJECT_STATUS (they're v1 non-goals).
8. Prefer editing existing files/patterns over inventing new ones; match surrounding code style.