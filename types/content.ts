/**
 * Content model types. Full schema rationale in docs/DATA_MODEL.md.
 * These are consumed via the `lib/content` repository, never read raw by UI.
 */

export type TripCategory = 'tour' | 'trek' | 'expedition' | 'corporate';
export type Difficulty = 'easy' | 'moderate' | 'strenuous' | 'technical';
export type Effort = 'easy' | 'moderate' | 'serious';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface ImageRef {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  credit?: string;
}

export interface Price {
  amount: number;
  currency: string;
  /** Original (pre-discount) amount, shown struck-through when present. */
  originalAmount?: number;
  unit: 'per_person';
}

export interface ItineraryDay {
  day: number;
  title: string;
  /** Optional: a day whose title says it all needs no body. */
  description?: string;
  /** Optional photo shown above the day's text. */
  image?: ImageRef;
  altitudeM?: number;
  hours?: number;
  meals?: Array<'B' | 'L' | 'D'>;
  accommodation?: string;
}

export interface Departure {
  start: string;
  end: string;
  lengthDays: number;
  price: Price;
  status: 'available' | 'limited' | 'guaranteed' | 'full';
  depositPercent?: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: ImageRef;
  canonical?: string;
  noindex?: boolean;
  keywords?: string[];
}

/** One numbered stop on a trip's route map, in travel order. */
export interface RouteWaypoint {
  name: string;
  lat: number;
  lng: number;
  note?: string;
}

/** One labelled pill on a trip card: an icon key plus its text. */
export interface TripFact {
  /** Key into `ICON_MAP` (components/ui/icons/iconMap). */
  icon: string;
  label: string;
}

export interface Trip {
  slug: string;
  title: string;
  category: TripCategory;
  tags: string[];
  destinationSlugs: string[];
  /** Short card/meta description. */
  summary: string;
  /** Long-form overview shown on the detail page. */
  description?: string;
  heroImage: ImageRef;
  gallery?: ImageRef[];
  /** Shown under "Where you'll go" — a route map or a wide regional photo. */
  routeMap?: ImageRef;
  /** Ordered stops; two or more draws the interactive map instead. */
  routeWaypoints?: RouteWaypoint[];

  durationDays: number;
  startCity: string;
  endCity: string;
  maxAltitudeM?: number;
  difficulty: Difficulty;
  effort: Effort;
  groupSizeMin?: number;
  groupSizeMax?: number;
  season: Season[];
  seasonNote?: string;
  accommodationNote?: string;
  /**
   * Labelled pills on the trip card, edited in the CMS. Free text by design so
   * the wording can sell ("10 days across two valleys") rather than restate the
   * spec. When empty, `TripCard` derives pills from the structured fields.
   */
  cardFacts?: TripFact[];

  price: Price;
  earlyBird?: boolean;
  priceOnRequest?: boolean;
  /** Deposit required to book, as a percentage of the price. */
  depositPercent?: number;
  /** Optional custom promo label (e.g. "Best seller", "New"). */
  badge?: string;

  highlights?: Array<{ icon?: string; title: string; body?: string }>;
  itinerary?: ItineraryDay[];
  included?: string[];
  excluded?: string[];
  /** "Important information" blocks shown on the detail page. */
  goodToKnow?: Array<{ title: string; body: string }>;
  faqs?: Faq[];
  departures?: Departure[];
  /** Manually curated related trips (slugs); falls back to auto-related. */
  relatedSlugs?: string[];

  featured?: boolean;
  seo?: Seo;
  draft?: boolean;
  updatedAt: string;
}

export interface Category {
  key: TripCategory;
  label: string;
  pluralLabel: string;
  slug: string;
  intro: string;
}

export interface Destination {
  slug: string;
  name: string;
  region?: string;
  heroImage: ImageRef;
  intro: string;
  /** Approximate number of trips in this destination, for the card label. */
  tripCount?: number;
  featured?: boolean;
  seo?: Seo;
}

export interface Testimonial {
  id: string;
  author: string;
  location?: string;
  /** Which trip the review is about, e.g. "Sample Base Camp Trek". */
  tripLabel?: string;
  date?: string;
  rating?: number;
  quote: string;
  /** Reviews are only shown/marked-up when genuinely consented (CLAUDE.md §2). */
  consentGiven: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Optional photo; when absent the card renders initials. */
  photo?: ImageRef;
  languages?: string[];
  order: number;
}

export interface Credential {
  id: string;
  name: string;
  type: 'accreditation' | 'partner' | 'award' | 'payment';
  /** Short label/abbreviation shown in the placeholder logo chip. */
  abbr?: string;
}

export interface ValueProp {
  id: string;
  /** Icon key resolved to a component in the presentational layer. */
  icon: string;
  title: string;
  subhead?: string;
  body: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: ImageRef;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMin?: number;
  /** Rendered/serialized long-form body (portable text → HTML/MDX at handoff). */
  body?: string;
  seo?: Seo;
  draft?: boolean;
}

/** Editable site-wide settings (mirrors `site.config.ts`; Sanity singleton). */
/** An editable marketing page (Corporate Retreats, etc.), keyed by route slug. */
export interface PageContent {
  slug: string;
  title: string;
  eyebrow?: string;
  intro?: string;
  features?: Array<{ icon?: string; title: string; body?: string }>;
  seo?: Seo;
}

/** A homepage hero slide. `ctaHref`/`ctaLabel` are derived from the linked
 * tour (category + slug) when sourced from Sanity — see `lib/content/site.ts`. */
export interface HeroSlideEntry {
  image: ImageRef;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteSettings {
  name?: string;
  tagline?: string;
  description?: string;
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    hours?: string;
    address?: { line1?: string; city?: string; country?: string };
  };
  social?: Record<string, string | undefined>;
  heroSlides?: HeroSlideEntry[];
}
