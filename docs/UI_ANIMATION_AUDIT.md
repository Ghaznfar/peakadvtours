# UI / ANIMATION AUDIT

_Audit dated 2026-09-22, ahead of the "premium visual + animation" upgrade._

> **Status: implemented.** Both decisions in §4 and §5 were confirmed by the client (CSS + `IntersectionObserver` primitives, no animation library; testimonials stay a static grid) and built on branch `ui-premium-upgrade`. See `PROJECT_STATUS.md` → "UI / animation upgrade" for the full breakdown of what was built, verified, and intentionally left for later. This document is kept as-is below as the original audit record.

## 1. Current state summary

- **No animation library installed.** `package.json` has no `framer-motion`, `gsap`, `motion`, `@react-spring/*`, or `tailwindcss-animate`. All existing motion is Tailwind utility classes (`transition-*`, `duration-*`, `animate-pulse`/`animate-spin`) or plain CSS `transition` — zero custom `@keyframes`, zero JS-driven animation loops.
- **Only 6 client components in the whole app**: `MobileNav`, `EnquiryForm`, `TripFilter`, `TripFilterControls`, `HeroSlideshow`, and the framework-mandated `app/error.tsx`. Every one has a genuine reason to be client (real state, browser APIs, or React requirement) — the codebase already practices fine-grained server/client splitting well. `SiteHeader`, `TripDetail`, `Gallery`, `Testimonials`, `Disclosure` are all server components today.
- **Zero scroll-listener / `IntersectionObserver` code anywhere.** Scroll-reveal and header-on-scroll are net-new surface area, not a refactor.
- **Reduced-motion is already handled globally** (`app/globals.css:135-147`) — a blanket `@media (prefers-reduced-motion: reduce)` rule collapses all `transition`/`animation` durations to ~0 for every element, site-wide. Any new animation authored with standard Tailwind `transition-*`/`animate-*` utilities gets this for free, no per-component work needed.
- **Design tokens exist but are thin**: an 11-step brand navy scale + a 3-step accent gold scale, one custom radius token (`--radius-card`), fluid type via `clamp()` (`.text-display/-h1/-h2/-h3/-lead`). No custom spacing scale, no shadow scale, no easing tokens.
- **Fonts**: `Inter` (body) + `Sora` (display) via `next/font/google`, self-hosted, `latin` subset only, `display: swap`. Good baseline, no changes needed.
- **Images**: `next/image` used consistently and correctly — every `fill` usage has an explicit `sizes`; `priority` is applied only to genuinely above-the-fold images (hero slide 0, trip/destination hero, first N cards in a grid). AVIF/WebP negotiated automatically via `next.config.ts`.

## 2. Concrete issues found

| # | Issue | File | Severity |
|---|---|---|---|
| 1 | `data-[state=open]:animate-in` on the Radix Dialog overlay does nothing — `tailwindcss-animate` (the plugin that class comes from) isn't installed, so the mobile menu overlay currently pops in instantly with no fade. | `components/layout/MobileNav/MobileNav.tsx:32` | Bug (dead code) |
| 2 | The mobile drawer panel (`Dialog.Content`) has no transform/transition classes at all — it also pops in instantly rather than sliding in. | `components/layout/MobileNav/MobileNav.tsx` | Visual gap |
| 3 | Header has a static translucent/blurred background from mount — no scroll-triggered "transparent → solid" state exists yet. | `components/layout/SiteHeader/SiteHeader.tsx` | Visual gap (explicitly requested in Phase 4) |
| 4 | `Gallery` has no lightbox — it's a static grid with no click-to-enlarge, no keyboard/focus handling beyond default image semantics. | `components/detail/Gallery.tsx` | Feature gap (explicitly requested in Phase 9) |
| 5 | `Testimonials` is a static 3-card grid, not a carousel — matches this project's own `COMPONENT_ARCHITECTURE.md` aspiration loosely but not `PROJECT_PLAN.md`'s "3 review cards" framing; no autoplay/carousel exists to "calm down," it simply doesn't exist yet. | `components/sections/Testimonials/` | Design decision needed (see §4) |
| 6 | `public/images/stock/hero-mountain-sunrise.jpg` (~190KB) has zero references anywhere in the codebase — leftover from before `HeroSlideshow` replaced the old single static hero image. | `public/images/stock/` | Dead asset |
| 7 | `public/images/hero.svg` (4KB) also has zero references found. | `public/images/` | Dead asset, needs confirming before deletion |
| 8 | `styled-components` (`^6.5.3`) is a declared dependency with **zero imports anywhere** in `app/`, `components/`, or `lib/`. Dead weight, and mixing CSS-in-JS with Tailwind v4 would be the wrong tool for this codebase anyway. | `package.json` | Cleanup |
| 9 | `docs/PROJECT_PLAN.md` §5 lists "Framer Motion (used sparingly)" as the recommended animation approach, but it was never adopted — the actual codebase evolved a strong "zero extra client JS unless truly interactive" convention instead (see `SiteHeader`/`Disclosure` doc-comments). This is a real divergence between the planning doc and reality that §4 below resolves explicitly. | `docs/PROJECT_PLAN.md` | Planning drift, not a code bug |

## 3. Components that should change vs. stay as-is

**Change (visual/animation work needed):**
- `SiteHeader` — add scroll-based background/shadow transition (Phase 4).
- `MobileNav` — fix the dead `animate-in` class, add a real slide-in/fade transition for drawer + overlay (Phase 4).
- `Hero` / `HeroSlideshow` — already has a crossfade slideshow with full reduced-motion handling; only needs a lightweight text/CTA entrance on first paint (Phase 3), not a rebuild.
- `TripCard`, `DestinationCard`, `BlogCard`, `ValuePropCard`, `CategoryCards` — already have hover zoom/shadow; add scroll-entrance (Phase 6/7) via one shared primitive, not per-component logic.
- `Gallery` — needs an actual lightbox (new, focused client addition) (Phase 9).
- `Testimonials` — needs a design decision (stay a calm grid with entrance animation, vs. become a carousel) before any code changes (Phase 10, see §4).
- `Button`, `WhatsAppButton` — add subtle press/hover micro-interaction polish (Phase 11).
- Section headings across homepage/detail pages — candidates for a shared scroll-reveal wrapper (Phase 5).

**Leave unchanged (already correct, don't touch):**
- `Disclosure` (itinerary/FAQ accordion) — native `<details>`, zero JS, chevron rotation already smooth. Only tighten the transition duration if it's outside the 150–350ms guidance; do not convert to a JS accordion.
- `EnquiryForm`, `TripFilter`, `TripFilterControls` — all client components already, all correctly scoped, no animation-related changes needed beyond button/input micro-interactions covered by the shared `Button`/`Input` primitives.
- Content/data layer, Sanity integration, routing, `lib/content/*`, `lib/enquiry/*`, `lib/seo/*` — **out of scope entirely**, per the brief.
- Image `priority`/`sizes` discipline — already correct site-wide, nothing to fix.
- Global reduced-motion CSS rule — already comprehensive, keep as the safety net for everything new.

## 4. Proposed improvements — decision needed before implementation

Per the brief's own final rule ("before making major architectural changes, stop and explain"), there is exactly **one** decision that gates everything else: **which animation approach to use.**

**Recommendation: no new animation library. Build two small, reusable, CSS/IntersectionObserver-based primitives instead.**

Why, concretely:
- The existing codebase has a deliberate, documented convention of shipping **zero client JS unless something is genuinely interactive** (see `SiteHeader`'s and `Disclosure`'s own doc-comments). `PROJECT_PLAN.md` once suggested Framer Motion, but the actual build never adopted it, and the site works well without it — introducing it now for what are fundamentally CSS-achievable effects (fade/translate reveals, hover zooms, header state, drawer slide) would undercut that convention and add real bundle weight for no capability gain.
- Every effect requested in Phases 3–12 (hero entrance, header scroll-state, card hover, scroll-reveal, drawer slide, accordion, micro-interactions) is achievable with `transform`/`opacity` CSS transitions plus, for scroll-triggered reveals specifically, one small `IntersectionObserver` hook — exactly what the brief's own Phase 5/14 rules ask for anyway ("prefer IntersectionObserver... avoid large animation libraries unless absolutely necessary").
- The one exception where a library would usually be reached for — a testimonials carousel or gallery lightbox — can be built as small, purpose-built client components (a "Lightbox" for the gallery, and either a calm static grid *or* a minimal carousel for testimonials, pending §5 below) without pulling in a general-purpose motion runtime.

Concretely, I'd add two new files under a new `components/animation/` folder:
- `Reveal.tsx` — a client component wrapping children in an `IntersectionObserver`-triggered fade+translateY-on-enter (the "scroll reveal" primitive used everywhere in Phase 5/6/7/8). One implementation, reused via props (`delay`, `y-offset`), not duplicated per section.
- `useScrolled.ts` (or similar) — a tiny hook for the header's scroll-based background transition (Phase 4), using a passive scroll listener with a threshold check, not per-frame work.

Both respect `prefers-reduced-motion` (skip the observer/animation entirely, render children immediately) and both stay tiny (well under the kind of weight a full library would add).

**What I need from you before proceeding:** confirm this direction (CSS + two small primitives, no Framer Motion/GSAP) — or tell me if you'd actually prefer Framer Motion adopted properly (matching the original `PROJECT_PLAN.md` intent) despite the bundle-size tradeoff. Once that's confirmed I'll implement Phases 3–12 component-by-component, verify against Phase 13–18 (reduced motion, performance, mobile, a11y, Lighthouse), and report per the FINAL REPORT structure.

## 5. Secondary decision — Testimonials

Small, separate decision bundled in because it blocks Phase 10 specifically: should `Testimonials` stay a static grid (with a scroll-reveal entrance, consistent with "calm/premium, not gamey") or become a real carousel? The brief says "if there is a carousel... avoid an autoplay carousel that feels distracting" — which reads as conditional, not a mandate to add one. **Recommendation: keep it a static grid + scroll-reveal.** With only 3 testimonials shown at once today, a carousel adds interaction surface and a11y burden (pause/prev/next/keyboard/swipe, per this project's own accessibility contract) for content that already fits in a calm grid on all breakpoints. Say so if you'd rather have the carousel anyway.

## 6. Cleanup items (low-risk, can bundle into the same PR)

- Remove unused `styled-components` dependency.
- Delete `public/images/stock/hero-mountain-sunrise.jpg` and `public/images/hero.svg` if you confirm they're not referenced from Sanity content either (they're not referenced from code, but worth a quick check against any Sanity documents before deleting binary assets).
- Fix/remove the dead `animate-in` class on `MobileNav`'s overlay as part of giving it a real transition.
