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

export default async function TreksPage({ searchParams }: { searchParams: Promise<ParamsInput> }) {
  const [allTreks, destinations, sp] = await Promise.all([
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
        alt: 'Two hikers with backpacks walking up a mountain trail',
      }}
      sectionEyebrow="The Karakoram classics"
      sectionTitle="Best Treks in Pakistan 2026-27"
      description="Every trek runs with licensed guides, porters and a full camp crew. Group sizes stay small and acclimatisation days are built into every itinerary."
      breadcrumbLabel="Treks"
      basePath="/treks"
      trips={allTreks}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
