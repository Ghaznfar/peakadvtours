import type { PageContent } from '@/types/content';

/**
 * PLACEHOLDER local fallback for editable marketing pages — used only when
 * Sanity is unconfigured or the page document hasn't been created yet. Real
 * copy is edited in Sanity Studio under "Pages". All wording here is original
 * and written to be replaced by the client (CLAUDE.md §2).
 */
export const pages: PageContent[] = [
  {
    slug: 'corporate-retreats',
    title: 'Corporate retreats',
    eyebrow: 'For teams and companies',
    intro:
      'A team offsite planned like any other trip we run — small-group logistics, local guides and one inclusive price, scaled to however many people you’re bringing.',
    features: [
      {
        icon: 'users',
        title: 'Built for your group size',
        body: 'From a 6-person leadership offsite to a 60-person company trip — accommodation and transport scale to fit.',
      },
      {
        icon: 'shield',
        title: 'One invoice, one point of contact',
        body: 'A single trip planner coordinates the whole itinerary and bills your company directly — no splitting receipts.',
      },
      {
        icon: 'compass',
        title: 'Team activities, not just sightseeing',
        body: 'Add guided hikes, team challenges or a shared dinner — tell us the goal of the trip and we build around it.',
      },
      {
        icon: 'route',
        title: 'Planned around your calendar',
        body: 'Dates, pace and length are set by you. We work back from when your team can actually travel.',
      },
      {
        icon: 'map',
        title: 'Routes we know first-hand',
        body: 'Every road, hotel and stop is checked by our own team before it goes on your itinerary.',
      },
      {
        icon: 'headset',
        title: 'Support throughout the trip',
        body: 'A guide with the group and a planner reachable from the office for the whole journey.',
      },
    ],
  },
];
