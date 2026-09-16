import type { Category, Trip } from '@/types/content';

/**
 * PLACEHOLDER SEED CONTENT — fictional trips used to build and demo the UI.
 * Replace with real client content (or a CMS source) at handoff. All prices,
 * names and images here are invented placeholders (see CLAUDE.md §2).
 *
 * In Phase 3 this data moves to `content/trips/*` files behind these same
 * repository functions; UI never changes.
 */

const PLACEHOLDER_IMAGE = {
  src: '/images/placeholder-trip.svg',
  alt: 'Placeholder scenery — replace with a licensed client photograph',
  width: 1200,
  height: 800,
};

export const categories: Category[] = [
  {
    key: 'tour',
    label: 'Tour',
    pluralLabel: 'Tours',
    slug: 'tours',
    intro: 'Guided, fully-inclusive tour packages at a comfortable pace.',
  },
  {
    key: 'trek',
    label: 'Trek',
    pluralLabel: 'Treks',
    slug: 'treks',
    intro: 'Multi-day guided treks with full camp support.',
  },
  {
    key: 'expedition',
    label: 'Expedition',
    pluralLabel: 'Expeditions',
    slug: 'expeditions',
    intro: 'High-altitude peak climbs with an experienced expedition team.',
  },
];

export const trips: Trip[] = [
  {
    slug: 'sample-valley-tour',
    title: 'Sample Valley Tour',
    category: 'tour',
    tags: ['culture', 'family'],
    destinationSlugs: ['sample-region'],
    summary:
      'A placeholder tour showing how a comfortable, guided valley itinerary is presented on a card and detail page.',
    heroImage: PLACEHOLDER_IMAGE,
    durationDays: 7,
    startCity: 'Gateway City',
    endCity: 'Gateway City',
    difficulty: 'easy',
    effort: 'easy',
    groupSizeMin: 4,
    groupSizeMax: 12,
    season: ['spring', 'autumn'],
    seasonNote: 'Spring blossom or autumn colour',
    accommodationNote: 'Comfort hotels with valley views',
    price: { amount: 1800, currency: 'USD', unit: 'per_person' },
    featured: true,
    updatedAt: '2026-01-01',
  },
  {
    slug: 'sample-base-camp-trek',
    title: 'Sample Base Camp Trek',
    category: 'trek',
    tags: ['trekking'],
    destinationSlugs: ['sample-region'],
    summary:
      'A placeholder trek demonstrating altitude, difficulty and departure data on the reusable trip card.',
    heroImage: PLACEHOLDER_IMAGE,
    durationDays: 14,
    startCity: 'Gateway City',
    endCity: 'Gateway City',
    maxAltitudeM: 5150,
    difficulty: 'strenuous',
    effort: 'serious',
    groupSizeMax: 12,
    season: ['summer'],
    seasonNote: 'Summer departures',
    accommodationNote: 'Hotels either end, tents between',
    price: { amount: 2590, currency: 'USD', originalAmount: 2900, unit: 'per_person' },
    earlyBird: true,
    featured: true,
    updatedAt: '2026-01-01',
  },
  {
    slug: 'sample-peak-expedition',
    title: 'Sample Peak Expedition',
    category: 'expedition',
    tags: ['expeditions', '6000m'],
    destinationSlugs: ['sample-region'],
    summary:
      'A placeholder expedition showing how a technical, high-altitude climb is summarised for prospective clients.',
    heroImage: PLACEHOLDER_IMAGE,
    durationDays: 23,
    startCity: 'Gateway City',
    endCity: 'Gateway City',
    maxAltitudeM: 6096,
    difficulty: 'technical',
    effort: 'serious',
    groupSizeMax: 8,
    season: ['summer'],
    seasonNote: 'Late June to mid-August',
    accommodationNote: 'Hotels either end, tents between',
    price: { amount: 4200, currency: 'USD', unit: 'per_person' },
    featured: true,
    updatedAt: '2026-01-01',
  },
];
