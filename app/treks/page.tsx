import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Treks',
  description:
    'Multi-day guided treks with licensed guides, porters and a full camp crew. Small groups, with acclimatisation days built into every itinerary.',
  path: '/treks',
});

/** Nepal treks run with partner crews and get their own section below. */
const NEPAL_TAG = 'nepal';

export default async function TreksPage({ searchParams }: { searchParams: Promise<ParamsInput> }) {
  const [allTreks, destinations, sp] = await Promise.all([
    getTripsByCategory('trek'),
    getDestinations(),
    searchParams,
  ]);

  // Split rather than filter: a single list would mix Karakoram expeditions in
  // with teahouse trails, which sell to different people.
  const trips = allTreks.filter((t) => !t.tags.includes(NEPAL_TAG));
  const nepalTreks = allTreks.filter((t) => t.tags.includes(NEPAL_TAG));

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
      description="Every trek runs with licensed guides, porters and a full camp crew. Group sizes stay small and acclimatisation days are built into every itinerary."
      breadcrumbLabel="Treks"
      basePath="/treks"
      trips={trips}
      secondary={{
        id: 'nepal',
        eyebrow: 'Teahouse trails',
        title: 'Trekking in Nepal',
        description:
          'Everest, Annapurna and Manaslu with our partner crews in Kathmandu — lodges booked, permits arranged, guides throughout.',
        trips: nepalTreks,
      }}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
