import { getAllTrips, getDestinations } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Find your trip',
  description:
    'Every tour, trek and expedition in one place. Filter by type, destination, difficulty, season and length.',
  path: '/trips',
});

export default async function TripsPage({ searchParams }: { searchParams: Promise<ParamsInput> }) {
  const [trips, destinations, sp] = await Promise.all([
    getAllTrips(),
    getDestinations(),
    searchParams,
  ]);
  return (
    <TripListingPage
      eyebrow="Everything"
      title="Find your trip"
      description="Every tour, trek and expedition in one place — filter, sort and search to find the right one."
      breadcrumbLabel="All trips"
      basePath="/trips"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
      showTypeFilter
    />
  );
}
