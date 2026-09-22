import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animation/Reveal';
import type { Stat } from '@/types/content';

export interface StatsProps {
  stats: Stat[];
}

/** Company statistics band — bold numbers on a brand background. */
export function Stats({ stats }: StatsProps) {
  if (stats.length === 0) return null;
  return (
    <section aria-label="Company statistics" className="bg-brand-700 text-white">
      <Container className="py-12 lg:py-16">
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.id} delayMs={i * 80}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display block text-4xl font-bold tracking-tight lg:text-5xl">
                  {stat.value}
                </span>
                <span className="text-brand-50/90 mt-2 block text-sm">{stat.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
