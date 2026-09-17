import { siteConfig } from '@/site.config';
import type { Faq, Trip } from '@/types/content';
import { CATEGORY_LABEL, tripPath } from '@/lib/trips/href';

function absolute(path: string): string {
  return path.startsWith('http') ? path : `${siteConfig.url}${path}`;
}

/**
 * schema.org TouristTrip with an Offer (when priced) and a simple itinerary
 * ItemList. Only real data is emitted — no fabricated ratings (CLAUDE.md §2).
 */
export function touristTripSchema(trip: Trip): Record<string, unknown> {
  const url = absolute(tripPath(trip));
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.summary,
    url,
    image: [absolute(trip.heroImage.src)],
    touristType: CATEGORY_LABEL[trip.category],
    provider: {
      '@type': 'TravelAgency',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  if (!trip.priceOnRequest) {
    schema.offers = {
      '@type': 'Offer',
      price: trip.price.amount,
      priceCurrency: trip.price.currency,
      availability: 'https://schema.org/InStock',
      url,
    };
  }

  if (trip.itinerary && trip.itinerary.length > 0) {
    schema.itinerary = {
      '@type': 'ItemList',
      numberOfItems: trip.itinerary.length,
      itemListElement: trip.itinerary.map((day) => ({
        '@type': 'ListItem',
        position: day.day,
        name: `Day ${day.day}: ${day.title}`,
      })),
    };
  }

  return schema;
}

/** schema.org FAQPage from a trip's FAQs. */
export function faqSchema(faqs: Faq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
