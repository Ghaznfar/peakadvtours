# DATA MODEL

Content/data architecture. Designed so a **non-technical client can replace every value** and so the storage can migrate from local files to a headless CMS **without touching components**.

## 1. Storage strategy & CMS migration path

> **DECISION (2026-09-17): Sanity is the CMS.** Content is managed in **Sanity Studio** (embedded at `/studio`) and read by the site through the **Sanity API/client**, all behind the `lib/content/` repository. There is **no custom admin dashboard, no runtime application database, and no application-level authentication** (editor auth/roles are handled by Sanity). Sanity schemas live in `sanity/schemaTypes/`. The repository **falls back to local seed data** when Sanity env vars are unset so the app still builds/runs offline. The notes below on "file-based v1" describe the fallback and the original portability rationale.

- **v1 fallback / portability:** typed content collections in the repo:
  - Structured records → JSON or TS in `content/` (trips, destinations, testimonials, team, credentials, settings).
  - Long-form → **MDX** (`content/blog/*.mdx`, destination guide bodies).
  - Images → `/public/images/...` (or a CDN URL field).
- **Access is isolated** behind `lib/content/` (a repository module) exposing typed functions: `getAllTrips()`, `getTripBySlug()`, `getTripsByCategory()`, `getRelatedTrips()`, `getAllBlogPosts()`, `getDestination()`, `getSiteSettings()`, etc. **Components and pages call these, never the raw files.**
- **Migration to Sanity (recommended for client self-editing):** implement the same functions against the Sanity client; swap the module. Schemas below map 1:1 to Sanity document types. No UI changes required.

All types live in `types/content.ts`. Every entity has: `id`/`slug`, `seo` block, `draft` flag, `updatedAt`.

## 2. Entities

### 2.1 `Trip` (primary — powers tours, treks, expeditions)
```ts
interface Trip {
  slug: string;                      // /trips/[slug]
  title: string;
  category: 'tour' | 'trek' | 'expedition';
  tags: string[];                    // e.g. ['festival','bike','corporate','8000m','family']
  destinationSlugs: string[];        // links to Destination
  summary: string;                   // card + meta description
  overview: string;                  // MDX/rich text
  heroImage: ImageRef;
  gallery: ImageRef[];

  // Quick facts
  durationDays: number;
  startCity: string;
  endCity: string;
  maxAltitudeM?: number;             // treks/expeditions
  difficulty: 'easy' | 'moderate' | 'strenuous' | 'technical';
  effort: 'easy' | 'moderate' | 'serious';   // filter bucket
  groupSizeMin?: number;
  groupSizeMax?: number;
  season: ('spring'|'summer'|'autumn'|'winter')[];
  seasonNote?: string;               // "Late June to late August"
  accommodationNote?: string;

  // Commercial
  price: Price;                      // see below
  earlyBird?: boolean;
  depositPercent?: number;           // e.g. 30
  priceOnRequest?: boolean;

  // Detail content
  highlights: { icon: string; title: string; body?: string }[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  goodToKnow?: { title: string; body: string }[];
  faqs: Faq[];
  departures: Departure[];
  routeMap?: { waypoints: Waypoint[]; staticImage?: ImageRef };
  relatedSlugs?: string[];           // optional manual overrides

  featured?: boolean;                // home/mega-menu
  seo: Seo;
  draft?: boolean;
  updatedAt: string;
}

interface Price { amount: number; currency: string; originalAmount?: number; unit: 'per_person'; }
interface ItineraryDay { day: number; title: string; description: string; altitudeM?: number; hours?: number; meals?: ('B'|'L'|'D')[]; accommodation?: string; }
interface Departure { start: string; end: string; lengthDays: number; price: Price; status: 'available'|'limited'|'guaranteed'|'full'; deposit?: number; }
interface Waypoint { order: number; name: string; lat?: number; lng?: number; altitudeM?: number; }
interface Faq { question: string; answer: string; }
interface ImageRef { src: string; alt: string; width?: number; height?: number; blurDataURL?: string; credit?: string; }
```
> **Category behavior:** the same schema serves all three; `tour` cards hide altitude, `expedition` cards emphasize peak height + technical grade. Filtering uses `category`, `effort`, `season`, `price`, `maxAltitudeM`, `durationDays`.

### 2.2 `Destination`
```ts
interface Destination {
  slug: string; name: string; region?: string;
  heroImage: ImageRef; intro: string; guideBody?: string; // MDX
  bestTime?: string; highlights?: string[];
  relatedBlogSlugs?: string[]; featured?: boolean; seo: Seo;
}
```

### 2.3 `Category` (config, drives listing pages & nav)
```ts
interface Category { key:'tour'|'trek'|'expedition'; label:string; pluralLabel:string; slug:string; intro:string; heroImage:ImageRef; }
```

### 2.4 `Testimonial`
```ts
interface Testimonial { id:string; author:string; location?:string; tripSlug?:string; tripLabel?:string; date?:string; rating?:number; quote:string; avatar?:ImageRef; consentGiven:boolean; }
```

### 2.5 `TeamMember`
```ts
interface TeamMember { id:string; name:string; role:string; bio:string; photo?:ImageRef; languages?:string[]; order:number; }
```

### 2.6 `BlogPost` (MDX frontmatter)
```ts
interface BlogPost { slug:string; title:string; excerpt:string; category:'guide'|'route'|'trekking'|'planning'|'news'; tags:string[]; coverImage:ImageRef; author:string; publishedAt:string; updatedAt?:string; readingTimeMin:number; body:string; seo:Seo; draft?:boolean; }
```

### 2.7 `Credential` / `Partner`
```ts
interface Credential { id:string; name:string; type:'accreditation'|'exhibition'|'payment'|'award'; logo:ImageRef; url?:string; }
```

### 2.8 `Seo` (embedded)
```ts
interface Seo { title?:string; description?:string; ogImage?:ImageRef; canonical?:string; noindex?:boolean; keywords?:string[]; }
```

## 3. Site configuration — `site.config.ts` (single source of client branding)
Everything the client rebrands lives here (imported by header/footer/forms/SEO):
```ts
export const siteConfig = {
  name: 'PeakAdventure Tours',           // PLACEHOLDER
  legalName: 'PeakAdventure Tours Ltd',  // PLACEHOLDER
  tagline: '…',                          // PLACEHOLDER
  url: 'https://example.com',            // PLACEHOLDER
  logo: { light:'…', dark:'…' },         // PLACEHOLDER
  defaultCurrency: 'USD',
  contact: {
    phone: '+00 000 0000000',            // PLACEHOLDER
    whatsapp: '000000000000',            // PLACEHOLDER (intl, no +)
    email: 'hello@example.com',          // PLACEHOLDER
    hours: '9am–9pm, 7 days',            // PLACEHOLDER
    address: { line1:'…', city:'…', country:'…' }, // PLACEHOLDER
    mapEmbed: { lat:0, lng:0 },
  },
  social: { facebook:'', instagram:'', youtube:'', tiktok:'', x:'', pinterest:'' },
  nav: [ /* menu structure */ ],
  footer: { columns:[ /* … */ ] },
  founded: 2010,                          // PLACEHOLDER
  analytics: { provider:'plausible', id:'' },
  featureFlags: { map:true, newsletter:true, blog:true },
};
```
> **Rule:** no component may hardcode brand name, phone, email, address, currency, or social links — all read from `siteConfig`. This makes rebranding a single-file edit.

## 4. Form payloads

### 4.1 Enquiry (`/api/enquiry`)
```ts
interface EnquiryPayload {
  context: 'trip'|'contact'|'corporate';
  tripSlug?: string; tripTitle?: string;
  fullName:string; email:string; whatsapp:string;
  countryOfResidence?:string; destination?:string;
  startDate?:string; hotelType?:string;
  adults:number; childrenUnder12?:number;
  message?:string; consent:true;
  // anti-spam
  honeypot?:string; token?:string; // captcha/turnstile
}
```

### 4.2 Customize (`/api/enquiry` with `context:'customize'`)
Adds: `passportCountry`, `infants`, `rooms`, `durationDays`, `startCity`, `tripTypes:string[]`, `regions:string[]`, `hotelStandard`, `budgetPerPersonUSD`.

Validation via **Zod** schemas shared between client (RHF) and server route handler. Server: honeypot + rate-limit + Turnstile → send via Resend + optional CRM webhook → return `{ok:true}`.

## 5. Content directory layout (v1)
```
content/
  site/          settings.ts (or settings.json)
  trips/         *.json  (or *.mdx with structured frontmatter)
  destinations/  *.mdx
  blog/          *.mdx
  testimonials/  testimonials.json
  team/          team.json
  credentials/   credentials.json
  categories/    categories.json
```

## 6. Derived/computed data
- Category counts + "from" price → computed from `getAllTrips()` (no manual sync).
- Trip filters (Effort/Season/Type) → derived facets.
- Related trips → same destination/category, nearest price, excluding self (unless `relatedSlugs` set).
- Sitemap, RSS, structured data → generated from the content layer.

## 7. Validation & integrity
- Zod schemas validate every content record at build (`scripts/validate-content.ts`); build fails on invalid/placeholder-only critical fields when `NODE_ENV=production` + `CONTENT_STRICT=1`.
- Image refs must include non-empty `alt`.
- A "placeholder scan" flags remaining `PLACEHOLDER` values before launch (see PROJECT_STATUS launch checklist).
