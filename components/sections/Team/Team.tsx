import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TeamCard } from '@/components/TeamCard';
import { Reveal } from '@/components/animation/Reveal';
import type { TeamMember } from '@/types/content';

export interface TeamProps {
  members: TeamMember[];
}

/** Team section — the people who plan and guide the trips. */
export function Team({ members }: TeamProps) {
  if (members.length === 0) return null;
  return (
    <Section ariaLabel="Our team">
      <Container>
        <SectionHeading
          eyebrow="Meet the team"
          title="The people behind your trip"
          description="Planners and guides who know these routes because they travel them."
          action={{ label: 'About us', href: '/about' }}
        />
        {/* `flex` on each item so the card stretches to the row height — more
            reliable than leaning on a percentage height alone. */}
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <Reveal as="li" key={member.id} delayMs={(i % 4) * 80} className="flex">
              <TeamCard member={member} className="w-full" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
