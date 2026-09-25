import { getTripsByCategory } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { TourListingPage } from '@/components/listing/TourListingPage';

/** Helicopter, jeep and other one-off formats get their own group below. */
const SPECIALTY_TAG = 'specialty';

export const metadata = buildMetadata({
  title: 'Pakistan Tour Packages 2026-27',
  description:
    'Guided, fully-inclusive tour packages at a comfortable pace — culture, scenery and hospitality across northern Pakistan, without the trekking.',
  path: '/tours',
});

export default async function ToursPage() {
  const trips = await getTripsByCategory('tour');

  const specialty = trips.filter((t) => t.tags.includes(SPECIALTY_TAG));
  const packages = trips.filter((t) => !t.tags.includes(SPECIALTY_TAG));

  return (
    <TourListingPage
      eyebrow="All-inclusive & guided"
      title="Pakistan Tour Packages 2026-27"
      heroImage={{
        src: '/images/stock/trip-valley-tour.jpg',
        alt: 'PLACEHOLDER — replace with a client photograph of a guided tour group',
      }}
      breadcrumbLabel="Tours"
      groups={[
        {
          eyebrow: 'Take a look at',
          title: 'Guided Pakistan Tour Packages',
          intro: [
            'Every package covers internal flights, hotels with breakfast, sightseeing and an English-speaking guide in one price agreed before you travel, with no surcharges once you arrive. Lunch and dinner are left off so you can eat where you like; we book them on request and you settle as you go.',
            'The Gilgit-Baltistan packages run the length of the Karakoram Highway — Hunza, the Khunjerab Pass, Skardu and the Deosai — and the Hunza and Skardu tours take the same valleys at a gentler pace. South of the mountains are the Mughal cities of Punjab, the Kalash valleys of the Hindu Kush, and the Indus down to Karachi.',
          ],
          trips: packages,
        },
        {
          eyebrow: 'See the mountains differently',
          title: 'Helicopter, Jeep & Custom Safaris',
          trips: specialty,
        },
      ]}
    />
  );
}
