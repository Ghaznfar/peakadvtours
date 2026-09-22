import { Building2, PartyPopper, Users } from 'lucide-react';
import { getCategories, getDestinations } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Enquiry } from '@/components/sections/Enquiry';

export const metadata = buildMetadata({
  title: 'Corporate Retreats',
  description:
    'Team offsites and corporate retreats with private transport, group accommodation and an itinerary built around your team size and goals.',
  path: '/corporate-retreats',
});

const FEATURES = [
  {
    icon: Users,
    title: 'Built for your group size',
    body: 'From a 6-person leadership offsite to a 60-person company trip — accommodation and transport scale to fit.',
  },
  {
    icon: Building2,
    title: 'One invoice, one point of contact',
    body: 'A single trip planner coordinates the whole itinerary and bills your company directly — no splitting receipts.',
  },
  {
    icon: PartyPopper,
    title: 'Team activities, not just sightseeing',
    body: 'Add guided hikes, team challenges or a shared dinner — tell us the goal of the trip and we build around it.',
  },
];

export default async function CorporateRetreatsPage() {
  const [categories, destinations] = await Promise.all([getCategories(), getDestinations()]);

  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  return (
    <>
      <Section spacing="sm" ariaLabel="Corporate retreats">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Corporate retreats' }]}
          />
          <div className="mt-4 max-w-2xl">
            <p className="text-brand-700 dark:text-brand-400 text-sm font-semibold tracking-wider uppercase">
              For teams and companies
            </p>
            <h1 className="text-h1 mt-2">Corporate retreats</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              A team offsite planned like any other trip we run — small-group logistics, local
              guides and one inclusive price, scaled to however many people you&rsquo;re bringing.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
              >
                <span
                  aria-hidden
                  className="bg-brand-50 text-brand-700 dark:text-brand-400 inline-flex size-10 items-center justify-center rounded-xl"
                >
                  <feature.icon className="size-5" />
                </span>
                <h2 className="font-display mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Enquiry
        destinationOptions={destinationOptions}
        source="corporate-retreats"
        eyebrow="Plan a team trip"
        title="Tell us about your team and dates"
      />
    </>
  );
}
