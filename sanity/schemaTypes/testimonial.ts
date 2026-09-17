import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'tripLabel',
      title: 'Trip',
      type: 'string',
      description: 'e.g. "Sample Base Camp Trek".',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'e.g. "2026" or "May 2026".',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'consentGiven',
      title: 'Consent given to publish',
      type: 'boolean',
      description: 'Only reviews with explicit consent are shown on the site.',
      initialValue: false,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'author', subtitle: 'tripLabel' } },
});
