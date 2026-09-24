import { defineArrayMember, defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

/**
 * Tour = the unified trip document (tours, treks, expeditions; festivals are
 * tours tagged "festival"; corporate retreats are tours tagged "corporate").
 * Fields are grouped so the Studio is approachable for a non-technical editor.
 *
 * Deliberately ONE document type, not four (CLAUDE.md §4). The Studio splits
 * it into four drag-to-reorder lists in `sanity/structure.ts`, which gives the
 * separate-sections editing experience without four near-identical schemas,
 * four sets of queries and four templates to keep in sync.
 */
export const tour = defineType({
  name: 'tour',
  title: 'Tour / Trek / Expedition',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'details', title: 'Details' },
    { name: 'itinerary', title: 'Itinerary & pricing' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hidden field written by the drag-to-reorder lists; `TOURS_*` queries
    // sort on it, so the order set in Studio is the order on the site.
    orderRankField({ type: 'tour' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'main',
      description: 'The fundamental trip type.',
      options: {
        list: [
          { title: 'Tour', value: 'tour' },
          { title: 'Trek', value: 'trek' },
          { title: 'Expedition', value: 'expedition' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destinations',
      title: 'Destinations',
      type: 'array',
      group: 'main',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'destination' }] })],
      validation: (r) => r.min(1).error('Add at least one destination.'),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'main',
      description: 'e.g. festival, culture, family, 8000m.',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      group: 'main',
      description: 'e.g. "Best seller", "New".',
    }),

    defineField({
      name: 'summary',
      title: 'Short description',
      type: 'text',
      rows: 2,
      group: 'main',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'description',
      title: 'Full description',
      type: 'text',
      rows: 6,
      group: 'details',
    }),

    // Quick facts
    defineField({
      name: 'durationDays',
      title: 'Duration (days)',
      type: 'number',
      group: 'details',
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'startCity', title: 'Start city', type: 'string', group: 'details' }),
    defineField({ name: 'endCity', title: 'End city', type: 'string', group: 'details' }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'details',
      options: {
        list: ['easy', 'moderate', 'strenuous', 'technical'].map((v) => ({ title: v, value: v })),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'effort',
      title: 'Effort (filter bucket)',
      type: 'string',
      group: 'details',
      options: { list: ['easy', 'moderate', 'serious'].map((v) => ({ title: v, value: v })) },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'maxAltitudeM',
      title: 'Maximum altitude (m)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'season',
      title: 'Season(s)',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: ['spring', 'summer', 'autumn', 'winter'].map((v) => ({ title: v, value: v })),
      },
    }),
    defineField({ name: 'seasonNote', title: 'Season note', type: 'string', group: 'details' }),
    defineField({
      name: 'groupSizeMin',
      title: 'Group size (min)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'groupSizeMax',
      title: 'Group size (max)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'accommodationNote',
      title: 'Accommodation',
      type: 'text',
      rows: 2,
      group: 'details',
    }),
    defineField({
      name: 'cardFacts',
      title: 'Card facts (pills)',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'tripFact' })],
      description:
        'The labelled pills shown on this trip’s card, in the order listed. Leave empty to fall back to pills derived from the fields above.',
      validation: (r) => r.max(8),
    }),

    // Commercial
    defineField({ name: 'price', title: 'Price', type: 'priceType', group: 'itinerary' }),
    defineField({
      name: 'priceOnRequest',
      title: 'Price on request',
      type: 'boolean',
      group: 'itinerary',
      initialValue: false,
    }),
    defineField({
      name: 'earlyBird',
      title: 'Early-bird pricing',
      type: 'boolean',
      group: 'itinerary',
      initialValue: false,
    }),
    defineField({ name: 'depositPercent', title: 'Deposit %', type: 'number', group: 'itinerary' }),

    // Rich detail
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'highlight' })],
    }),
    defineField({
      name: 'itinerary',
      title: 'Day-by-day itinerary',
      type: 'array',
      group: 'itinerary',
      of: [defineArrayMember({ type: 'itineraryDay' })],
    }),
    defineField({
      name: 'included',
      title: "What's included",
      type: 'array',
      group: 'itinerary',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'excluded',
      title: "What's excluded",
      type: 'array',
      group: 'itinerary',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'goodToKnow',
      title: 'Important information',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'infoBlock' })],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'faq' })],
    }),
    defineField({
      name: 'departures',
      title: 'Departure dates',
      type: 'array',
      group: 'itinerary',
      of: [defineArrayMember({ type: 'departure' })],
    }),

    // Media
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      group: 'media',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
    }),

    // Relationships
    defineField({
      name: 'relatedTours',
      title: 'Related tours',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tour' }] })],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      if (!doc?.priceOnRequest && !(doc?.price as { amount?: number } | undefined)?.amount) {
        return 'Set a price amount, or tick "Price on request".';
      }
      return true;
    }),
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'heroImage' },
  },
});
