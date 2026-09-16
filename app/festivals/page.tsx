import { getDestinations, getTripsByTag } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Festival Tours',
  description:
    'Departures timed to seasonal festivals and cultural gatherings across our regions. Filter by destination, season and length.',
  path: '/festivals',
});

export default async function FestivalsPage({
  searchParams,
}: {
  searchParams: Promise<ParamsInput>;
}) {
  const [trips, destinations, sp] = await Promise.all([
    getTripsByTag('festival'),
    getDestinations(),
    searchParams,
  ]);
  return (
    <TripListingPage
      eyebrow="Seasonal"
      title="Festival Tours"
      description="Departures timed to seasonal festivals and cultural gatherings — book early, dates are fixed to the events."
      breadcrumbLabel="Festivals"
      basePath="/festivals"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
      showTypeFilter
    />
  );
}
