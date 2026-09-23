import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Editable marketing page (Corporate Retreats, About, etc.). Keyed by the
 * route slug so a page's copy can be edited without a code change; the route
 * itself still lives in `app/`.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (H1)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Route slug',
      type: 'slug',
      description: 'Must match the page route, e.g. "corporate-retreats".',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (small line above the title)',
      type: 'string',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'Feature cards',
      type: 'array',
      of: [defineArrayMember({ type: 'highlight' })],
      description: 'Icon + heading + short body, shown as a row of cards.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
