import type { Destination } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { DESTINATIONS_ALL, DESTINATION_BY_SLUG } from '@/sanity/queries';
import { destinations as localDestinations } from './destinations.data';

const PLACEHOLDER = {
  src: '/images/placeholder-trip.svg',
  alt: 'Placeholder image — replace with a client photograph',
  width: 1200,
  height: 800,
};

function mapDestination(raw: Destination): Destination {
  return { ...raw, heroImage: raw.heroImage?.src ? raw.heroImage : PLACEHOLDER };
}

export async function getDestinations(): Promise<Destination[]> {
  if (!isSanityConfigured) return localDestinations;
  const rows = await sanityFetch<Destination[]>(DESTINATIONS_ALL);
  return rows.map(mapDestination);
}

export async function getFeaturedDestinations(limit?: number): Promise<Destination[]> {
  const all = await getDestinations();
  const featured = all.filter((d) => d.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  if (!isSanityConfigured) return localDestinations.find((d) => d.slug === slug);
  const row = await sanityFetch<Destination | null>(DESTINATION_BY_SLUG, { slug });
  return row ? mapDestination(row) : undefined;
}
