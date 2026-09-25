import { notFound } from 'next/navigation';
import type { TripCategory } from '@/types/content';
import {
  getCategories,
  getCredentials,
  getDestinations,
  getRelatedTrips,
  getTripBySlug,
} from '@/lib/content';
import { TripDetail } from './TripDetail';

export interface TripDetailPageProps {
  category: TripCategory;
  params: Promise<{ slug: string }>;
}

/**
 * Shared async server component behind every category detail route. Validates
 * that the slug belongs to the expected category (so /tours/<a-trek> 404s),
 * assembles related trips + destination lookups, and renders the one template.
 */
export async function TripDetailPage({ category, params }: TripDetailPageProps) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip || trip.category !== category) notFound();

  const [related, destinations, categories, credentials] = await Promise.all([
    getRelatedTrips(trip, 3),
    getDestinations(),
    getCategories(),
    getCredentials(),
  ]);

  const destinationNames = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  return (
    <TripDetail
      credentials={credentials}
      trip={trip}
      relatedTrips={related}
      destinationNames={destinationNames}
      destinationOptions={destinationOptions}
    />
  );
}
