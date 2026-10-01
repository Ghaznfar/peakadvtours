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

/**
 * "4.9/5 — Average rating" was removed before launch. There are no reviews
 * behind it: the CMS holds zero testimonials, so the number was invented.
 * Fabricated ratings are forbidden by CLAUDE.md §2, are a consumer-protection
 * problem, and are penalised by search engines when they appear as rich data.
 *
 * Of the three that remain, "40+ trips & routes" is true (42 are published) and
 * "15+ years" follows `siteConfig.foundedYear` (2010). **"2,000+ travellers
 * hosted" is unverified** and should be confirmed or changed by the client.
 */
export const stats: Stat[] = [
  { id: 's1', value: '15+', label: 'Years operating' },
  { id: 's2', value: '2,000+', label: 'Travellers hosted' },
  { id: 's3', value: '40+', label: 'Trips & routes' },
];

/**
 * EMPTY ON PURPOSE — do not re-add invented bodies.
 *
 * This list held five made-up accreditations ("Tourism Board (placeholder)",
 * "Safe Travel Mark (placeholder)" and so on). They were removed before launch
 * for two reasons. CLAUDE.md §2 forbids presenting credentials the client has
 * not actually earned, and since the family archive went live they would have
 * sat directly beneath genuine signed letters from the 1993 Dutch K2 expedition
 * and the Swiss Gasherbrum II team — real proof propping up invented proof.
 *
 * `Credentials` returns null on an empty list and the enquiry band skips its
 * credentials row, so nothing renders and no layout breaks. Add entries back
 * only for accreditations the client holds and can evidence.
 */
export const credentials: Credential[] = [];
