import type { HeroSlideEntry } from '@/types/content';

/**
 * PLACEHOLDER local fallback for the homepage hero slider — used only when
 * Sanity is unconfigured. Real content is edited in Sanity Studio (Site
 * settings → Homepage hero slides), which references the site's actual
 * tours. Images are real, freely-licensed stock photos (Pexels License)
 * standing in until the client supplies their own photography.
 */
export const heroSlides: HeroSlideEntry[] = [
  {
    image: {
      src: '/images/stock/trip-trek-hikers.jpg',
      alt: 'Two hikers with backpacks walking up a mountain trail',
      width: 1200,
      height: 800,
    },
    eyebrow: 'Guided & fully supported',
    title: 'K2 Base Camp & Gondogoro La Trek',
    ctaLabel: 'View trek',
    ctaHref: '/treks/k2-base-camp-gondogoro-la-trek',
  },
  {
    image: {
      src: '/images/stock/trip-valley-tour.jpg',
      alt: 'Green valley with trees between mountains',
      width: 1200,
      height: 800,
    },
    eyebrow: 'All-inclusive & guided',
    title: 'Hunza Valley Tour',
    ctaLabel: 'View tour',
    ctaHref: '/tours/hunza-valley-tour',
  },
  {
    image: {
      src: '/images/stock/destination-lakes-district.jpg',
      alt: 'Turquoise alpine lake surrounded by mountains',
      width: 1200,
      height: 800,
    },
    eyebrow: 'All-inclusive & guided',
    title: 'Skardu & Baltistan Tours',
    ctaLabel: 'View tour',
    ctaHref: '/tours/skardu-baltistan-tours',
  },
  {
    image: {
      src: '/images/stock/destination-highland-region.jpg',
      alt: 'Snow-capped mountain peaks in a northern highland valley',
      width: 1200,
      height: 800,
    },
    eyebrow: 'Seasonal departures',
    title: 'Kalash & Shandur',
    ctaLabel: 'View tour',
    ctaHref: '/tours/kalash-shandur',
  },
  {
    image: {
      src: '/images/stock/trip-expedition-climbers.jpg',
      alt: 'Mountaineers climbing with ropes on rock',
      width: 1200,
      height: 800,
    },
    eyebrow: 'Expedition-grade support',
    title: 'Karakoram Expeditions',
    ctaLabel: 'View expedition',
    ctaHref: '/expeditions/karakoram-expeditions',
  },
];
