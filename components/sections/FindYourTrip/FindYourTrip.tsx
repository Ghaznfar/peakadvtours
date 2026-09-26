import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TripFilter } from '@/components/TripFilter';
import type { Trip } from '@/types/content';

/** The homepage is a shop window, not the catalogue — six cards, then a link. */
const HOME_CARD_LIMIT = 6;

export interface FindYourTripProps {
  trips: Trip[];
}

/** "Find your trip" — tours, treks and expeditions in one filterable index. */
export function FindYourTrip({ trips }: FindYourTripProps) {
  return (
    <Section id="find-your-trip" ariaLabel="Find your trip">
      <Container>
        <SectionHeading
          eyebrow="Plan"
          title="Find your trip"
          description="Every tour, trek and expedition in one place. Filter by type, effort and season."
        />
        <div className="mt-8">
          <TripFilter trips={trips} maxVisible={HOME_CARD_LIMIT} />
        </div>
      </Container>
    </Section>
  );
}
