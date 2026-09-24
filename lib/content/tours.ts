import type { ImageRef, Trip, TripCategory } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import {
  TOURS_ALL,
  TOURS_BY_CATEGORY,
  TOURS_BY_TAG,
  TOURS_FEATURED,
  TOURS_RELATED,
  TOUR_BY_SLUG,
  TOUR_SLUGS_BY_CATEGORY,
} from '@/sanity/queries';
import { trips as localTrips } from './trips.data';

/**
 * Tours data access. Reads from Sanity when configured, otherwise serves the
 * local seed data so the app builds and runs with no live project. UI never
 * imports Sanity queries directly — only these typed functions.
 */

const PLACEHOLDER_IMAGE: ImageRef = {
  src: '/images/placeholder-trip.svg',
  alt: 'Placeholder image — replace with a client photograph',
  width: 1200,
  height: 800,
};

/** Ensure a usable image even if a Sanity image is missing its asset. */
function ensureImage(img?: Partial<ImageRef> | null): ImageRef {
  if (!img || !img.src) return PLACEHOLDER_IMAGE;
  return {
    src: img.src,
    alt: img.alt ?? '',
    width: img.width,
    height: img.height,
    blurDataURL: img.blurDataURL,
  };
}

/** Normalise a raw Sanity tour into a fully-typed `Trip` (defensive). */
function mapTour(raw: Trip): Trip {
  return {
    ...raw,
    tags: raw.tags ?? [],
    destinationSlugs: raw.destinationSlugs ?? [],
    season: raw.season ?? [],
    heroImage: ensureImage(raw.heroImage),
    gallery: (raw.gallery ?? []).map(ensureImage).filter((i) => i.src),
    // Left undefined when unset (not run through ensureImage) so the detail
    // page can tell "no image chosen" from "image chosen" and fall back itself.
    routeMap: raw.routeMap?.src ? raw.routeMap : undefined,
    // Drop half-filled pills so a card never renders an icon with no text.
    cardFacts: (raw.cardFacts ?? []).filter((f) => f?.icon && f?.label),
    updatedAt: raw.updatedAt || new Date().toISOString().slice(0, 10),
  };
}

function isPublished(trip: Trip): boolean {
  return !trip.draft;
}

export async function getTours(): Promise<Trip[]> {
  if (!isSanityConfigured) return localTrips.filter(isPublished);
  const rows = await sanityFetch<Trip[]>(TOURS_ALL);
  return rows.map(mapTour);
}

/** Back-compat alias used across the app. */
export const getAllTrips = getTours;

export async function getFeaturedTours(limit?: number): Promise<Trip[]> {
  const rows = isSanityConfigured
    ? (await sanityFetch<Trip[]>(TOURS_FEATURED)).map(mapTour)
    : localTrips.filter((t) => isPublished(t) && t.featured);
  return typeof limit === 'number' ? rows.slice(0, limit) : rows;
}
export const getFeaturedTrips = getFeaturedTours;

export async function getToursByCategory(category: TripCategory): Promise<Trip[]> {
  if (!isSanityConfigured)
    return localTrips.filter((t) => isPublished(t) && t.category === category);
  const rows = await sanityFetch<Trip[]>(TOURS_BY_CATEGORY, { category });
  return rows.map(mapTour);
}
export const getTripsByCategory = getToursByCategory;

export async function getToursByTag(tag: string): Promise<Trip[]> {
  if (!isSanityConfigured) return localTrips.filter((t) => isPublished(t) && t.tags.includes(tag));
  const rows = await sanityFetch<Trip[]>(TOURS_BY_TAG, { tag });
  return rows.map(mapTour);
}
export const getTripsByTag = getToursByTag;

export async function getTourBySlug(slug: string): Promise<Trip | undefined> {
  if (!isSanityConfigured) return localTrips.find((t) => t.slug === slug && isPublished(t));
  const row = await sanityFetch<Trip | null>(TOUR_BY_SLUG, { slug });
  return row ? mapTour(row) : undefined;
}
export const getTripBySlug = getTourBySlug;

export async function getAllTripSlugs(): Promise<string[]> {
  const rows = await getTours();
  return rows.map((t) => t.slug);
}

export async function getTripSlugsByCategory(category: TripCategory): Promise<string[]> {
  if (!isSanityConfigured)
    return localTrips.filter((t) => isPublished(t) && t.category === category).map((t) => t.slug);
  return sanityFetch<string[]>(TOUR_SLUGS_BY_CATEGORY, { category });
}

/**
 * Related trips: manual `relatedSlugs` on the trip take precedence; otherwise
 * same-category trips (excluding self), preferring a shared destination.
 */
export async function getRelatedTrips(trip: Trip, limit = 3): Promise<Trip[]> {
  if (trip.relatedSlugs && trip.relatedSlugs.length > 0) {
    if (isSanityConfigured) {
      const rows = await sanityFetch<Trip[]>(TOURS_RELATED, { slugs: trip.relatedSlugs });
      return rows.map(mapTour).slice(0, limit);
    }
    const bySlug = new Map(localTrips.map((t) => [t.slug, t]));
    return trip.relatedSlugs
      .map((s) => bySlug.get(s))
      .filter((t): t is Trip => Boolean(t))
      .slice(0, limit);
  }

  const all = await getTours();
  const pool = all.filter((t) => t.slug !== trip.slug && t.category === trip.category);
  const sharesDestination = (t: Trip) =>
    t.destinationSlugs.some((d) => trip.destinationSlugs.includes(d));
  return [...pool]
    .sort((a, b) => Number(sharesDestination(b)) - Number(sharesDestination(a)))
    .slice(0, limit);
}
