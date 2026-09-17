import { defineField, defineType } from 'sanity';

/** Singleton: editable site-wide settings (branding + contact + socials). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'social', title: 'Social' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Site name', type: 'string', group: 'brand' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'brand' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'brand',
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt', group: 'brand' }),

    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      type: 'string',
      description: 'International format, digits only (no +).',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (r) => r.email(),
    }),
    defineField({ name: 'hours', title: 'Opening hours', type: 'string', group: 'contact' }),
    defineField({ name: 'addressLine1', title: 'Address line', type: 'string', group: 'contact' }),
    defineField({ name: 'addressCity', title: 'City', type: 'string', group: 'contact' }),
    defineField({ name: 'addressCountry', title: 'Country', type: 'string', group: 'contact' }),

    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url', group: 'social' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url', group: 'social' }),
    defineField({ name: 'youtube', title: 'YouTube URL', type: 'url', group: 'social' }),
    defineField({ name: 'x', title: 'X (Twitter) URL', type: 'url', group: 'social' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
