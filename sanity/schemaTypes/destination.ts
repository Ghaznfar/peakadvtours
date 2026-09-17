import { defineField, defineType } from 'sanity';

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'region', title: 'Region', type: 'string' }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'name', subtitle: 'region', media: 'heroImage' } },
});
