import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Treks',
  description:
    'Multi-day guided treks with full camp support. Filter by destination, difficulty, season, altitude and length.',
  path: '/treks',
});

export default async function TreksPage({ searchParams }: { searchParams: Promise<ParamsInput> }) {
  const [trips, destinations, sp] = await Promise.all([
    getTripsByCategory('trek'),
    getDestinations(),
    searchParams,
  ]);
  return (
    <TripListingPage
      eyebrow="On foot"
      title="Treks"
      description="Multi-day guided treks with full camp support — from gentle valley walks to serious high-altitude routes."
      breadcrumbLabel="Treks"
      basePath="/treks"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
