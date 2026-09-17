import type { SiteConfig } from '@/types/site';

/**
 * SINGLE SOURCE OF CLIENT BRANDING.
 *
 * Every brand name, contact detail, social link and navigation label the site
 * renders comes from this file. Components never hardcode these values, so
 * rebranding for a different client is a one-file edit.
 *
 * All values below are PLACEHOLDERS — replace before launch.
 * (See docs/DATA_MODEL.md §3 and PROJECT_STATUS.md launch checklist.)
 */
export const siteConfig: SiteConfig = {
  name: 'PeakAdventure Tours',
  legalName: 'PeakAdventure Tours Ltd',
  tagline: 'Guided tours, treks and expeditions — planned by people who walk the routes.',
  description:
    'Small-group tours, treks and mountaineering expeditions with fully-inclusive pricing, local expert guides and custom itineraries built around your dates.',
  // Set NEXT_PUBLIC_SITE_URL in your host (e.g. Vercel env vars) to your real
  // domain so canonical/OG/sitemap URLs are correct. Falls back to a placeholder.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  logo: { alt: 'PeakAdventure Tours' },
  defaultCurrency: 'USD',
  locale: 'en-US',
  foundedYear: 2010,

  contact: {
    phone: '+92 334 5290511',
    phoneSecondary: '+92 321 7499259',
    whatsapp: '923345290511',
    email: 'hello@peakadvtours.com',
    emailSecondary: 'peakadventuretour@gmail.com',
    hours: '9am – 9pm, seven days a week',
    address: {
      line1: 'House No. 155, Street 12-A, Mohra Road, Simly Dam Road',
      city: 'Islamabad',
      country: 'Pakistan',
    },
    geo: { lat: 0, lng: 0 },
  },

  social: {
    facebook: 'https://www.facebook.com/share/1EXQ2QNMJE/',
    instagram: 'https://www.instagram.com/peak_adventure_tours',
    youtube: '',
    tiktok: 'https://www.tiktok.com/@peakadventuretour',
    x: '',
    pinterest: '',
  },

  nav: [
    {
      label: 'Tours',
      href: '/tours',
      children: [
        { label: 'All tours', href: '/tours', description: 'Every guided tour package' },
        { label: 'Destinations', href: '/destinations', description: 'Browse by region' },
        { label: 'Festivals', href: '/festivals', description: 'Seasonal festival departures' },
      ],
    },
    {
      label: 'Treks',
      href: '/treks',
      children: [
        { label: 'All treks', href: '/treks', description: 'Guided trekking routes' },
        { label: 'Find your trip', href: '/trips', description: 'Filter every trip in one place' },
      ],
    },
    {
      label: 'Expeditions',
      href: '/expeditions',
      children: [
        {
          label: 'All expeditions',
          href: '/expeditions',
          description: 'Peak climbs & big mountains',
        },
      ],
    },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Customize', href: '/custom-trips' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  footer: {
    about:
      'Small-group tours, treks and expeditions planned by the people who walk the routes. Fully-inclusive pricing and custom itineraries built around your dates.',
    columns: [
      {
        heading: 'Explore',
        links: [
          { label: 'Tours', href: '/tours' },
          { label: 'Treks', href: '/treks' },
          { label: 'Expeditions', href: '/expeditions' },
          { label: 'Festivals', href: '/festivals' },
          { label: 'Corporate retreats', href: '/corporate-retreats' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About us', href: '/about' },
          { label: 'Customize your trip', href: '/custom-trips' },
          { label: 'Blog & news', href: '/blog' },
          { label: 'Contact', href: '/contact' },
          { label: 'Booking info', href: '/booking-info' },
        ],
      },
      {
        heading: 'Before you go',
        links: [
          { label: 'Booking terms', href: '/terms' },
          { label: 'Privacy policy', href: '/privacy' },
          { label: 'Sitemap', href: '/sitemap' },
        ],
      },
    ],
  },

  featureFlags: {
    map: true,
    newsletter: true,
    blog: true,
  },
};
