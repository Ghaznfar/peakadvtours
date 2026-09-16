import type { Credential, Stat, ValueProp } from '@/types/content';

/**
 * PLACEHOLDER marketing content (why-us value props, company stats,
 * credentials/partners). Replace with the client's real, verifiable claims at
 * handoff — never invent credentials or awards (CLAUDE.md §2).
 */

export const valueProps: ValueProp[] = [
  {
    id: 'v1',
    icon: 'shield',
    title: 'Book with confidence',
    subhead: '30% deposit',
    body: 'Pay a small deposit to hold your place and settle the balance before departure. Written receipts for every payment.',
  },
  {
    id: 'v2',
    icon: 'route',
    title: 'Routes we actually walk',
    subhead: 'Since 2010',
    body: 'Every road, hotel and stop on your itinerary is checked by our own team across seasons — not booked from a desk.',
  },
  {
    id: 'v3',
    icon: 'wallet',
    title: 'One inclusive price',
    subhead: 'No surprises',
    body: 'Transport, accommodation, listed meals and your guide are all in the printed price. Anything excluded is flagged before you book.',
  },
  {
    id: 'v4',
    icon: 'users',
    title: 'Small groups only',
    subhead: 'Max 12–14',
    body: 'Enough company for the campfire, never a queue for the viewpoint. Solo and first-time travellers join our departures regularly.',
  },
  {
    id: 'v5',
    icon: 'compass',
    title: 'Made-to-measure trips',
    subhead: 'In 24 hours',
    body: 'Send your dates, group size and budget and we build a custom day-by-day itinerary — no deposit to see one.',
  },
  {
    id: 'v6',
    icon: 'headset',
    title: 'Local expert guides',
    subhead: 'On every trip',
    body: 'Guides and drivers from the regions you visit, many with us for years, reachable throughout your journey.',
  },
];

export const stats: Stat[] = [
  { id: 's1', value: '15+', label: 'Years operating' },
  { id: 's2', value: '2,000+', label: 'Travellers hosted' },
  { id: 's3', value: '40+', label: 'Trips & routes' },
  { id: 's4', value: '4.9/5', label: 'Average rating' },
];

export const credentials: Credential[] = [
  { id: 'c1', name: 'Tourism Board (placeholder)', type: 'accreditation', abbr: 'TB' },
  { id: 'c2', name: 'Tour Operators Assoc. (placeholder)', type: 'accreditation', abbr: 'TOA' },
  { id: 'c3', name: 'Adventure Guides Guild (placeholder)', type: 'partner', abbr: 'AGG' },
  { id: 'c4', name: 'Chamber of Commerce (placeholder)', type: 'partner', abbr: 'CoC' },
  { id: 'c5', name: 'Safe Travel Mark (placeholder)', type: 'award', abbr: 'STM' },
];
