import type { Testimonial } from '@/types/content';

/**
 * PLACEHOLDER testimonials — fictional, for layout only. Do NOT ship as real.
 * Replace with genuine, consented reviews before launch (CLAUDE.md §2); only
 * consented reviews (`consentGiven: true`) should ever be displayed.
 */
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Sample Traveller A',
    location: 'Placeholder City',
    tripLabel: 'Sample Base Camp Trek',
    date: '2026',
    rating: 5,
    quote:
      'Placeholder review text: everything from airport pickup to the mountain camps was organised before we asked. Swap this for a real, consented quote at handoff.',
    consentGiven: true,
  },
  {
    id: 't2',
    author: 'Sample Traveller B',
    location: 'Placeholder Town',
    tripLabel: 'Sample Valley Tour',
    date: '2026',
    rating: 5,
    quote:
      'Placeholder review text: the guide adjusted our route around the weather without dropping a single highlight. This is stand-in copy only.',
    consentGiven: true,
  },
  {
    id: 't3',
    author: 'Sample Traveller C',
    location: 'Placeholder Village',
    tripLabel: 'Alpine Lakes Trek',
    date: '2026',
    rating: 5,
    quote:
      'Placeholder review text: well paced, well fed and genuinely local knowledge throughout. Replace with a verified traveller quote.',
    consentGiven: true,
  },
];
