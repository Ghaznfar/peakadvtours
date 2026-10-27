import { getDestinations, getTripsByTag } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';

export const metadata = buildMetadata({
  title: 'Festival Tours',
  description:
    'Departures timed to seasonal festivals and cultural gatherings across our regions — dates are fixed to the events, so book early.',
  path: '/festivals',
});

export default async function FestivalsPage() {
  const [trips, destinations] = await Promise.all([getTripsByTag('festival'), getDestinations()]);
  return (
    <TripListingPage
      eyebrow="Dates fixed to the calendar"
      title="Festival Tours"
      heroImage={{
        src: '/images/stock/destination-golden-desert.jpg',
        alt: 'Sunlit orange sand dunes under a clear sky',
      }}
      sectionEyebrow="Weeks you cannot move"
      sectionTitle="Festival Departures 2026-27"
      description="Departures timed to seasonal festivals and cultural gatherings — book early, dates are fixed to the events."
      breadcrumbLabel="Festivals"
      basePath="/festivals"
      trips={trips}
      destinations={destinations}
    />
  );
}
