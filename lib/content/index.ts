import type {
  Category,
  Credential,
  Destination,
  Stat,
  TeamMember,
  Testimonial,
  Trip,
  TripCategory,
  ValueProp,
} from '@/types/content';
import { categories, trips } from './trips.data';
import { destinations } from './destinations.data';
import { testimonials } from './testimonials.data';
import { team } from './team.data';
import { credentials, stats, valueProps } from './marketing.data';

/**
 * CONTENT REPOSITORY (the CMS seam).
 *
 * UI and pages call ONLY these functions — never the raw data files. To move
 * from local seed data to a CMS (e.g. Sanity), reimplement this module against
 * the CMS client; components stay untouched. See docs/DATA_MODEL.md §1.
 *
 * Functions are async to match a future networked data source.
 */

function isPublished(trip: Trip): boolean {
  return !trip.draft;
}

export async function getAllTrips(): Promise<Trip[]> {
  return trips.filter(isPublished);
}

export async function getFeaturedTrips(limit?: number): Promise<Trip[]> {
  const featured = trips.filter((t) => isPublished(t) && t.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export async function getTripsByCategory(category: TripCategory): Promise<Trip[]> {
  return trips.filter((t) => isPublished(t) && t.category === category);
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  return trips.find((t) => t.slug === slug && isPublished(t));
}

export async function getAllTripSlugs(): Promise<string[]> {
  return trips.filter(isPublished).map((t) => t.slug);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryByKey(key: TripCategory): Promise<Category | undefined> {
  return categories.find((c) => c.key === key);
}

export async function getDestinations(): Promise<Destination[]> {
  return destinations;
}

export async function getFeaturedDestinations(limit?: number): Promise<Destination[]> {
  const featured = destinations.filter((d) => d.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

/** Only consented testimonials are ever returned (CLAUDE.md §2). */
export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  const consented = testimonials.filter((t) => t.consentGiven);
  return typeof limit === 'number' ? consented.slice(0, limit) : consented;
}

export async function getTeam(): Promise<TeamMember[]> {
  return [...team].sort((a, b) => a.order - b.order);
}

export async function getValueProps(): Promise<ValueProp[]> {
  return valueProps;
}

export async function getStats(): Promise<Stat[]> {
  return stats;
}

export async function getCredentials(): Promise<Credential[]> {
  return credentials;
}
