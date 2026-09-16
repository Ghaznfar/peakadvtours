import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ValuePropCard } from '@/components/ValuePropCard';
import type { ValueProp } from '@/types/content';

export interface WhyChooseUsProps {
  valueProps: ValueProp[];
}

/** Trust / "why book with us" section — a grid of value-proposition cards. */
export function WhyChooseUs({ valueProps }: WhyChooseUsProps) {
  return (
    <Section ariaLabel="Why book with us" className="bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Why book with us"
          title="Travel with confidence"
          description="The practical reasons travellers choose us — and keep coming back."
          align="center"
        />
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((vp) => (
            <li key={vp.id}>
              <ValuePropCard valueProp={vp} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
