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
];

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
      description: 'The slide’s title and "View …" button link come from this tour.',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { eyebrow: 'eyebrow', title: 'tour.title', media: 'image' },
    prepare: ({ eyebrow, title, media }) => ({
      title: title ?? 'Untitled slide',
      subtitle: eyebrow,
      media,
    }),
  },
});

export const objectTypes = [
  imageWithAlt,
  seo,
  priceType,
  itineraryDay,
  departure,
  highlight,
  infoBlock,
  faq,
  heroSlide,
];
