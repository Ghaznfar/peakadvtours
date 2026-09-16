import type { Destination } from '@/types/content';

/** PLACEHOLDER destinations. Replace with real regions + photography at handoff. */

const IMG = (alt: string) => ({
  src: '/images/placeholder-trip.svg',
  alt,
  width: 1200,
  height: 800,
});

export const destinations: Destination[] = [
  {
    slug: 'sample-region',
    name: 'Highland Region',
    region: 'Northern highlands',
    heroImage: IMG('Placeholder highland scenery — replace with a client photograph'),
    intro: 'Big-mountain valleys, glacier trails and hospitable villages.',
    tripCount: 6,
    featured: true,
  },
  {
    slug: 'harbour-coast',
    name: 'Harbour Coast',
    region: 'Southern coast',
    heroImage: IMG('Placeholder coastal scenery — replace with a client photograph'),
    intro: 'Old harbour towns, sea forts and slow coastal roads.',
    tripCount: 3,
    featured: true,
  },
  {
    slug: 'golden-desert',
    name: 'Golden Desert',
    region: 'Western desert',
    heroImage: IMG('Placeholder desert scenery — replace with a client photograph'),
    intro: 'Dune camps, caravan towns and some of the clearest night skies.',
    tripCount: 2,
    featured: true,
  },
  {
    slug: 'lakes-district',
    name: 'Lakes District',
    region: 'Central lakes',
    heroImage: IMG('Placeholder lakeland scenery — replace with a client photograph'),
    intro: 'Turquoise tarns, alpine meadows and gentle walking country.',
    tripCount: 4,
    featured: true,
  },
];
