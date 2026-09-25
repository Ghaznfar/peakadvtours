import { CalendarClock, MessagesSquare, Route } from 'lucide-react';
import { getCategories, getDestinations, getTripBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Enquiry } from '@/components/sections/Enquiry';

export const metadata = buildMetadata({
  title: 'Customize Your Tour',
  description:
    'Tell us your dates, route and budget and we build a custom day-by-day itinerary with the full per-person price — no deposit to see one.',
  path: '/custom-trips',
});

const STEPS = [
  {
    icon: MessagesSquare,
    title: 'A planner reads it',
    body: 'Not a call centre and not an auto-responder. The person who writes your itinerary is the person who answers.',
  },
  {
    icon: Route,
    title: 'You get a costed day-by-day',
    body: 'Internal flights, hotels with breakfast, permits and guide, priced per person — with what is not included written down.',
  },
  {
    icon: CalendarClock,
    title: 'You change it as often as you like',
    body: 'Reply to the email and it gets rewritten. Nothing is booked and nothing is owed until you say yes.',
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
      <PageHero
        eyebrow="Your dates, your route, your budget"
        title="Customize Your Tour"
        heroImage={{
          src: '/images/banners/bannerpost.avif',
          alt: 'Autumn foliage framing a snow-capped peak, with golden poplars along the valley floor',
        }}
      />

      <Section spacing="sm" ariaLabel="Custom trips">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Custom trips' }]} />
          <SectionHeading
            variant="display"
            align="center"
            eyebrow="Tailor made"
            title="Tell Us the Trip You Want"
            description={
              <>
                <p>
                  Every fixed departure we publish started as somebody&rsquo;s private trip. If the
                  dates do not work, the route is not quite right, or you want to spend four days in
                  Hunza instead of two, this is the form that fixes it — and it costs nothing to
                  find out what it would come to.
                </p>
                <p>
                  Only your name, email and WhatsApp number are required. Everything else sharpens
                  the reply: a start date lets us check the passes are open, a passport country
                  decides the permits, a party size sets the per-person price, and a budget — even a
                  rough one — gets you one honest itinerary instead of three hedged ones.
                </p>
              </>
            }
            className="mt-6"
          />
          <div className="mt-4 max-w-2xl">
            {contextTrip && (
              <p className="bg-brand-50 text-brand-800 dark:text-brand-400 mt-4 inline-block rounded-lg px-4 py-2 text-sm">
                Enquiring about <span className="font-semibold">{contextTrip.title}</span> — mention
                any changes you&rsquo;d like below.
              </p>
            )}
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="bg-brand-50 text-brand-700 dark:text-brand-400 inline-flex size-10 items-center justify-center rounded-xl"
                  >
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-400 dark:text-slate-600">
                    Step {i + 1}
                  </span>
                </div>
                <h2 className="font-display mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{step.body}</p>
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
