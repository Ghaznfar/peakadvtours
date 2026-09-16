import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Expeditions',
  description:
    'High-altitude peak climbs with an experienced expedition team. Filter by destination, difficulty, season and altitude.',
  path: '/expeditions',
});

export default async function ExpeditionsPage({
  searchParams,
}: {
  searchParams: Promise<ParamsInput>;
}) {
  const [trips, destinations, sp] = await Promise.all([
    getTripsByCategory('expedition'),
    getDestinations(),
    searchParams,
  ]);
  return (
    <TripListingPage
      eyebrow="Big mountains"
      title="Expeditions"
      description="High-altitude peak climbs with an experienced expedition team, full logistics and support above base camp."
      breadcrumbLabel="Expeditions"
      basePath="/expeditions"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
