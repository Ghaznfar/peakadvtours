import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Reveal } from '@/components/animation/Reveal';
import type { Testimonial } from '@/types/content';

export interface TestimonialsProps {
  testimonials: Testimonial[];
}

/** Testimonials/reviews section. Only consented reviews are passed in. */
export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;
  return (
    <Section ariaLabel="Traveller reviews" className="bg-slate-50 dark:bg-[#0d1117]">
      <Container>
        <SectionHeading
          eyebrow="What travellers say"
          title="Word from the road"
          description="Real, consented reviews from travellers on real departures."
          align="center"
        />
        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={t.id} delayMs={(i % 3) * 80}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
