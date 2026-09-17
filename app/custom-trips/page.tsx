import { CalendarClock, MessagesSquare, Route } from 'lucide-react';
import { getCategories, getDestinations, getTripBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Enquiry } from '@/components/sections/Enquiry';

export const metadata = buildMetadata({
  title: 'Custom Trips',
  description:
    'Nothing off-the-shelf fits? Send your dates, group size and budget and we build a custom day-by-day itinerary — no deposit to see one.',
  path: '/custom-trips',
});

const STEPS = [
  {
    icon: MessagesSquare,
    title: 'Tell us the essentials',
    body: 'Your dates, group size, budget and the regions or activities you have in mind.',
  },
  {
    icon: Route,
    title: 'We design the route',
    body: 'A trip planner writes a day-by-day itinerary with the full per-person cost — nothing hidden.',
  },
  {
    icon: CalendarClock,
    title: 'Refine and confirm',
    body: 'Adjust anything until it fits, then hold your place with a small deposit.',
  },
];

interface CustomTripsPageProps {
  searchParams: Promise<{ trip?: string }>;
}

export default async function CustomTripsPage({ searchParams }: CustomTripsPageProps) {
  const { trip: tripSlug } = await searchParams;
  const [categories, destinations, contextTrip] = await Promise.all([
    getCategories(),
    getDestinations(),
    tripSlug ? getTripBySlug(tripSlug) : Promise.resolve(undefined),
  ]);

  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  return (
    <>
      <Section spacing="sm" ariaLabel="Custom trips">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Custom trips' }]} />
          <div className="mt-4 max-w-2xl">
            <p className="text-brand-700 text-sm font-semibold tracking-wider uppercase">
              Your dates, your route
            </p>
            <h1 className="text-h1 mt-2">Design your own trip</h1>
            <p className="mt-3 text-slate-600">
              Nothing off-the-shelf fits? Tell us where you want to go and we build a custom
              day-by-day itinerary around your dates, with the full price per person — no deposit to
              see one.
            </p>
            {contextTrip && (
              <p className="bg-brand-50 text-brand-800 mt-4 inline-block rounded-lg px-4 py-2 text-sm">
                Enquiring about <span className="font-semibold">{contextTrip.title}</span> — mention
                any changes you&rsquo;d like below.
              </p>
            )}
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-card border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="bg-brand-50 text-brand-700 inline-flex size-10 items-center justify-center rounded-xl"
                  >
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-400">
                    Step {i + 1}
                  </span>
                </div>
                <h2 className="font-display mt-4 text-lg font-semibold text-slate-900">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Enquiry
        destinationOptions={destinationOptions}
        defaultDestination={contextTrip?.destinationSlugs[0]}
        tripSlug={contextTrip?.slug}
        tripTitle={contextTrip?.title}
        source={contextTrip ? `custom-trips:${contextTrip.slug}` : 'custom-trips'}
      />
    </>
  );
}
