import type { Difficulty, Season, Trip, TripCategory } from '@/types/content';

/**
 * Pure, framework-free filtering/sorting/search for trips, driven by URL query
 * params. Kept separate from UI so it is easy to unit-test and reuse on both
 * server (initial render/SEO) and client (interactive filtering).
 *
 * Invalid/unknown param values are ignored (treated as "no filter"), which is
 * what makes shared/hand-edited URLs robust.
 */

export type DurationBucket = 'short' | 'medium' | 'long';
export type SortKey =
  'recommended' | 'price-asc' | 'price-desc' | 'altitude-desc' | 'duration-asc' | 'duration-desc';

export interface TripQuery {
  type?: TripCategory;
  difficulty?: Difficulty;
  season?: Season;
  destination?: string;
  duration?: DurationBucket;
  q?: string;
  sort: SortKey;
}

export const CATEGORY_VALUES: readonly TripCategory[] = ['tour', 'trek', 'expedition'];
export const DIFFICULTY_VALUES: readonly Difficulty[] = [
  'easy',
  'moderate',
  'strenuous',
  'technical',
];
export const SEASON_VALUES: readonly Season[] = ['spring', 'summer', 'autumn', 'winter'];
export const DURATION_VALUES: readonly DurationBucket[] = ['short', 'medium', 'long'];
export const SORT_VALUES: readonly SortKey[] = [
  'recommended',
  'price-asc',
  'price-desc',
  'altitude-desc',
  'duration-asc',
  'duration-desc',
];

export const DEFAULT_SORT: SortKey = 'recommended';

/** Cards shown per page / per "load more" step. */
export const PAGE_SIZE = 6;

export const DURATION_LABELS: Record<DurationBucket, string> = {
  short: 'Up to 7 days',
  medium: '8–15 days',
  long: '16+ days',
};

export const SORT_LABELS: Record<SortKey, string> = {
  recommended: 'Recommended',
  'price-asc': 'Price (low to high)',
  'price-desc': 'Price (high to low)',
  'altitude-desc': 'Altitude (high to low)',
  'duration-asc': 'Length (short to long)',
  'duration-desc': 'Length (long to short)',
};

/** A plain params bag (Next.js server `searchParams`) or a URLSearchParams. */
export type ParamsInput = Record<string, string | string[] | undefined> | URLSearchParams;

function readParam(params: ParamsInput, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

/** Parse + validate a query from URL params. Unknown values are dropped. */
export function parseTripQuery(params: ParamsInput): TripQuery {
  return {
    type: oneOf(readParam(params, 'type'), CATEGORY_VALUES),
    difficulty: oneOf(readParam(params, 'difficulty'), DIFFICULTY_VALUES),
    season: oneOf(readParam(params, 'season'), SEASON_VALUES),
    destination: readParam(params, 'destination')?.trim() || undefined,
    duration: oneOf(readParam(params, 'duration'), DURATION_VALUES),
    q: readParam(params, 'q')?.trim() || undefined,
    sort: oneOf(readParam(params, 'sort'), SORT_VALUES) ?? DEFAULT_SORT,
  };
}

/** Serialize a query back to a URLSearchParams (omitting defaults/empties). */
export function serializeTripQuery(query: Partial<TripQuery>): URLSearchParams {
  const params = new URLSearchParams();
  if (query.type) params.set('type', query.type);
  if (query.difficulty) params.set('difficulty', query.difficulty);
  if (query.season) params.set('season', query.season);
  if (query.destination) params.set('destination', query.destination);
  if (query.duration) params.set('duration', query.duration);
  if (query.q) params.set('q', query.q);
  if (query.sort && query.sort !== DEFAULT_SORT) params.set('sort', query.sort);
  return params;
}

/** Parse the cumulative page number (>= 1) used for load-more pagination. */
export function parsePage(params: ParamsInput): number {
  const raw = readParam(params, 'page');
  const n = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function durationBucket(days: number): DurationBucket {
  if (days <= 7) return 'short';
  if (days <= 15) return 'medium';
  return 'long';
}

/** Count the active filters (excludes sort). Useful for "clear all" affordances. */
export function activeFilterCount(query: TripQuery): number {
  return [
    query.type,
    query.difficulty,
    query.season,
    query.destination,
    query.duration,
    query.q,
  ].filter(Boolean).length;
}

export function filterTrips(
  trips: Trip[],
  query: TripQuery,
  destinationNames?: Record<string, string>,
): Trip[] {
  const needle = query.q?.toLowerCase();
  return trips.filter((t) => {
    if (query.type && t.category !== query.type) return false;
    if (query.difficulty && t.difficulty !== query.difficulty) return false;
    if (query.season && !t.season.includes(query.season)) return false;
    if (query.destination && !t.destinationSlugs.includes(query.destination)) return false;
    if (query.duration && durationBucket(t.durationDays) !== query.duration) return false;
    if (needle) {
      const haystack = [
        t.title,
        t.summary,
        t.category,
        ...t.tags,
        ...t.destinationSlugs.map((s) => destinationNames?.[s] ?? s),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function sortTrips(trips: Trip[], sort: SortKey): Trip[] {
  const priceOf = (t: Trip) => (t.priceOnRequest ? Number.POSITIVE_INFINITY : t.price.amount);
  const out = [...trips];
  switch (sort) {
    case 'price-asc':
      out.sort((a, b) => priceOf(a) - priceOf(b));
      break;
    case 'price-desc':
      out.sort((a, b) => priceOf(b) - priceOf(a));
      break;
    case 'altitude-desc':
      out.sort((a, b) => (b.maxAltitudeM ?? 0) - (a.maxAltitudeM ?? 0));
      break;
    case 'duration-asc':
      out.sort((a, b) => a.durationDays - b.durationDays);
      break;
    case 'duration-desc':
      out.sort((a, b) => b.durationDays - a.durationDays);
      break;
    default:
      out.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
  return out;
}

export function filterAndSortTrips(
  trips: Trip[],
  query: TripQuery,
  destinationNames?: Record<string, string>,
): Trip[] {
  return sortTrips(filterTrips(trips, query, destinationNames), query.sort);
}
