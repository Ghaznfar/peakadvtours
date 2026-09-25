import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Karakoram Expeditions 2026-27',
  description:
    'High-altitude peak climbs with an experienced expedition team — permits, liaison, high-altitude porters and base-camp logistics handled end to end.',
  path: '/expeditions',
});

export default async function ExpeditionsPage({
  searchParams,
}: {
  searchParams: Promise<ParamsInput>;
}) {
  const [all, destinations, sp] = await Promise.all([
    getTripsByCategory('expedition'),
    getDestinations(),
    searchParams,
  ]);

  // Split by altitude band: a first 6,000 m summit and K2 sell to different
  // climbers, and one list would bury the entry-level peaks under the giants.
  const nepal = all.filter((t) => t.tags.includes('nepal'));
  const pakistan = all.filter((t) => !t.tags.includes('nepal'));
  const eightThousand = pakistan.filter((t) => (t.maxAltitudeM ?? 0) >= 8000);
  const lower = pakistan.filter((t) => (t.maxAltitudeM ?? 0) < 8000);

  return (
    <TripListingPage
      eyebrow="Permits, porters and base camps"
      title="Karakoram Expeditions 2026-27"
      heroImage={{
        src: '/images/stock/trip-expedition-climbers.jpg',
        alt: 'PLACEHOLDER — replace with a client photograph of an expedition base camp',
      }}
      sectionEyebrow="Beginning to seriously high"
      sectionTitle="Expedition Pakistan 2026-27 — 6,000 to 7,000 m"
      description="We handle climbing permits, liaison requirements, high-altitude porters and base-camp logistics end to end. Every expedition is quoted per team — the prices below are per-person guides."
      breadcrumbLabel="Expeditions"
      basePath="/expeditions"
      trips={lower}
      extraGroups={[
        {
          id: 'eight-thousanders',
          eyebrow: 'The giants',
          title: 'Expedition Pakistan 2026-27 — 8,000 m',
          description:
            'Pakistan holds five of the world’s fourteen 8,000 m peaks. These run with full base-camp service, weather forecasting and experienced high-altitude porters — previous 7,000 m experience required.',
          trips: eightThousand,
        },
        {
          id: 'nepal',
          eyebrow: 'Beyond the Karakoram',
          title: 'Expeditions in Nepal',
          description:
            'We run spring and autumn seasons in Nepal with the same crew standards, from Mera Peak’s big summit views upward.',
          trips: nepal,
        },
      ]}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
