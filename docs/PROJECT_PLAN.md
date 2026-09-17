# PROJECT PLAN

> Working codename: **PeakAdventure Tours** (all brand names, copy, prices, images and contact details are placeholders and MUST be replaced by the client before launch).

## 1. Purpose

Build a professional, high-performance travel & tourism marketing/booking-enquiry website for a tour operator. The site sells **tours, treks and expeditions**, plus custom itineraries, and captures leads through enquiry forms and WhatsApp — it is a **lead-generation and content site**, not a real-time online-payment booking engine (payments are handled offline: deposit + balance, per the operator model).

The build is **inspired by the UX, information architecture and interaction patterns** of a reference operator site (structure only). It must ship with **100% original, replaceable branding, copy, imagery, pricing and contact data**.

## 2. Goals

| Goal | Success measure |
|---|---|
| Generate qualified enquiries | Working enquiry + WhatsApp funnels on every page |
| Rank for destination/trip queries | Full technical SEO, structured data, fast Core Web Vitals |
| Let a non-technical client edit everything | All content, prices, images, and contact info in a content layer, not hardcoded |
| Look premium & trustworthy | Consistent design system, real trust signals, testimonials, team, credentials |
| Load fast on mobile in low-bandwidth regions | Image optimization, lazy loading, static generation, small JS payload |

## 3. Non-goals (v1)

- No online card payment / checkout / cart.
- No user accounts / login **for the public site or a custom admin** — content-editor auth is provided by **Sanity** (see §5; decided 2026-09-17). No bespoke admin dashboard, no application database.
- No live availability inventory sync.
- No multi-currency conversion engine (display currency is configurable, single default).
- No multi-language i18n in v1 (architecture leaves room; see SEO_PLAN).

## 4. Core content model (summary)

One primary content type — **Trip** — with a `category` of `tour | trek | expedition`. This mirrors the reference site's unified `/trips/<slug>` model and avoids three near-duplicate templates. Supporting types: **Destination**, **Category**, **Testimonial**, **TeamMember**, **BlogPost**, **Credential/Partner**, **SiteSettings**. Full schema in `DATA_MODEL.md`.

## 5. Recommended tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | SSG/ISR for SEO + speed, image optimization, file routing, huge ecosystem |
| Styling | **Tailwind CSS v4** + CSS design tokens | Fast, consistent, tiny production CSS, theming via tokens |
| UI primitives | **Radix UI** (accordion, dialog, tabs) + custom components | Accessible, unstyled, keyboard-ready |
| Content layer | **File-based typed content** (JSON/MDX) behind a repository interface, designed to swap to **Sanity CMS** | Non-technical client editing; portable; no vendor lock-in in v1 |
| Blog | **MDX** | Rich long-form content authoring with components |
| Forms | **React Hook Form + Zod** | Typed validation, accessible errors |
| Form delivery | **Next.js Route Handler → Resend (email)** + optional CRM webhook | No backend server to run |
| Maps | **MapLibre GL + OpenStreetMap tiles** (or static map images) | Free, no API key lock-in; matches "trips plotted on a map" pattern |
| Animation | **Framer Motion** (used sparingly) | Tasteful, respects reduced-motion |
| Images | **next/image** + build-time optimization; source assets in `/public` or CMS CDN | AVIF/WebP, responsive `srcset`, lazy loading |
| Analytics | **Plausible / GA4** (configurable, consent-gated) | Privacy-friendly option |
| Hosting | **Vercel** (or Netlify / Cloudflare Pages) | First-class Next.js support, edge CDN, image CDN |
| Testing | **Vitest** (unit) + **Playwright** (e2e) + **axe-core** (a11y) + **Lighthouse CI** | Quality gates |

> **Decision rationale for content layer:** v1 ships with typed local content collections so the developer can move fast and everything is version-controlled and portable. The data access is isolated behind a `content/` repository module so migrating to Sanity (recommended once the client needs self-service editing) requires changing only that module, not the components. See `DATA_MODEL.md` §"Storage strategy & CMS migration path".

## 6. High-level scope

- ~9 page templates, ~30–60 generated trip pages, ~10–30 blog posts (content-driven counts).
- ~40 reusable components (see `COMPONENT_ARCHITECTURE.md`).
- 6 implementation phases (see `IMPLEMENTATION_PHASES.md`).

## 7. Constraints & guardrails

- **No copyrighted content** from the reference or any third party: no logos, no proprietary copy, no testimonials, no photos, no contact details. See `CLAUDE.md` §"Content originality rules".
- Everything user-visible must be **swappable via the content layer + `site.config.ts`**, never hardcoded in components.
- **Accessibility:** target WCAG 2.2 AA.
- **Performance budget:** LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-range mobile / 4G; initial JS < ~120KB gzip per route.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Client accidentally ships placeholder content | Pre-launch checklist + content-completeness lint (see PROJECT_STATUS) |
| Image weight hurts CWV | Enforce next/image, size limits, AVIF, lazy loading |
| Scope creep into online payments | Explicit non-goal; enquiry-first funnel |
| CMS migration later | Repository pattern isolates data source now |

## 9. Deliverables

Docs (this set) → approved plan → phased implementation → QA (a11y/perf/SEO) → content handoff guide → launch checklist.
