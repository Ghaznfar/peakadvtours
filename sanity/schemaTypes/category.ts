import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'The fundamental trip type. Must match one of the fixed values.',
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
      name: 'label',
      title: 'Label (singular)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pluralLabel',
      title: 'Label (plural)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'pluralLabel' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'pluralLabel', subtitle: 'key' } },
});
