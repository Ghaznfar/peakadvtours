import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TripCard } from '@/components/TripCard';
import { Reveal } from '@/components/animation/Reveal';
import type { Trip } from '@/types/content';

export interface FeaturedTripsProps {
  trips: Trip[];
}

/** Featured trip cards — highlights a hand-picked selection across categories. */
export function FeaturedTrips({ trips }: FeaturedTripsProps) {
  if (trips.length === 0) return null;
  return (
    <Section ariaLabel="Featured trips" className="bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Popular right now"
          title="Featured trips"
          description="A hand-picked selection of departures travellers are booking this season."
          action={{ label: 'View all trips', href: '/trips' }}
        />
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <Reveal as="li" key={trip.slug} delayMs={(i % 3) * 80}>
              <TripCard
                trip={trip}
                priority={i < 3}
                imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
