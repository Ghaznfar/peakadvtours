import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Expeditions',
  description:
    'High-altitude peak climbs with an experienced expedition team — permits, liaison, high-altitude porters and base-camp logistics handled end to end.',
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
      eyebrow="Higher than the treks"
      title="Karakoram Expeditions 2026-27"
      heroImage={{
        src: '/images/stock/trip-expedition-climbers.jpg',
        alt: 'PLACEHOLDER — replace with a client photograph of an expedition team',
      }}
      sectionEyebrow="Permits, porters and base camps"
      sectionTitle="High-altitude peak climbs with an experienced expedition team, full logistics and support above base camp."
      description="We handle climbing permits, liaison requirements, high-altitude porters and base-camp logistics end to end. Every expedition is quoted per team — prices below are per-person guides."
      breadcrumbLabel="Expeditions"
      basePath="/expeditions"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
