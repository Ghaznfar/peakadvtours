import { defineArrayMember, defineField, defineType } from 'sanity';

/** Reusable object types shared across documents. */

const ICON_KEYS = [
  'shield',
  'route',
  'wallet',
  'users',
  'compass',
  'headset',
  'map',
  'mountain',
  'mountain-snow',
  'footprints',
  'clock',
  'pin',
  'bed',
  'calendar',
];

/**
 * One pill on a trip card: a chosen icon plus free text. Deliberately free
 * text rather than derived from `durationDays`/`difficulty` etc, so an editor
 * can write "10 days across two valleys" instead of "10 days, Islamabad to
 * Islamabad" — the phrasing is part of the selling, not just the spec.
 */
export const tripFact = defineType({
  name: 'tripFact',
  title: 'Card fact',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: ICON_KEYS.map((v) => ({ title: v, value: v })) },
      initialValue: 'clock',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'label',
      title: 'Text',
      type: 'string',
      description: 'e.g. "10 days across two valleys", "Hotels and lakeside resorts".',
      validation: (r) => r.required().max(60),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'icon' },
  },
});

/** Image with required-ish alt text + hotspot cropping for good art direction. */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for accessibility and SEO.',
      validation: (rule) => rule.required().warning('Alt text improves accessibility and SEO.'),
    }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Aim for ≤ 60 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(160).warning('Aim for ≤ 160 characters.'),
    }),
    defineField({ name: 'ogImage', title: 'Social share image', type: 'imageWithAlt' }),
    defineField({ name: 'noindex', title: 'Hide from search engines', type: 'boolean' }),
  ],
});

export const priceType = defineType({
  name: 'priceType',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'USD',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'originalAmount',
      title: 'Original amount (for a strike-through)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
  ],
});

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Day',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day number',
      type: 'number',
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'altitudeM', title: 'Altitude (m)', type: 'number' }),
    defineField({ name: 'hours', title: 'Hours (approx.)', type: 'number' }),
    defineField({
      name: 'meals',
      title: 'Meals included',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Breakfast', value: 'B' },
          { title: 'Lunch', value: 'L' },
          { title: 'Dinner', value: 'D' },
        ],
      },
    }),
    defineField({ name: 'accommodation', title: 'Accommodation', type: 'string' }),
  ],
  preview: {
    select: { day: 'day', title: 'title' },
    prepare: ({ day, title }) => ({ title: `Day ${day ?? '?'}: ${title ?? ''}` }),
  },
});

export const departure = defineType({
  name: 'departure',
  title: 'Departure',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      title: 'Start date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'end', title: 'End date', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'lengthDays', title: 'Length (days)', type: 'number' }),
    defineField({ name: 'price', title: 'Price', type: 'number', validation: (r) => r.min(0) }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'USD' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'available',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Limited', value: 'limited' },
          { title: 'Guaranteed', value: 'guaranteed' },
          { title: 'Full', value: 'full' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'depositPercent', title: 'Deposit %', type: 'number' }),
  ],
  preview: {
    select: { start: 'start', status: 'status' },
    prepare: ({ start, status }) => ({ title: start ?? 'Departure', subtitle: status }),
  },
});

export const highlight = defineType({
  name: 'highlight',
  title: 'Highlight',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: ICON_KEYS.map((k) => ({ title: k, value: k })) },
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 2 }),
  ],
});

export const infoBlock = defineType({
  name: 'infoBlock',
  title: 'Info block',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
});

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'question' } },
});

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero slide',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (short line above the title)',
      type: 'string',
      description: 'e.g. "All-inclusive & guided".',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'tour',
      title: 'Featured tour/trek/expedition',
      type: 'reference',
      to: [{ type: 'tour' }],
      description:
        'Optional. When set, the slide’s title and button are taken from this trip and the two fields below can be left empty.',
    }),
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      description: 'Only needed when no trip is linked above — it overrides the trip’s title.',
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as { tour?: unknown } | undefined;
          if (!value && !parent?.tour) return 'Add a headline, or link a trip to supply one.';
          return true;
        }),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      description: 'Defaults to "View tour"/"View trek"/"View expedition" when a trip is linked.',
      validation: (r) => r.max(30),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      description: 'A path such as /tours or /contact. Only needed when no trip is linked.',
      validation: (r) =>
        r.custom((value?: string) =>
          !value || value.startsWith('/') ? true : 'Use a path starting with "/".',
        ),
    }),
  ],
  preview: {
    select: { eyebrow: 'eyebrow', manual: 'title', tourTitle: 'tour.title', media: 'image' },
    prepare: ({ eyebrow, manual, tourTitle, media }) => ({
      title: manual ?? tourTitle ?? 'Untitled slide',
      subtitle: eyebrow,
      media,
    }),
  },
});

export const objectTypes = [
  imageWithAlt,
  seo,
  tripFact,
  priceType,
  itineraryDay,
  departure,
  highlight,
  infoBlock,
  faq,
  heroSlide,
];
