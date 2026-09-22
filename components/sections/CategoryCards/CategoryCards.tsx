import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { formatCurrency } from '@/lib/utils/format';
import { DynamicIcon } from '@/components/ui/icons/iconMap';
import { Reveal } from '@/components/animation/Reveal';

export interface CategoryCardVM {
  key: string;
  label: string;
  pluralLabel: string;
  slug: string;
  intro: string;
  icon: string;
  count: number;
  fromAmount?: number;
  currency: string;
}

export interface CategoryCardsProps {
  categories: CategoryCardVM[];
}

/** Tour category navigation — one card per trip category, with live counts. */
export function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <Section ariaLabel="Browse by type">
      <Container>
        <SectionHeading
          eyebrow="Ways to travel"
          title="Find the kind of trip you want"
          description="From relaxed cultural tours to serious high-altitude climbs — browse by type or explore every trip together."
        />
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            return (
              <Reveal as="li" key={cat.key} delayMs={i * 80}>
                <Link
                  href={`/${cat.slug}`}
                  className="group rounded-card focus-visible:ring-ring bg-card flex h-full flex-col border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-800 dark:shadow-black/30 dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden
                      className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-12 items-center justify-center rounded-xl"
                    >
                      <DynamicIcon name={cat.icon} className="size-6" />
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {cat.count} trips
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                    {cat.pluralLabel}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">
                    {cat.intro}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    {typeof cat.fromAmount === 'number' && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        From{' '}
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(cat.fromAmount, cat.currency)}
                        </span>
                      </span>
                    )}
                    <span className="text-brand-700 dark:text-brand-400 inline-flex items-center gap-1 text-sm font-medium">
                      Explore
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
