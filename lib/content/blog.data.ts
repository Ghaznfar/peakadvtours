import type { BlogPost } from '@/types/content';

const IMG = (src: string, alt: string) => ({
  src,
  alt,
  width: 1200,
  height: 800,
});

/**
 * PLACEHOLDER blog posts. Fictional authorship/dates/content — replace with
 * the client's real articles at handoff (CLAUDE.md §2).
 */
export const blogPosts: BlogPost[] = [
  {
    slug: 'packing-list-for-a-highland-trek',
    title: 'A packing list for a highland trek',
    excerpt:
      'What actually earns its place in your pack for a multi-day highland trek — and what to leave at the hotel.',
    category: 'Trip planning',
    tags: ['trekking', 'packing', 'highland-region'],
    coverImage: IMG(
      '/images/placeholder-trip.svg',
      'Placeholder cover image — replace with a client photograph',
    ),
    author: 'Placeholder Planner',
    publishedAt: '2026-03-04',
    readingTimeMin: 6,
    body: `<p>Every kit list looks different once you've actually walked the route. This is the version we hand to our own groups before a highland departure — built from what guides pack, not what a gear shop wants you to buy.</p>
<h2>Layers, not one big jacket</h2>
<p>Mountain weather changes faster than a single jacket can handle. A base layer, an insulating mid layer and a waterproof shell together beat one heavy coat, and pack down smaller too.</p>
<h2>Footwear you've already broken in</h2>
<p>New boots and multi-day trails don't mix. Wear yours on at least two or three shorter walks beforehand so day one on the trail isn't the first time they've seen your feet.</p>
<h2>The small things people forget</h2>
<p>A headtorch, blister plasters, a basic water filter or purification tablets, and a printed copy of your itinerary in case your phone battery doesn't make it through the day.</p>
<p>Your confirmed departure includes a full kit list specific to that route and season — this is just the version that applies almost everywhere.</p>`,
  },
  {
    slug: 'best-season-to-visit-the-harbour-coast',
    title: 'Best season to visit the Harbour Coast',
    excerpt:
      'When the coast road is quietest, when the sea is calmest, and when to book if you want the best rates.',
    category: 'Destinations',
    tags: ['harbour-coast', 'seasons'],
    coverImage: IMG(
      '/images/placeholder-trip.svg',
      'Placeholder cover image — replace with a client photograph',
    ),
    author: 'Placeholder Founder',
    publishedAt: '2026-02-18',
    readingTimeMin: 4,
    body: `<p>The Harbour Coast rewards travelling slightly outside the peak weeks. Here's how we'd time it.</p>
<h2>Shoulder season first</h2>
<p>Late spring and early autumn bring calmer seas, thinner crowds at the old harbour towns, and noticeably better availability at the smaller guesthouses.</p>
<h2>Peak season trade-offs</h2>
<p>Midsummer is warmest and liveliest, but book your departure early — the coast road guesthouses fill months ahead.</p>
<h2>What we'd skip</h2>
<p>The depths of winter close several of the smaller sea-fort routes; we run a reduced set of departures then and say so upfront.</p>`,
  },
  {
    slug: 'how-our-custom-itineraries-are-priced',
    title: 'How our custom itineraries are priced',
    excerpt:
      'A plain explanation of what goes into a custom quote, so there are no surprises when it lands in your inbox.',
    category: 'Booking',
    tags: ['custom-trips', 'pricing'],
    coverImage: IMG(
      '/images/placeholder-trip.svg',
      'Placeholder cover image — replace with a client photograph',
    ),
    author: 'Placeholder Operations',
    publishedAt: '2026-01-22',
    readingTimeMin: 5,
    body: `<p>Custom quotes can feel like a black box. Here's what actually goes into one of ours.</p>
<h2>The fixed costs</h2>
<p>Transport, accommodation at the grade you choose, and your guide's fee are quoted per person and don't change once confirmed.</p>
<h2>The variable costs</h2>
<p>Group size affects the per-person rate — smaller private groups cost more per head than joining a scheduled departure. We show both options when relevant.</p>
<h2>What's never hidden</h2>
<p>Anything excluded from the price (visas, personal insurance, optional activities) is listed on the itinerary itself, not left for a follow-up email.</p>`,
  },
];
