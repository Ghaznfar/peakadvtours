import { notFound } from 'next/navigation';
import { getCategories, getDestinations, getPageBySlug, getTripsByTag } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DynamicIcon } from '@/components/ui/icons/iconMap';
import { TripCard } from '@/components/TripCard';
import { Reveal } from '@/components/animation/Reveal';
import { Enquiry } from '@/components/sections/Enquiry';

const SLUG = 'corporate-retreats';
/** Retreat packages are trips tagged "corporate" (SITE_ARCHITECTURE §1). */
const CORPORATE_TAG = 'corporate';

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seo?.title ?? page?.title ?? 'Corporate Retreats',
    description:
      page?.seo?.description ??
      page?.intro ??
      'Team offsites and corporate retreats with private transport, group accommodation and an itinerary built around your team size and goals.',
    path: `/${SLUG}`,
  });
}

/** Corporate retreats landing page. Copy is edited in Sanity ("Pages"). */
export default async function CorporateRetreatsPage() {
  const [page, retreats, categories, destinations] = await Promise.all([
    getPageBySlug(SLUG),
    getTripsByTag(CORPORATE_TAG),
    getCategories(),
    getDestinations(),
  ]);

  if (!page) notFound();

  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  return (
    <>
      <Section spacing="sm" ariaLabel={page.title}>
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.title }]} />
          <div className="mt-4 max-w-2xl">
            {page.eyebrow && (
              <p className="text-brand-700 dark:text-brand-400 text-sm font-semibold tracking-wider uppercase">
                {page.eyebrow}
              </p>
            )}
            <h1 className="text-h1 mt-2">{page.title}</h1>
            {page.intro && (
              <p className="mt-3 text-slate-600 dark:text-slate-400">{page.intro}</p>
            )}
          </div>

          {page.features && page.features.length > 0 && (
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-card bg-card border border-slate-200 p-6 shadow-sm dark:border-slate-800"
                >
                  {feature.icon && (
                    <span
                      aria-hidden
                      className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-10 items-center justify-center rounded-xl"
                    >
                      <DynamicIcon name={feature.icon} className="size-5" />
                    </span>
                  )}
                  <h2 className="font-display mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h2>
                  {feature.body && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {feature.body}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {retreats.length > 0 && (
        <Section ariaLabel="Retreat packages" className="bg-slate-50 dark:bg-[#0d1117]">
          <Container>
            <SectionHeading
              eyebrow="Ready-made programmes"
              title="Retreat packages"
              description="Starting points we can reshape around your dates, headcount and budget."
              action={{ label: 'See all trips', href: '/trips' }}
            />
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {retreats.map((trip, i) => (
                <Reveal as="li" key={trip.slug} delayMs={(i % 3) * 80}>
                  <TripCard
                    trip={trip}
                    priority={i < 3}
                    imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Enquiry
        destinationOptions={destinationOptions}
        source={SLUG}
        eyebrow="Plan a team trip"
        title="Tell us about your team and dates"
      />
    </>
  );
}
