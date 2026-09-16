import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DestinationCard } from '@/components/DestinationCard';
import type { Destination } from '@/types/content';

export interface DestinationShowcaseProps {
  destinations: Destination[];
}

/**
 * Destination showcase — a bento-style grid where the first region leads as a
 * tall tile and the rest follow. Falls back gracefully with fewer items.
 */
export function DestinationShowcase({ destinations }: DestinationShowcaseProps) {
  if (destinations.length === 0) return null;

  return (
    <Section ariaLabel="Destinations">
      <Container>
        <SectionHeading
          eyebrow="Where we go"
          title="Explore our destinations"
          description="Regions we know first-hand, each with its own tours, treks and seasons."
          action={{ label: 'All destinations', href: '/destinations' }}
        />
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <li key={destination.slug}>
              <DestinationCard
                destination={destination}
                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
