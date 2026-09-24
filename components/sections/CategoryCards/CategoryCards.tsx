import Image from 'next/image';
import Link from 'next/link';
import type { Trip } from '@/types/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { formatCurrency } from '@/lib/utils/format';

/**
 * The four cards are defined here rather than in the CMS, deliberately: they
 * are site navigation, not content. Their number, order and destinations are
 * part of the layout, so an editor changing them would change the shape of the
 * homepage. Only the counts and "from" prices below them are live.
 *
 * `match` decides which trips each card counts. Festivals is a tag rather than
 * a category, which is why this isn't simply keyed on `category`.
 */
interface CategoryCardDef {
  eyebrow: string;
  title: string;
  href: string;
  image: { src: string; alt: string };
  /** Shown instead of a count when the category has no trips yet. */
  fallback: string;
  match: (trip: Trip) => boolean;
}

const CARDS: CategoryCardDef[] = [
  {
    eyebrow: 'All-inclusive',
    title: 'Tours',
    href: '/tours',
    image: {
      src: '/images/stock/trip-valley-tour.jpg',
      alt: 'PLACEHOLDER — replace with a client photograph of a guided tour',
    },
    fallback: 'Guided, fully inclusive',
    match: (t) => t.category === 'tour',
  },
  {
    eyebrow: 'Porters & camps',
    title: 'Trekking',
    href: '/treks',
    image: {
      src: '/images/stock/trip-trek-hikers.jpg',
      alt: 'PLACEHOLDER — replace with a client photograph of a trekking group',
    },
    fallback: 'Full camp support',
    match: (t) => t.category === 'trek',
  },
  {
    eyebrow: '6,000–8,611 m',
    title: 'Expeditions',
    href: '/expeditions',
    image: {
      src: '/images/stock/trip-expedition-climbers.jpg',
      alt: 'PLACEHOLDER — replace with a client photograph of an expedition team',
    },
    fallback: 'High-altitude peaks',
    match: (t) => t.category === 'expedition',
  },
  {
    eyebrow: 'Time it right',
    title: 'Festivals',
    href: '/festivals',
    image: {
      src: '/images/stock/destination-golden-desert.jpg',
      alt: 'PLACEHOLDER — replace with a client photograph of a festival departure',
    },
    fallback: 'Dates fixed to the calendar',
    match: (t) => t.tags.includes('festival'),
  },
];

export interface CategoryCardsProps {
  /** Every trip, used only to count each card and find its lowest price. */
  trips: Trip[];
  currency: string;
}

/**
 * Four photo tiles in their own section below the hero. Deliberately does NOT
 * overlap the hero — the slider keeps its full height and nothing sits on top
 * of it. Counts and prices are derived from live trip data rather than written
 * in, so a card can never advertise a number the site cannot show.
 */
export function CategoryCards({ trips, currency }: CategoryCardsProps) {
  return (
    <Section ariaLabel="Browse by type">
      <Container>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {CARDS.map((card) => {
            const matched = trips.filter(card.match);
            const prices = matched.filter((t) => !t.priceOnRequest).map((t) => t.price.amount);
            const from = prices.length > 0 ? Math.min(...prices) : undefined;

            const subtitle =
              matched.length === 0
                ? card.fallback
                : `${matched.length} ${matched.length === 1 ? 'trip' : 'trips'}` +
                  (from === undefined ? '' : ` · from ${formatCurrency(from, currency)}`);

            return (
              <li key={card.href}>
                <Link
                  href={card.href}
                  className="group focus-visible:ring-ring relative flex aspect-5/4 items-end overflow-hidden rounded-xl shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                  {/* Same bottom-weighted recipe as the heroes, so white text
                      clears 4.5:1 over the caption even on a bright photo. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(0deg,rgb(3_22_35/0.88)_0%,rgb(3_22_35/0.62)_38%,rgb(3_22_35/0.12)_72%,transparent_100%)]"
                  />
                  <span className="relative w-full p-5 text-white">
                    <span className="block text-[11px] font-semibold tracking-[0.14em] uppercase">
                      {card.eyebrow}
                    </span>
                    <span className="mt-1 block text-[clamp(20px,2.2vw,30px)] leading-tight font-extrabold tracking-[0.01em] uppercase">
                      {card.title}
                    </span>
                    <span className="mt-1.5 block text-[15px] text-white/85">{subtitle}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
