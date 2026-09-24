import { getDestinations } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { DestinationCard } from '@/components/DestinationCard';

export const metadata = buildMetadata({
  title: 'Destinations',
  description:
    'Regions we know first-hand, each with its own tours, treks and expeditions and seasons.',
  path: '/destinations',
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PageHero
        eyebrow="Where we go"
        title="Explore our destinations"
        heroImage={{
          src: '/images/stock/destination-highland-region.jpg',
          alt: 'PLACEHOLDER — replace with a client photograph of a signature region',
        }}
      />

      <Section spacing="sm" ariaLabel="Destinations">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Destinations' }]} />
          <SectionHeading
            variant="display"
            align="center"
            eyebrow="Know the ground"
            title="Regions We Travel"
            description="Regions we know first-hand, each with its own tours, treks and seasons."
            className="mt-6"
          />

          {destinations.length > 0 ? (
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination, i) => (
                <li key={destination.slug}>
                  <DestinationCard
                    destination={destination}
                    priority={i === 0}
                    imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card mt-8 border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Destinations coming soon
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                We&rsquo;re adding destinations. Browse all trips in the meantime.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <CtaBanner
        heading="Can't find the right destination?"
        body="Tell us where you want to go and we'll build a custom day-by-day itinerary."
        primary={{ label: 'Plan a custom trip', href: '/custom-trips' }}
      />
    </>
  );
}
