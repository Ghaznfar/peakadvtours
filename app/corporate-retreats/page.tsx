import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Corporate Retreats',
  description:
    'Team offsites and corporate retreats with private transport, group accommodation and an itinerary built around your team size and goals.',
  path: '/corporate-retreats',
});

export default async function CorporateRetreatsPage({
  searchParams,
}: {
  searchParams: Promise<ParamsInput>;
}) {
  const [trips, destinations, sp] = await Promise.all([
    getTripsByCategory('corporate'),
    getDestinations(),
    searchParams,
  ]);
  return (
    <TripListingPage
      eyebrow="Take the team north"
      title="Corporate Retreats 2026-27"
      heroImage={{
        src: '/images/stock/destination-lakes-district.jpg',
        alt: 'PLACEHOLDER — replace with a client photograph of a company group trip',
      }}
      sectionEyebrow="Offsites that stick"
      sectionTitle="Team Retreats & Incentive Trips"
      description="We handle the logistics your team cannot — meeting space, transport, meals, permits and a dedicated event lead — so the days are spent on the work and the mountains, not the arrangements. Every programme is built around your headcount, dates and goals."
      breadcrumbLabel="Corporate retreats"
      basePath="/corporate-retreats"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
