import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TripCard } from '@/components/TripCard';
import { Reveal } from '@/components/animation/Reveal';
import type { Trip } from '@/types/content';
import { FeaturedTripsReveal } from './FeaturedTripsReveal';

/** Cards shown before "Read more" — one full row on desktop. */
const INITIAL_CARDS = 3;

export interface FeaturedTripsProps {
  /** Every featured trip. The grid shows three; "Read more" reveals the rest. */
  trips: Trip[];
}

/** Featured trip cards — highlights a hand-picked selection across categories. */
export function FeaturedTrips({ trips }: FeaturedTripsProps) {
  if (trips.length === 0) return null;

  // Rendered here, on the server, then handed to the client island as elements:
  // `TripCard` never enters the client bundle.
  const card = (trip: Trip, i: number) => (
    <Reveal as="li" key={trip.slug} delayMs={(i % 3) * 80}>
      {/* No `priority`: this section sits below the hero, the category tiles
          and the intro block, so eager-loading its images would compete with
          the real LCP image. */}
      <TripCard trip={trip} imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
    </Reveal>
  );

  return (
    <Section ariaLabel="Featured trips" className="bg-slate-50 dark:bg-[#0d1117]">
      <Container>
        <SectionHeading
          eyebrow="Popular right now"
          title="Featured trips"
          description="A hand-picked selection of departures travellers are booking this season."
        />
        <FeaturedTripsReveal
          initial={trips.slice(0, INITIAL_CARDS).map(card)}
          more={trips.slice(INITIAL_CARDS).map((trip, i) => card(trip, i + INITIAL_CARDS))}
        />
      </Container>
    </Section>
  );
}
