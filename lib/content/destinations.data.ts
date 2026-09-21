import type { Destination } from '@/types/content';

/**
 * Destinations. Names/intros are placeholders (replace at handoff), but hero
 * images are real, freely-licensed stock photos (Pexels License — free for
 * commercial use) downloaded into `public/images/stock/`, standing in until
 * the client supplies their own photography.
 */

const IMG = (src: string, alt: string, credit: string) => ({
  src,
  alt,
  width: 1200,
  height: 800,
  credit,
});

export const destinations: Destination[] = [
  {
    slug: 'sample-region',
    name: 'Highland Region',
    region: 'Northern highlands',
    heroImage: IMG(
      '/images/stock/destination-highland-region.jpg',
      'Snow-capped mountain peaks in a northern highland valley',
      'Photo by Arif Esapzai / Pexels',
    ),
    intro: 'Big-mountain valleys, glacier trails and hospitable villages.',
    tripCount: 6,
    featured: true,
  },
  {
    slug: 'harbour-coast',
    name: 'Harbour Coast',
    region: 'Southern coast',
    heroImage: IMG(
      '/images/stock/destination-harbour-coast.jpg',
      'Boats moored in a scenic coastal harbour town',
      'Photo by Andreas Berget / Pexels',
    ),
    intro: 'Old harbour towns, sea forts and slow coastal roads.',
    tripCount: 3,
    featured: true,
  },
  {
    slug: 'golden-desert',
    name: 'Golden Desert',
    region: 'Western desert',
    heroImage: IMG(
      '/images/stock/destination-golden-desert.jpg',
      'Golden sand dunes at sunset',
      'Photo via Pexels',
    ),
    intro: 'Dune camps, caravan towns and some of the clearest night skies.',
    tripCount: 2,
    featured: true,
  },
  {
    slug: 'lakes-district',
    name: 'Lakes District',
    region: 'Central lakes',
    heroImage: IMG(
      '/images/stock/destination-lakes-district.jpg',
      'Turquoise alpine lake surrounded by mountains',
      'Photo via Pexels',
    ),
    intro: 'Turquoise tarns, alpine meadows and gentle walking country.',
    tripCount: 4,
    featured: true,
  },
];
