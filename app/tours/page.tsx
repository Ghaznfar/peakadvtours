import { getDestinations, getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TripListingPage } from '@/components/listing/TripListingPage';
import type { ParamsInput } from '@/lib/trips/filters';

export const metadata = buildMetadata({
  title: 'Tours',
  description:
    'Guided, fully-inclusive tour packages at a comfortable pace — culture, scenery and hospitality across northern Pakistan, without the trekking.',
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
      title="Tours in Pakistan"
      heroImage={{
        src: '/images/stock/trip-valley-tour.jpg',
        alt: 'PLACEHOLDER — replace with a client photograph of a guided valley tour',
      }}
      sectionEyebrow="Take a look at"
      sectionTitle="Guided Pakistan Tour Packages"
      description="Every package on this page covers internal flights, hotels with breakfast, sightseeing and an English-speaking guide in one price agreed before you travel, with no surcharges once you arrive. Lunch and dinner are left off so you can eat where you like; we book them on request and you settle as you go.

The Gilgit-Baltistan tour packages run the length of the Karakoram Highway — Hunza, the Khunjerab Pass, Skardu and the Deosai — and the Hunza and Skardu tour packages take the same valleys at a gentler pace. South of the mountains are the Mughal cities of Punjab, the Kalash valleys of the Hindu Kush, and the Indus down to Karachi. All on routes we have run since 2014."
      breadcrumbLabel="Tours"
      basePath="/tours"
      trips={trips}
      destinations={destinations}
      searchParams={sp}
    />
  );
}
