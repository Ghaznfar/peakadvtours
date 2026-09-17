import type { Trip, TripCategory } from '@/types/content';

/** URL segment for each category's listing + detail routes. */
export const CATEGORY_SLUG: Record<TripCategory, string> = {
  tour: 'tours',
  trek: 'treks',
  expedition: 'expeditions',
};

/** Human label for a category (singular). */
export const CATEGORY_LABEL: Record<TripCategory, string> = {
  tour: 'Tour',
  trek: 'Trek',
  expedition: 'Expedition',
};

/** Path to a trip's detail page, scoped under its category (e.g. /treks/x). */
export function tripPath(trip: Pick<Trip, 'slug' | 'category'>): string {
  return `/${CATEGORY_SLUG[trip.category]}/${trip.slug}`;
}

/** Path to a category's listing page (e.g. /tours). */
export function categoryPath(category: TripCategory): string {
  return `/${CATEGORY_SLUG[category]}`;
}
