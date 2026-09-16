# PROJECT STATUS

_Last updated: 2026-09-16_

## Current phase

**Planning — awaiting client approval of the technical plan.**
No application code written yet (by design). Documentation set complete.

## Completed work

- Reference site analyzed (structure/UX/IA only — no content copied): homepage, category pages, unified trip detail (`/trips/<slug>`), trekking, expeditions, blog, customize/contact forms, footer, trust/credential sections.
- Authored planning docs:
  - `docs/PROJECT_PLAN.md` — purpose, goals, tech stack, scope, risks
  - `docs/SITE_ARCHITECTURE.md` — routes, templates, section breakdowns, rendering strategy
  - `docs/COMPONENT_ARCHITECTURE.md` — component layers, primitives/composites/sections, a11y contract
  - `docs/DATA_MODEL.md` — content schemas, `site.config.ts`, form payloads, CMS migration path
  - `docs/SEO_PLAN.md` — technical/on-page SEO, structured data, CWV, image SEO
  - `docs/IMPLEMENTATION_PHASES.md` — 9 phases (0–8) with complexity estimates
  - `CLAUDE.md` — standards, rules, originality guardrails, session instructions
  - `PROJECT_STATUS.md` — this file

## Next task

1. **Get client approval** on: tech stack, folder structure, content model, page list, component list, phases.
2. On approval → **Phase 0 (Foundation & tooling)**: scaffold Next.js 15 + TS + Tailwind + testing + CI, design tokens, `site.config.ts`, `types/content.ts`, `lib/content/` interface, base layout.

## Known issues / open questions (for client)

- **CMS now or later?** v1 ships file-based content behind a repository interface; recommend migrating to **Sanity** when self-service editing is needed. Confirm preference.
- **Currency & locale:** single default currency (config); multi-currency and i18n are post-v1. Confirm default currency.
- **Map:** interactive MapLibre explorer is the riskiest UI; static fallback ships first. Confirm it's wanted for v1.
- **Form delivery:** default is Resend email + optional CRM webhook. Need client's inbox/CRM + spam-protection (Turnstile) keys.
- **Real assets:** need client logo, brand colors/fonts, photography (licensed/original), real contact details, real testimonials (with consent), real credentials.
- **Payments:** explicitly out of scope for v1 (enquiry-first). Confirm.

## Decisions made

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript. _Rationale: SSG/ISR SEO + performance + image optimization._
- **Styling:** Tailwind v4 + design tokens; Radix for accessible primitives.
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
