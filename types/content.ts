/**
 * Content model types. Full schema rationale in docs/DATA_MODEL.md.
 * These are consumed via the `lib/content` repository, never read raw by UI.
 */

export type TripCategory = 'tour' | 'trek' | 'expedition';
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
  description: string;
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

export interface Trip {
  slug: string;
  title: string;
  category: TripCategory;
  tags: string[];
  destinationSlugs: string[];
  summary: string;
  heroImage: ImageRef;

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

  price: Price;
  earlyBird?: boolean;
  priceOnRequest?: boolean;

  highlights?: Array<{ icon?: string; title: string; body?: string }>;
  itinerary?: ItineraryDay[];
  included?: string[];
  excluded?: string[];
  faqs?: Faq[];
  departures?: Departure[];

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
