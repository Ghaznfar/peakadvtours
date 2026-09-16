import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Tours',
  description:
    'Guided, fully-inclusive tour packages at a comfortable pace. Filter by destination, difficulty, season and length.',
  path: '/tours',
});

export default async function ToursPage({ searchParams }: { searchParams: Promise<ParamsInput> }) {
  const [trips, destinations, sp] = await Promise.all([
    getTripsByCategory('tour'),
    getDestinations(),
    searchParams,
  ]);
  return (
    <TripListingPage
      eyebrow="Ways to travel"
      title="Tours"
      description="Guided, fully-inclusive tour packages at a comfortable pace — culture, scenery and hospitality without the trekking."
      breadcrumbLabel="Tours"
      basePath="/tours"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
