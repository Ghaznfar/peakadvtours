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
      eyebrow="Boots on"
      title="Trekking in Pakistan"
      heroImage={{
        src: '/images/stock/trip-trek-hikers.jpg',
        alt: 'PLACEHOLDER — replace with a client photograph of a trekking group',
      }}
      sectionEyebrow="The Karakoram classics"
      sectionTitle="Best Treks in Pakistan 2026-27"
      description="Multi-day guided treks with full camp support — from gentle valley walks to serious high-altitude routes."
      breadcrumbLabel="Treks"
      basePath="/treks"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
