import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { TripCardSkeleton } from '@/components/TripCard';

/** Route-level loading state (shown during navigation/streaming). */
export default function Loading() {
  return (
    <Section ariaLabel="Loading">
      <Container>
        <div className="mb-8 h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
