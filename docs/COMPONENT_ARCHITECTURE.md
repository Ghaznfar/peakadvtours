# COMPONENT ARCHITECTURE

Component system for the site. Principles: **composable, presentational-vs-container split, content-agnostic, accessible, typed props**. No content is hardcoded inside components — everything comes via props sourced from the content layer or `site.config.ts`.

## 1. Conventions

- One component per folder: `ComponentName/ComponentName.tsx`, `ComponentName.test.tsx`, `index.ts`.
- **Server Components by default.** Add `"use client"` only for interactivity (filters, carousel, accordion, forms, map, mobile nav).
- Props are typed with explicit `interface XProps`. No `any`. No implicit `children` unless intended.
- Styling via Tailwind utility classes + shared tokens; variants via `cva` (class-variance-authority).
- Every interactive component ships keyboard + ARIA support and a Vitest/Playwright test.
- Naming: components `PascalCase`, hooks `useCamelCase`, utils `camelCase`, types `PascalCase`, constants `SCREAMING_SNAKE_CASE`.

## 2. Layers

```
primitives (ui/)      →  design-system atoms, no domain knowledge
composites            →  domain molecules built from primitives
sections              →  full-width page sections (compose composites)
templates             →  page-level layouts (compose sections)
providers/layout      →  header, footer, shells, context
```

## 3. Primitives (`components/ui/`)

| Component | Notes |
|---|---|
| `Button` | variants: primary, secondary, ghost, whatsapp; sizes; `asChild` for links |
| `Link` | wraps `next/link`, external-safe (`rel`, `target`) |
| `Badge` | trip type, promo ("Early bird"), difficulty color-coded |
| `Card` | base surface + slots |
| `Tag` / `Chip` | filter chips, categories |
| `Accordion` | Radix-based (itinerary days, FAQ) |
| `Tabs` | Radix-based (filter type toggles) |
| `Dialog` / `Drawer` | mobile nav, gallery lightbox |
| `Select`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Stepper`, `DatePicker`, `FieldError`, `Label` | form primitives, all a11y-wired |
| `Rating` | star display (aria-label with value) |
| `Icon` | typed icon set (lucide) |
| `Skeleton` | loading placeholders |
| `Container`, `Section`, `Grid` | layout helpers |
| `Prose` | MDX/long-form typography wrapper |
| `Price` | formats currency, strike-through original + discounted, "from/pp" |
| `Breadcrumbs` | + BreadcrumbList structured data |

## 4. Composites (domain molecules)

| Component | Composes | Used on |
|---|---|---|
| `TripCard` | Card, Badge, Price, Button, next/image | listings, home, related, mega-menu |
| `TripCardCompact` | small variant | mega-menu, related |
| `TripQuickFacts` | Icon + label pairs | trip detail |
| `TripFilterBar` | Tabs, Select, Chip | listings, home ("Find your trip") |
| `TripSortSelect` | Select | listings |
| `ItineraryDay` | Accordion item | trip detail |
| `DeparturesTable` | table + Badge(status) | trip detail |
| `IncludedList` / `ExcludedList` | check/cross list | trip detail |
| `HighlightCard` | Icon + text | trip detail |
| `RouteMap` | MapLibre (client) + static fallback | trip detail, home |
| `TripMapExplorer` | map + category toggles + markers | home |
| `DestinationCard` | image + label | home, destinations |
| `TestimonialCard` | quote, author, trip, rating | home, about |
| `TeamCard` | photo, name, role, bio | team, about |
| `ValuePropCard` | icon, heading, subhead, body | why-us |
| `CredentialLogo` / `PartnerStrip` | logo grid | trust sections |
| `BlogCard` | image, category, date, title, excerpt | blog index, related |
| `PriceBox` | sticky price + deposit + CTAs | trip detail |
| `EnquiryForm` | RHF + Zod, all fields | trip, contact, corporate |
| `CustomizeForm` | multi-section RHF form + live summary | /customize |
| `WhatsAppButton` | floating + inline, prefbuilds message | global |
| `Faq` | Accordion + FAQPage structured data | trip detail, pages |
| `Gallery` | image grid + lightbox | trip detail, destinations |
| `MegaMenu` | featured trips + links | header |
| `NewsletterForm` | inline signup | footer |
| `StatsBand` | numeric trust stats | about, home |

## 5. Sections (`components/sections/`)

Each is a self-contained, content-driven full-width block used by templates:
`HeroCarousel`, `CategoryCards`, `BrandPromise`, `FeaturedDestinations`, `FindYourTrip`, `TripMapSection`, `CustomizeCTA`, `WhyBookWithUs`, `TeamSection`, `TestimonialsSection`, `CredentialsSection`, `EnquirySection`, `RelatedTrips`, `CorporateHero`, `BlogListSection`.

## 6. Layout & providers

| Component | Role |
|---|---|
| `SiteHeader` | sticky header, MegaMenu, mobile Drawer, utility bar |
| `SiteFooter` | multi-column footer |
| `RootLayout` | fonts, theme tokens, skip-link, providers |
| `MobileNav` | client drawer with accordion |
| `AnalyticsProvider` | consent-gated analytics |
| `MotionProvider` | reduced-motion aware wrapper |
| `SEO` helpers | `generateMetadata` factories + JSON-LD components (`<JsonLd type=... />`) |

## 7. Data flow

```
content layer (repository)  ──►  page (server component, fetch at build/ISR)
        │                              │
        │                              ▼
        │                     maps content → typed props
        ▼                              │
   site.config.ts (brand)              ▼
                              sections ──► composites ──► primitives
                                              │
                            client islands (filter/carousel/form/map) hydrate only where needed
```

- Pages are **containers**: they fetch content and pass typed view-models down.
- Sections/composites/primitives are **presentational**: they never import the content layer directly (keeps them testable and CMS-agnostic).
- Interactive state (filters, form) lives in client components; filter state is mirrored to the URL.

## 8. Reusability guarantees

- `TripCard` renders any trip regardless of category (tour/trek/expedition) — category only changes badge + which quick-facts show.
- One `EnquiryForm` schema powers trip, contact, and corporate contexts via a `context` prop (prefills subject/trip).
- `Section`/`Container`/`Grid` enforce consistent spacing and max-widths site-wide.
- All copy strings that aren't content come from `site.config.ts` / a `labels` map (i18n-ready).

## 9. Accessibility contract (per interactive component)

- Focus visible, logical tab order, Escape closes overlays, focus trap in dialogs/drawers, focus returns to trigger.
- Accordions/tabs/selects use Radix (WAI-ARIA compliant).
- Carousel: pause/prev/next controls, no autoplay-only reliance, `aria-roledescription`, respects `prefers-reduced-motion`.
- Forms: `<label>` for every field, `aria-describedby` for hints/errors, `aria-invalid`, error summary on submit.
- Icons decorative → `aria-hidden`; meaningful icons get labels.
